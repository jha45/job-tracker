import { useState, FormEvent } from 'react';
import { ApplicationFormData, JOB_TYPES, STATUSES, Application } from '../types';

interface ApplicationFormProps {
  initial?: Application;
  onSubmit: (data: ApplicationFormData) => Promise<void>;
  onCancel: () => void;
  loading: boolean;
}

const EMPTY: ApplicationFormData = {
  company_name: '',
  job_title: '',
  job_type: 'Internship',
  status: 'Applied',
  applied_date: '',
  notes: '',
};

export function ApplicationForm({ initial, onSubmit, onCancel, loading }: ApplicationFormProps) {
  const [form, setForm] = useState<ApplicationFormData>(
    initial
      ? {
          company_name: initial.company_name,
          job_title: initial.job_title,
          job_type: initial.job_type,
          status: initial.status,
          applied_date: initial.applied_date.split('T')[0],
          notes: initial.notes ?? '',
        }
      : EMPTY
  );
  const [errors, setErrors] = useState<Partial<ApplicationFormData>>({});

  const validate = (): boolean => {
    const e: Partial<ApplicationFormData> = {};
    if (form.company_name.trim().length < 2)
      e.company_name = 'At least 2 characters required';
    if (!form.job_title.trim()) e.job_title = 'Job title is required';
    if (!form.applied_date) e.applied_date = 'Applied date is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit(form);
  };

  const set = (field: keyof ApplicationFormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setForm((f) => ({ ...f, [field]: e.target.value }));
      if (errors[field]) setErrors((er) => ({ ...er, [field]: undefined }));
    };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-box form-modal" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">{initial ? 'Edit Application' : 'Add Application'}</h2>
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-grid">
            <div className="field">
              <label>Company Name *</label>
              <input
                value={form.company_name}
                onChange={set('company_name')}
                placeholder="e.g. Google"
                className={errors.company_name ? 'input-error' : ''}
              />
              {errors.company_name && <span className="field-error">{errors.company_name}</span>}
            </div>

            <div className="field">
              <label>Job Title *</label>
              <input
                value={form.job_title}
                onChange={set('job_title')}
                placeholder="e.g. Frontend Engineer"
                className={errors.job_title ? 'input-error' : ''}
              />
              {errors.job_title && <span className="field-error">{errors.job_title}</span>}
            </div>

            <div className="field">
              <label>Job Type</label>
              <select value={form.job_type} onChange={set('job_type')}>
                {JOB_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div className="field">
              <label>Status</label>
              <select value={form.status} onChange={set('status')}>
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="field">
              <label>Applied Date *</label>
              <input
                type="date"
                value={form.applied_date}
                onChange={set('applied_date')}
                className={errors.applied_date ? 'input-error' : ''}
              />
              {errors.applied_date && <span className="field-error">{errors.applied_date}</span>}
            </div>

            <div className="field field-full">
              <label>Notes</label>
              <textarea
                value={form.notes}
                onChange={set('notes')}
                rows={3}
                placeholder="Any notes about this application..."
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-ghost" onClick={onCancel} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : initial ? 'Save Changes' : 'Add Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
