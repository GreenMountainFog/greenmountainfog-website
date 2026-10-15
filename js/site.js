// Green Mountain Fog — small enhancements. The page works without this file.
(() => {
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)");

  // 1. Split the statement into words so each one can come into focus.
  document.querySelectorAll("[data-words]").forEach((el) => {
    const words = el.textContent.trim().split(/\s+/);
    el.setAttribute("aria-label", el.textContent.trim());
    el.textContent = "";
    words.forEach((word, i) => {
      const span = document.createElement("span");
      span.className = "w";
      span.setAttribute("aria-hidden", "true");
      span.style.setProperty("--i", i);
      span.textContent = word;
      el.append(span, i < words.length - 1 ? " " : "");
    });
    el.style.setProperty("--n", words.length);
  });

  // 2. Solid nav once the hero headline has scrolled past.
  const nav = document.querySelector("[data-nav]");
  const heroCopy = document.querySelector(".hero-copy");
  const setNav = () => {
    const past = heroCopy ? heroCopy.getBoundingClientRect().bottom < 80 || scrollY > innerHeight * 0.55 : scrollY > 40;
    nav.classList.toggle("is-solid", past);
  };
  addEventListener("scroll", setNav, { passive: true });
  setNav();

  // 3. Close the mobile menu after choosing a link.
  const menu = document.getElementById("menu");
  menu?.addEventListener("click", (e) => {
    if (e.target.closest("a") && menu.matches(":popover-open")) menu.hidePopover();
  });

  // 4. Fallback for browsers without CSS scroll-driven animations (Firefox):
  //    compute the same --p values the CSS timelines would.
  const native = CSS.supports("(animation-timeline: view()) and (animation-range: entry)");
  if (native) return;

  const targets = [...document.querySelectorAll("[data-progress]")];
  const clamp = (v) => Math.min(1, Math.max(0, v));
  let ticking = false;

  const update = () => {
    ticking = false;
    if (reduceMotion.matches) {
      targets.forEach((t) => t.style.removeProperty("--p"));
      return;
    }
    const vh = innerHeight;
    targets.forEach((t) => {
      const r = t.getBoundingClientRect();
      let p;
      if (t.dataset.progress === "contain") {
        // 0 when the section's top meets the viewport top, 1 when its bottom meets the viewport bottom
        const span = r.height - vh;
        p = span > 0 ? -r.top / span : r.top < 0 ? 1 : 0;
      } else {
        // "enter": from 30% into the viewport to 55% of the way through it
        const start = vh - r.height * 0.3;
        const end = vh - (vh + r.height) * 0.55;
        p = (start - r.top) / (start - end);
      }
      t.style.setProperty("--p", clamp(p).toFixed(4));
    });
  };
  const onScroll = () => {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  };
  addEventListener("scroll", onScroll, { passive: true });
  addEventListener("resize", onScroll);
  reduceMotion.addEventListener?.("change", update);
  update();
})();
