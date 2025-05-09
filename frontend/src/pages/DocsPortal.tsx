import React from "react";

const DOCS = [
  { id: "getting-started", label: "Getting Started" },
  { id: "api-reference", label: "API Reference" },
  { id: "accessibility", label: "Accessibility" },
  { id: "security", label: "Security" },
  { id: "pilot-deployment", label: "Pilot Deployment" },
  { id: "feedback", label: "Feedback" },
];

const DOCS_BASE_URL = "https://your-org.github.io/flight-control/docs/";

const DocsPortal = () => (
  <div className="p-8">
    <h2 className="text-2xl font-semibold mb-4">Documentation Portal</h2>
    <p>Access user guides, API reference, and technical documentation here.</p>
    <a
      href="https://your-org.github.io/flight-control/"
      className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Open Docusaurus Documentation"
    >
      Open Documentation
    </a>
    <nav className="mt-6" aria-label="Documentation Table of Contents">
      <ul className="space-y-2">
        {DOCS.map((doc) => (
          <li key={doc.id}>
            <a
              href={`${DOCS_BASE_URL}${doc.id}`}
              className="text-blue-700 underline hover:text-blue-900 focus:outline-none focus:ring"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open ${doc.label} documentation`}
            >
              {doc.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  </div>
);

export default DocsPortal;
