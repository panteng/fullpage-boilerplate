export default function () {
  const textEl = document.querySelector(".section-2 .text");

  if (textEl.classList.contains("animated")) {
    return;
  }

  textEl
    .velocity(
      {
        top: "60%",
        opacity: 0,
      },
      { duration: 0 }
    )
    .velocity(
      {
        top: "50%",
        opacity: 1,
      },
      { delay: 100, duration: 600, easing: "easeOutCubic" }
    );
}
