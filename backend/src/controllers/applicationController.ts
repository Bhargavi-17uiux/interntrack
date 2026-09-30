/**
 * applicationController.ts — HTTP Request Handlers
 *
 * Controllers handle the HTTP layer:
 * - Reading request data (params, query, body)
 * - Calling the service layer
 * - Sending the HTTP response with the right status code
 *
 * Controllers do NOT contain business logic or database queries.
 */

import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import * as applicationService from '../services/applicationService';
import { ApplicationQueryParams, ApplicationStatus } from '../types';

/**
 * GET /api/applications
 * Returns all applications with optional filtering.
 */
export async function getApplications(req: Request, res: Response) {
  try {
    // Read query parameters for filtering/sorting
    const query: ApplicationQueryParams = {
      search: req.query.search as string | undefined,
      status: req.query.status as ApplicationStatus | undefined,
      sortBy: req.query.sortBy as ApplicationQueryParams['sortBy'],
      order: req.query.order as 'asc' | 'desc' | undefined,
    };

    const applications = await applicationService.getAllApplications(query);

    res.status(200).json({
      success: true,
      data: applications,
    });
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch applications',
    });
  }
}

/**
 * GET /api/applications/:id
 * Returns a single application by ID.
 */
export async function getApplication(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const application = await applicationService.getApplicationById(id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    res.status(200).json({
      success: true,
      data: application,
    });
  } catch (error) {
    console.error('Error fetching application:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch application',
    });
  }
}

/**
 * POST /api/applications
 * Creates a new application.
 */
export async function createApplication(req: Request, res: Response) {
  try {
    // Check if validation passed (validators ran before this controller)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array().map((e) => e.msg),
      });
    }

    const application = await applicationService.createApplication(req.body);

    res.status(201).json({
      success: true,
      data: application,
      message: 'Application created successfully',
    });
  } catch (error) {
    console.error('Error creating application:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create application',
    });
  }
}

/**
 * PUT /api/applications/:id
 * Updates an existing application (partial update allowed).
 */
export async function updateApplication(req: Request, res: Response) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array().map((e) => e.msg),
      });
    }

    const { id } = req.params;

    // Check if the application exists before updating
    const existing = await applicationService.getApplicationById(id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    const updated = await applicationService.updateApplication(id, req.body);

    res.status(200).json({
      success: true,
      data: updated,
      message: 'Application updated successfully',
    });
  } catch (error) {
    console.error('Error updating application:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update application',
    });
  }
}

/**
 * DELETE /api/applications/:id
 * Deletes an application by ID.
 */
export async function deleteApplication(req: Request, res: Response) {
  try {
    const { id } = req.params;

    // Check existence first to give a proper 404
    const existing = await applicationService.getApplicationById(id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    await applicationService.deleteApplication(id);

    res.status(200).json({
      success: true,
      message: 'Application deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting application:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete application',
    });
  }
}

/**
 * GET /api/stats
 * Returns dashboard statistics (counts per status).
 */
export async function getStats(_req: Request, res: Response) {
  try {
    const stats = await applicationService.getStats();

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics',
    });
  }
}
