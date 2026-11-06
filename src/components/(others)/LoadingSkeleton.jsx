const pulse = "animate-pulse rounded-lg bg-slate-200 motion-reduce:animate-none";

function SkeletonBlock({ className = "" }) {
  return <div aria-hidden="true" className={`${pulse} ${className}`} />;
}

function DashboardSkeleton() {
  return (
    <>
      <div className="space-y-3">
        <SkeletonBlock className="h-4 w-28" />
        <SkeletonBlock className="h-9 w-44 max-w-full" />
        <SkeletonBlock className="h-5 w-72 max-w-full" />
      </div>
      <div className="mt-7 grid gap-4 sm:grid-cols-2">
        {[0, 1].map((item) => (
          <div key={item} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <SkeletonBlock className="h-4 w-28" />
            <SkeletonBlock className="mt-4 h-9 w-20" />
            <SkeletonBlock className="mt-3 h-3 w-40 max-w-full" />
          </div>
        ))}
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {[0, 1].map((panel) => (
          <div key={panel} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <SkeletonBlock className="h-5 w-40" />
            <SkeletonBlock className="mt-2 h-4 w-56 max-w-full" />
            <div className="mt-7 space-y-5">
              {[0, 1, 2, 3].map((row) => (
                <div key={row}>
                  <SkeletonBlock className="mb-2 h-4 w-full" />
                  <SkeletonBlock className="h-2.5 w-full rounded-full" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function DirectorySkeleton({ type }) {
  const isPatients = type === "patients";
  const filterCount = isPatients ? 5 : 4;
  const fieldCount = isPatients ? 6 : 7;

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-3">
          <SkeletonBlock className="h-4 w-24" />
          <SkeletonBlock className="h-9 w-40" />
          <SkeletonBlock className="h-5 w-80 max-w-full" />
        </div>
        {!isPatients && <SkeletonBlock className="h-10 w-32" />}
      </div>
      <div className={`mt-7 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-2 ${isPatients ? "lg:grid-cols-3" : "lg:grid-cols-4"}`}>
        {Array.from({ length: filterCount }, (_, item) => (
          <div key={item} className="space-y-2">
            <SkeletonBlock className="h-3 w-20" />
            <SkeletonBlock className="h-10 w-full" />
          </div>
        ))}
      </div>
      <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {Array.from({ length: 5 }, (_, row) => (
          <div key={row} className={`grid gap-4 border-b border-slate-100 px-5 py-5 sm:grid-cols-2 ${isPatients ? "xl:grid-cols-6" : "xl:grid-cols-7"} xl:items-center`}>
            {Array.from({ length: fieldCount }, (_, field) => (
              <SkeletonBlock key={field} className={`h-4 ${field === 0 ? "w-3/4" : "w-full"}`} />
            ))}
          </div>
        ))}
      </div>
    </>
  );
}

export default function LoadingSkeleton({ type }) {
  const label = type === "dashboard" ? "dashboard" : type === "patients" ? "patients" : "doctors";

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8" role="status" aria-busy="true" aria-label={`Loading ${label}`}>
      <span className="sr-only">Loading {label}...</span>
      <div aria-hidden="true" className="animate-pulse motion-reduce:animate-none">
        {type === "dashboard" ? <DashboardSkeleton /> : <DirectorySkeleton type={type} />}
      </div>
    </div>
  );
}
