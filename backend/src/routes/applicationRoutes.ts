/**
 * applicationRoutes.ts — Route Definitions
 *
 * This file maps HTTP methods + URL paths to controller functions.
 * It also attaches the validation middleware before the controller
 * so bad input is caught early.
 *
 * Route structure:
 * GET    /api/applications       → list all
 * GET    /api/applications/:id   → get one
 * POST   /api/applications       → create
 * PUT    /api/applications/:id   → update
 * DELETE /api/applications/:id   → delete
 * GET    /api/stats              → dashboard stats
 */

import { Router } from 'express';
import * as controller from '../controllers/applicationController';
import { createApplicationValidator, updateApplicationValidator } from '../validation';

const router = Router();

// Stats endpoint (specific route before /:id to avoid conflicts)
router.get('/stats', controller.getStats);

// Application CRUD routes
router.get('/', controller.getApplications);
router.get('/:id', controller.getApplication);
router.post('/', createApplicationValidator, controller.createApplication);
router.put('/:id', updateApplicationValidator, controller.updateApplication);
router.delete('/:id', controller.deleteApplication);

export default router;
