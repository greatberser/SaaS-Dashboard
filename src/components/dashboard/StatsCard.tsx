import { TrendingUp, TrendingDown, DollarSign, Users, CheckSquare } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { StatCard } from '@/types';
import { cn } from '@/lib/utils';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  DollarSign,
  Users,
  CheckSquare,
  TrendingUp,
};

interface StatsCardProps {
  data: StatCard;
}

export default function StatsCard({ data }: StatsCardProps) {
  const Icon = iconMap[data.icon] ?? TrendingUp;
  const isPositive = data.change >= 0;

  return (
    <Card className="border-border bg-card">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">{data.title}</p>
            <p className="text-2xl font-bold tracking-tight text-foreground">{data.value}</p>
          </div>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        </div>
        <div className="mt-3 flex items-center gap-1 text-xs">
          {isPositive ? (
            <TrendingUp className="h-3 w-3 text-emerald-500" />
          ) : (
            <TrendingDown className="h-3 w-3 text-red-500" />
          )}
          <span className={cn('font-medium', isPositive ? 'text-emerald-500' : 'text-red-500')}>
            {isPositive ? '+' : ''}
            {data.change}%
          </span>
          <span className="text-muted-foreground">{data.changeLabel}</span>
        </div>
      </CardContent>
    </Card>
  );
}
