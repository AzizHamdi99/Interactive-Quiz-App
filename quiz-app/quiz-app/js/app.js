/* Shared logic: theme, page transitions, ripple, sound, confetti, result page */
const App = (() => {
  const root = document.documentElement;

  /* ---- Dark mode ---- */
  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    const btn = document.querySelector("#theme-toggle");
    if (!btn) return;
    const dark = theme === "dark";
    btn.textContent = dark ? "\u2600" : "\u263E";
    btn.setAttribute("aria-pressed", String(dark));
    btn.setAttribute(
      "aria-label",
      dark ? "Switch to light mode" : "Switch to dark mode",
    );
  }
  applyTheme(localStorage.getItem("quizTheme") || "light");
  document.querySelector("#theme-toggle").addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    localStorage.setItem("quizTheme", next);
    applyTheme(next);
  });

  /* ---- Page transitions ---- */
  function go(url) {
    document.body.classList.add("leaving");
    setTimeout(() => {
      window.location.href = url;
    }, 250);
  }
  document.querySelectorAll("[data-nav]").forEach((link) =>
    link.addEventListener("click", (e) => {
      e.preventDefault();
      go(link.getAttribute("href"));
    }),
  );

  /* ---- Button ripple ---- */
  document.querySelectorAll(".btn").forEach((btn) =>
    btn.addEventListener("click", (e) => {
      const r = btn.getBoundingClientRect(),
        size = Math.max(r.width, r.height);
      const dot = document.createElement("span");
      dot.className = "ripple";
      dot.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - r.left - size / 2}px;top:${e.clientY - r.top - size / 2}px`;
      btn.appendChild(dot);
      setTimeout(() => dot.remove(), 600);
    }),
  );

  /* ---- Sound effects (Web Audio, no files needed) ---- */
  let ctx;
  function beep(freqs) {
    try {
      ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
      freqs.forEach((f, i) => {
        const o = ctx.createOscillator(),
          g = ctx.createGain(),
          t = ctx.currentTime + i * 0.14;
        o.frequency.value = f;
        o.type = "sine";
        g.gain.setValueAtTime(0.15, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
        o.connect(g);
        g.connect(ctx.destination);
        o.start(t);
        o.stop(t + 0.25);
      });
    } catch (err) {
      /* audio unavailable */
    }
  }
  const playCorrect = () => beep([660, 880]);
  const playWrong = () => beep([300, 200]);

  /* ---- Confetti ---- */
  function confetti() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const canvas = document.querySelector("#confetti"),
      c = canvas.getContext("2d");
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    const colors = ["#2563EB", "#3B82F6", "#22C55E", "#F59E0B", "#EF4444"];
    const bits = Array.from({ length: 150 }, () => ({
      x: Math.random() * canvas.width,
      y: -Math.random() * canvas.height,
      s: 5 + Math.random() * 7,
      v: 2 + Math.random() * 3,
      d: Math.random() * 2 - 1,
      col: colors[Math.floor(Math.random() * colors.length)],
    }));
    let frames = 0;
    (function draw() {
      c.clearRect(0, 0, canvas.width, canvas.height);
      bits.forEach((b) => {
        b.y += b.v;
        b.x += b.d;
        c.fillStyle = b.col;
        c.fillRect(b.x, b.y, b.s, b.s * 0.6);
      });
      if (++frames < 300) requestAnimationFrame(draw);
      else c.clearRect(0, 0, canvas.width, canvas.height);
    })();
  }

  /* ---- Result page ---- */
  if (document.body.dataset.page === "result") {
    const score = Number(sessionStorage.getItem("quizScore")) || 0;
    const total = Number(sessionStorage.getItem("quizTotal")) || 10;
    const pct = Math.round((score / total) * 100);
    const best = Number(localStorage.getItem("quizBest")) || 0;
    const msgs = [
      [100, "Outstanding!"],
      [80, "Excellent!"],
      [60, "Good Job!"],
      [40, "Keep Practicing!"],
      [0, "Try Again!"],
    ];
    document.querySelector("#score").textContent = `${score} / ${total}`;
    document.querySelector("#pct").textContent = `${pct}%`;
    document.querySelector("#msg").textContent = msgs.find(
      (m) => pct >= m[0],
    )[1];
    document.querySelector("#best").textContent = `${best} / ${total}`;
    if (pct > 80) confetti();
  }

  return { go, playCorrect, playWrong };
})();
