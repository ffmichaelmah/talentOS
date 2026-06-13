import { Skeleton } from "@/components/ui/skeleton";

export default function MarketingLoading() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 px-6 py-24 text-center">
      <Skeleton className="mx-auto h-6 w-48 rounded-full" />
      <Skeleton className="mx-auto h-12 w-full max-w-2xl" />
      <Skeleton className="mx-auto h-12 w-3/4 max-w-xl" />
      <Skeleton className="mx-auto h-5 w-full max-w-lg" />
      <div className="flex justify-center gap-3 pt-2">
        <Skeleton className="h-10 w-32 rounded-lg" />
        <Skeleton className="h-10 w-32 rounded-lg" />
      </div>
    </div>
  );
}
