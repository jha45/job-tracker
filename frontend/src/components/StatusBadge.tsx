import { ApplicationStatus, STATUS_COLORS } from '../types';

interface StatusBadgeProps {
  status: ApplicationStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const color = STATUS_COLORS[status];
  return (
    <span
      style={{
        backgroundColor: `${color}18`,
        color,
        border: `1px solid ${color}40`,
      }}
      className="status-badge"
    >
      {status}
    </span>
  );
}
