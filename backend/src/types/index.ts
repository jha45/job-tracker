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

export interface CreateApplicationBody {
  company_name: string;
  job_title: string;
  job_type: JobType;
  status: ApplicationStatus;
  applied_date: string;
  notes?: string;
}

export interface UpdateApplicationBody {
  company_name?: string;
  job_title?: string;
  job_type?: JobType;
  status?: ApplicationStatus;
  applied_date?: string;
  notes?: string;
}

export interface ApplicationQuery {
  status?: ApplicationStatus;
  search?: string;
  page?: string;
  limit?: string;
}
