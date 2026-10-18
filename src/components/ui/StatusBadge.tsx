import React from 'react';

export type EntityStatus =
  // Donation statuses
  | 'pendingReview'
  | 'approved'
  | 'volunteerAssigned'
  | 'collected'
  | 'delivered'
  | 'rejected'
  | 'cancellationRequested'
  | 'cancelled'
  | 'expired'
  // Assignment statuses
  | 'assigned'
  | 'accepted'
  | 'declined'
  | 'failed'
  // Account/Application statuses
  | 'pending'
  | 'active'
  | 'suspended';

interface StatusConfig {
  label: string;
  bg: string;
  text: string;
  border: string;
  dotColor: string;
}

const statusMap: Record<EntityStatus, StatusConfig> = {
  // Pending review / initial
  pendingReview: {
    label: 'Pending Review',
    bg: 'bg-[#FEF7EC]',
    text: 'text-[#946200]',
    border: 'border-[#F8DCA6]',
    dotColor: 'bg-[#D58B45]',
  },
  pending: {
    label: 'Pending',
    bg: 'bg-[#FEF7EC]',
    text: 'text-[#946200]',
    border: 'border-[#F8DCA6]',
    dotColor: 'bg-[#D58B45]',
  },

  // Approved
  approved: {
    label: 'Approved',
    bg: 'bg-sage-light',
    text: 'text-forest',
    border: 'border-[#C8DFC8]',
    dotColor: 'bg-forest',
  },
  active: {
    label: 'Active',
    bg: 'bg-sage-light',
    text: 'text-forest',
    border: 'border-[#C8DFC8]',
    dotColor: 'bg-forest',
  },

  // In coordination / assigned
  assigned: {
    label: 'Assigned',
    bg: 'bg-[#EFF6FF]',
    text: 'text-[#1E40AF]',
    border: 'border-[#BFDBFE]',
    dotColor: 'bg-[#3B82F6]',
  },
  volunteerAssigned: {
    label: 'Volunteer Assigned',
    bg: 'bg-[#EFF6FF]',
    text: 'text-[#1E40AF]',
    border: 'border-[#BFDBFE]',
    dotColor: 'bg-[#3B82F6]',
  },
  accepted: {
    label: 'Accepted',
    bg: 'bg-[#F0FDF4]',
    text: 'text-[#166534]',
    border: 'border-[#BBF7D0]',
    dotColor: 'bg-[#22C55E]',
  },

  // Collected
  collected: {
    label: 'Collected',
    bg: 'bg-[#ECFDF5]',
    text: 'text-[#065F46]',
    border: 'border-[#A7F3D0]',
    dotColor: 'bg-[#10B981]',
  },

  // Delivered / Completed
  delivered: {
    label: 'Delivered',
    bg: 'bg-[#EBF7EE]',
    text: 'text-status-success',
    border: 'border-[#B2E2BD]',
    dotColor: 'bg-status-success',
  },

  // Cancellation
  cancellationRequested: {
    label: 'Cancellation Requested',
    bg: 'bg-[#FFF7ED]',
    text: 'text-[#C2410C]',
    border: 'border-[#FFEDD5]',
    dotColor: 'bg-[#EA580C]',
  },
  cancelled: {
    label: 'Cancelled',
    bg: 'bg-[#F3F4F6]',
    text: 'text-[#4B5563]',
    border: 'border-[#E5E7EB]',
    dotColor: 'bg-[#9CA3AF]',
  },

  // Negative / Terminal states
  rejected: {
    label: 'Rejected',
    bg: 'bg-[#FEF2F2]',
    text: 'text-status-error',
    border: 'border-[#FECACA]',
    dotColor: 'bg-status-error',
  },
  declined: {
    label: 'Declined',
    bg: 'bg-[#FEF2F2]',
    text: 'text-status-error',
    border: 'border-[#FECACA]',
    dotColor: 'bg-status-error',
  },
  failed: {
    label: 'Failed',
    bg: 'bg-[#FEF2F2]',
    text: 'text-status-error',
    border: 'border-[#FECACA]',
    dotColor: 'bg-status-error',
  },
  suspended: {
    label: 'Suspended',
    bg: 'bg-[#FEF2F2]',
    text: 'text-status-error',
    border: 'border-[#FECACA]',
    dotColor: 'bg-status-error',
  },
  expired: {
    label: 'Expired',
    bg: 'bg-[#F3F4F6]',
    text: 'text-[#4B5563]',
    border: 'border-[#E5E7EB]',
    dotColor: 'bg-[#9CA3AF]',
  },
};

export interface StatusBadgeProps {
  status: EntityStatus;
  className?: string;
  customLabel?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  className = '',
  customLabel,
}) => {
  const config = statusMap[status] || {
    label: status,
    bg: 'bg-gray-100',
    text: 'text-gray-800',
    border: 'border-gray-200',
    dotColor: 'bg-gray-400',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${config.bg} ${config.text} ${config.border} ${className}`}
      role="status"
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${config.dotColor} shrink-0`}
        aria-hidden="true"
      />
      <span>{customLabel || config.label}</span>
    </span>
  );
};
