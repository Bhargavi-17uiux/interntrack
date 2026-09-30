/**
 * types.ts — Shared TypeScript types for the frontend
 *
 * These types mirror the backend API responses so TypeScript
 * can verify we're using the data correctly throughout the UI.
 */

// Application status enum — must match backend Prisma enum values
export type ApplicationStatus =
  | 'APPLIED'
  | 'INTERVIEW'
  | 'OFFER'
  | 'REJECTED'
  | 'WITHDRAWN';

// The full Application object returned from the API
export interface Application {
  id: string;
  companyName: string;
  jobRole: string;
  jobDescription: string | null;
  applicationDate: string; // ISO date string
  status: ApplicationStatus;
  jobPostingUrl: string | null;
  location: string | null;
  createdAt: string;
  updatedAt: string;
}

// Data shape for creating a new application (form submission)
export interface CreateApplicationData {
  companyName: string;
  jobRole: string;
  jobDescription?: string;
  applicationDate: string;
  status?: ApplicationStatus;
  jobPostingUrl?: string;
  location?: string;
}

// Data shape for updating (all fields optional)
export type UpdateApplicationData = Partial<CreateApplicationData>;

// Dashboard statistics from GET /api/stats
export interface Stats {
  total: number;
  applied: number;
  interview: number;
  offer: number;
  rejected: number;
  withdrawn: number;
}

// Generic API response wrapper matching backend structure
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

// Query parameters for filtering/searching
export interface ApplicationFilters {
  search: string;
  status: ApplicationStatus | '';
  sortBy: 'applicationDate' | 'createdAt' | 'companyName';
  order: 'asc' | 'desc';
}
