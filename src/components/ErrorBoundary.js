import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from "react";
export default class ErrorBoundary extends React.Component {
    state = { hasError: false };
    static getDerivedStateFromError(_) {
        // Update state so the next render shows fallback UI
        return { hasError: true };
    }
    componentDidCatch(error, info) {
        console.error("[ErrorBoundary] Caught error:", error);
        console.error("[ErrorBoundary] Component stack:", info.componentStack);
    }
    render() {
        if (this.state.hasError) {
            // You can render any fallback UI here
            return (_jsx("div", { style: {
                    height: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#fefefe",
                }, children: _jsxs("div", { style: { textAlign: "center" }, children: [_jsx("h1", { style: { color: "#c00", marginBottom: "0.5rem" }, children: "Something went wrong." }), _jsx("p", { style: { color: "#666" }, children: "An unexpected error occurred. Check the console for details." })] }) }));
        }
        return this.props.children;
    }
}
