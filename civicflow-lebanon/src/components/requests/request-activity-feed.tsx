interface ActivityItem {
  id: string;
  author: string;
  role: string;
  time: string;
  message: string;
}

interface RequestActivityFeedProps {
  title?: string;
  items: ActivityItem[];
}

export function RequestActivityFeed({
  title = "Activity and notes",
  items,
}: RequestActivityFeedProps) {
  return (
    <div className="theme-surface rounded-[24px] border border-white/10 bg-slate-950/30 p-6">
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <p className="mt-1 text-sm text-slate-400">
        Communication, review notes, and workflow updates.
      </p>

      <div className="mt-6 space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="theme-surface rounded-2xl border border-white/10 bg-white/[0.03] p-4"
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="text-sm font-medium text-white">
                  {item.author}
                </div>
                <div className="text-xs text-slate-400">{item.role}</div>
              </div>

              <div className="text-xs text-slate-400">{item.time}</div>
            </div>

            <p className="mt-3 text-sm leading-7 text-slate-300">
              {item.message}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
