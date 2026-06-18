import { Application } from '../types';
import { StatusBadge } from './StatusBadge';

interface ApplicationRowProps {
  app: Application;
  onEdit: (app: Application) => void;
  onDelete: (app: Application) => void;
  onView: (app: Application) => void;
}

export function ApplicationRow({ app, onEdit, onDelete, onView }: ApplicationRowProps) {
  const date = new Date(app.applied_date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <tr className="table-row">
      <td>
        <div className="company-cell">
          <span className="company-avatar">{app.company_name[0].toUpperCase()}</span>
          <span className="company-name">{app.company_name}</span>
        </div>
      </td>
      <td>{app.job_title}</td>
      <td><span className="job-type-tag">{app.job_type}</span></td>
      <td><StatusBadge status={app.status} /></td>
      <td>{date}</td>
      <td>
        <div className="action-btns">
          <button className="icon-btn" title="View" onClick={() => onView(app)}>👁</button>
          <button className="icon-btn" title="Edit" onClick={() => onEdit(app)}>✏️</button>
          <button className="icon-btn icon-btn-danger" title="Delete" onClick={() => onDelete(app)}>🗑</button>
        </div>
      </td>
    </tr>
  );
}
