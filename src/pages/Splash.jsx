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
      className: "first_slide",
      imgSrc: imageUnscreen,
      title: "Welcome to Dentgo, Your Smart Dental Assistant",
      content:
        "Diagnose cases accurately, build precise treatment plans, and get a tailored list of required materials with trusted suppliers — all in one place.",
    },
    {
      id: 1,
      className: "second_slide",
      imgSrc: robotSlider,
      title: "AI-Powered Treatment Planning in Seconds",
      content:
        "Let Dentgo analyze your cases and suggest complete, customized treatment plans backed by dental AI — helping you deliver better care, faster.",
    },
    {
      id: 2,
      className: "third_slide",
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
    <>
      <div className="site_content">
        {/* Splash Loader */}
        {showSplash && (
          <div className="loader-mask1">
            <div id="splash-screen-page" className="position-relative">
              <div className="dots_pattern_img1">
                <img className="pattern-top" src={dotsPattern} alt="Decorative pattern top" />
              </div>
              <div className="splash-screen-logo">
                <img className="logo_img" src={logo} alt="Dentgo logo" />
                <h1 className="dentgo-logo-text">Dentgo</h1>
                <p className="meets">Smarter Dentistry Starts Here</p>
              </div>
              <div className="dots_pattern_img2">
                <img className="pattern-bottom" src={dotsPatternBottom} alt="Decorative pattern bottom" />
              </div>
            </div>
          </div>
        )}

        {/* Onboarding Slides */}
        <div className="container">
          <div id="carouselExampleIndicators" className="carousel slide onboarding-slider" data-bs-ride="carousel">
            <div className="carousel-inner">
              {slides.map((slide, index) => (
                <div
                  key={slide.id}
                  className={`carousel-item ${slide.className} ${activeSlide === index ? "active" : ""}`}
                  id={`slide${slide.id + 1}`}
                >
                  <div className={`Onboarding-Screen-1 slide${slide.id + 1}`}>
                    <div className="Onboarding-Screen-1-full">
                      <div className="boarding-title">
                        <div className="Image-unscreen_main">
                          <img
                            className="Image-unscreen"
                            src={slide.imgSrc}
                            alt={`Slide illustration for: ${slide.title}`}
                          />
                          <h2 className="dentgo-welcome-text">{slide.title}</h2>
                          <p className="dentgo-slide-description">{slide.content}</p>
                        </div>
                      </div>
                      <div className="d-flex align-items-center justify-content-center">
                        {index < slides.length - 1 ? (
                          <div
                            className={`onboarding-next-btn-slider bottom-fix-btn skip_btn_${index + 1}`}
                            onClick={handleNext}
                          >
                            <Link to="">Next</Link>
                          </div>
                        ) : (
                          <div className="onboarding-next-btn-slider bottom-fix-btn">
                            <Link to="/LetsYouIn">Get Started</Link>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="carousel-indicators custom-slider-btn">
              {slides.map((slide, index) => (
                <button
                  key={slide.id}
                  type="button"
                  id={`slide${slide.id}`}
                  data-bs-target="#carouselExampleIndicators"
                  data-bs-slide-to={index}
                  className={`custom-slider-dots ${activeSlide === index ? "active" : ""}`}
                  onClick={() => setActiveSlide(index)}
                ></button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Splash;
