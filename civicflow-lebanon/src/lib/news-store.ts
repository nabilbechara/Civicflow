"use client";

import { defaultNewsItems } from "@/lib/mock-data";
import type { NewsItem } from "@/types";

const NEWS_STORAGE_KEY = "civicflow-news-items";

function sortNews(items: NewsItem[]) {
  return [...items].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export function getNewsItems(): NewsItem[] {
  if (typeof window === "undefined") return defaultNewsItems;

  const storedNews = window.localStorage.getItem(NEWS_STORAGE_KEY);

  if (!storedNews) {
    window.localStorage.setItem(
      NEWS_STORAGE_KEY,
      JSON.stringify(defaultNewsItems),
    );
    return defaultNewsItems;
  }

  try {
    const parsed = JSON.parse(storedNews) as NewsItem[];
    return sortNews(parsed);
  } catch {
    window.localStorage.setItem(
      NEWS_STORAGE_KEY,
      JSON.stringify(defaultNewsItems),
    );
    return defaultNewsItems;
  }
}

export function saveNewsItem(
  input: Omit<NewsItem, "id" | "createdAt">,
): NewsItem[] {
  const currentItems = getNewsItems();
  const newsItem: NewsItem = {
    ...input,
    id: `news-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  const updatedItems = sortNews([newsItem, ...currentItems]);

  window.localStorage.setItem(NEWS_STORAGE_KEY, JSON.stringify(updatedItems));
  window.dispatchEvent(new Event("civicflow-news-updated"));

  return updatedItems;
}

export function deleteNewsItem(newsId: string): NewsItem[] {
  const updatedItems = getNewsItems().filter((item) => item.id !== newsId);

  window.localStorage.setItem(NEWS_STORAGE_KEY, JSON.stringify(updatedItems));
  window.dispatchEvent(new Event("civicflow-news-updated"));

  return updatedItems;
}
