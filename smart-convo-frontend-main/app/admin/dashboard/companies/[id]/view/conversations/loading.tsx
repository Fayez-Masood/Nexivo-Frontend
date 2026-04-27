import { Skeleton } from "@/components/ui/skeleton"

export default function ViewConversationsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48 rounded-xl" />
          <Skeleton className="h-4 w-64 rounded-xl" />
        </div>
        <Skeleton className="h-4 w-20 rounded-xl" />
      </div>

      <div className="space-y-4">
        <Skeleton className="h-10 w-96 rounded-xl" />

        <div className="flex flex-col sm:flex-row gap-4">
          <Skeleton className="h-10 flex-1 rounded-xl" />
          <Skeleton className="h-10 w-48 rounded-xl" />
          <Skeleton className="h-10 w-48 rounded-xl" />
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/60 overflow-hidden">
          <div className="p-5 border-b border-slate-100">
            <Skeleton className="h-6 w-48 rounded-xl" />
            <Skeleton className="h-4 w-64 rounded-xl mt-2" />
          </div>
          <div className="p-5">
            <div className="space-y-4">
              <div className="grid grid-cols-9 gap-4">
                {Array.from({ length: 9 }).map((_, i) => (
                  <Skeleton key={i} className="h-4 w-full rounded-xl" />
                ))}
              </div>
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="grid grid-cols-9 gap-4">
                  {Array.from({ length: 9 }).map((_, j) => (
                    <Skeleton key={j} className="h-4 w-full rounded-xl" />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
