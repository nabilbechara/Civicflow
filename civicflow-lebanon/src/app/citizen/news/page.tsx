"use client";

import { useEffect, useState } from "react";
import { CalendarDays, Newspaper } from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { getNewsItems } from "@/lib/news-store";
import type { NewsItem } from "@/types";

export default function CitizenNewsPage() {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      setNewsItems(getNewsItems());
    });

    function handleNewsUpdated() {
      setNewsItems(getNewsItems());
    }

    window.addEventListener("civicflow-news-updated", handleNewsUpdated);
    window.addEventListener("storage", handleNewsUpdated);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("civicflow-news-updated", handleNewsUpdated);
      window.removeEventListener("storage", handleNewsUpdated);
    };
  }, []);

  return (
    <DashboardShell
      roleLabel="Citizen Portal"
      title="Latest municipal news"
      subtitle="Read the newest announcements, works, events, and public notices from your municipality."
    >
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="space-y-5">
          {newsItems.map((item) => (
            <article
              key={item.id}
              id={item.id}
              className="theme-surface overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.03] shadow-sm"
            >
              <img
                src={item.image}
                alt={item.title}
                className="h-72 w-full object-cover"
              />
              <div className="p-6">
                <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase text-slate-400">
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1">
                    <Newspaper className="h-3.5 w-3.5" />
                    {item.category}
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1">
                    <CalendarDays className="h-3.5 w-3.5" />
                    {item.date}
                  </span>
                </div>

                <h2 className="mt-4 text-2xl font-semibold tracking-tight">
                  {item.title}
                </h2>
                <p className="mt-3 text-base leading-7 text-slate-300">
                  {item.summary}
                </p>
                <p className="mt-4 text-sm leading-7 text-slate-400">
                  {item.body}
                </p>
              </div>
            </article>
          ))}
        </section>

        <aside className="glass-panel h-fit rounded-[24px] p-6">
          <h2 className="text-xl font-semibold">News archive</h2>
          <p className="mt-1 text-sm text-slate-400">
            Latest published items from the municipality admin.
          </p>

          <div className="mt-6 space-y-3">
            {newsItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="theme-surface block rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition hover:bg-white/10"
              >
                <div className="text-xs font-semibold uppercase text-slate-400">
                  {item.category} · {item.date}
                </div>
                <div className="mt-2 text-sm font-semibold">{item.title}</div>
              </a>
            ))}
          </div>
        </aside>
      </div>
    </DashboardShell>
  );
}
