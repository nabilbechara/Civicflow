"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Button } from "@/components/ui/button";
import { RequestStepper } from "@/components/requests/request-stepper";
import { UploadDropzone } from "@/components/requests/upload-dropzone";
import { services } from "@/lib/mock-data";
import { createRequest } from "@/lib/request-api";

const steps = ["Service", "Details", "Documents", "Review"];

const requirementsByService: Record<string, string[]> = {
  "Residency Certificate": [
    "National ID copy",
    "Proof of residence",
    "Recent utility bill",
  ],
  "Business Permit": [
    "Commercial registration",
    "Lease agreement",
    "Owner ID copy",
  ],
  "Building Complaint": [
    "Complaint statement",
    "Photo evidence",
    "Location details",
  ],
};

export default function NewRequestPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const serviceId = searchParams.get("service") || services[0]?.id || "";

  const selectedService = useMemo(
    () => services.find((service) => service.id === serviceId) || services[0],
    [serviceId],
  );

  const [step, setStep] = useState(1);
  const [fullName, setFullName] = useState("Maya Haddad");
  const [phone, setPhone] = useState("+961 70 123 456");
  const [notes, setNotes] = useState("");
  const [files, setFiles] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const requirements = requirementsByService[selectedService?.title || ""] || [
    "Supporting document",
    "Municipality-specific requirement",
  ];

  function handleAddMockFile() {
    const count = files.length + 1;
    setFiles((current) => [...current, `uploaded-document-${count}.pdf`]);
  }

  function handleRemoveFile(fileName: string) {
    setFiles((current) => current.filter((file) => file !== fileName));
  }

  function nextStep() {
    if (step === 2) {
      if (!fullName.trim() || !phone.trim()) {
        setError(
          "Please enter your full name and phone number before continuing.",
        );
        return;
      }
    }

    setError("");
    setStep((current) => Math.min(current + 1, 4));
  }

  function previousStep() {
    setError("");
    setStep((current) => Math.max(current - 1, 1));
  }

  async function submitRequest() {
    if (!selectedService) {
      setError("No service is selected.");
      setStep(1);
      return;
    }

    if (!fullName.trim() || !phone.trim()) {
      setError("Please complete your applicant details before submitting.");
      setStep(2);
      return;
    }

    try {
      setError("");
      setIsSubmitting(true);

      const createdRequest = await createRequest({
        serviceId: selectedService.id,
        tenantId: selectedService.tenantId,
        applicantName: fullName.trim(),
        applicantPhone: phone.trim(),
        notes: notes.trim(),
        files,
        priority: "Medium",
      });

      router.push(`/citizen/request/submitted?id=${createdRequest.id}`);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to submit request to the backend.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <DashboardShell
      roleLabel="Citizen Portal"
      title="New Service Request"
      subtitle="Complete the request wizard, upload documents, and submit to your municipality."
    >
      <RequestStepper currentStep={step} steps={steps} />

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.36fr]">
        <div className="glass-panel rounded-[24px] p-6">
          {step === 1 ? (
            <div>
              <h2 className="text-xl font-semibold">Selected service</h2>
              <p className="mt-1 text-sm text-slate-400">
                Confirm the service you want to request.
              </p>

              <div className="mt-6 rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
                <div className="text-sm text-slate-400">
                  {selectedService?.category}
                </div>
                <div className="mt-2 text-2xl font-semibold text-white">
                  {selectedService?.title}
                </div>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  {selectedService?.description}
                </p>
                <div className="mt-4 inline-flex rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-200">
                  Estimated processing time: {selectedService?.estimatedDays}{" "}
                  days
                </div>
              </div>
            </div>
          ) : null}

          {step === 2 ? (
            <div>
              <h2 className="text-xl font-semibold">Request details</h2>
              <p className="mt-1 text-sm text-slate-400">
                Add the applicant details and any supporting explanation.
              </p>

              <div className="mt-6 grid gap-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-200">
                    Full name
                  </label>
                  <input
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-200">
                    Phone number
                  </label>
                  <input
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-200">
                    Additional notes
                  </label>
                  <textarea
                    rows={5}
                    value={notes}
                    onChange={(event) => setNotes(event.target.value)}
                    placeholder="Provide any context that may help the municipality review your request."
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500"
                  />
                </div>
              </div>
            </div>
          ) : null}

          {step === 3 ? (
            <div>
              <h2 className="text-xl font-semibold">Upload documents</h2>
              <p className="mt-1 text-sm text-slate-400">
                Add required files before final submission.
              </p>

              <div className="mt-6">
                <UploadDropzone
                  files={files}
                  onAddMockFile={handleAddMockFile}
                  onRemoveFile={handleRemoveFile}
                />
              </div>
            </div>
          ) : null}

          {step === 4 ? (
            <div>
              <h2 className="text-xl font-semibold">Review and submit</h2>
              <p className="mt-1 text-sm text-slate-400">
                Confirm everything before sending the request to the
                municipality.
              </p>

              <div className="mt-6 space-y-4">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="text-sm text-slate-400">Service</div>
                  <div className="mt-1 text-base font-semibold text-white">
                    {selectedService?.title}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="text-sm text-slate-400">Applicant</div>
                  <div className="mt-1 text-base font-semibold text-white">
                    {fullName}
                  </div>
                  <div className="mt-1 text-sm text-slate-400">{phone}</div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="text-sm text-slate-400">Supporting notes</div>
                  <div className="mt-1 text-sm leading-7 text-slate-300">
                    {notes || "No additional notes provided."}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="text-sm text-slate-400">
                    Uploaded documents
                  </div>
                  <div className="mt-2 text-sm text-slate-300">
                    {files.length > 0
                      ? files.join(", ")
                      : "No documents uploaded yet."}
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {error ? (
            <div className="mt-6 rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
              {error}
            </div>
          ) : null}

          <div className="mt-8 flex flex-wrap gap-3">
            {step > 1 ? (
              <Button variant="secondary" onClick={previousStep}>
                Back
              </Button>
            ) : null}

            {step < 4 ? (
              <Button onClick={nextStep}>Continue</Button>
            ) : (
              <Button onClick={submitRequest} disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Request"}
              </Button>
            )}
          </div>
        </div>

        <div className="glass-panel rounded-[24px] p-6">
          <h3 className="text-lg font-semibold">Requirements</h3>
          <p className="mt-1 text-sm text-slate-400">
            Municipality guidance for this service.
          </p>

          <div className="mt-5 space-y-3">
            {requirements.map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-200"
              >
                {item}
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-amber-400/20 bg-amber-500/10 p-4 text-sm text-amber-200">
            Demo note: later this panel will come from tenant-specific service
            configuration.
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
