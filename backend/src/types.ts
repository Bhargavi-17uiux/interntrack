/**
 * types.ts — Shared TypeScript types for the backend
 *
 * Keeping types in one place makes them easy to reuse
 * across controllers, services, and validation files.
 */

import { ApplicationStatus } from '@prisma/client';

// Re-export the Prisma enum so other files can import from here
export { ApplicationStatus };

// Shape of data when CREATING a new application (all required fields)
export interface CreateApplicationDto {
  companyName: string;
  jobRole: string;
  jobDescription?: string;
  applicationDate: string; // ISO date string from the client
  status?: ApplicationStatus;
  jobPostingUrl?: string;
  location?: string;
}

// Shape of data when UPDATING an application (all fields optional)
export interface UpdateApplicationDto {
  companyName?: string;
  jobRole?: string;
  jobDescription?: string;
  applicationDate?: string;
  status?: ApplicationStatus;
  jobPostingUrl?: string;
  location?: string;
}

// Query parameters for listing/filtering applications
export interface ApplicationQueryParams {
  search?: string;       // Search by company name or job role
  status?: ApplicationStatus;
  sortBy?: 'applicationDate' | 'createdAt' | 'companyName';
  order?: 'asc' | 'desc';
}

// Standard API response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}
