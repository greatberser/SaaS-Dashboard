'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Task, TaskStatus, TaskPriority, Subtask } from '@/types';
import { projects, assignees } from '@/data/mockData';
import { Plus, Trash2, CheckSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskForm {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee: string;
  project: string;
  dueDate: string;
  subtasks: Subtask[];
}

const empty: TaskForm = {
  title: '',
  description: '',
  status: 'todo',
  priority: 'medium',
  assignee: '',
  project: '',
  dueDate: '',
  subtasks: [],
};

interface TaskModalProps {
  open: boolean;
  task: Task | null;
  onClose: () => void;
  onCreate: (data: Omit<Task, 'id' | 'createdAt'>) => void;
  onUpdate: (id: string, data: Partial<Omit<Task, 'id' | 'createdAt'>>) => void;
}

export default function TaskModal({ open, task, onClose, onCreate, onUpdate }: TaskModalProps) {
  const [form, setForm] = useState<TaskForm>(empty);
  const [errors, setErrors] = useState<Partial<Record<keyof Omit<TaskForm, 'subtasks'>, string>>>({});
  const [subtaskInput, setSubtaskInput] = useState('');
  const subtaskInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        assignee: task.assignee,
        project: task.project,
        dueDate: task.dueDate,
        subtasks: task.subtasks,
      });
    } else {
      setForm(empty);
    }
    setErrors({});
    setSubtaskInput('');
  }, [task, open]);

  function set<K extends keyof TaskForm>(key: K, value: TaskForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (key !== 'subtasks') setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function validate(): boolean {
    const errs: typeof errors = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    if (!form.assignee) errs.assignee = 'Assignee is required';
    if (!form.project) errs.project = 'Project is required';
    if (!form.dueDate) errs.dueDate = 'Due date is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSubmit() {
    if (!validate()) return;
    if (task) {
      onUpdate(task.id, form);
    } else {
      onCreate(form);
    }
    onClose();
  }

  function addSubtask() {
    const title = subtaskInput.trim();
    if (!title) return;
    set('subtasks', [...form.subtasks, { id: String(Date.now()), title, done: false }]);
    setSubtaskInput('');
    subtaskInputRef.current?.focus();
  }

  function toggleSubtask(id: string) {
    set('subtasks', form.subtasks.map((s) => s.id === id ? { ...s, done: !s.done } : s));
  }

  function deleteSubtask(id: string) {
    set('subtasks', form.subtasks.filter((s) => s.id !== id));
  }

  const doneCount = form.subtasks.filter((s) => s.done).length;
  const total = form.subtasks.length;
  const progress = total > 0 ? Math.round((doneCount / total) * 100) : 0;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{task ? 'Edit Task' : 'Create Task'}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="title" className="text-xs">
              Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              placeholder="Task title"
              className="h-9 text-sm"
            />
            {errors.title && <p className="text-[11px] text-destructive">{errors.title}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description" className="text-xs">Description</Label>
            <textarea
              id="description"
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              placeholder="Optional description..."
              rows={2}
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-0 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Status</Label>
              <Select value={form.status} onValueChange={(v) => set('status', v as TaskStatus)}>
                <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Priority</Label>
              <Select value={form.priority} onValueChange={(v) => set('priority', v as TaskPriority)}>
                <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Assignee <span className="text-destructive">*</span></Label>
              <Select value={form.assignee} onValueChange={(v) => set('assignee', v)}>
                <SelectTrigger className={cn('h-9 text-sm', errors.assignee && 'border-destructive')}>
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  {assignees.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}
                </SelectContent>
              </Select>
              {errors.assignee && <p className="text-[11px] text-destructive">{errors.assignee}</p>}
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Project <span className="text-destructive">*</span></Label>
              <Select value={form.project} onValueChange={(v) => set('project', v)}>
                <SelectTrigger className={cn('h-9 text-sm', errors.project && 'border-destructive')}>
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                </SelectContent>
              </Select>
              {errors.project && <p className="text-[11px] text-destructive">{errors.project}</p>}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="dueDate" className="text-xs">
              Due Date <span className="text-destructive">*</span>
            </Label>
            <Input
              id="dueDate"
              type="date"
              value={form.dueDate}
              onChange={(e) => set('dueDate', e.target.value)}
              className={cn('h-9 text-sm', errors.dueDate && 'border-destructive')}
            />
            {errors.dueDate && <p className="text-[11px] text-destructive">{errors.dueDate}</p>}
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-1.5 text-xs">
                <CheckSquare className="h-3.5 w-3.5" />
                Subtasks
              </Label>
              {total > 0 && (
                <span className="text-[11px] text-muted-foreground">{doneCount}/{total} done</span>
              )}
            </div>

            {total > 0 && <Progress value={progress} className="h-1.5" />}

            {form.subtasks.length > 0 && (
              <ul className="space-y-1.5">
                {form.subtasks.map((s) => (
                  <li key={s.id} className="flex items-center gap-2 group">
                    <button
                      type="button"
                      onClick={() => toggleSubtask(s.id)}
                      className={cn(
                        'flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors',
                        s.done
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border bg-muted hover:border-primary/50'
                      )}
                    >
                      {s.done && (
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 10 8">
                          <path d="M1 4l3 3 5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </button>
                    <span className={cn('flex-1 text-sm', s.done && 'line-through text-muted-foreground')}>
                      {s.title}
                    </span>
                    <button
                      type="button"
                      onClick={() => deleteSubtask(s.id)}
                      className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <div className="flex items-center gap-2">
              <Input
                ref={subtaskInputRef}
                value={subtaskInput}
                onChange={(e) => setSubtaskInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSubtask())}
                placeholder="Add a subtask..."
                className="h-8 flex-1 text-xs"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-8 w-8 shrink-0"
                onClick={addSubtask}
                disabled={!subtaskInput.trim()}
              >
                <Plus className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
          <Button size="sm" onClick={handleSubmit}>
            {task ? 'Save Changes' : 'Create Task'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
