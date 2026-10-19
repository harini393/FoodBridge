import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  orderBy,
} from 'firebase/firestore';
import { db } from '@/services/firebase/firestore';
import { UserRole } from '@/types/auth';
import {
  Donation,
  DonationStatus,
  Assignment,
  AssignmentStatus,
  Recipient,
  RecipientSnapshot,
  Delivery,
  DonationStatusHistory,
  AuditLog,
  Ngo,
} from '@/types/database';
import {
  isValidDonationTransition,
  isValidAssignmentTransition,
} from './transitions';

/**
 * ----------------------------------------------------------------------
 * 1. Helper ID & Timestamp Utilities
 * ----------------------------------------------------------------------
 */
export const generateId = (prefix: string): string => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `${prefix}_${timestamp}_${random}`;
};

export const getNowIso = (): string => new Date().toISOString();

/**
 * ----------------------------------------------------------------------
 * 2. Donations Data Access & Lifecycle
 * ----------------------------------------------------------------------
 */
export interface CreateDonationInput {
  donorUid: string;
  title: string;
  foodType: Donation['foodType'];
  quantity: Donation['quantity'];
  preparationTime: string; // ISO 8601
  storageCondition: Donation['storageCondition'];
  packagingCondition: Donation['packagingCondition'];
  allergens: string[];
  collectionDeadline: string; // ISO 8601
  pickupAddress: Donation['pickupAddress'];
  contactPhone: string;
  photoUrls?: string[];
}

export const createDonation = async (
  input: CreateDonationInput
): Promise<Donation> => {
  if (!db) {
    throw new Error('Cloud Firestore is not initialized.');
  }

  const id = generateId('don');
  const now = getNowIso();

  const donation: Donation = {
    id,
    donorUid: input.donorUid,
    title: input.title.trim(),
    foodType: input.foodType,
    quantity: input.quantity,
    preparationTime: input.preparationTime,
    storageCondition: input.storageCondition,
    packagingCondition: input.packagingCondition,
    allergens: input.allergens.length > 0 ? input.allergens : ['unknown'],
    collectionDeadline: input.collectionDeadline,
    pickupAddress: input.pickupAddress,
    contactPhone: input.contactPhone.trim(),
    photoUrls: input.photoUrls || [],
    status: 'pendingReview',
    createdAt: now,
    updatedAt: now,
  };

  // 1. Write donation document
  const donationRef = doc(db, 'donations', id);
  await setDoc(donationRef, donation);

  // 2. Write initial status history entry
  await recordStatusHistory({
    donationId: id,
    fromStatus: null,
    toStatus: 'pendingReview',
    changedByUid: input.donorUid,
    changedByRole: 'donor',
    notes: 'Donation created and submitted for review',
  });

  return donation;
};

export const getDonation = async (id: string): Promise<Donation | null> => {
  if (!db) return null;
  const docRef = doc(db, 'donations', id);
  const snap = await getDoc(docRef);
  return snap.exists() ? (snap.data() as Donation) : null;
};

export interface UpdateDonationStatusOptions {
  changedByUid: string;
  changedByRole: UserRole;
  reason?: string;
  notes?: string;
  expectedDeliveryAt?: string;
  recipientSnapshot?: RecipientSnapshot;
  recipientId?: string;
  assignedNgoId?: string;
  assignedVolunteerUid?: string;
  currentAssignmentId?: string;
}

export const updateDonationStatus = async (
  donationId: string,
  targetStatus: DonationStatus,
  options: UpdateDonationStatusOptions
): Promise<void> => {
  if (!db) throw new Error('Cloud Firestore is not initialized.');

  const existing = await getDonation(donationId);
  if (!existing) {
    throw new Error(`Donation ${donationId} does not exist.`);
  }

  if (!isValidDonationTransition(existing.status, targetStatus)) {
    throw new Error(
      `Invalid donation transition: cannot transition from "${existing.status}" to "${targetStatus}".`
    );
  }

  const now = getNowIso();
  const updates: Partial<Donation> = {
    status: targetStatus,
    updatedAt: now,
  };

  if (targetStatus === 'collected') {
    updates.collectedAt = now;
  } else if (targetStatus === 'delivered') {
    updates.deliveredAt = now;
  }

  if (targetStatus === 'rejected' && options.reason) {
    updates.rejectionReason = options.reason;
  }
  if (targetStatus === 'cancelled' && options.reason) {
    updates.cancellationReason = options.reason;
  }

  if (options.expectedDeliveryAt) updates.expectedDeliveryAt = options.expectedDeliveryAt;
  if (options.recipientId) updates.recipientId = options.recipientId;
  if (options.recipientSnapshot) updates.recipientSnapshot = options.recipientSnapshot;
  if (options.assignedNgoId) updates.assignedNgoId = options.assignedNgoId;
  if (options.assignedVolunteerUid) updates.assignedVolunteerUid = options.assignedVolunteerUid;
  if (options.currentAssignmentId) updates.currentAssignmentId = options.currentAssignmentId;

  // 1. Update donation document
  const donationRef = doc(db, 'donations', donationId);
  await updateDoc(donationRef, updates);

  // 2. Append to separate status history
  await recordStatusHistory({
    donationId,
    fromStatus: existing.status,
    toStatus: targetStatus,
    changedByUid: options.changedByUid,
    changedByRole: options.changedByRole,
    reason: options.reason,
    notes: options.notes,
  });
};

/**
 * ----------------------------------------------------------------------
 * 3. Status History (Kept Separate from Audit Logs)
 * ----------------------------------------------------------------------
 */
export const recordStatusHistory = async (
  entry: Omit<DonationStatusHistory, 'id' | 'timestamp'>
): Promise<DonationStatusHistory> => {
  if (!db) throw new Error('Cloud Firestore is not initialized.');

  const id = generateId(`hist_${entry.donationId}`);
  const timestamp = getNowIso();

  const record: DonationStatusHistory = {
    id,
    ...entry,
    timestamp,
  };

  const docRef = doc(db, 'donationStatusHistory', id);
  await setDoc(docRef, record);
  return record;
};

export const getDonationHistory = async (
  donationId: string
): Promise<DonationStatusHistory[]> => {
  if (!db) return [];
  const colRef = collection(db, 'donationStatusHistory');
  const q = query(
    colRef,
    where('donationId', '==', donationId),
    orderBy('timestamp', 'asc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as DonationStatusHistory);
};

/**
 * ----------------------------------------------------------------------
 * 4. Volunteer Assignments & Attempts
 * ----------------------------------------------------------------------
 */
export const createAssignment = async (params: {
  donationId: string;
  ngoId: string;
  volunteerUid: string;
  attemptNumber: number;
  notes?: string;
}): Promise<Assignment> => {
  if (!db) throw new Error('Cloud Firestore is not initialized.');

  // Stable document ID linking donation & attempt
  const id = `asgn_${params.donationId}_${params.attemptNumber}`;
  const now = getNowIso();

  const assignment: Assignment = {
    id,
    donationId: params.donationId,
    ngoId: params.ngoId,
    volunteerUid: params.volunteerUid,
    attemptNumber: params.attemptNumber,
    status: 'assigned',
    notes: params.notes,
    assignedAt: now,
    updatedAt: now,
  };

  const docRef = doc(db, 'assignments', id);
  await setDoc(docRef, assignment);
  return assignment;
};

export const getAssignment = async (id: string): Promise<Assignment | null> => {
  if (!db) return null;
  const docRef = doc(db, 'assignments', id);
  const snap = await getDoc(docRef);
  return snap.exists() ? (snap.data() as Assignment) : null;
};

export const updateAssignmentStatus = async (
  assignmentId: string,
  targetStatus: AssignmentStatus,
  options?: {
    declineReason?: string;
    failureReason?: string;
    notes?: string;
  }
): Promise<void> => {
  if (!db) throw new Error('Cloud Firestore is not initialized.');

  const existing = await getAssignment(assignmentId);
  if (!existing) {
    throw new Error(`Assignment ${assignmentId} does not exist.`);
  }

  if (!isValidAssignmentTransition(existing.status, targetStatus)) {
    throw new Error(
      `Invalid assignment transition: cannot transition from "${existing.status}" to "${targetStatus}".`
    );
  }

  const now = getNowIso();
  const updates: Partial<Assignment> = {
    status: targetStatus,
    updatedAt: now,
  };

  if (targetStatus === 'accepted') updates.acceptedAt = now;
  if (targetStatus === 'declined') {
    updates.declinedAt = now;
    if (options?.declineReason) updates.declineReason = options.declineReason;
  }
  if (targetStatus === 'collected') updates.collectedAt = now;
  if (targetStatus === 'delivered') updates.completedAt = now;
  if (targetStatus === 'failed') {
    updates.completedAt = now;
    if (options?.failureReason) updates.failureReason = options.failureReason;
  }
  if (options?.notes) updates.notes = options.notes;

  const docRef = doc(db, 'assignments', assignmentId);
  await updateDoc(docRef, updates);
};

export const getAssignmentsForDonation = async (
  donationId: string
): Promise<Assignment[]> => {
  if (!db) return [];
  const colRef = collection(db, 'assignments');
  const q = query(
    colRef,
    where('donationId', '==', donationId),
    orderBy('attemptNumber', 'asc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as Assignment);
};

/**
 * ----------------------------------------------------------------------
 * 5. Recipients Directory & Historical Snapshots
 * ----------------------------------------------------------------------
 */
export const createRecipientSnapshot = (recipient: Recipient): RecipientSnapshot => {
  return {
    recipientId: recipient.id,
    name: recipient.name,
    contactPerson: recipient.contactPerson,
    contactPhone: recipient.contactPhone,
    address: recipient.address,
    beneficiaryCount: recipient.beneficiaryCount,
  };
};

export const createRecipient = async (
  ngoId: string,
  data: Omit<Recipient, 'id' | 'ngoId' | 'createdAt' | 'updatedAt'>
): Promise<Recipient> => {
  if (!db) throw new Error('Cloud Firestore is not initialized.');

  const id = generateId(`rec_${ngoId}`);
  const now = getNowIso();

  const recipient: Recipient = {
    id,
    ngoId,
    ...data,
    createdAt: now,
    updatedAt: now,
  };

  const docRef = doc(db, 'recipients', id);
  await setDoc(docRef, recipient);
  return recipient;
};

export const getRecipient = async (id: string): Promise<Recipient | null> => {
  if (!db) return null;
  const docRef = doc(db, 'recipients', id);
  const snap = await getDoc(docRef);
  return snap.exists() ? (snap.data() as Recipient) : null;
};

/**
 * ----------------------------------------------------------------------
 * 6. Deliveries (Separate Record Created Only Upon Successful Drop-off)
 * ----------------------------------------------------------------------
 */
export const createDelivery = async (params: {
  donationId: string;
  assignmentId: string;
  ngoId: string;
  volunteerUid: string;
  donorUid: string;
  recipientId: string;
  recipientSnapshot: RecipientSnapshot;
  receivedByName: string;
  receivedNotes?: string;
  proofPhotoUrls?: string[];
}): Promise<Delivery> => {
  if (!db) throw new Error('Cloud Firestore is not initialized.');

  const id = `deliv_${params.donationId}`;
  const now = getNowIso();

  const delivery: Delivery = {
    id,
    donationId: params.donationId,
    assignmentId: params.assignmentId,
    ngoId: params.ngoId,
    volunteerUid: params.volunteerUid,
    donorUid: params.donorUid,
    recipientId: params.recipientId,
    recipientSnapshot: params.recipientSnapshot,
    deliveredAt: now,
    receivedByName: params.receivedByName.trim(),
    receivedNotes: params.receivedNotes?.trim(),
    proofPhotoUrls: params.proofPhotoUrls || [],
    createdAt: now,
  };

  const docRef = doc(db, 'deliveries', id);
  await setDoc(docRef, delivery);
  return delivery;
};

export const getDelivery = async (id: string): Promise<Delivery | null> => {
  if (!db) return null;
  const docRef = doc(db, 'deliveries', id);
  const snap = await getDoc(docRef);
  return snap.exists() ? (snap.data() as Delivery) : null;
};

/**
 * ----------------------------------------------------------------------
 * 7. Verified NGOs Directory
 * ----------------------------------------------------------------------
 */
export const createNgo = async (
  ngoData: Omit<Ngo, 'createdAt' | 'updatedAt'>
): Promise<Ngo> => {
  if (!db) throw new Error('Cloud Firestore is not initialized.');

  const now = getNowIso();
  const ngo: Ngo = {
    ...ngoData,
    createdAt: now,
    updatedAt: now,
  };

  const docRef = doc(db, 'ngos', ngo.id);
  await setDoc(docRef, ngo);
  return ngo;
};

export const getNgo = async (id: string): Promise<Ngo | null> => {
  if (!db) return null;
  const docRef = doc(db, 'ngos', id);
  const snap = await getDoc(docRef);
  return snap.exists() ? (snap.data() as Ngo) : null;
};

/**
 * ----------------------------------------------------------------------
 * 8. Platform Audit Logs (Dedicated Collection)
 * ----------------------------------------------------------------------
 */
export const createAuditLog = async (
  logData: Omit<AuditLog, 'id' | 'timestamp'>
): Promise<AuditLog> => {
  if (!db) throw new Error('Cloud Firestore is not initialized.');

  const id = generateId('audit');
  const timestamp = getNowIso();

  const log: AuditLog = {
    id,
    ...logData,
    timestamp,
  };

  const docRef = doc(db, 'auditLogs', id);
  await setDoc(docRef, log);
  return log;
};
