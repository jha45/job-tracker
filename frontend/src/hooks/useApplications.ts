import { useState, useEffect, useCallback } from 'react';
import { api, GetApplicationsParams } from '../api';
import { Application, PaginationMeta, ApplicationStatus } from '../types';

interface UseApplicationsReturn {
  applications: Application[];
  pagination: PaginationMeta | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
  setStatus: (status: ApplicationStatus | '') => void;
  setSearch: (search: string) => void;
  setPage: (page: number) => void;
  status: ApplicationStatus | '';
  search: string;
  page: number;
}

export function useApplications(): UseApplicationsReturn {
  const [applications, setApplications] = useState<Application[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<ApplicationStatus | ''>('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [trigger, setTrigger] = useState(0);

  const refetch = useCallback(() => setTrigger((t) => t + 1), []);

  useEffect(() => {
    let cancelled = false;
    const params: GetApplicationsParams = { page, limit: 10 };
    if (status) params.status = status;
    if (search.trim()) params.search = search.trim();

    setLoading(true);
    setError(null);

    api
      .getApplications(params)
      .then((res) => {
        if (!cancelled) {
          setApplications(res.data);
          setPagination(res.pagination);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load applications');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [status, search, page, trigger]);

  const handleSetStatus = (s: ApplicationStatus | '') => {
    setStatus(s);
    setPage(1);
  };

  const handleSetSearch = (s: string) => {
    setSearch(s);
    setPage(1);
  };

  return {
    applications,
    pagination,
    loading,
    error,
    refetch,
    setStatus: handleSetStatus,
    setSearch: handleSetSearch,
    setPage,
    status,
    search,
    page,
  };
}
