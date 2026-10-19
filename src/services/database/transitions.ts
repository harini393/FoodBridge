import { DonationStatus, AssignmentStatus } from '@/types/database';

/**
 * ----------------------------------------------------------------------
 * FoodBridge State Machine: Transitions Specification
 * ----------------------------------------------------------------------
 * Every state change in FoodBridge must follow an explicit, unidirectional
 * or controlled bidirectional transition to ensure auditability, chain of custody,
 * and food safety compliance.
 */

/**
 * Map of permitted donation transitions.
 * Terminal states (delivered, rejected, cancelled, expired) have empty target arrays.
 */
export const PERMITTED_DONATION_TRANSITIONS: Readonly<Record<DonationStatus, readonly DonationStatus[]>> = {
  pendingReview: ['approved', 'rejected', 'cancellationRequested', 'cancelled', 'expired'],
  approved: ['volunteerAssigned', 'cancellationRequested', 'cancelled', 'expired'],
  volunteerAssigned: ['collected', 'approved', 'cancellationRequested', 'cancelled', 'expired'],
  cancellationRequested: ['cancelled', 'pendingReview', 'approved', 'volunteerAssigned'],
  collected: ['delivered', 'cancelled'],
  delivered: [],
  rejected: [],
  cancelled: [],
  expired: [],
};

/**
 * Map of permitted assignment transitions.
 * Terminal states (declined, delivered, failed) have empty target arrays.
 */
export const PERMITTED_ASSIGNMENT_TRANSITIONS: Readonly<Record<AssignmentStatus, readonly AssignmentStatus[]>> = {
  assigned: ['accepted', 'declined', 'failed'],
  accepted: ['collected', 'failed'],
  collected: ['delivered', 'failed'],
  declined: [],
  delivered: [],
  failed: [],
};

/**
 * Validates whether a requested donation status transition is allowed.
 *
 * @param currentStatus The donation's current lifecycle status
 * @param targetStatus The requested next status
 * @returns boolean true if valid, false otherwise
 */
export const isValidDonationTransition = (
  currentStatus: DonationStatus,
  targetStatus: DonationStatus
): boolean => {
  if (currentStatus === targetStatus) return true; // Idempotent
  const allowed = PERMITTED_DONATION_TRANSITIONS[currentStatus];
  return allowed ? allowed.includes(targetStatus) : false;
};

/**
 * Validates whether a requested volunteer assignment transition is allowed.
 *
 * @param currentStatus The assignment's current status
 * @param targetStatus The requested next status
 * @returns boolean true if valid, false otherwise
 */
export const isValidAssignmentTransition = (
  currentStatus: AssignmentStatus,
  targetStatus: AssignmentStatus
): boolean => {
  if (currentStatus === targetStatus) return true; // Idempotent
  const allowed = PERMITTED_ASSIGNMENT_TRANSITIONS[currentStatus];
  return allowed ? allowed.includes(targetStatus) : false;
};

/**
 * Checks whether a donation lifecycle status is a terminal state.
 */
export const isTerminalDonationStatus = (status: DonationStatus): boolean => {
  return PERMITTED_DONATION_TRANSITIONS[status]?.length === 0;
};

/**
 * Checks whether an assignment status is a terminal state.
 */
export const isTerminalAssignmentStatus = (status: AssignmentStatus): boolean => {
  return PERMITTED_ASSIGNMENT_TRANSITIONS[status]?.length === 0;
};
