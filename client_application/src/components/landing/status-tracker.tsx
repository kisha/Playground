import { trackerBlockClasses } from "@/lib/connection-styles";
import { describeCheck, emptySlotCount, type HealthCheckRecord, toCheckState } from "@/lib/system-status";
import { cn } from "@/lib/utils";

/** One block per health check, oldest on the left. Empty slots fill in as checks arrive. */
export function StatusTracker({ history, totalSlots }: { history: HealthCheckRecord[]; totalSlots: number }) {
  return (
    <div className="flex h-8 w-full gap-[3px]" role="img" aria-label={`Last ${history.length} health checks`}>
      {Array.from({ length: emptySlotCount(history, totalSlots) }, (_, slotIndex) => (
        <span key={`empty-${slotIndex}`} className="flex-1 rounded-[3px] bg-muted" />
      ))}
      {history.map((record) => (
        <span
          key={record.id}
          title={describeCheck(record)}
          className={cn("flex-1 rounded-[3px] transition-colors duration-500", trackerBlockClasses[toCheckState(record)])}
        />
      ))}
    </div>
  );
}
