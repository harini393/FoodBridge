import { describe, it, expect } from 'vitest';
import {
  isValidDonationTransition,
  isValidAssignmentTransition,
  isTerminalDonationStatus,
  isTerminalAssignmentStatus,
  PERMITTED_DONATION_TRANSITIONS,
  PERMITTED_ASSIGNMENT_TRANSITIONS,
} from '@/services/database/transitions';
import { DonationStatus, AssignmentStatus } from '@/types/database';

describe('FoodBridge State Transitions Specification', () => {
  describe('Donation State Machine', () => {
    it('allows valid lifecycle progression from pendingReview to delivered', () => {
      // Step 1: pendingReview -> approved
      expect(isValidDonationTransition('pendingReview', 'approved')).toBe(true);

      // Step 2: approved -> volunteerAssigned
      expect(isValidDonationTransition('approved', 'volunteerAssigned')).toBe(true);

      // Step 3: volunteerAssigned -> collected
      expect(isValidDonationTransition('volunteerAssigned', 'collected')).toBe(true);

      // Step 4: collected -> delivered
      expect(isValidDonationTransition('collected', 'delivered')).toBe(true);
    });

    it('allows re-opening approved status if a volunteer assignment is declined', () => {
      expect(isValidDonationTransition('volunteerAssigned', 'approved')).toBe(true);
    });

    it('allows cancellation requests before food is collected', () => {
      expect(isValidDonationTransition('pendingReview', 'cancellationRequested')).toBe(true);
      expect(isValidDonationTransition('approved', 'cancellationRequested')).toBe(true);
      expect(isValidDonationTransition('volunteerAssigned', 'cancellationRequested')).toBe(true);
    });

    it('strictly forbids skipping steps (e.g. pendingReview directly to collected or delivered)', () => {
      expect(isValidDonationTransition('pendingReview', 'collected')).toBe(false);
      expect(isValidDonationTransition('pendingReview', 'delivered')).toBe(false);
      expect(isValidDonationTransition('approved', 'delivered')).toBe(false);
    });

    it('strictly treats terminal states as immutable (no further transitions allowed)', () => {
      const terminalStatuses: DonationStatus[] = ['delivered', 'rejected', 'cancelled', 'expired'];

      for (const terminal of terminalStatuses) {
        expect(isTerminalDonationStatus(terminal)).toBe(true);
        expect(PERMITTED_DONATION_TRANSITIONS[terminal]).toEqual([]);

        // Cannot transition from terminal to anything else
        expect(isValidDonationTransition(terminal, 'approved')).toBe(false);
        expect(isValidDonationTransition(terminal, 'pendingReview')).toBe(false);
        expect(isValidDonationTransition(terminal, 'volunteerAssigned')).toBe(false);
      }
    });

    it('is idempotent when target status equals current status', () => {
      expect(isValidDonationTransition('pendingReview', 'pendingReview')).toBe(true);
      expect(isValidDonationTransition('approved', 'approved')).toBe(true);
    });
  });

  describe('Volunteer Assignment State Machine', () => {
    it('allows complete happy path from assigned to delivered', () => {
      expect(isValidAssignmentTransition('assigned', 'accepted')).toBe(true);
      expect(isValidAssignmentTransition('accepted', 'collected')).toBe(true);
      expect(isValidAssignmentTransition('collected', 'delivered')).toBe(true);
    });

    it('allows volunteer decline and failure states', () => {
      expect(isValidAssignmentTransition('assigned', 'declined')).toBe(true);
      expect(isValidAssignmentTransition('assigned', 'failed')).toBe(true);
      expect(isValidAssignmentTransition('accepted', 'failed')).toBe(true);
      expect(isValidAssignmentTransition('collected', 'failed')).toBe(true);
    });

    it('strictly treats terminal assignment states as immutable', () => {
      const terminalStatuses: AssignmentStatus[] = ['declined', 'delivered', 'failed'];

      for (const terminal of terminalStatuses) {
        expect(isTerminalAssignmentStatus(terminal)).toBe(true);
        expect(PERMITTED_ASSIGNMENT_TRANSITIONS[terminal]).toEqual([]);

        expect(isValidAssignmentTransition(terminal, 'accepted')).toBe(false);
        expect(isValidAssignmentTransition(terminal, 'collected')).toBe(false);
      }
    });

    it('forbids invalid skips (e.g. directly from assigned to delivered)', () => {
      expect(isValidAssignmentTransition('assigned', 'delivered')).toBe(false);
      expect(isValidAssignmentTransition('assigned', 'collected')).toBe(false);
    });
  });
});
