export interface DocMarketing {
  heroTitle?: string;
  heroSubtitle?: string;
  [key: string]: unknown;
}

export interface DocumentDefinition {
  id: string;
  displayName: string;
  description: string;
  marketing?: DocMarketing;
  compliance?: Record<string, unknown>;
}
