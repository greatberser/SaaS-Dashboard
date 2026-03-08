'use client';

import { useState, useMemo, useEffect } from 'react';
import { Task, TaskStatus, TaskPriority } from '@/types';
import { tasks as initialTasks } from '@/data/mockData';

export type SortField = 'title' | 'status' | 'priority' | 'assignee' | 'dueDate' | 'createdAt';
export type SortDirection = 'asc' | 'desc';

export interface TaskFilters {
  search: string;
  status: TaskStatus | 'all';
  priority: TaskPriority | 'all';
  project: string;
}

const PRIORITY_ORDER: Record<TaskPriority, number> = { high: 0, medium: 1, low: 2 };
const STATUS_ORDER: Record<TaskStatus, number> = { 'in-progress': 0, todo: 1, done: 2, cancelled: 3 };

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const stored = localStorage.getItem('tasks');
      return stored ? JSON.parse(stored) : initialTasks;
    } catch {
      return initialTasks;
    }
  });
  const [filters, setFilters] = useState<TaskFilters>({
    search: '',
    status: 'all',
    priority: 'all',
    project: 'all',
  });
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.assignee.toLowerCase().includes(q) ||
          t.project.toLowerCase().includes(q)
      );
    }
    if (filters.status !== 'all') result = result.filter((t) => t.status === filters.status);
    if (filters.priority !== 'all') result = result.filter((t) => t.priority === filters.priority);
    if (filters.project !== 'all') result = result.filter((t) => t.project === filters.project);

    result.sort((a, b) => {
      let cmp = 0;
      if (sortField === 'priority') {
        cmp = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
      } else if (sortField === 'status') {
        cmp = STATUS_ORDER[a.status] - STATUS_ORDER[b.status];
      } else {
        cmp = a[sortField].localeCompare(b[sortField]);
      }
      return sortDirection === 'asc' ? cmp : -cmp;
    });

    return result;
  }, [tasks, filters, sortField, sortDirection]);

  const totalPages = Math.max(1, Math.ceil(filteredTasks.length / pageSize));
  const paginatedTasks = filteredTasks.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  function toggleSort(field: SortField) {
    if (sortField === field) {
      setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  }

  function updateFilter<K extends keyof TaskFilters>(key: K, value: TaskFilters[K]) {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  }

  function createTask(data: Omit<Task, 'id' | 'createdAt'>) {
    const newTask: Task = {
      ...data,
      id: String(Date.now()),
      createdAt: new Date().toISOString().split('T')[0],
    };
    setTasks((prev) => [newTask, ...prev]);
  }

  function updateTask(id: string, data: Partial<Omit<Task, 'id' | 'createdAt'>>) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...data } : t)));
  }

  function deleteTask(id: string) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  function toggleSubtask(taskId: string, subtaskId: string) {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              subtasks: t.subtasks.map((s) =>
                s.id === subtaskId ? { ...s, done: !s.done } : s
              ),
            }
          : t
      )
    );
  }

  return {
    tasks: paginatedTasks,
    totalTasks: filteredTasks.length,
    allTasks: tasks,
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
  };
}
