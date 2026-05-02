"use client";

import { useEffect, useState } from "react";
import { Newspaper } from "lucide-react";
import { getNewsItems } from "@/lib/news-store";
import type { NewsItem } from "@/types";

export function NewsSlider() {
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
    <section id="news" className="container-shell py-12 sm:py-14">
      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="badge-soft">
            <Newspaper className="mr-2 h-4 w-4" />
            Latest news
          </span>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            Updates from around the municipality
          </h2>
        </div>
        <p className="max-w-xl text-sm leading-7 text-slate-600">
          Swipe or scroll through announcements, works, events, and public
          notices published by the municipality admin.
        </p>
      </div>

      <div className="flex snap-x gap-5 overflow-x-auto pb-4">
        {newsItems.map((item) => (
          <article
            key={item.id}
            className="theme-surface min-w-[300px] snap-start overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm sm:min-w-[440px] lg:min-w-[520px]"
          >
            <img
              src={item.image}
              alt={item.title}
              className="h-56 w-full object-cover"
            />
            <div className="p-5">
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase text-slate-500">
                <span>{item.category}</span>
                <span className="h-1 w-1 rounded-full bg-slate-300" />
                <span>{item.date}</span>
              </div>
              <h3 className="mt-3 text-xl font-semibold text-slate-950">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {item.summary}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
