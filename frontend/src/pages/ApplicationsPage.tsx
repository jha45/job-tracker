import { useState, useCallback } from 'react';
import { Application, ApplicationFormData, STATUSES, ApplicationStatus } from '../types';
import { useApplications } from '../hooks/useApplications';
import { ApplicationRow } from '../components/ApplicationRow';
import { ApplicationForm } from '../components/ApplicationForm';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { ViewDrawer } from '../components/ViewDrawer';
import { api } from '../api';

export function ApplicationsPage() {
  const {
    applications,
    pagination,
    loading,
    error,
    refetch,
    setStatus,
    setSearch,
    setPage,
    status,
    search,
    page,
  } = useApplications();

  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState<Application | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Application | null>(null);
  const [viewTarget, setViewTarget] = useState<Application | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleCreate = useCallback(async (data: ApplicationFormData) => {
    setFormLoading(true);
    setFormError(null);
    try {
      await api.createApplication(data);
      setShowForm(false);
      refetch();
    } catch (e) {
      setFormError(e instanceof Error ? e.message : 'Failed to create');
    } finally {
      setFormLoading(false);
    }
  }, [refetch]);

  const handleUpdate = useCallback(async (data: ApplicationFormData) => {
    if (!editTarget) return;
    setFormLoading(true);
    setFormError(null);
    try {
      await api.updateApplication(editTarget.id, data);
      setEditTarget(null);
      refetch();
    } catch (e) {
      setFormError(e instanceof Error ? e.message : 'Failed to update');
    } finally {
      setFormLoading(false);
    }
  }, [editTarget, refetch]);

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await api.deleteApplication(deleteTarget.id);
      setDeleteTarget(null);
      refetch();
    } catch {
      setDeleteTarget(null);
    } finally {
      setDeleteLoading(false);
    }
  }, [deleteTarget, refetch]);

  const stats = STATUSES.map((s) => ({
    label: s,
    count: applications.filter((a) => a.status === s).length,
  }));

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1 className="page-title">Job Applications</h1>
          <p className="page-sub">
            {pagination ? `${pagination.total} total application${pagination.total !== 1 ? 's' : ''}` : ''}
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => { setShowForm(true); setFormError(null); }}>
          + Add Application
        </button>
      </header>

      <div className="stats-row">
        {stats.map((s) => (
          <button
            key={s.label}
            className={`stat-card ${status === s.label ? 'stat-card-active' : ''}`}
            onClick={() => setStatus(status === s.label ? '' : s.label as ApplicationStatus)}
          >
            <span className="stat-count">{s.count}</span>
            <span className="stat-label">{s.label}</span>
          </button>
        ))}
      </div>

      <div className="toolbar">
        <input
          className="search-input"
          placeholder="Search by company or title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="filter-select"
          value={status}
          onChange={(e) => setStatus(e.target.value as ApplicationStatus | '')}
        >
          <option value="">All Statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {formError && <div className="alert alert-error">{formError}</div>}

      {loading ? (
        <div className="loading-state">
          <div className="spinner" />
          <span>Loading applications...</span>
        </div>
      ) : error ? (
        <div className="alert alert-error">{error}</div>
      ) : applications.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h3>No applications yet</h3>
          <p>{search || status ? 'No results match your filters.' : 'Start tracking by adding your first application.'}</p>
          {!search && !status && (
            <button className="btn btn-primary" onClick={() => setShowForm(true)}>
              Add your first application
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="table-wrapper">
            <table className="app-table">
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Role</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Applied</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <ApplicationRow
                    key={app.id}
                    app={app}
                    onEdit={(a) => { setEditTarget(a); setFormError(null); }}
                    onDelete={setDeleteTarget}
                    onView={setViewTarget}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {pagination && pagination.totalPages > 1 && (
            <div className="pagination">
              <button
                className="btn btn-ghost btn-sm"
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
              >
                ← Prev
              </button>
              <span className="page-info">
                Page {page} of {pagination.totalPages}
              </span>
              <button
                className="btn btn-ghost btn-sm"
                disabled={page >= pagination.totalPages}
                onClick={() => setPage(page + 1)}
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}

      {showForm && (
        <ApplicationForm
          onSubmit={handleCreate}
          onCancel={() => setShowForm(false)}
          loading={formLoading}
        />
      )}

      {editTarget && (
        <ApplicationForm
          initial={editTarget}
          onSubmit={handleUpdate}
          onCancel={() => setEditTarget(null)}
          loading={formLoading}
        />
      )}

      {deleteTarget && (
        <ConfirmDialog
          message={`Delete application for ${deleteTarget.job_title} at ${deleteTarget.company_name}? This cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleteLoading}
        />
      )}

      {viewTarget && (
        <ViewDrawer
          app={viewTarget}
          onClose={() => setViewTarget(null)}
          onEdit={(a) => { setViewTarget(null); setEditTarget(a); }}
        />
      )}
    </div>
  );
}
