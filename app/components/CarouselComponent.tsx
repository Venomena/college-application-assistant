import React, { useState } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";

const items = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  content: `Link ${i + 1}`,
}));

const CarouselComponent = () => {
  const [index, setIndex] = useState(0);

  const incrementIndex = () => {
    setIndex((prevIndex) => (prevIndex + 1) % items.length);
  };

  const decrementIndex = () => {
    setIndex((prevIndex) =>
      prevIndex === 0 ? items.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="carousel-container">
      <button onClick={decrementIndex} className="carousel-button">
        ↑
      </button>
      <TransitionGroup className="carousel">
        {items.map((item, i) => {
          const offset = (i - index + items.length) % items.length;
          let className = "carousel-item";
          if (offset === 0) className += " active";
          if (offset === 1) className += " next";
          if (offset === items.length - 1) className += " prev";

          return (
            <CSSTransition key={item.id} timeout={500} classNames="item">
              <div className={className}>
                <a href="#">{item.content}</a>
              </div>
            </CSSTransition>
          );
        })}
      </TransitionGroup>
      <button onClick={incrementIndex} className="carousel-button">
        ↓
      </button>
    </div>
  );
};

export default CarouselComponent;