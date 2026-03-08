import Topbar from '@/components/layout/Topbar';
import DashboardContent from '@/components/dashboard/DashboardContent';

export default function DashboardPage() {
  return (
    <>
      <Topbar title="Dashboard" subtitle="Welcome back, Alex" />
      <main className="flex-1 overflow-y-auto p-6">
        <DashboardContent />
      </main>
    </>
  );
}
