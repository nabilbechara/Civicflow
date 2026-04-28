"use client";

import { useRef } from "react";
import { Paperclip, Trash2, UploadCloud } from "lucide-react";

interface UploadDropzoneProps {
  files: File[];
  onAddFiles: (files: File[]) => void;
  onRemoveFile: (index: number) => void;
}

export function UploadDropzone({
  files,
  onAddFiles,
  onRemoveFile,
}: UploadDropzoneProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selectedFiles = Array.from(event.target.files || []);
    if (selectedFiles.length > 0) {
      onAddFiles(selectedFiles);
    }
    event.target.value = "";
  }

  return (
    <div className="space-y-4">
      <div className="theme-surface rounded-[24px] border border-dashed border-white/15 bg-white/[0.03] p-6 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-200">
          <UploadCloud className="h-6 w-6" />
        </div>

        <h3 className="mt-4 text-base font-semibold text-white">
          Attach real files
        </h3>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          Choose PDF, image, or document files from your computer.
        </p>

        <input
          ref={inputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleChange}
        />

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
        >
          <Paperclip className="h-4 w-4" />
          Choose Files
        </button>
      </div>

      <div className="space-y-3">
        {files.map((file, index) => (
          <div
            key={`${file.name}-${index}`}
            className="theme-surface flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3"
          >
            <div>
              <div className="text-sm font-medium text-white">{file.name}</div>
              <div className="mt-1 text-xs text-slate-400">
                {Math.max(1, Math.round(file.size / 1024))} KB
              </div>
            </div>

            <button
              type="button"
              onClick={() => onRemoveFile(index)}
              className="inline-flex items-center gap-2 rounded-full border border-rose-400/20 bg-rose-500/10 px-3 py-1.5 text-xs font-semibold text-rose-200 transition hover:bg-rose-500/15"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Remove
            </button>
          </div>
        ))}

        {files.length === 0 ? (
          <div className="theme-surface rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-400">
            No files attached yet.
          </div>
        ) : null}
      </div>
    </div>
  );
}
