'use client';

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';
import { chartData } from '@/data/mockData';

type ChartType = 'revenue' | 'users' | 'tasks';

const config: Record<ChartType, { label: string; color: string; format: (v: number) => string }> = {
  revenue: {
    label: 'Revenue',
    color: '#8b5cf6',
    format: (v) => `$${(v / 1000).toFixed(0)}k`,
  },
  users: {
    label: 'Active Users',
    color: '#06b6d4',
    format: (v) => v.toLocaleString(),
  },
  tasks: {
    label: 'Tasks Completed',
    color: '#10b981',
    format: (v) => String(v),
  },
};

export default function AnalyticsChart() {
  const [metric, setMetric] = useState<ChartType>('revenue');
  const [chartType, setChartType] = useState<'area' | 'bar'>('area');
  const cfg = config[metric];

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle className="text-sm font-semibold">Analytics Overview</CardTitle>
          <div className="flex items-center gap-2">
            <Tabs value={metric} onValueChange={(v) => setMetric(v as ChartType)}>
              <TabsList className="h-7 text-xs">
                <TabsTrigger value="revenue" className="h-6 px-2 text-xs">Revenue</TabsTrigger>
                <TabsTrigger value="users" className="h-6 px-2 text-xs">Users</TabsTrigger>
                <TabsTrigger value="tasks" className="h-6 px-2 text-xs">Tasks</TabsTrigger>
              </TabsList>
            </Tabs>
            <Tabs value={chartType} onValueChange={(v) => setChartType(v as 'area' | 'bar')}>
              <TabsList className="h-7 text-xs">
                <TabsTrigger value="area" className="h-6 px-2 text-xs">Area</TabsTrigger>
                <TabsTrigger value="bar" className="h-6 px-2 text-xs">Bar</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={240}>
          {chartType === 'area' ? (
            <AreaChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={cfg.color} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={cfg.color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={cfg.format}
                width={48}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: '6px',
                  fontSize: 12,
                }}
                formatter={(v) => [cfg.format(v as number), cfg.label]}
              />
              <Area
                type="monotone"
                dataKey={metric}
                stroke={cfg.color}
                strokeWidth={2}
                fill="url(#colorGrad)"
                dot={false}
                activeDot={{ r: 4, fill: cfg.color }}
              />
            </AreaChart>
          ) : (
            <BarChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={cfg.format}
                width={48}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: '6px',
                  fontSize: 12,
                }}
                formatter={(v) => [cfg.format(v as number), cfg.label]}
              />
              <Bar dataKey={metric} fill={cfg.color} radius={[4, 4, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
