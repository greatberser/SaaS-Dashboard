import { Badge } from '@/components/ui/badge';
import { TaskStatus, TaskPriority } from '@/types';
import { cn } from '@/lib/utils';

const statusConfig: Record<TaskStatus, { label: string; className: string }> = {
  todo: { label: 'To Do', className: 'bg-zinc-700 text-zinc-200 hover:bg-zinc-700' },
  'in-progress': { label: 'In Progress', className: 'bg-blue-900 text-blue-300 hover:bg-blue-900' },
  done: { label: 'Done', className: 'bg-emerald-900 text-emerald-300 hover:bg-emerald-900' },
  cancelled: { label: 'Cancelled', className: 'bg-red-900 text-red-300 hover:bg-red-900' },
};

const priorityConfig: Record<TaskPriority, { label: string; className: string }> = {
  high: { label: 'High', className: 'bg-red-900 text-red-300 hover:bg-red-900' },
  medium: { label: 'Medium', className: 'bg-yellow-900 text-yellow-300 hover:bg-yellow-900' },
  low: { label: 'Low', className: 'bg-zinc-700 text-zinc-300 hover:bg-zinc-700' },
};

export function StatusBadge({ status }: { status: TaskStatus }) {
  const cfg = statusConfig[status];
  return <Badge className={cn('text-[11px] font-medium', cfg.className)}>{cfg.label}</Badge>;
}

export function PriorityBadge({ priority }: { priority: TaskPriority }) {
  const cfg = priorityConfig[priority];
  return <Badge className={cn('text-[11px] font-medium', cfg.className)}>{cfg.label}</Badge>;
}
