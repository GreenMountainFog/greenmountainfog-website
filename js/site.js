// Green Mountain Fog 3.0 — the fogged window, plus small page helpers.
// The page is fully usable without this file.
(() => {
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ---------------- nav + menu ---------------- */
  const nav = document.querySelector("[data-nav]");
  const menu = document.getElementById("menu");
  menu?.addEventListener("click", (e) => {
    if (e.target.closest("a") && menu.matches(":popover-open")) menu.hidePopover();
  });

  /* ---------------- the window ---------------- */
  const hero = document.querySelector(".hero");
  const stage = document.querySelector("[data-window]");
  const canvas = stage?.querySelector("canvas.fog");
  const hint = stage?.querySelector("[data-hint]");
  if (hint && !finePointer) hint.textContent = "Swipe sideways to wipe the window";

  // Scroll clears the glass: --clear goes 0 → 1 over the hero's extra height.
  const onScroll = () => {
    const r = hero.getBoundingClientRect();
    const span = Math.max(1, r.height - innerHeight);
    const clear = Math.min(1, Math.max(0, -r.top / (span * 0.85)));
    stage.style.setProperty("--clear", clear.toFixed(4));
    nav.classList.toggle("is-solid", r.bottom < innerHeight * 0.35 || clear > 0.92);
  };

  const ctx = canvas?.getContext("2d");
  if (!hero || !stage || !ctx) {
    if (hero) addEventListener("scroll", onScroll, { passive: true });
    return;
  }

  const scene = new Image();
  scene.decoding = "async";
  scene.src = stage.querySelector(".scene").currentSrc || "/images/scene.svg";

  let W = 0, H = 0, dpr = 1;
  let fogLayer = null;        // pre-rendered fogged glass, redrawn on resize
  let lastWipe = 0;           // fog slowly re-forms after a wipe
  let visible = true, raf = 0, last = null;

  // Draw the scene with the same crop as CSS object-fit: cover; object-position: 50% 100%.
  // Horizontal crop position comes from CSS (--sx), so phones can keep the sunset in frame.
  let sx = 0.5;
  const drawCover = (c, w, h) => {
    const s = Math.max(w / 1600, h / 900);
    const dw = 1600 * s, dh = 900 * s;
    c.drawImage(scene, (w - dw) * sx, h - dh, dw, dh);
  };

  const buildFog = () => {
    // Cheap, reliable blur: draw tiny, then scale back up with smoothing.
    const small = document.createElement("canvas");
    const k = 18;
    small.width = Math.max(2, Math.round(W / k));
    small.height = Math.max(2, Math.round(H / k));
    const sc = small.getContext("2d");
    sc.imageSmoothingQuality = "high";
    drawCover(sc, small.width, small.height);

    fogLayer = document.createElement("canvas");
    fogLayer.width = W * dpr; fogLayer.height = H * dpr;
    const fc = fogLayer.getContext("2d");
    fc.imageSmoothingEnabled = true;
    fc.imageSmoothingQuality = "high";
    fc.drawImage(small, 0, 0, fogLayer.width, fogLayer.height);
    // the milky film of condensation
    fc.fillStyle = "rgba(222, 218, 240, 0.26)";
    fc.fillRect(0, 0, fogLayer.width, fogLayer.height);
    // a few soft droplets so it reads as glass, not just blur
    const rnd = mulberry(802);
    for (let i = 0; i < (W * H) / 9000; i++) {
      const x = rnd() * fogLayer.width, y = rnd() * fogLayer.height, r = (0.6 + rnd() * 2.4) * dpr;
      fc.fillStyle = `rgba(255,255,255,${0.05 + rnd() * 0.12})`;
      fc.beginPath(); fc.arc(x, y, r, 0, Math.PI * 2); fc.fill();
    }
  };

  const resize = (force) => {
    const r = stage.getBoundingClientRect();
    const nw = Math.round(r.width), nh = Math.round(r.height);
    // mobile browsers resize slightly as the address bar slides; don't re-fog for that
    if (force !== true && nw === W && Math.abs(nh - H) < 140) return;
    W = nw; H = nh;
    sx = (parseFloat(getComputedStyle(stage).getPropertyValue("--sx")) || 50) / 100;
    dpr = Math.min(devicePixelRatio || 1, 1.5);
    canvas.width = W * dpr; canvas.height = H * dpr;
    mask.width = W * dpr; mask.height = H * dpr;   // resizing clears it: the glass re-fogs
    buildFog();
    render();
  };

  // Wipes are painted into a separate mask, then the fog is drawn through it.
  // (Erasing the fog canvas directly drifts its colors and leaves dark rings.)
  const mask = document.createElement("canvas");
  const mctx = mask.getContext("2d");
  const render = () => {
    ctx.globalCompositeOperation = "source-over";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(fogLayer, 0, 0);
    ctx.globalCompositeOperation = "destination-out";
    ctx.drawImage(mask, 0, 0);
    ctx.globalCompositeOperation = "source-over";
  };

  // One stamp of a soft "hand" on the glass.
  const brush = () => (finePointer ? 74 : 60) * dpr;
  const stamp = (x, y, strength = 1) => {
    const R = brush();
    const g = mctx.createRadialGradient(x, y, 0, x, y, R);
    g.addColorStop(0, `rgba(255,255,255,${0.9 * strength})`);
    g.addColorStop(0.4, `rgba(255,255,255,${0.65 * strength})`);
    g.addColorStop(0.75, `rgba(255,255,255,${0.2 * strength})`);
    g.addColorStop(1, "rgba(255,255,255,0)");
    mctx.globalCompositeOperation = "source-over";
    mctx.fillStyle = g;
    mctx.beginPath(); mctx.arc(x, y, R, 0, Math.PI * 2); mctx.fill();
  };
  let dirty = false;
  const wipeTo = (x, y) => {
    x *= dpr; y *= dpr;
    if (last) {
      const dx = x - last.x, dy = y - last.y, d = Math.hypot(dx, dy);
      const step = brush() / 4;
      for (let t = step; t < d; t += step) stamp(last.x + (dx * t) / d, last.y + (dy * t) / d, 0.45);
    }
    stamp(x, y, 0.45);
    last = { x, y };
    lastWipe = performance.now();
    dirty = true;
    kick();
  };
  const hideHint = () => { if (hint) hint.style.translate = "-50% 200%"; };

  // Fog creeps back over about ten seconds after the last wipe.
  let frame = 0;
  const tick = () => {
    raf = 0;
    if (!visible) return;
    const since = performance.now() - lastWipe;
    if (!reduceMotion && since > 1200 && ++frame % 4 === 0) {
      mctx.globalCompositeOperation = "destination-out";
      mctx.fillStyle = "rgba(0,0,0,0.035)";
      mctx.fillRect(0, 0, mask.width, mask.height);
      dirty = true;
    }
    if (!reduceMotion && since > 14000) {
      mctx.clearRect(0, 0, mask.width, mask.height);   // fully fogged again
      render(); dirty = false;
      return;
    }
    if (dirty) { render(); dirty = false; }
    if (!reduceMotion || since < 100) kick();
  };
  const kick = () => { if (!raf) raf = requestAnimationFrame(tick); };

  const toLocal = (e) => {
    const r = stage.getBoundingClientRect();
    return [e.clientX - r.left, e.clientY - r.top];
  };
  stage.addEventListener("pointermove", (e) => {
    if (e.pointerType === "mouse" || e.buttons || e.pointerType === "pen" || e.pointerType === "touch") {
      wipeTo(...toLocal(e));
      if (e.isTrusted) hideHint();
    }
  });
  stage.addEventListener("pointerleave", () => { last = null; });
  stage.addEventListener("pointerup", () => { last = null; });
  stage.addEventListener("pointercancel", () => { last = null; });

  // The opening moment: one slow swipe across the sunset, so people see the glass is wipeable.
  const introWipe = () => {
    if (reduceMotion) return;
    const t0 = performance.now(), dur = 1500;
    const path = (t) => {
      const x = W * (0.5 + 0.42 * t);
      const y = H * (0.62 - 0.12 * Math.sin(t * Math.PI));
      return [x, y];
    };
    const run = (now) => {
      const t = Math.min(1, (now - t0) / dur);
      const e = 1 - Math.pow(1 - t, 3);
      wipeTo(...path(e));
      if (t < 1) requestAnimationFrame(run); else last = null;
    };
    requestAnimationFrame(run);
  };

  new IntersectionObserver(([en]) => { visible = en.isIntersecting; if (visible) kick(); }).observe(stage);

  const start = () => {
    resize(true);
    document.documentElement.classList.add("has-fog");
    hero.classList.add("has-fog");
    setTimeout(introWipe, 900);
  };
  if (scene.complete && scene.naturalWidth) start();
  else scene.addEventListener("load", start, { once: true });

  let rt;
  addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(resize, 150); });
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  function mulberry(a) {
    return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  }
})();
