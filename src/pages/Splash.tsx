// src/pages/Splash.tsx

import React, { useEffect, useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

import logo from '@/assets/images/logo.png';
import dotsPattern from '@/assets/images/dots_pattern.png';
import dotsPatternBottom from '@/assets/images/dots_pattern_bottom.png';
import imageUnscreen from '@/assets/images/Image.png';
import robotSlider from '@/assets/images/robot-slider-img2.png';
import robotSlider3 from '@/assets/images/robot-slider-img3.png';

const slides = [
  {
    id: 0,
    img: imageUnscreen,
    title: 'Welcome to Dentgo, Your Smart Dental Assistant',
    text:
      'Diagnose cases accurately, build precise treatment plans, and get a tailored list of required materials with trusted suppliers — all in one place.',
  },
  {
    id: 1,
    img: robotSlider,
    title: 'AI-Powered Treatment Planning in Seconds',
    text:
      'Let Dentgo analyze your cases and suggest complete, customized treatment plans backed by dental AI — helping you deliver better care, faster.',
  },
  {
    id: 2,
    img: robotSlider3,
    title: 'Get What You Need — Delivered to Your Clinic',
    text:
      'Easily source the supplies and tools you need from top suppliers and have them delivered right to your door — saving you time and effort.',
  },
];

const Splash: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, initializing } = useAuth();
  const [initial, setInitial] = useState(true);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setInitial(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  // If user is already logged in, skip splash
  if (!initializing && isAuthenticated) {
    return <Navigate to="/dentgo-gpt-home" replace />;
  }

  if (initial) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center">
        <img src={dotsPattern} alt="" className="absolute top-0 left-0 w-48" aria-hidden="true" />
        <div className="flex flex-col items-center space-y-4">
          <img src={logo} alt="Dentgo logo" className="w-48" />
          <h1 className="text-3xl font-bold text-gray-800">Dentgo</h1>
          <p className="text-center text-gray-500">Smarter Dentistry Starts Here</p>
        </div>
        <img src={dotsPatternBottom} alt="" className="absolute bottom-0 left-0 w-48" aria-hidden="true" />
      </div>
    );
  }

  const { img, title, text } = slides[index];

  const handleNext = () => {
    if (index < slides.length - 1) {
      setIndex(i => i + 1);
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen">
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <img src={img} alt={title} className="w-full max-w-xs mb-6" />
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">{title}</h2>
        <p className="text-center text-gray-500 max-w-md">{text}</p>
      </div>

      <div className="px-4 pb-4">
        <button
          onClick={handleNext}
          className="w-full bg-primary text-white py-3 rounded-lg hover:opacity-90 transition"
        >
          {index < slides.length - 1 ? 'Next' : 'Get Started'}
        </button>
      </div>

      <div className="flex justify-center space-x-2 pb-6">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`rounded-full transition-all ${
              i === index ? 'bg-gray-800 w-8 h-2' : 'bg-gray-200 w-2 h-2'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Splash;
