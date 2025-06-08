import { jsx as _jsx } from "react/jsx-runtime";
const Loader = ({ fullscreen = false }) => {
    // If fullscreen, use h-screen w-screen; otherwise h-full w-full
    const containerClasses = fullscreen
        ? "flex items-center justify-center h-screen w-screen"
        : "flex items-center justify-center h-full w-full";
    return (_jsx("div", { className: containerClasses, children: _jsx("div", { className: "w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" }) }));
};
export default Loader;
