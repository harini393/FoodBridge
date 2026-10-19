import { UserRole } from './auth';

/**
 * ----------------------------------------------------------------------
 * 1. Status Types & Transitions
 * ----------------------------------------------------------------------
 */

/**
 * Valid donation lifecycle statuses.
 */
export type DonationStatus =
  | 'pendingReview'
  | 'approved'
  | 'volunteerAssigned'
  | 'collected'
  | 'delivered'
  | 'rejected'
  | 'cancellationRequested'
  | 'cancelled'
  | 'expired';

/**
 * Valid volunteer task assignment statuses.
 */
export type AssignmentStatus =
  | 'assigned'
  | 'accepted'
  | 'declined'
  | 'collected'
  | 'delivered'
  | 'failed';

/**
 * Valid recipient organization statuses.
 */
export type RecipientStatus = 'active' | 'inactive';

/**
 * Valid NGO entity statuses.
 */
export type NgoEntityStatus = 'active' | 'suspended';

/**
 * Food storage condition requirement.
 */
export type StorageCondition = 'ambient' | 'refrigerated' | 'frozen' | 'hotHeld';

/**
 * Packaging integrity classification.
 */
export type PackagingCondition = 'sealed' | 'containers' | 'bulk' | 'originalPackaging';

/**
 * Food category classification.
 */
export type FoodType =
  | 'cooked'
  | 'packaged'
  | 'produce'
  | 'bakery'
  | 'dairy'
  | 'other';

/**
 * ----------------------------------------------------------------------
 * 2. Limited Historical Snapshots
 * ----------------------------------------------------------------------
 * Preserved at assignment/delivery to prevent historical data corruption
 * if the recipient profile is subsequently updated or removed.
 */
export interface RecipientSnapshot {
  recipientId: string;
  name: string;
  contactPerson: string;
  contactPhone: string;
  address: {
    street: string;
    city: string;
    postalCode: string;
    notes?: string;
  };
  beneficiaryCount: number;
}

/**
 * ----------------------------------------------------------------------
 * 3. Collection Models
 * ----------------------------------------------------------------------
 */

/**
 * Approved NGO Partner Entity (ngos/{id})
 */
export interface Ngo {
  id: string; // e.g. ngo_<slug_or_uuid>
  name: string;
  registrationNumber: string;
  primaryOfficerUid: string;
  officerUids: string[];
  contactPhone: string;
  officialAddress: string;
  status: NgoEntityStatus;
  serviceArea?: string;
  approvedBy: string; // admin user UID
  approvedAt: string; // ISO 8601
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}

/**
 * Recipient Facility Directory (recipients/{id})
 * Maintained by authorized NGO officers.
 */
export interface Recipient {
  id: string; // e.g. rec_<uuid>
  ngoId: string; // parent NGO owner
  name: string;
  contactPerson: string;
  contactPhone: string;
  address: {
    street: string;
    city: string;
    postalCode: string;
    notes?: string;
  };
  beneficiaryCount: number;
  dietaryPreferences?: string[];
  operatingHours?: string;
  status: RecipientStatus;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}

/**
 * Food Donation Record (donations/{id})
 */
export interface Donation {
  id: string; // e.g. don_<timestamp>_<rand>
  donorUid: string;
  title: string;
  foodType: FoodType;
  quantity: {
    portions?: number;
    weightKg?: number;
    description: string;
  };
  preparationTime: string; // ISO 8601 (microbiological safety benchmark)
  storageCondition: StorageCondition;
  packagingCondition: PackagingCondition;
  allergens: string[]; // ['gluten', 'dairy', etc.] or ['unknown'] or ['none']
  pickupAddress: {
    street: string;
    city: string;
    postalCode: string;
    instructions?: string;
  };
  contactPhone: string;
  photoUrls: string[];

  // Current lifecycle status
  status: DonationStatus;

  // Coordination relationships
  assignedNgoId?: string;
  assignedVolunteerUid?: string;
  currentAssignmentId?: string;
  recipientId?: string;
  recipientSnapshot?: RecipientSnapshot;

  // Explicit distinct timestamp tracking (required by Phase 3 specification)
  collectionDeadline: string; // ISO 8601 - strict safe pickup limit
  expectedDeliveryAt?: string; // ISO 8601 - target recipient arrival set by NGO
  collectedAt?: string; // ISO 8601 - recorded upon physical collection
  deliveredAt?: string; // ISO 8601 - recorded upon confirmed recipient receipt

  // Reasons for terminal/exceptional states
  rejectionReason?: string;
  cancellationReason?: string;

  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}

/**
 * Volunteer Task Assignment Attempt (assignments/{id})
 * Explicit rule: Every assignment attempt is preserved as an individual immutable record.
 */
export interface Assignment {
  id: string; // e.g. asgn_<donationId>_<attemptIndex>
  donationId: string;
  ngoId: string;
  volunteerUid: string;
  attemptNumber: number;
  status: AssignmentStatus;
  notes?: string;
  declineReason?: string;
  failureReason?: string;

  // Distinct milestones
  assignedAt: string; // ISO 8601
  acceptedAt?: string; // ISO 8601
  declinedAt?: string; // ISO 8601
  collectedAt?: string; // ISO 8601
  completedAt?: string; // ISO 8601
  updatedAt: string; // ISO 8601
}

/**
 * Confirmed Delivery Record (deliveries/{id})
 * Explicit rule: Created ONLY after successful recipient drop-off.
 */
export interface Delivery {
  id: string; // e.g. deliv_<donationId>
  donationId: string;
  assignmentId: string;
  ngoId: string;
  volunteerUid: string;
  donorUid: string;
  recipientId: string;
  recipientSnapshot: RecipientSnapshot;
  deliveredAt: string; // ISO 8601
  receivedByName: string; // name of staff/representative at recipient facility
  receivedNotes?: string;
  proofPhotoUrls?: string[];
  createdAt: string; // ISO 8601
}

/**
 * Donation Status History Log (donationStatusHistory/{id})
 * Explicit rule: Kept separate from general audit logs.
 */
export interface DonationStatusHistory {
  id: string; // e.g. hist_<donationId>_<timestamp>
  donationId: string;
  fromStatus: DonationStatus | null;
  toStatus: DonationStatus;
  changedByUid: string;
  changedByRole: UserRole;
  reason?: string;
  notes?: string;
  timestamp: string; // ISO 8601
}

/**
 * Platform Audit Log (auditLogs/{id})
 * Explicit rule: Reserved for security, privileged overrides, user status changes, and Admin actions.
 */
export interface AuditLog {
  id: string; // e.g. audit_<timestamp>_<rand>
  action:
    | 'user_registered'
    | 'user_suspended'
    | 'user_reinstated'
    | 'ngo_approved'
    | 'ngo_rejected'
    | 'privileged_status_override'
    | 'security_alert'
    | 'document_deleted';
  actorUid: string;
  actorRole: UserRole;
  targetCollection: string;
  targetDocumentId: string;
  previousState?: Record<string, unknown>;
  newState?: Record<string, unknown>;
  reason: string;
  ipAddress?: string;
  userAgent?: string;
  timestamp: string; // ISO 8601
}
