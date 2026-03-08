export type TaskStatus = 'todo' | 'in-progress' | 'done' | 'cancelled';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Subtask {
  id: string;
  title: string;
  done: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee: string;
  project: string;
  dueDate: string;
  createdAt: string;
  subtasks: Subtask[];
}

export interface ActivityItem {
  id: string;
  user: string;
  action: string;
  target: string;
  timestamp: string;
  avatarInitials: string;
  avatarColor: string;
}

export interface ChartDataPoint {
  month: string;
  revenue: number;
  users: number;
  tasks: number;
}

export interface StatCard {
  title: string;
  value: string;
  change: number;
  changeLabel: string;
  icon: string;
}

export interface UserProfile {
  name: string;
  email: string;
  role: string;
  avatarInitials: string;
  timezone: string;
  language: string;
  notifications: {
    email: boolean;
    push: boolean;
    weekly: boolean;
  };
}
