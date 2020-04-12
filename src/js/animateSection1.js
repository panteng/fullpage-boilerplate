export default function () {
  const textEl = document.querySelector(".section-1 .text");

  if (textEl.classList.contains("animated")) {
    return;
  }

  textEl
    .velocity(
      {
        left: "40%",
        opacity: 0,
      },
      { duration: 0 }
    )
    .velocity(
      {
        left: "50%",
        opacity: 1,
      },
      { delay: 100, duration: 600, easing: "easeOutCubic" }
    );
}
