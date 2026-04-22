"use client";

import { UploadCloud, FileText, X } from "lucide-react";

interface UploadDropzoneProps {
  files: string[];
  onAddMockFile: () => void;
  onRemoveFile: (fileName: string) => void;
}

export function UploadDropzone({
  files,
  onAddMockFile,
  onRemoveFile,
}: UploadDropzoneProps) {
  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={onAddMockFile}
        className="w-full rounded-[24px] border border-dashed border-white/15 bg-white/[0.03] p-8 text-center transition hover:bg-white/[0.05]"
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-blue-300">
          <UploadCloud className="h-6 w-6" />
        </div>

        <div className="mt-4 text-base font-semibold text-white">
          Upload supporting documents
        </div>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          Drag and drop files here later. For now, click this area to add a demo
          document.
        </p>
      </button>

      {files.length > 0 ? (
        <div className="space-y-3">
          {files.map((fileName) => (
            <div
              key={fileName}
              className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-300">
                  <FileText className="h-4 w-4" />
                </div>

                <div>
                  <div className="text-sm font-medium text-white">
                    {fileName}
                  </div>
                  <div className="text-xs text-slate-400">
                    Demo uploaded document
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onRemoveFile(fileName)}
                className="rounded-full border border-white/10 bg-white/5 p-2 text-slate-300 transition hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
