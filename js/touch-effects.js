const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

const tiltCards = document.querySelectorAll("[data-tilt]");
if (canHover && !reducedMotion) {
  tiltCards.forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const bounds = card.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width;
      const y = (event.clientY - bounds.top) / bounds.height;
      card.style.setProperty("--spot-x", `${x * 100}%`);
      card.style.setProperty("--spot-y", `${y * 100}%`);
      card.classList.add("is-tilting");
      card.style.transform = `perspective(900px) rotateX(${(0.5 - y) * 3}deg) rotateY(${(x - 0.5) * 3}deg) translateY(-2px)`;
    });
    card.addEventListener("pointerleave", () => {
      card.style.transform = "";
      card.classList.remove("is-tilting");
    });
  });
} else {
  tiltCards.forEach((card) => card.addEventListener("pointerdown", (event) => {
    const bounds = card.getBoundingClientRect();
    card.style.setProperty("--spot-x", `${((event.clientX - bounds.left) / bounds.width) * 100}%`);
    card.style.setProperty("--spot-y", `${((event.clientY - bounds.top) / bounds.height) * 100}%`);
  }));
}

document.querySelectorAll(".press").forEach((button) => {
  button.addEventListener("pointerdown", (event) => {
    button.classList.add("is-pressed");
    const bounds = button.getBoundingClientRect();
    const ripple = document.createElement("span");
    const diameter = Math.max(bounds.width, bounds.height) * 1.5;
    ripple.className = "ripple";
    ripple.style.cssText = `width:${diameter}px;height:${diameter}px;left:${event.clientX - bounds.left - diameter / 2}px;top:${event.clientY - bounds.top - diameter / 2}px`;
    button.append(ripple);
    ripple.addEventListener("animationend", () => ripple.remove(), { once: true });
  });
  ["pointerup", "pointercancel", "pointerleave"].forEach((name) => button.addEventListener(name, () => button.classList.remove("is-pressed")));
});

const timeline = document.querySelector(".timeline");
const timelineFill = document.querySelector(".timeline-track span");
let ticking = false;
function updateTimeline() {
  const rect = timeline.getBoundingClientRect();
  const progress = Math.min(1, Math.max(0, (window.innerHeight * 0.72 - rect.top) / rect.height));
  timelineFill.style.height = `${progress * 100}%`;
  ticking = false;
}
window.addEventListener("scroll", () => {
  if (!ticking) {
    window.requestAnimationFrame(updateTimeline);
    ticking = true;
  }
}, { passive: true });
updateTimeline();
