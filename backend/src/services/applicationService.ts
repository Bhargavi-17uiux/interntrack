/**
 * applicationService.ts — Business Logic Layer
 *
 * The "service" layer sits between the controller (handles HTTP) and
 * the database (Prisma). Keeping business logic here makes the code:
 * - Easier to test (no HTTP needed)
 * - Easier to reuse (another controller could call these functions)
 * - Cleaner to read (controller stays thin)
 */

import prisma from '../db';
import { ApplicationStatus, CreateApplicationDto, UpdateApplicationDto, ApplicationQueryParams } from '../types';

/**
 * Get all applications with optional filtering, search, and sorting.
 */
export async function getAllApplications(query: ApplicationQueryParams) {
  const { search, status, sortBy = 'applicationDate', order = 'desc' } = query;

  // Build the "where" clause dynamically based on what filters are provided
  const where: {
    status?: ApplicationStatus;
    OR?: Array<{ companyName?: { contains: string; mode: 'insensitive' }; jobRole?: { contains: string; mode: 'insensitive' } }>;
  } = {};

  // Filter by status if provided
  if (status) {
    where.status = status;
  }

  // Search across company name AND job role (case-insensitive)
  if (search) {
    where.OR = [
      { companyName: { contains: search, mode: 'insensitive' } },
      { jobRole: { contains: search, mode: 'insensitive' } },
    ];
  }

  const applications = await prisma.application.findMany({
    where,
    orderBy: { [sortBy]: order },
  });

  return applications;
}

/**
 * Get a single application by ID.
 * Returns null if not found (controller handles the 404).
 */
export async function getApplicationById(id: string) {
  return prisma.application.findUnique({
    where: { id },
  });
}

/**
 * Create a new application record in the database.
 */
export async function createApplication(data: CreateApplicationDto) {
  return prisma.application.create({
    data: {
      companyName: data.companyName,
      jobRole: data.jobRole,
      jobDescription: data.jobDescription ?? null,
      applicationDate: new Date(data.applicationDate),
      status: data.status ?? ApplicationStatus.APPLIED,
      jobPostingUrl: data.jobPostingUrl ?? null,
      location: data.location ?? null,
    },
  });
}

/**
 * Update an existing application.
 * Only updates fields that are provided (partial update).
 */
export async function updateApplication(id: string, data: UpdateApplicationDto) {
  // Build the update payload — only include fields that were sent
  const updateData: Record<string, unknown> = {};

  if (data.companyName !== undefined) updateData.companyName = data.companyName;
  if (data.jobRole !== undefined) updateData.jobRole = data.jobRole;
  if (data.jobDescription !== undefined) updateData.jobDescription = data.jobDescription;
  if (data.applicationDate !== undefined) updateData.applicationDate = new Date(data.applicationDate);
  if (data.status !== undefined) updateData.status = data.status;
  if (data.jobPostingUrl !== undefined) updateData.jobPostingUrl = data.jobPostingUrl;
  if (data.location !== undefined) updateData.location = data.location;

  return prisma.application.update({
    where: { id },
    data: updateData,
  });
}

/**
 * Delete an application by ID.
 */
export async function deleteApplication(id: string) {
  return prisma.application.delete({
    where: { id },
  });
}

/**
 * Get aggregate statistics for the dashboard.
 * Uses Prisma's groupBy to count records per status in a single query.
 */
export async function getStats() {
  // Count all applications
  const total = await prisma.application.count();

  // Get count per status using groupBy
  const statusCounts = await prisma.application.groupBy({
    by: ['status'],
    _count: { status: true },
  });

  // Turn the array of { status, _count } into a simple object
  const counts: Record<string, number> = {
    APPLIED: 0,
    INTERVIEW: 0,
    OFFER: 0,
    REJECTED: 0,
    WITHDRAWN: 0,
  };

  for (const row of statusCounts) {
    counts[row.status] = row._count.status;
  }

  return {
    total,
    applied: counts.APPLIED,
    interview: counts.INTERVIEW,
    offer: counts.OFFER,
    rejected: counts.REJECTED,
    withdrawn: counts.WITHDRAWN,
  };
}
