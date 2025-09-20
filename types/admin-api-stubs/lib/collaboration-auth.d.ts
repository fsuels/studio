export type CollaborationRole = 'owner' | 'editor' | 'reviewer' | 'viewer';

export interface CollaborationToken {
  userId: string;
  documentId: string;
  role: CollaborationRole;
  expiresAt: number;
  permissions: string[];
}

export declare function generateCollaborationToken(
  userId: string,
  documentId: string,
  role: CollaborationRole,
  expiresIn: number,
): Promise<string>;

export declare function authorizeDocumentAccess(
  documentId: string,
  userId: string,
): Promise<boolean>;

export declare function checkPermission(
  userId: string,
  documentId: string,
  permission: string,
): Promise<boolean>;
