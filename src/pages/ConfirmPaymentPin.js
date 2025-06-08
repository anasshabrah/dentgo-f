import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "@components/ui/Loader";
const ConfirmPaymentPin = () => {
    const navigate = useNavigate();
    const [pin, setPin] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const handleChange = (e) => {
        setPin(e.target.value);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSubmitting(true);
        try {
            // Replace with real PIN validation API if needed
            navigate("/");
        }
        catch (err) {
            setError("Invalid PIN. Please try again.");
            setSubmitting(false);
        }
    };
    return (_jsx("div", { className: "flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900", children: _jsxs("form", { onSubmit: handleSubmit, className: "bg-white dark:bg-gray-800 p-6 rounded shadow-md w-full max-w-sm", children: [_jsx("h2", { className: "text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200", children: "Enter Payment PIN" }), error && (_jsx("div", { className: "text-red-600 bg-red-100 border border-red-300 p-2 rounded mb-4", children: error })), _jsx("input", { type: "password", placeholder: "PIN", value: pin, onChange: handleChange, maxLength: 4, className: "w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-2 rounded mb-4 text-gray-800 dark:text-gray-200", required: true }), _jsx("button", { type: "submit", className: "w-full bg-blue-800 text-white py-2 rounded disabled:opacity-50", disabled: submitting, children: submitting ? _jsx(Loader, {}) : "Confirm" })] }) }));
};
export default ConfirmPaymentPin;
