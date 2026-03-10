'use client';

import { useSimulatedLoading } from '@/hooks/useSimulatedLoading';
import TaskTableSkeleton from './TaskTableSkeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { StatusBadge, PriorityBadge } from './StatusBadge';
import { Task, TaskStatus, TaskPriority } from '@/types';
import { useTasks, SortField } from '@/hooks/useTasks';
import {
  ArrowUpDown, ArrowUp, ArrowDown,
  Pencil, Trash2, Plus,
  ChevronLeft, ChevronRight, ChevronDown,
} from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import TaskModal from './TaskModal';
import { projects } from '@/data/mockData';
import { cn } from '@/lib/utils';

function SortIcon({ field, active, direction }: { field: SortField; active: SortField; direction: 'asc' | 'desc' }) {
  if (field !== active) return <ArrowUpDown className="ml-1 inline h-3 w-3 text-muted-foreground" />;
  return direction === 'asc'
    ? <ArrowUp className="ml-1 inline h-3 w-3 text-primary" />
    : <ArrowDown className="ml-1 inline h-3 w-3 text-primary" />;
}

export default function TaskTable() {
  const {
    tasks,
    allTasks,
    totalTasks,
    filters,
    sortField,
    sortDirection,
    currentPage,
    totalPages,
    pageSize,
    updateFilter,
    toggleSort,
    setCurrentPage,
    createTask,
    updateTask,
    deleteTask,
    toggleSubtask,
  } = useTasks();

  const router = useRouter();
  const loading = useSimulatedLoading(900);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const editingTask = editingTaskId ? (allTasks.find((t) => t.id === editingTaskId) ?? null) : null;
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  if (loading) return <TaskTableSkeleton />;

  function openCreate() {
    setEditingTaskId(null);
    setModalOpen(true);
  }

  function openEdit(task: Task) {
    setEditingTaskId(task.id);
    setModalOpen(true);
  }

  function toggleExpand(id: string) {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalTasks);

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <Input
          placeholder="Search tasks..."
          value={filters.search}
          onChange={(e) => updateFilter('search', e.target.value)}
          className="h-8 w-52 text-sm"
        />
        <Select value={filters.status} onValueChange={(v) => updateFilter('status', v as TaskStatus | 'all')}>
          <SelectTrigger className="h-8 w-36 text-sm"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="todo">To Do</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="done">Done</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filters.priority} onValueChange={(v) => updateFilter('priority', v as TaskPriority | 'all')}>
          <SelectTrigger className="h-8 w-36 text-sm"><SelectValue placeholder="Priority" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filters.project} onValueChange={(v) => updateFilter('project', v)}>
          <SelectTrigger className="h-8 w-44 text-sm"><SelectValue placeholder="Project" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Projects</SelectItem>
            {projects.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
          </SelectContent>
        </Select>
        <Button size="sm" className="ml-auto h-8 gap-1.5" onClick={openCreate}>
          <Plus className="h-3.5 w-3.5" />
          New Task
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead className="w-8" />
              <TableHead className="cursor-pointer select-none text-xs font-medium" onClick={() => toggleSort('title')}>
                Title <SortIcon field="title" active={sortField} direction={sortDirection} />
              </TableHead>
              <TableHead className="cursor-pointer select-none text-xs font-medium" onClick={() => toggleSort('status')}>
                Status <SortIcon field="status" active={sortField} direction={sortDirection} />
              </TableHead>
              <TableHead className="cursor-pointer select-none text-xs font-medium" onClick={() => toggleSort('priority')}>
                Priority <SortIcon field="priority" active={sortField} direction={sortDirection} />
              </TableHead>
              <TableHead className="cursor-pointer select-none text-xs font-medium hidden md:table-cell" onClick={() => toggleSort('assignee')}>
                Assignee <SortIcon field="assignee" active={sortField} direction={sortDirection} />
              </TableHead>
              <TableHead className="hidden lg:table-cell text-xs font-medium">Project</TableHead>
              <TableHead className="cursor-pointer select-none text-xs font-medium hidden lg:table-cell" onClick={() => toggleSort('dueDate')}>
                Due Date <SortIcon field="dueDate" active={sortField} direction={sortDirection} />
              </TableHead>
              <TableHead className="w-20 text-xs font-medium">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="py-10 text-center text-sm text-muted-foreground">
                  No tasks found matching your filters.
                </TableCell>
              </TableRow>
            ) : (
              tasks.map((task) => {
                const expanded = expandedIds.has(task.id);
                const subtotalCount = task.subtasks.length;
                const doneCount = task.subtasks.filter((s) => s.done).length;
                const progress = subtotalCount > 0 ? Math.round((doneCount / subtotalCount) * 100) : 0;

                return (
                  <>
                    <TableRow key={task.id} className="text-sm hover:bg-muted/30">
                      {/* Expand chevron */}
                      <TableCell className="w-8 pr-0">
                        {subtotalCount > 0 && (
                          <button
                            onClick={() => toggleExpand(task.id)}
                            className="flex h-5 w-5 items-center justify-center rounded text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', expanded && 'rotate-180')} />
                          </button>
                        )}
                      </TableCell>

                      {/* Title + subtask progress */}
                      <TableCell className="font-medium max-w-[200px]">
                        <p
                          className="truncate text-sm cursor-pointer hover:text-primary hover:underline transition-colors"
                          onClick={() => router.push(`/projects/${task.id}`)}
                        >
                          {task.title}
                        </p>
                        <p className="truncate text-[11px] text-muted-foreground hidden sm:block">{task.description}</p>
                        {subtotalCount > 0 && (
                          <div className="mt-1.5 flex items-center gap-2">
                            <Progress value={progress} className="h-1 w-20" />
                            <span className="text-[10px] text-muted-foreground">{doneCount}/{subtotalCount}</span>
                          </div>
                        )}
                      </TableCell>

                      <TableCell><StatusBadge status={task.status} /></TableCell>
                      <TableCell><PriorityBadge priority={task.priority} /></TableCell>
                      <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{task.assignee}</TableCell>
                      <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">{task.project}</TableCell>
                      <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">{task.dueDate}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(task)}>
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-destructive hover:text-destructive"
                            onClick={() => {
                              deleteTask(task.id);
                              toast.error('Task deleted', { description: task.title });
                            }}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>

                    {/* Expanded subtask row */}
                    {expanded && subtotalCount > 0 && (
                      <TableRow key={`${task.id}-subtasks`} className="bg-muted/20 hover:bg-muted/20">
                        <TableCell />
                        <TableCell colSpan={7} className="pb-3 pt-1">
                          <ul className="space-y-1.5 pl-1">
                            {task.subtasks.map((s) => (
                              <li key={s.id} className="flex items-center gap-2">
                                <button
                                  onClick={() => toggleSubtask(task.id, s.id)}
                                  className={cn(
                                    'flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors',
                                    s.done
                                      ? 'border-primary bg-primary text-primary-foreground'
                                      : 'border-border bg-muted hover:border-primary/50 hover:bg-muted/70'
                                  )}
                                >
                                  {s.done && (
                                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 10 8">
                                      <path d="M1 4l3 3 5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                  )}
                                </button>
                                <span className={cn('text-xs', s.done && 'line-through text-muted-foreground')}>
                                  {s.title}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          {totalTasks === 0 ? 'No results' : `Showing ${start}–${end} of ${totalTasks} tasks`}
        </span>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}>
            <ChevronLeft className="h-3.5 w-3.5" />
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={page === currentPage ? 'default' : 'outline'}
              size="icon"
              className={cn('h-7 w-7 text-xs', page === currentPage && 'pointer-events-none')}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </Button>
          ))}
          <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      <TaskModal
        open={modalOpen}
        task={editingTask}
        onClose={() => { setModalOpen(false); setEditingTaskId(null); }}
        onCreate={(data) => {
          createTask(data);
          toast.success('Task created', { description: data.title });
        }}
        onUpdate={(id, data) => {
          updateTask(id, data);
          toast.success('Task updated', { description: data.title });
        }}
      />
    </div>
  );
}
