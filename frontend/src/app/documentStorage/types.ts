export interface Document {
  id: string;
  name: string;
  type: DocumentType;
  size: number;
  uploadedAt: string;
  uploadedBy: string;
  folderId: string | null;
  accountId: string;
  permissions: DocumentPermission[];
  tags: string[];
  description?: string;
  version: number;
  isConfidential: boolean;
}

export interface Folder {
  id: string;
  name: string;
  parentId: string | null;
  accountId: string;
  createdAt: string;
  createdBy: string;
  permissions: FolderPermission[];
  documentCount: number;
}

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  createdAt: string;
  status: AccountStatus;
  primaryContact: string;
  email: string;
}

export interface DocumentPermission {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  accessLevel: AccessLevel;
  grantedAt: string;
  grantedBy: string;
  expiresAt?: string;
}

export interface FolderPermission {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  accessLevel: AccessLevel;
  inheritToDocuments: boolean;
  grantedAt: string;
  grantedBy: string;
}

export enum DocumentType {
  CONTRACT = "CONTRACT",
  AGREEMENT = "AGREEMENT",
  BRIEF = "BRIEF",
  MOTION = "MOTION",
  PLEADING = "PLEADING",
  CORRESPONDENCE = "CORRESPONDENCE",
  EVIDENCE = "EVIDENCE",
  DISCOVERY = "DISCOVERY",
  COURT_FILING = "COURT_FILING",
  MEMO = "MEMO",
  OTHER = "OTHER",
}

export enum AccessLevel {
  VIEW = "VIEW",
  DOWNLOAD = "DOWNLOAD",
  EDIT = "EDIT",
  DELETE = "DELETE",
  MANAGE = "MANAGE",
  OWNER = "OWNER",
}

export enum AccountType {
  INDIVIDUAL = "INDIVIDUAL",
  CORPORATE = "CORPORATE",
  GOVERNMENT = "GOVERNMENT",
  NON_PROFIT = "NON_PROFIT",
}

export enum AccountStatus {
  ACTIVE = "ACTIVE",
  SUSPENDED = "SUSPENDED",
  PENDING = "PENDING",
  ARCHIVED = "ARCHIVED",
}

export interface DocumentFilter {
  searchTerm?: string;
  documentType?: DocumentType;
  folderId?: string | null;
  accountId?: string;
  uploadedAfter?: string;
  uploadedBefore?: string;
  tags?: string[];
  isConfidential?: boolean;
}

export interface SortConfig {
  field: "name" | "uploadedAt" | "size" | "type";
  direction: "asc" | "desc";
}

export interface PaginationConfig {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface AuditLogEntry {
  id: string;
  documentId: string;
  action: AuditAction;
  performedBy: string;
  performedAt: string;
  details: string;
  ipAddress?: string;
}

export enum AuditAction {
  VIEW = "VIEW",
  DOWNLOAD = "DOWNLOAD",
  UPLOAD = "UPLOAD",
  EDIT = "EDIT",
  DELETE = "DELETE",
  PERMISSION_GRANTED = "PERMISSION_GRANTED",
  PERMISSION_REVOKED = "PERMISSION_REVOKED",
  MOVED = "MOVED",
  RENAMED = "RENAMED",
}
