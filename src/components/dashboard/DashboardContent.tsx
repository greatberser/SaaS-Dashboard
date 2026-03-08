'use client';

import StatsCard from './StatsCard';
import AnalyticsChart from './AnalyticsChart';
import RecentActivity from './RecentActivity';
import DashboardSkeleton from './DashboardSkeleton';
import { statsCards } from '@/data/mockData';
import { useSimulatedLoading } from '@/hooks/useSimulatedLoading';

export default function DashboardContent() {
  const loading = useSimulatedLoading(1100);

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statsCards.map((card) => (
          <StatsCard key={card.title} data={card} />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AnalyticsChart />
        </div>
        <div>
          <RecentActivity />
        </div>
      </div>
    </div>
  );
}
