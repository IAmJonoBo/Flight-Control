import * as React from "react";

interface FeedbackButtonProps {
  onClick: () => void;
}

function FeedbackButton({ onClick }: FeedbackButtonProps) {
  return (
    <button
      aria-label="Open feedback form"
      className="fixed bottom-6 right-6 z-50 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-full shadow-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      onClick={onClick}
      style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}
    >
      {/* Simple feedback icon (speech bubble) */}
      <svg
        width="24"
        height="24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        viewBox="0 0 24 24"
      >
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    </button>
  );
}

export default FeedbackButton;
