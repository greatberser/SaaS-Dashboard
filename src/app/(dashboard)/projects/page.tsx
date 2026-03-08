import Topbar from '@/components/layout/Topbar';
import TaskTable from '@/components/projects/TaskTable';

export default function ProjectsPage() {
  return (
    <>
      <Topbar title="Projects" subtitle="Manage and track all tasks" />
      <main className="flex-1 overflow-y-auto p-6">
        <TaskTable />
      </main>
    </>
  );
}
