import React, { useState, useEffect } from 'react';

interface CarouselProps {
  children: React.ReactNode;
  className?: string;
  opts: {
    autoplay: boolean;
    autoplayInterval: number;
    loop: boolean;
  };
}

interface CarouselItemProps {
  children: React.ReactNode;
}

export function Carousel({ children, className, opts }: CarouselProps) {
  const { autoplay, autoplayInterval, loop } = opts;
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (autoplay) {
      interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % React.Children.count(children));
      }, autoplayInterval);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [autoplay, autoplayInterval, children]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div className="flex flex-col transition-transform duration-300" style={{ transform: `translateY(-${currentIndex * 100}%)` }}>
        {React.Children.map(children, (child, index) => (
          <div key={index} className="w-full h-full">
            {child}
          </div>
        ))}
      </div>
    </div>
  );
}

export function CarouselContent({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function CarouselItem({ children }: CarouselItemProps) {
  return <div className="w-full">{children}</div>;
}

export function CarouselPrevious({ onClick = () => {} }: { onClick?: () => void }) {
  return (
    <button onClick={onClick} className="absolute left-0 top-1/2 transform -translate-y-1/2 p-2">
      &lt;
    </button>
  );
}

export function CarouselNext({ onClick = () => {} }: { onClick?: () => void }) {
  return (
    <button onClick={onClick} className="absolute right-0 top-1/2 transform -translate-y-1/2 p-2">
      &gt;
    </button>
  );
}
