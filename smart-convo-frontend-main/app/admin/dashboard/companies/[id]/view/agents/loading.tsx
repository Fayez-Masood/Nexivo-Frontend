import { Skeleton } from "@/components/ui/skeleton"

export default function ViewAgentsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48 rounded-xl" />
          <Skeleton className="h-4 w-64 rounded-xl" />
        </div>
        <Skeleton className="h-4 w-32 rounded-xl" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-200/60 p-4 text-center">
            <Skeleton className="h-8 w-12 mx-auto mb-2 rounded-xl" />
            <Skeleton className="h-4 w-20 mx-auto rounded-xl" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-200/60 overflow-hidden">
            <div className="p-5 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-6 w-40 rounded-xl" />
                  <Skeleton className="h-4 w-24 rounded-xl" />
                </div>
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <Skeleton className="h-8 w-8 rounded-xl" />
                </div>
              </div>
            </div>
            <div className="p-5 space-y-4">
              <Skeleton className="h-4 w-full rounded-xl" />
              <Skeleton className="h-4 w-3/4 rounded-xl" />
              <div className="grid grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, j) => (
                  <div key={j} className="space-y-1">
                    <Skeleton className="h-4 w-16 rounded-xl" />
                    <Skeleton className="h-4 w-20 rounded-xl" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
