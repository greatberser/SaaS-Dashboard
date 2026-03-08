import { Skeleton } from '@/components/ui/skeleton';

export default function TaskTableSkeleton() {
  return (
    <div className="space-y-4">
      {/* Toolbar skeleton */}
      <div className="flex flex-wrap items-center gap-3">
        <Skeleton className="h-8 w-52 rounded-md" />
        <Skeleton className="h-8 w-36 rounded-md" />
        <Skeleton className="h-8 w-36 rounded-md" />
        <Skeleton className="h-8 w-44 rounded-md" />
        <Skeleton className="ml-auto h-8 w-24 rounded-md" />
      </div>

      {/* Table skeleton */}
      <div className="rounded-lg border border-border overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-4 border-b border-border bg-muted/40 px-4 py-3">
          {[200, 80, 80, 120, 100, 80, 60].map((w, i) => (
            <Skeleton key={i} className="h-3 rounded" style={{ width: w }} />
          ))}
        </div>

        {/* Rows */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 border-b border-border px-4 py-3.5 last:border-0"
          >
            <div className="space-y-1.5" style={{ width: 200 }}>
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-2.5 w-3/4" />
            </div>
            <Skeleton className="h-5 w-20 rounded-full" />
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-3 w-28 hidden md:block" />
            <Skeleton className="h-3 w-24 hidden lg:block" />
            <Skeleton className="h-3 w-20 hidden lg:block" />
            <div className="flex gap-1">
              <Skeleton className="h-7 w-7 rounded-md" />
              <Skeleton className="h-7 w-7 rounded-md" />
            </div>
          </div>
        ))}
      </div>

      {/* Pagination skeleton */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-3 w-40" />
        <div className="flex items-center gap-1">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-7 w-7 rounded-md" />
          ))}
        </div>
      </div>
    </div>
  );
}
