"use client";
import { useState, useEffect } from 'react';

const URL_401_Carousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    '4N Stands for Fourth DimensioN', 
    'for InnovatioN', 
    'for TransformatioN', 
    'Building products for the next GeneratioN!'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 3500); 

    return () => clearInterval(interval);
  }, [slides.length]);

  const highlightN = (text) => {
    return text.replace(/N/g, '<span class="highlight">N</span>');
  };

  return (
    <div className="carousel">
      <div
        className="carousel-content"
        dangerouslySetInnerHTML={{ __html: highlightN(slides[currentSlide]) }}
      />
    </div>
  );
};

export default URL_401_Carousel;
