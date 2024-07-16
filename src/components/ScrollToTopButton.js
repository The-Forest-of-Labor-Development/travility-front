import React, { useState, useEffect } from "react";
import styles from "../styles/components/ScrollToTopButton.module.css";

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  return (
    <div className={styles.scroll_to_top}>
      {isVisible && (
        <button onClick={scrollToTop} className={styles.scroll_button}>
          <div className={styles.triangle}></div>
          <span className={styles.scroll_text}>Top</span>
        </button>
      )}
    </div>
  );
};

export default ScrollToTopButton;
