import { Application, STATUS_COLORS } from '../types';

interface ViewDrawerProps {
  app: Application;
  onClose: () => void;
  onEdit: (app: Application) => void;
}

export function ViewDrawer({ app, onClose, onEdit }: ViewDrawerProps) {
  const color = STATUS_COLORS[app.status];

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="drawer" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header" style={{ borderColor: color }}>
          <div className="drawer-avatar" style={{ backgroundColor: `${color}20`, color }}>
            {app.company_name[0].toUpperCase()}
          </div>
          <div>
            <h2 className="drawer-company">{app.company_name}</h2>
            <p className="drawer-title">{app.job_title}</p>
          </div>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="drawer-body">
          <div className="detail-row">
            <span className="detail-label">Status</span>
            <span
              className="status-badge"
              style={{
                backgroundColor: `${color}18`,
                color,
                border: `1px solid ${color}40`,
              }}
            >
              {app.status}
            </span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Job Type</span>
            <span>{app.job_type}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Applied</span>
            <span>{formatDate(app.applied_date)}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Added</span>
            <span>{formatDate(app.created_at)}</span>
          </div>
          {app.notes && (
            <div className="notes-section">
              <span className="detail-label">Notes</span>
              <p className="notes-text">{app.notes}</p>
            </div>
          )}
        </div>

        <div className="drawer-footer">
          <button className="btn btn-primary" onClick={() => { onClose(); onEdit(app); }}>
            Edit Application
          </button>
        </div>
      </div>
    </div>
  );
}
