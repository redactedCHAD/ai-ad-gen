export interface UploadedFile {
  base64: string;
  mimeType: string;
}

export type Platform = 'LinkedIn' | 'X' | 'Blog';
export type Status = 'Draft' | 'Scheduled' | 'Published';

export interface CalendarEvent {
  id: number;
  date: Date;
  title: string;
  platform: Platform;
  status: Status;
}

// FIX: Add a shared 'Tool' type to be used across components.
export type Tool = 'ad-generator' | 'social-posts' | 'dashboard';
