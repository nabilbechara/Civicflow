interface TimelineItem {
  id: string;
  status: string;
  actor: string;
  timestamp: string;
  note?: string;
}

interface RequestTimelineProps {
  items: TimelineItem[];
}

export function RequestTimeline({ items }: RequestTimelineProps) {
  return (
    <div className="theme-surface rounded-[24px] border border-white/10 bg-slate-950/30 p-6">
      <h3 className="text-lg font-semibold text-white">Request timeline</h3>
      <p className="mt-1 text-sm text-slate-400">
        Full lifecycle visibility across submission, review, and approvals.
      </p>

      <div className="mt-6 space-y-5">
        {items.map((item, index) => (
          <div key={item.id} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="h-10 w-10 rounded-full border border-blue-400/20 bg-blue-500/15" />
              {index < items.length - 1 ? (
                <div className="mt-2 h-full w-px bg-white/10" />
              ) : null}
            </div>

            <div className="theme-surface flex-1 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-base font-semibold text-white">
                  {item.status}
                </div>
                <div className="text-xs text-slate-400">{item.timestamp}</div>
              </div>

              <div className="mt-2 text-sm text-slate-300">
                By: {item.actor}
              </div>

              {item.note ? (
                <p className="mt-3 text-sm leading-7 text-slate-400">
                  {item.note}
                </p>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
