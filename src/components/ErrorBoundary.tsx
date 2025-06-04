import React from "react";

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
    console.error("[ErrorBoundary] Caught error:", error);
    console.error("[ErrorBoundary] Component stack:", info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      // You can render any fallback UI here
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
              Something went wrong.
            </h1>
            <p style={{ color: "#666" }}>
              An unexpected error occurred. Check the console for details.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
