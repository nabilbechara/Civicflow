"use client";

import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { ImagePlus, Newspaper, Plus, Trash2 } from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Button } from "@/components/ui/button";
import { deleteNewsItem, getNewsItems, saveNewsItem } from "@/lib/news-store";
import type { NewsItem } from "@/types";

const initialForm = {
  title: "",
  date: "",
  category: "",
  image: "",
  summary: "",
  body: "",
};

export default function AdminNewsPage() {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [form, setForm] = useState(initialForm);
  const [imageName, setImageName] = useState("");
  const imageInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      setNewsItems(getNewsItems());
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, []);

  function updateField(field: keyof typeof initialForm, value: string) {
    setForm((currentForm) => ({ ...currentForm, [field]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const updatedItems = saveNewsItem({
      ...form,
      image:
        form.image ||
        "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1200&q=80",
    });

    setNewsItems(updatedItems);
    setForm(initialForm);
    setImageName("");
  }

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        updateField("image", reader.result);
        setImageName(file.name);
      }
    };
    reader.readAsDataURL(file);
    event.target.value = "";
  }

  function handleDelete(newsId: string) {
    setNewsItems(deleteNewsItem(newsId));
  }

  return (
    <DashboardShell
      roleLabel="Municipality Admin Workspace"
      title="Manage municipal news"
      subtitle="Publish announcements that appear on the public homepage and the citizen news tab."
    >
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <form onSubmit={handleSubmit} className="glass-panel rounded-[24px] p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-md bg-[#e8f2f8] text-[#1f5f8b]">
              <ImagePlus className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Add news item</h2>
              <p className="mt-1 text-sm text-slate-400">
                Add a title, image URL, and short public announcement.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4">
            <label className="grid gap-2 text-sm font-medium">
              Title
              <input
                required
                value={form.title}
                onChange={(event) => updateField("title", event.target.value)}
                className="rounded-md border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none focus:border-[#1f5f8b]"
                placeholder="Community cleanup campaign announced"
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-medium">
                Date label
                <input
                  required
                  value={form.date}
                  onChange={(event) => updateField("date", event.target.value)}
                  className="rounded-md border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none focus:border-[#1f5f8b]"
                  placeholder="May 2026"
                />
              </label>

              <label className="grid gap-2 text-sm font-medium">
                Category
                <input
                  required
                  value={form.category}
                  onChange={(event) =>
                    updateField("category", event.target.value)
                  }
                  className="rounded-md border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none focus:border-[#1f5f8b]"
                  placeholder="Public Works"
                />
              </label>
            </div>

            <div className="grid gap-3 text-sm font-medium">
              News image
              <div className="rounded-md border border-dashed border-slate-300 bg-white p-4">
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />

                {form.image ? (
                  <img
                    src={form.image}
                    alt="Selected news preview"
                    className="mb-4 h-44 w-full rounded-md object-cover"
                  />
                ) : null}

                <button
                  type="button"
                  onClick={() => imageInputRef.current?.click()}
                  className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
                >
                  <ImagePlus className="h-4 w-4" />
                  Attach image
                </button>

                <div className="mt-2 text-xs text-slate-500">
                  {imageName || "No image attached yet. A default image is used if left empty."}
                </div>
              </div>
            </div>

            <label className="grid gap-2 text-sm font-medium">
              Short summary
              <textarea
                required
                value={form.summary}
                onChange={(event) =>
                  updateField("summary", event.target.value)
                }
                className="min-h-24 rounded-md border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none focus:border-[#1f5f8b]"
                placeholder="A short sentence citizens will see in the slider."
              />
            </label>

            <label className="grid gap-2 text-sm font-medium">
              Full details
              <textarea
                required
                value={form.body}
                onChange={(event) => updateField("body", event.target.value)}
                className="min-h-32 rounded-md border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none focus:border-[#1f5f8b]"
                placeholder="Longer details for the citizen news page."
              />
            </label>
          </div>

          <Button type="submit" className="mt-6 gap-2">
            <Plus className="h-4 w-4" />
            Publish news
          </Button>
        </form>

        <section className="glass-panel rounded-[24px] p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-md bg-[#e8f2f8] text-[#1f5f8b]">
              <Newspaper className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Published news</h2>
              <p className="mt-1 text-sm text-slate-400">
                Latest items appear first for residents.
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {newsItems.map((item) => (
              <article
                key={item.id}
                className="theme-surface overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]"
              >
                <div className="grid gap-4 sm:grid-cols-[180px_1fr]">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-44 w-full object-cover sm:h-full"
                  />
                  <div className="p-4">
                    <div className="text-xs font-semibold uppercase text-slate-400">
                      {item.category} · {item.date}
                    </div>
                    <h3 className="mt-2 text-lg font-semibold">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      {item.summary}
                    </p>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      className="mt-4 inline-flex items-center gap-2 rounded-md border border-rose-400/20 bg-rose-500/10 px-3 py-2 text-sm font-semibold text-rose-200 transition hover:bg-rose-500/20"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}
