export default function () {
  const textEl = document.querySelector(".section-0 .text");

  textEl
    .velocity(
      {
        top: "40%",
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
