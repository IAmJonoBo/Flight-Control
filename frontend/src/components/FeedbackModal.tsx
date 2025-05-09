import * as React from "react";
import { useRef, useEffect, useState } from "react";

interface FeedbackModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => Promise<void>;
}

const SEVERITY_OPTIONS = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "critical", label: "Critical" },
];

function FeedbackModal({ open, onClose, onSubmit }: FeedbackModalProps) {
  const modalRef = useRef(null);
  const firstFieldRef = useRef(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && firstFieldRef.current) {
      (firstFieldRef.current as HTMLInputElement).focus();
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      // Trap focus
      if (e.key === "Tab" && modalRef.current) {
        const focusable = (
          modalRef.current as HTMLElement
        ).querySelectorAll<HTMLElement>(
          'input, textarea, select, button, [tabindex]:not([tabindex="-1"])',
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        } else if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      }
    }
    if (open) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  const validate = (form: HTMLFormElement) => {
    const errs: { [key: string]: string } = {};
    const title = (
      form.elements.namedItem("title") as HTMLInputElement
    )?.value.trim();
    const description = (
      form.elements.namedItem("description") as HTMLTextAreaElement
    )?.value.trim();
    if (!title) errs.title = "Title is required.";
    else if (title.length < 3 || title.length > 100)
      errs.title = "Title must be 3-100 characters.";
    if (!description) errs.description = "Description is required.";
    else if (description.length < 10 || description.length > 2000)
      errs.description = "Description must be 10-2000 characters.";
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      // Focus first error field
      const firstError = Object.keys(errs)[0];
      const el = form[firstError];
      if (el && typeof el.focus === "function") el.focus();
      return;
    }
    setLoading(true);
    try {
      await onSubmit(new FormData(form));
      setErrors({});
    } catch {
      // Optionally handle global error
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="feedback-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm transition-opacity"
      style={{ animation: "fadeIn 0.2s" }}
    >
      <div
        ref={modalRef}
        className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-md mx-4 p-6 relative animate-fadeIn"
      >
        <button
          aria-label="Close feedback form"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none"
        >
          <span aria-hidden="true">&times;</span>
        </button>
        <h2
          id="feedback-title"
          className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100"
        >
          Submit Feedback
        </h2>
        <form onSubmit={handleSubmit} noValidate>
          <label
            htmlFor="title"
            className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200"
          >
            Title <span className="text-red-500">*</span>
          </label>
          <input
            ref={firstFieldRef}
            id="title"
            name="title"
            type="text"
            required
            aria-invalid={!!errors.title}
            aria-describedby={errors.title ? "title-error" : undefined}
            className={`w-full mb-1 px-3 py-2 border ${errors.title ? "border-red-500" : "border-gray-300 dark:border-gray-700"} rounded focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100`}
            aria-required="true"
            aria-label="Title"
          />
          {errors.title && (
            <div
              id="title-error"
              className="text-xs text-red-600 mb-2"
              role="alert"
            >
              {errors.title}
            </div>
          )}
          <label
            htmlFor="description"
            className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200"
          >
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            required
            rows={4}
            aria-invalid={!!errors.description}
            aria-describedby={
              errors.description ? "description-error" : undefined
            }
            className={`w-full mb-1 px-3 py-2 border ${errors.description ? "border-red-500" : "border-gray-300 dark:border-gray-700"} rounded focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100`}
            aria-required="true"
            aria-label="Description"
          />
          {errors.description && (
            <div
              id="description-error"
              className="text-xs text-red-600 mb-2"
              role="alert"
            >
              {errors.description}
            </div>
          )}
          <label
            htmlFor="severity"
            className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200"
          >
            Severity
          </label>
          <select
            id="severity"
            name="severity"
            className="w-full mb-3 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            aria-label="Severity"
            defaultValue="medium"
          >
            {SEVERITY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <label
            htmlFor="email"
            className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200"
          >
            Email (optional)
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className="w-full mb-3 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            aria-label="Email"
          />
          <label
            htmlFor="attachment"
            className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200"
          >
            Attachment (optional)
          </label>
          <input
            id="attachment"
            name="attachment"
            type="file"
            accept="image/*"
            className="w-full mb-4 text-gray-700 dark:text-gray-200"
            aria-label="Attachment"
          />
          <button
            type="submit"
            className={`w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded shadow focus:outline-none focus:ring-2 focus:ring-blue-500 transition flex items-center justify-center ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? (
              <span className="loader mr-2" aria-hidden="true"></span>
            ) : null}
            {loading ? "Submitting..." : "Submit Feedback"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default FeedbackModal;
