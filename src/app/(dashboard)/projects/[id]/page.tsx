'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Pencil,
  Trash2,
  Calendar,
  User,
  FolderOpen,
  Clock,
  CheckSquare,
} from 'lucide-react';
import { useTasks } from '@/hooks/useTasks';
import { StatusBadge, PriorityBadge } from '@/components/projects/StatusBadge';
import TaskModal from '@/components/projects/TaskModal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

export default function TaskDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { allTasks, updateTask, deleteTask, toggleSubtask } = useTasks();
  const [modalOpen, setModalOpen] = useState(false);

  const task = allTasks.find((t) => t.id === id);

  if (!task) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6">
        <p className="text-sm text-muted-foreground">Task not found.</p>
        <Link href="/projects">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-3.5 w-3.5" />
            Back to Projects
          </Button>
        </Link>
      </div>
    );
  }

  const doneCount = task.subtasks.filter((s) => s.done).length;
  const total = task.subtasks.length;
  const progress = total > 0 ? Math.round((doneCount / total) * 100) : 0;

  const today = new Date().toISOString().split('T')[0];
  const isOverdue = task.dueDate < today && task.status !== 'done' && task.status !== 'cancelled';
  const isDueSoon =
    !isOverdue &&
    task.dueDate >= today &&
    task.dueDate <=
      new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] &&
    task.status !== 'done' &&
    task.status !== 'cancelled';

  function handleDelete() {
    deleteTask(task!.id);
    toast.error('Task deleted', { description: task!.title });
    router.replace('/projects');
  }

  return (
    <>
      {/* Topbar-style header */}
      <header className="flex h-16 shrink-0 items-center gap-3 border-b border-border bg-card px-6">
        <Link
          href="/projects"
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Projects
        </Link>
        <span className="text-muted-foreground">/</span>
        <span className="text-xs font-medium text-foreground truncate max-w-xs">{task.title}</span>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8 gap-1.5" onClick={() => setModalOpen(true)}>
            <Pencil className="h-3.5 w-3.5" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 text-destructive hover:text-destructive"
            onClick={handleDelete}
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete
          </Button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-4xl space-y-6">
          {/* Title + badges */}
          <div className="space-y-2">
            <h1 className="text-xl font-semibold text-foreground">{task.title}</h1>
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={task.status} />
              <PriorityBadge priority={task.priority} />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Left: description + subtasks */}
            <div className="space-y-6 lg:col-span-2">
              {/* Description */}
              <Card className="border-border bg-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold">Description</CardTitle>
                </CardHeader>
                <CardContent>
                  {task.description ? (
                    <p className="text-sm text-muted-foreground leading-relaxed">{task.description}</p>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">No description provided.</p>
                  )}
                </CardContent>
              </Card>

              {/* Subtasks */}
              {total > 0 && (
                <Card className="border-border bg-card">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-1.5 text-sm font-semibold">
                        <CheckSquare className="h-4 w-4" />
                        Subtasks
                      </CardTitle>
                      <span className="text-xs text-muted-foreground">{doneCount}/{total} done</span>
                    </div>
                    <Progress value={progress} className="h-1.5 mt-2" />
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {task.subtasks.map((s) => (
                      <div
                        key={s.id}
                        className="flex items-center gap-3 rounded-md p-2 hover:bg-muted/40 transition-colors"
                      >
                        <button
                          onClick={() => toggleSubtask(task.id, s.id)}
                          className={cn(
                            'flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors',
                            s.done
                              ? 'border-primary bg-primary text-primary-foreground'
                              : 'border-border bg-muted hover:border-primary/50'
                          )}
                        >
                          {s.done && (
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 10 8">
                              <path
                                d="M1 4l3 3 5-6"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          )}
                        </button>
                        <span
                          className={cn(
                            'text-sm',
                            s.done && 'line-through text-muted-foreground'
                          )}
                        >
                          {s.title}
                        </span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right: meta */}
            <div className="space-y-4">
              <Card className="border-border bg-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold">Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <MetaRow icon={<User className="h-3.5 w-3.5" />} label="Assignee" value={task.assignee} />
                  <Separator />
                  <MetaRow icon={<FolderOpen className="h-3.5 w-3.5" />} label="Project" value={task.project} />
                  <Separator />
                  <MetaRow
                    icon={<Calendar className="h-3.5 w-3.5" />}
                    label="Due Date"
                    value={task.dueDate}
                    valueClassName={
                      isOverdue
                        ? 'text-red-400'
                        : isDueSoon
                        ? 'text-yellow-400'
                        : undefined
                    }
                    suffix={
                      isOverdue ? (
                        <span className="text-[10px] text-red-400 font-medium">Overdue</span>
                      ) : isDueSoon ? (
                        <span className="text-[10px] text-yellow-400 font-medium">Due soon</span>
                      ) : undefined
                    }
                  />
                  <Separator />
                  <MetaRow icon={<Clock className="h-3.5 w-3.5" />} label="Created" value={task.createdAt} />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <TaskModal
        open={modalOpen}
        task={task}
        onClose={() => setModalOpen(false)}
        onCreate={() => {}}
        onUpdate={(taskId, data) => {
          updateTask(taskId, data);
          toast.success('Task updated', { description: data.title ?? task.title });
        }}
      />
    </>
  );
}

function MetaRow({
  icon,
  label,
  value,
  valueClassName,
  suffix,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  valueClassName?: string;
  suffix?: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-2">
      <span className="mt-0.5 shrink-0 text-muted-foreground">{icon}</span>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
        <div className="flex items-center gap-1.5 flex-wrap">
          <p className={cn('text-sm font-medium', valueClassName)}>{value}</p>
          {suffix}
        </div>
      </div>
    </div>
  );
}
