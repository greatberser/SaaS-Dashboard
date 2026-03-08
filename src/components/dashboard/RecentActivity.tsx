import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { activityItems } from '@/data/mockData';
import { cn } from '@/lib/utils';

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

const actionColors: Record<string, string> = {
  completed: 'text-emerald-500',
  created: 'text-blue-500',
  updated: 'text-violet-500',
  commented: 'text-cyan-500',
  'commented on': 'text-cyan-500',
  cancelled: 'text-red-500',
  assigned: 'text-orange-500',
  started: 'text-yellow-500',
};

export default function RecentActivity() {
  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activityItems.map((item) => (
          <div key={item.id} className="flex items-start gap-3">
            <div
              className={cn(
                'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white',
                item.avatarColor
              )}
            >
              {item.avatarInitials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-foreground">
                <span className="font-medium">{item.user}</span>{' '}
                <span className={cn('font-medium', actionColors[item.action] ?? 'text-muted-foreground')}>
                  {item.action}
                </span>{' '}
                <span className="text-muted-foreground">{item.target}</span>
              </p>
              <p className="mt-0.5 text-[10px] text-muted-foreground">{timeAgo(item.timestamp)}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
