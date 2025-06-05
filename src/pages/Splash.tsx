import React, { useEffect, useState } from "react";
import logo from "../assets/images/logo.png";
import dotsPattern from "../assets/images/dots_pattern.png";
import dotsPatternBottom from "../assets/images/dots_pattern_bottom.png";
import imageUnscreen from "../assets/images/Image.png";
import robotSlider from "../assets/images/robot-slider-img2.png";
import robotSlider3 from "../assets/images/robot-slider-img3.png";

interface SplashProps {
  onComplete: () => void;
}

const Splash: React.FC<SplashProps> = ({ onComplete }) => {
  const [showInitialSplash, setShowInitialSplash] = useState(true);
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

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowInitialSplash(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleNext = () => {
    if (activeSlide < slides.length - 1) {
      setActiveSlide((prev) => prev + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="bg-white h-screen w-full overflow-hidden">
      {showInitialSplash ? (
        <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center">
          <div className="relative h-full w-full flex flex-col items-center justify-center">
            <div className="absolute top-0 left-0">
              <img
                className="w-48 object-contain"
                src={dotsPattern}
                alt=""
                aria-hidden="true"
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
                alt=""
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="w-full h-full flex flex-col">
            <div className="flex-1 w-full flex flex-col">
              {slides.map((slide, index) => (
                <div
                  key={slide.id}
                  className={`${
                    activeSlide === index ? "flex" : "hidden"
                  } flex-1 flex-col items-center justify-between w-full h-full`}
                >
                  <div className="flex flex-col items-center px-4 pt-8">
                    <img
                      className="w-full max-w-xs mb-4"
                      src={slide.imgSrc}
                      alt=""
                      aria-hidden="true"
                    />
                    <h2 className="text-center text-2xl font-bold text-gray-800 mb-2">
                      {slide.title}
                    </h2>
                    <p className="text-center text-base text-gray-500">
                      {slide.content}
                    </p>
                  </div>

                  <div className="w-full px-4 pb-8">
                    <button
                      className="bg-primary text-white text-base font-medium py-3 w-full rounded transition hover:opacity-90"
                      onClick={handleNext}
                    >
                      {index < slides.length - 1 ? "Next" : "Get Started"}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center gap-2 mb-4">
              {slides.map((_, index) => (
                <button
                  key={index}
                  className={`rounded-full transition-all ${
                    activeSlide === index
                      ? "bg-gray-800 w-8 h-2"
                      : "bg-gray-200 w-2 h-2"
                  }`}
                  onClick={() => setActiveSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Splash;
