/**
 * ApplicationForm.tsx — Add / Edit Application Form
 *
 * A reusable form used for both creating and editing applications.
 * It accepts initial data (for edit mode) and a submit callback.
 *
 * Key concepts demonstrated:
 * - Controlled form with React state
 * - Client-side form handling
 * - Validation error display
 * - Loading state during submission
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CreateApplicationData, Application } from '@/types';
import { createApplication, updateApplication } from '@/lib/api';
import { STATUS_OPTIONS, getTodayISO, formatDateForInput } from '@/lib/utils';
import styles from './ApplicationForm.module.css';

interface ApplicationFormProps {
  // If provided, the form pre-fills with existing data (edit mode)
  existingApplication?: Application;
}

export default function ApplicationForm({ existingApplication }: ApplicationFormProps) {
  const router = useRouter();
  const isEditMode = !!existingApplication;

  // Form state — controlled inputs
  const [formData, setFormData] = useState<CreateApplicationData>({
    companyName: existingApplication?.companyName ?? '',
    jobRole: existingApplication?.jobRole ?? '',
    jobDescription: existingApplication?.jobDescription ?? '',
    applicationDate: existingApplication
      ? formatDateForInput(existingApplication.applicationDate)
      : getTodayISO(),
    status: existingApplication?.status ?? 'APPLIED',
    jobPostingUrl: existingApplication?.jobPostingUrl ?? '',
    location: existingApplication?.location ?? '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Generic change handler — works for all input types
  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (error) setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Clean up optional fields — send null if empty string
    const cleanData: CreateApplicationData = {
      ...formData,
      jobDescription: formData.jobDescription || undefined,
      jobPostingUrl: formData.jobPostingUrl || undefined,
      location: formData.location || undefined,
    };

    try {
      if (isEditMode && existingApplication) {
        await updateApplication(existingApplication.id, cleanData);
        router.push(`/applications/${existingApplication.id}`);
      } else {
        const newApp = await createApplication(cleanData);
        router.push(`/applications/${newApp.id}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setIsSubmitting(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} id="application-form">
      {/* Error message */}
      {error && (
        <div className="error-message" role="alert">
          ⚠️ {error}
        </div>
      )}

      {/* Two-column grid for most fields */}
      <div className={styles.grid}>
        {/* Company Name */}
        <div className={styles.fieldGroup}>
          <label htmlFor="companyName">Company Name *</label>
          <input
            id="companyName"
            name="companyName"
            type="text"
            value={formData.companyName}
            onChange={handleChange}
            placeholder="e.g., Google, Microsoft, Stripe"
            required
            maxLength={200}
          />
        </div>

        {/* Job Role */}
        <div className={styles.fieldGroup}>
          <label htmlFor="jobRole">Job Role / Position *</label>
          <input
            id="jobRole"
            name="jobRole"
            type="text"
            value={formData.jobRole}
            onChange={handleChange}
            placeholder="e.g., Software Engineering Intern"
            required
            maxLength={200}
          />
        </div>

        {/* Application Date */}
        <div className={styles.fieldGroup}>
          <label htmlFor="applicationDate">Application Date *</label>
          <input
            id="applicationDate"
            name="applicationDate"
            type="date"
            value={formData.applicationDate}
            onChange={handleChange}
            required
          />
        </div>

        {/* Status */}
        <div className={styles.fieldGroup}>
          <label htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Location */}
        <div className={styles.fieldGroup}>
          <label htmlFor="location">Location</label>
          <input
            id="location"
            name="location"
            type="text"
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g., San Francisco, CA / Remote"
            maxLength={200}
          />
        </div>

        {/* Job Posting URL */}
        <div className={styles.fieldGroup}>
          <label htmlFor="jobPostingUrl">Job Posting URL</label>
          <input
            id="jobPostingUrl"
            name="jobPostingUrl"
            type="url"
            value={formData.jobPostingUrl}
            onChange={handleChange}
            placeholder="https://jobs.example.com/..."
          />
        </div>
      </div>

      {/* Job Description (full width) */}
      <div className={styles.fieldGroup}>
        <label htmlFor="jobDescription">Notes / Job Description</label>
        <textarea
          id="jobDescription"
          name="jobDescription"
          value={formData.jobDescription}
          onChange={handleChange}
          placeholder="Add any notes, key requirements, or important information about this position..."
          maxLength={5000}
          rows={5}
        />
        <span className={styles.charCount}>
          {(formData.jobDescription ?? '').length} / 5000
        </span>
      </div>

      {/* Form Actions */}
      <div className={styles.formActions}>
        <button
          type="button"
          className="btn-secondary"
          onClick={() => router.back()}
          disabled={isSubmitting}
          id="form-cancel-btn"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn-primary"
          disabled={isSubmitting}
          id="form-submit-btn"
        >
          {isSubmitting ? (
            <>
              <span className={styles.btnSpinner} />
              {isEditMode ? 'Saving...' : 'Adding...'}
            </>
          ) : (
            isEditMode ? '💾 Save Changes' : '➕ Add Application'
          )}
        </button>
      </div>
    </form>
  );
}
