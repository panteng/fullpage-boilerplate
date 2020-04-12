import "normalize.css";
import "../scss/root.scss";

import "swiper/css/swiper.css";
import Swiper from "swiper";

import "velocity-animate";

import animateSection0 from "./animateSection0";
import animateSection1 from "./animateSection1";
import animateSection2 from "./animateSection2";

window.onload = () => {
  const animatedSections = [];

  const mySwiper = new Swiper(".swiper-container", {
    direction: "vertical",
    mousewheel: true,
    speed: 600,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
  });

  mySwiper.on("slideChangeTransitionEnd", () => {
    const sectionIndex = mySwiper.activeIndex;

    if (animatedSections.includes(sectionIndex)) {
      return;
    }

    switch (sectionIndex) {
      case 1:
        animateSection1();
        break;
      case 2:
        animateSection2();
        break;
      default:
        console.log(`No animation found for Section ${mySwiper.activeIndex}`);
    }

    animatedSections.push(sectionIndex);
  });

  animateSection0();
  animatedSections.push(0);
};
