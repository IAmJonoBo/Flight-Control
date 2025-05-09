import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";
import { getEnv } from "./utils/env";

const SENTRY_DSN = getEnv("VITE_SENTRY_DSN");
if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    integrations: [new (BrowserTracing as any)()],
    tracesSampleRate: 0.1,
  });
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
