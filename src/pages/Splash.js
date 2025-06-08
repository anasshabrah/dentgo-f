import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/Splash.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/images/logo.png";
import dotsPattern from "../assets/images/dots_pattern.png";
import dotsPatternBottom from "../assets/images/dots_pattern_bottom.png";
import imageUnscreen from "../assets/images/Image.png";
import robotSlider from "../assets/images/robot-slider-img2.png";
import robotSlider3 from "../assets/images/robot-slider-img3.png";
const Splash = () => {
    const navigate = useNavigate();
    const [showInitialSplash, setShowInitialSplash] = useState(true);
    const [activeSlide, setActiveSlide] = useState(0);
    const slides = [
        {
            id: 0,
            imgSrc: imageUnscreen,
            title: "Welcome to Dentgo, Your Smart Dental Assistant",
            content: "Diagnose cases accurately, build precise treatment plans, and get a tailored list of required materials with trusted suppliers — all in one place.",
        },
        {
            id: 1,
            imgSrc: robotSlider,
            title: "AI-Powered Treatment Planning in Seconds",
            content: "Let Dentgo analyze your cases and suggest complete, customized treatment plans backed by dental AI — helping you deliver better care, faster.",
        },
        {
            id: 2,
            imgSrc: robotSlider3,
            title: "Get What You Need — Delivered to Your Clinic",
            content: "Easily source the supplies and tools you need from top suppliers and have them delivered right to your door — saving you time and effort.",
        },
    ];
    useEffect(() => {
        // Show the “initial splash” for 1.5s, then reveal first slide
        const timer = setTimeout(() => {
            setShowInitialSplash(false);
        }, 1500);
        return () => clearTimeout(timer);
    }, []);
    const handleNext = () => {
        if (activeSlide < slides.length - 1) {
            setActiveSlide((prev) => prev + 1);
        }
        else {
            // When on last slide, navigate to /login
            navigate("/login");
        }
    };
    return (_jsx("div", { className: "bg-white h-screen w-full overflow-hidden", children: showInitialSplash ? (_jsxs("div", { className: "fixed inset-0 bg-white z-50 flex flex-col items-center justify-center", children: [_jsx("div", { className: "absolute top-0 left-0", children: _jsx("img", { className: "w-48 object-contain", src: dotsPattern, alt: "Decorative pattern top", "aria-hidden": "true" }) }), _jsxs("div", { className: "flex flex-col items-center", children: [_jsx("img", { className: "w-48 h-auto", src: logo, alt: "Dentgo logo" }), _jsx("h1", { className: "text-3xl font-bold mt-4 text-gray-800", children: "Dentgo" }), _jsx("p", { className: "text-gray-500 text-center text-lg font-medium leading-6 mt-2", children: "Smarter Dentistry Starts Here" })] }), _jsx("div", { className: "absolute bottom-0 left-0", children: _jsx("img", { className: "w-48 object-contain", src: dotsPatternBottom, alt: "Decorative pattern bottom", "aria-hidden": "true" }) })] })) : (_jsxs("div", { className: "flex flex-col h-full w-full", children: [_jsx("div", { className: "flex-1 flex flex-col", children: slides.map((slide, index) => (_jsxs("div", { className: `${activeSlide === index ? "flex" : "hidden"} flex-1 flex-col items-center justify-between w-full h-full`, children: [_jsxs("div", { className: "flex flex-col items-center px-4 pt-8", children: [_jsx("img", { className: "w-full max-w-xs mb-4", src: slide.imgSrc, alt: slide.title }), _jsx("h2", { className: "text-center text-2xl font-bold text-gray-800 mb-2", children: slide.title }), _jsx("p", { className: "text-center text-base text-gray-500", children: slide.content })] }), _jsx("div", { className: "w-full px-4 pb-8", children: _jsx("button", { className: "bg-primary text-white text-base font-medium py-3 w-full rounded transition hover:opacity-90", onClick: handleNext, children: index < slides.length - 1 ? "Next" : "Get Started" }) })] }, slide.id))) }), _jsx("div", { className: "flex justify-center gap-2 mb-4", children: slides.map((_, index) => (_jsx("button", { className: `rounded-full transition-all ${activeSlide === index
                            ? "bg-gray-800 w-8 h-2"
                            : "bg-gray-200 w-2 h-2"}`, onClick: () => setActiveSlide(index), "aria-label": `Go to slide ${index + 1}` }, index))) })] })) }));
};
export default Splash;
