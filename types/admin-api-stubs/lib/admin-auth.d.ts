import type { NextRequest } from 'next/server';

export interface AdminAuthSuccess {
  userId: string;
  roles?: string[];
}

export declare function requireAdmin(
  request: NextRequest,
): Promise<Response | AdminAuthSuccess>;
