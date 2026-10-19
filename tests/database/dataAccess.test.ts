import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  createDonation,
  updateDonationStatus,
  createAssignment,
  updateAssignmentStatus,
  createRecipientSnapshot,
  createDelivery,
  createAuditLog,
  generateId,
} from '@/services/database/dataAccess';
import { Recipient } from '@/types/database';

// Mock Firebase Firestore methods
const mockSetDoc = vi.fn().mockResolvedValue(undefined);
const mockUpdateDoc = vi.fn().mockResolvedValue(undefined);
const mockGetDoc = vi.fn();
const mockDoc = vi.fn((_db: unknown, collectionName: string, id: string) => ({ collectionName, id }));

vi.mock('firebase/firestore', () => ({
  doc: (_db: unknown, collectionName: string, id: string) => mockDoc(_db, collectionName, id),
  setDoc: (...args: [unknown, unknown]) => mockSetDoc(...args),
  updateDoc: (...args: [unknown, unknown]) => mockUpdateDoc(...args),
  getDoc: (...args: [unknown]) => mockGetDoc(...args),
  collection: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  orderBy: vi.fn(),
  getDocs: vi.fn().mockResolvedValue({ docs: [] }),
}));

vi.mock('@/services/firebase/firestore', () => ({
  db: {},
}));

describe('Phase 3 Data Access & Integrity Specifications', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('ID Generation & Stability', () => {
    it('generates stable prefixed IDs with timestamp and entropy', () => {
      const donId = generateId('don');
      expect(donId).toMatch(/^don_[a-z0-9]+_[a-z0-9]+$/);

      const asgnId = generateId('asgn');
      expect(asgnId).toMatch(/^asgn_[a-z0-9]+_[a-z0-9]+$/);
    });
  });

  describe('Donation Creation & Status History Separation', () => {
    it('creates donation with pendingReview status and records initial status history', async () => {
      const donation = await createDonation({
        donorUid: 'donor_01',
        title: 'Surplus Sandwiches & Salad Bowls',
        foodType: 'cooked',
        quantity: { portions: 40, weightKg: 12, description: '40 packaged lunchboxes' },
        preparationTime: '2026-10-19T10:00:00.000Z',
        storageCondition: 'refrigerated',
        packagingCondition: 'sealed',
        allergens: ['gluten', 'dairy'],
        collectionDeadline: '2026-10-19T16:00:00.000Z',
        pickupAddress: { street: '123 Market St', city: 'Metro', postalCode: '10001' },
        contactPhone: '+91 98765 00000',
      });

      expect(donation.id).toMatch(/^don_/);
      expect(donation.status).toBe('pendingReview');
      expect(donation.donorUid).toBe('donor_01');
      expect(donation.collectionDeadline).toBe('2026-10-19T16:00:00.000Z');

      // Verify setDoc was called for both donations and donationStatusHistory
      expect(mockSetDoc).toHaveBeenCalledTimes(2);

      const firstCallArgs = mockSetDoc.mock.calls[0];
      expect(firstCallArgs[0].collectionName).toBe('donations');

      const secondCallArgs = mockSetDoc.mock.calls[1];
      expect(secondCallArgs[0].collectionName).toBe('donationStatusHistory');
      expect(secondCallArgs[1].fromStatus).toBeNull();
      expect(secondCallArgs[1].toStatus).toBe('pendingReview');
    });

    it('rejects invalid state transitions and does not modify the record', async () => {
      mockGetDoc.mockResolvedValueOnce({
        exists: () => true,
        data: () => ({
          id: 'don_123',
          status: 'pendingReview',
        }),
      });

      // Attempting to skip directly to delivered must throw
      await expect(
        updateDonationStatus('don_123', 'delivered', {
          changedByUid: 'officer_1',
          changedByRole: 'ngo',
        })
      ).rejects.toThrow(/Invalid donation transition/i);

      expect(mockUpdateDoc).not.toHaveBeenCalled();
    });

    it('records distinct timestamps (collectedAt, deliveredAt) when transitioning', async () => {
      mockGetDoc.mockResolvedValueOnce({
        exists: () => true,
        data: () => ({
          id: 'don_456',
          status: 'volunteerAssigned',
        }),
      });

      await updateDonationStatus('don_456', 'collected', {
        changedByUid: 'vol_01',
        changedByRole: 'volunteer',
        notes: 'Picked up from kitchen dock',
      });

      expect(mockUpdateDoc).toHaveBeenCalledTimes(1);
      const updates = mockUpdateDoc.mock.calls[0][1];
      expect(updates.status).toBe('collected');
      expect(updates.collectedAt).toBeDefined();
    });
  });

  describe('Volunteer Assignments & Attempt Preservation', () => {
    it('creates assignment attempt with stable ID including attempt number', async () => {
      const assignment = await createAssignment({
        donationId: 'don_789',
        ngoId: 'ngo_42',
        volunteerUid: 'vol_99',
        attemptNumber: 1,
        notes: 'Priority evening pickup',
      });

      expect(assignment.id).toBe('asgn_don_789_1');
      expect(assignment.status).toBe('assigned');
      expect(assignment.attemptNumber).toBe(1);

      expect(mockSetDoc).toHaveBeenCalledTimes(1);
      expect(mockSetDoc.mock.calls[0][0].collectionName).toBe('assignments');
    });

    it('updates assignment with distinct timestamp for decline reason', async () => {
      mockGetDoc.mockResolvedValueOnce({
        exists: () => true,
        data: () => ({
          id: 'asgn_don_789_1',
          status: 'assigned',
        }),
      });

      await updateAssignmentStatus('asgn_don_789_1', 'declined', {
        declineReason: 'Vehicle tire puncture',
      });

      expect(mockUpdateDoc).toHaveBeenCalledTimes(1);
      const updates = mockUpdateDoc.mock.calls[0][1];
      expect(updates.status).toBe('declined');
      expect(updates.declineReason).toBe('Vehicle tire puncture');
      expect(updates.declinedAt).toBeDefined();
    });
  });

  describe('Recipient Snapshots & Deliveries', () => {
    it('creates limited immutable recipient snapshot to preserve historical data', () => {
      const activeRecipient: Recipient = {
        id: 'rec_101',
        ngoId: 'ngo_42',
        name: 'Community Hope Center',
        contactPerson: 'Sister Mary',
        contactPhone: '+91 91234 56789',
        address: { street: '45 Care Ave', city: 'Metro', postalCode: '10002' },
        beneficiaryCount: 75,
        status: 'active',
        createdAt: '2026-01-01T00:00:00Z',
        updatedAt: '2026-01-01T00:00:00Z',
      };

      const snapshot = createRecipientSnapshot(activeRecipient);
      expect(snapshot).toEqual({
        recipientId: 'rec_101',
        name: 'Community Hope Center',
        contactPerson: 'Sister Mary',
        contactPhone: '+91 91234 56789',
        address: { street: '45 Care Ave', city: 'Metro', postalCode: '10002' },
        beneficiaryCount: 75,
      });
    });

    it('creates separate delivery record only upon confirmed delivery', async () => {
      const delivery = await createDelivery({
        donationId: 'don_789',
        assignmentId: 'asgn_don_789_2',
        ngoId: 'ngo_42',
        volunteerUid: 'vol_88',
        donorUid: 'donor_01',
        recipientId: 'rec_101',
        recipientSnapshot: {
          recipientId: 'rec_101',
          name: 'Community Hope Center',
          contactPerson: 'Sister Mary',
          contactPhone: '+91 91234 56789',
          address: { street: '45 Care Ave', city: 'Metro', postalCode: '10002' },
          beneficiaryCount: 75,
        },
        receivedByName: 'Officer John Davis',
        receivedNotes: 'All 40 meal boxes inspected and safely refrigerated',
      });

      expect(delivery.id).toBe('deliv_don_789');
      expect(delivery.receivedByName).toBe('Officer John Davis');
      expect(delivery.deliveredAt).toBeDefined();

      expect(mockSetDoc).toHaveBeenCalledTimes(1);
      expect(mockSetDoc.mock.calls[0][0].collectionName).toBe('deliveries');
    });
  });

  describe('Audit Logging', () => {
    it('creates immutable platform audit log record in separate collection', async () => {
      const auditLog = await createAuditLog({
        action: 'user_suspended',
        actorUid: 'admin_root',
        actorRole: 'admin',
        targetCollection: 'users',
        targetDocumentId: 'violator_01',
        reason: 'Multiple unannounced donation cancellations',
        previousState: { accountStatus: 'active' },
        newState: { accountStatus: 'suspended' },
      });

      expect(auditLog.id).toMatch(/^audit_/);
      expect(auditLog.action).toBe('user_suspended');
      expect(auditLog.timestamp).toBeDefined();

      expect(mockSetDoc).toHaveBeenCalledTimes(1);
      expect(mockSetDoc.mock.calls[0][0].collectionName).toBe('auditLogs');
    });
  });
});
