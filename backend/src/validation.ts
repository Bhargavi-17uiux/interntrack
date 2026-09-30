/**
 * validation.ts — Input validation rules using express-validator
 *
 * express-validator lets us define what valid input looks like
 * and automatically returns descriptive error messages if validation fails.
 *
 * Why validate? Never trust user input. Always validate on the server.
 */

import { body } from 'express-validator';

// Valid status values (must match Prisma enum)
const VALID_STATUSES = ['APPLIED', 'INTERVIEW', 'OFFER', 'REJECTED', 'WITHDRAWN'];

/**
 * Validation rules for creating a new application.
 * These run before the controller and catch bad input early.
 */
export const createApplicationValidator = [
  body('companyName')
    .trim()
    .notEmpty()
    .withMessage('Company name is required')
    .isLength({ max: 200 })
    .withMessage('Company name must be 200 characters or less'),

  body('jobRole')
    .trim()
    .notEmpty()
    .withMessage('Job role is required')
    .isLength({ max: 200 })
    .withMessage('Job role must be 200 characters or less'),

  body('jobDescription')
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 5000 })
    .withMessage('Job description must be 5000 characters or less'),

  body('applicationDate')
    .notEmpty()
    .withMessage('Application date is required')
    .isISO8601()
    .withMessage('Application date must be a valid date (YYYY-MM-DD)'),

  body('status')
    .optional()
    .isIn(VALID_STATUSES)
    .withMessage(`Status must be one of: ${VALID_STATUSES.join(', ')}`),

  body('jobPostingUrl')
    .optional({ nullable: true })
    .trim()
    .custom((value) => {
      // Allow empty string or a valid URL
      if (!value || value === '') return true;
      try {
        new URL(value);
        return true;
      } catch {
        throw new Error('Job posting URL must be a valid URL');
      }
    }),

  body('location')
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 200 })
    .withMessage('Location must be 200 characters or less'),
];

/**
 * Validation rules for updating an existing application.
 * Same rules but everything is optional since it's a partial update.
 */
export const updateApplicationValidator = [
  body('companyName')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Company name cannot be empty')
    .isLength({ max: 200 })
    .withMessage('Company name must be 200 characters or less'),

  body('jobRole')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Job role cannot be empty')
    .isLength({ max: 200 })
    .withMessage('Job role must be 200 characters or less'),

  body('jobDescription')
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 5000 })
    .withMessage('Job description must be 5000 characters or less'),

  body('applicationDate')
    .optional()
    .isISO8601()
    .withMessage('Application date must be a valid date (YYYY-MM-DD)'),

  body('status')
    .optional()
    .isIn(VALID_STATUSES)
    .withMessage(`Status must be one of: ${VALID_STATUSES.join(', ')}`),

  body('jobPostingUrl')
    .optional({ nullable: true })
    .trim()
    .custom((value) => {
      if (!value || value === '') return true;
      try {
        new URL(value);
        return true;
      } catch {
        throw new Error('Job posting URL must be a valid URL');
      }
    }),

  body('location')
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 200 })
    .withMessage('Location must be 200 characters or less'),
];
