export type UserRole = 'donor' | 'volunteer' | 'ngo' | 'admin';

export type AccountStatus = 'active' | 'pending' | 'suspended' | 'rejected';

export type NgoApplicationStatus = 'pending' | 'approved' | 'rejected' | 'needsCorrection';

export interface UserProfile {
  uid: string;
  email: string;
  fullName: string;
  phone: string;
  role: UserRole;
  accountStatus: AccountStatus;
  organizationName?: string;
  ngoId?: string;
  suspensionReason?: string;
  suspendedBy?: string;
  suspendedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NgoApplication {
  id: string;
  officerUid: string;
  organizationName: string;
  registrationNumber: string;
  contactPhone: string;
  officialAddress: string;
  documentReferences: string[];
  status: NgoApplicationStatus;
  reviewReason?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  submittedAt: string;
  updatedAt: string;
  ngoId?: string;
}
