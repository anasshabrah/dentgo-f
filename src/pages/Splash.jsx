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
    <div className="relative min-h-screen bg-white">
      {/* Splash Loader */}
      {showSplash && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="text-center">
            <div className="relative">
              <img className="absolute top-0 left-0 w-full" src={dotsPattern} alt="Pattern top" />
              <div className="relative z-10">
                <img className="mx-auto" src={logo} alt="Dentgo logo" />
                <h1 className="text-4xl font-bold text-white mt-4">Dentgo</h1>
                <p className="text-lg text-white mt-2">Smarter Dentistry Starts Here</p>
              </div>
              <img className="absolute bottom-0 left-0 w-full" src={dotsPatternBottom} alt="Pattern bottom" />
            </div>
          </div>
        </div>
      )}

      {/* Onboarding Slides */}
      <div className="container mx-auto px-4 py-16">
        <div className="relative">
          <div className="carousel slide" data-bs-ride="carousel">
            <div className="carousel-inner">
              {slides.map((slide, index) => (
                <div
                  key={slide.id}
                  className={`carousel-item ${activeSlide === index ? "active" : ""}`}
                >
                  <div className="flex flex-col items-center">
                    <div className="flex flex-col items-center w-full">
                      <div className="flex flex-col items-center max-w-3xl mx-auto">
                        <img
                          className="w-64 h-64 object-cover"
                          src={slide.imgSrc}
                          alt={`Slide illustration for: ${slide.title}`}
                        />
                        <h2 className="text-2xl font-semibold text-center mt-6">{slide.title}</h2>
                        <p className="text-center mt-4 text-lg text-gray-600">{slide.content}</p>
                      </div>
                    </div>

                    <div className="mt-8 flex justify-center">
                      {index < slides.length - 1 ? (
                        <button
                          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                          onClick={handleNext}
                        >
                          Next
                        </button>
                      ) : (
                        <Link
                          to="/LetsYouIn"
                          className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                        >
                          Get Started
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {slides.map((slide, index) => (
                <button
                  key={slide.id}
                  type="button"
                  data-bs-target="#carouselExampleIndicators"
                  data-bs-slide-to={index}
                  className={`w-3 h-3 rounded-full ${activeSlide === index ? "bg-blue-600" : "bg-gray-400"}`}
                  onClick={() => setActiveSlide(index)}
                ></button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Splash;