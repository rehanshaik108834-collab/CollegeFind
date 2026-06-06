export function CollegeCardSkeleton() {
  return (
    <div className="card">
      <div className="skeleton h-48 w-full rounded-none" />
      <div className="p-5 space-y-3">
        <div className="skeleton h-4 w-3/4" />
        <div className="skeleton h-3 w-1/2" />
        <div className="flex gap-2 pt-1">
          <div className="skeleton h-5 w-20 rounded-full" />
          <div className="skeleton h-5 w-16 rounded-full" />
        </div>
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="skeleton h-10 rounded-xl" />
          <div className="skeleton h-10 rounded-xl" />
        </div>
        <div className="skeleton h-9 w-full rounded-xl" />
      </div>
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-pulse">
      <div className="skeleton h-64 rounded-2xl mb-8" />
      <div className="grid grid-cols-3 gap-8">
        <div className="space-y-4">
          <div className="skeleton h-80 rounded-2xl" />
        </div>
        <div className="col-span-2 space-y-4">
          <div className="skeleton h-48 rounded-2xl" />
          <div className="skeleton h-48 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
