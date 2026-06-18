import { JobType, ApplicationStatus } from '../types';

const JOB_TYPES: JobType[] = ['Internship', 'Full-time', 'Part-time'];
const STATUSES: ApplicationStatus[] = ['Applied', 'Interviewing', 'Offer', 'Rejected'];

function validateCreateApplication(body: {
  company_name?: string;
  job_title?: string;
  job_type?: string;
  status?: string;
  applied_date?: string;
}): string[] {
  const errors: string[] = [];
  if (!body.company_name || body.company_name.trim().length < 2)
    errors.push('company_name must be at least 2 characters');
  if (!body.job_title || body.job_title.trim().length === 0)
    errors.push('job_title is required');
  if (!body.job_type || !JOB_TYPES.includes(body.job_type as JobType))
    errors.push(`job_type must be one of: ${JOB_TYPES.join(', ')}`);
  if (!body.status || !STATUSES.includes(body.status as ApplicationStatus))
    errors.push(`status must be one of: ${STATUSES.join(', ')}`);
  if (!body.applied_date || isNaN(Date.parse(body.applied_date)))
    errors.push('applied_date must be a valid date');
  return errors;
}

describe('Application validation', () => {
  it('passes with valid data', () => {
    const errors = validateCreateApplication({
      company_name: 'Google',
      job_title: 'Frontend Engineer',
      job_type: 'Internship',
      status: 'Applied',
      applied_date: '2024-06-18',
    });
    expect(errors).toHaveLength(0);
  });

  it('fails when company_name is too short', () => {
    const errors = validateCreateApplication({
      company_name: 'A',
      job_title: 'Dev',
      job_type: 'Full-time',
      status: 'Applied',
      applied_date: '2024-06-18',
    });
    expect(errors).toContain('company_name must be at least 2 characters');
  });

  it('fails when status is invalid', () => {
    const errors = validateCreateApplication({
      company_name: 'Google',
      job_title: 'Dev',
      job_type: 'Full-time',
      status: 'Pending',
      applied_date: '2024-06-18',
    });
    expect(errors.some((e) => e.includes('status must be one of'))).toBe(true);
  });

  it('fails when applied_date is invalid', () => {
    const errors = validateCreateApplication({
      company_name: 'Google',
      job_title: 'Dev',
      job_type: 'Full-time',
      status: 'Applied',
      applied_date: 'not-a-date',
    });
    expect(errors).toContain('applied_date must be a valid date');
  });

  it('fails when required fields are missing', () => {
    const errors = validateCreateApplication({});
    expect(errors.length).toBeGreaterThan(0);
  });
});
