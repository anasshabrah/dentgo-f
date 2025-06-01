import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/images/logo.png";
import dotsPattern from "../assets/images/dots_pattern.png";
import dotsPatternBottom from "../assets/images/dots_pattern_bottom.png";
import imageUnscreen from "../assets/images/Image.png";
import robotSlider from "../assets/images/robot-slider-img2.png";
import robotSlider3 from "../assets/images/robot-slider-img3.png";

const Splash = () => {
  const [activeSlide, setActiveSlide] = useState(0);

  const slides = [
    {
      id: 0,
      imgSrc: imageUnscreen,
      title: "Welcome to Dentgo, Your Smart Dental Assistant",
      content:
        "Diagnose cases accurately, build precise treatment plans, and get a tailored list of required materials with trusted suppliers — all in one place.",
    },
    {
      id: 1,
      imgSrc: robotSlider,
      title: "AI-Powered Treatment Planning in Seconds",
      content:
        "Let Dentgo analyze your cases and suggest complete, customized treatment plans backed by dental AI — helping you deliver better care, faster.",
    },
    {
      id: 2,
      imgSrc: robotSlider3,
      title: "Get What You Need — Delivered to Your Clinic",
      content:
        "Easily source the supplies and tools you need from top suppliers and have them delivered right to your door — saving you time and effort.",
    },
  ];

  const handleNext = () => {
    if (activeSlide < slides.length - 1) {
      setActiveSlide(activeSlide + 1);
    }
  };

  const [showSplash, setShowSplash] = useState(true);
  useEffect(() => {
    const splashTimer = setTimeout(() => {
      setShowSplash(false);
    }, 1500);
    return () => clearTimeout(splashTimer);
  }, []);

  return (
    <div className="bg-blue-800 min-h-screen">
      {showSplash && (
        <div className="fixed inset-0 bg-blue-800 z-50 flex flex-col items-center justify-center">
          <div className="relative h-screen w-full flex flex-col items-center justify-center">
            <div className="absolute top-0 left-0">
              <img
                className="w-48 object-contain"
                src={dotsPattern}
                alt="Decorative pattern top"
              />
            </div>
            <div className="flex flex-col items-center">
              <img className="w-48 h-auto" src={logo} alt="Dentgo logo" />
              <h1 className="text-3xl font-bold mt-4 text-gray-800">Dentgo</h1>
              <p className="text-gray-500 text-center text-lg font-medium leading-6 mt-2">
                Smarter Dentistry Starts Here
              </p>
            </div>
            <div className="absolute bottom-0 left-0">
              <img
                className="w-48 object-contain"
                src={dotsPatternBottom}
                alt="Decorative pattern bottom"
              />
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-xl px-4 py-8">
        <div className="relative">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`${activeSlide === index ? "block" : "hidden"} w-full`}
            >
              <div className="h-screen flex flex-col">
                <div className="flex-1 flex flex-col items-center justify-center">
                  <div className="flex flex-col items-center">
                    <img
                      className="pt-16 pb-16 w-full"
                      src={slide.imgSrc}
                      alt={`Slide illustration for: ${slide.title}`}
                    />
                    <h2 className="text-center text-2xl font-bold text-gray-800 px-4 mb-4">
                      {slide.title}
                    </h2>
                    <p className="text-center text-base text-gray-500 px-4">
                      {slide.content}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-center mb-8">
                  {index < slides.length - 1 ? (
                    <div
                      className="bg-blue-800 text-white text-base font-medium py-3 px-6 rounded transition hover:bg-blue-700 cursor-pointer"
                      onClick={handleNext}
                    >
                      <Link to="#">Next</Link>
                    </div>
                  ) : (
                    <div className="bg-blue-800 text-white text-base font-medium py-3 px-6 rounded transition hover:bg-blue-700 cursor-pointer">
                      <Link to="/LetsYouIn">Get Started</Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          <div className="flex justify-center gap-2 mt-4">
            {slides.map((_, index) => (
              <button
                key={index}
                className={`rounded-full transition-all ${
                  activeSlide === index
                    ? "bg-gray-800 w-8 h-2"
                    : "bg-gray-200 w-2 h-2"
                }`}
                onClick={() => setActiveSlide(index)}
              ></button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Splash;
