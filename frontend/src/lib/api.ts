/**
 * api.ts — API Client
 *
 * This module contains all functions that communicate with the backend.
 * Centralizing API calls here means:
 * - If the backend URL changes, update it in one place
 * - All fetch logic (error handling, JSON parsing) is consistent
 * - Components stay clean — they just call these functions
 *
 * This is a lightweight alternative to axios or React Query.
 */

import {
  Application,
  ApplicationFilters,
  CreateApplicationData,
  Stats,
  UpdateApplicationData,
} from '../types';

// Read the backend URL from environment variable
// NEXT_PUBLIC_ prefix is required for Next.js to expose it to the browser
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';

/**
 * Helper function to make fetch requests and handle errors consistently.
 * Throws an error if the response is not OK or the API returns success: false.
 */
async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE}${path}`;

  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  });

  const json = await response.json();

  if (!response.ok || !json.success) {
    // Throw with the API's error message if available
    const message = json.message ?? `HTTP error ${response.status}`;
    throw new Error(message);
  }

  return json.data as T;
}

// ─── Application API functions ────────────────────────────────────────────────

/**
 * Fetch all applications with optional filters.
 */
export async function fetchApplications(filters?: Partial<ApplicationFilters>): Promise<Application[]> {
  // Build query string from filter object
  const params = new URLSearchParams();

  if (filters?.search) params.set('search', filters.search);
  if (filters?.status) params.set('status', filters.status);
  if (filters?.sortBy) params.set('sortBy', filters.sortBy);
  if (filters?.order) params.set('order', filters.order);

  const queryString = params.toString();
  const path = `/api/applications${queryString ? `?${queryString}` : ''}`;

  return apiFetch<Application[]>(path);
}

/**
 * Fetch a single application by ID.
 */
export async function fetchApplication(id: string): Promise<Application> {
  return apiFetch<Application>(`/api/applications/${id}`);
}

/**
 * Create a new application.
 */
export async function createApplication(data: CreateApplicationData): Promise<Application> {
  return apiFetch<Application>('/api/applications', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Update an existing application.
 */
export async function updateApplication(id: string, data: UpdateApplicationData): Promise<Application> {
  return apiFetch<Application>(`/api/applications/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * Delete an application.
 */
export async function deleteApplication(id: string): Promise<void> {
  await fetch(`${API_BASE}/api/applications/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  });
}

/**
 * Fetch dashboard statistics.
 */
export async function fetchStats(): Promise<Stats> {
  return apiFetch<Stats>('/api/stats');
}
