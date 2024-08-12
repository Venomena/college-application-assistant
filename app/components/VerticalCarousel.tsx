"use client";

import { useState, useEffect } from "react";

const snippets = [
  "Boost Your Admission Chances",
  "Personalized Feedback",
  "Upload Your Documents",
  "Get Detailed Analysis",
  "Confidential & Secure",
  "Dream University Acceptance"
];

const VerticalCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % snippets.length);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-12 overflow-hidden">
      <div
        className="absolute inset-0 transition-transform duration-1000"
        style={{ transform: `translateY(-${currentIndex * 100}%)` }}
      >
        {snippets.map((snippet, index) => (
          <div
            key={index}
            className="flex items-center justify-center h-12"
          >
            <p className="text-center font-medium">{snippet}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VerticalCarousel;
