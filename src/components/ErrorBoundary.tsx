// frontend/src/components/ErrorBoundary.tsx
import React from "react";
import * as Sentry from "@sentry/react";

interface ErrorBoundaryState {
  hasError: boolean;
}

export default class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(_: Error) {
    // Update state so the next render shows fallback UI
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Send exception to Sentry
    Sentry.captureException(error, {
      contexts: {
        componentStack: info.componentStack,
      },
    });
    // Also log to console for local debugging
    console.error("[ErrorBoundary] Caught error:", error);
    console.error("[ErrorBoundary] Component stack:", info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI
      return (
        <div
          style={{
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#fefefe",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <h1 style={{ color: "#c00", marginBottom: "0.5rem" }}>
              Oops! Something went wrong.
            </h1>
            <p style={{ color: "#666", marginBottom: "1rem" }}>
              An unexpected error occurred. You can reload the page or try again later.
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: '0.5rem 1rem',
                background: '#c00',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Reload page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
