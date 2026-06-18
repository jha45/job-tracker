export type JobType = 'Internship' | 'Full-time' | 'Part-time';
export type ApplicationStatus = 'Applied' | 'Interviewing' | 'Offer' | 'Rejected';

export interface Application {
  id: string;
  company_name: string;
  job_title: string;
  job_type: JobType;
  status: ApplicationStatus;
  applied_date: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface ApplicationFormData {
  company_name: string;
  job_title: string;
  job_type: JobType;
  status: ApplicationStatus;
  applied_date: string;
  notes: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApplicationsResponse {
  data: Application[];
  pagination: PaginationMeta;
}

export const JOB_TYPES: JobType[] = ['Internship', 'Full-time', 'Part-time'];
export const STATUSES: ApplicationStatus[] = ['Applied', 'Interviewing', 'Offer', 'Rejected'];

export const STATUS_COLORS: Record<ApplicationStatus, string> = {
  Applied: '#3B82F6',
  Interviewing: '#F59E0B',
  Offer: '#10B981',
  Rejected: '#EF4444',
};
