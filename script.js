/* =========================================================
   Personalise with URL parameters, e.g.
   https://<you>.github.io/<repo>/?name=Anna&from=Juan
   ========================================================= */
const params = new URLSearchParams(location.search);
const CONFIG = {
  name: (params.get("name") || "Kishh").trim().slice(0, 40),
  fullName: (params.get("full") || "Krishia Jane").trim().slice(0, 60),
  from: (params.get("from") || "").trim().slice(0, 40),
};

const mayorName = `Mayor ${CONFIG.name}`;
const signature = CONFIG.from ? `— ${CONFIG.from}` : "— your classmate";

const LETTER = `Happy birthday, ${CONFIG.name}! 🎉

I know we don't get to talk all the time, but I want you to know that what you do for our class doesn't go unnoticed.

And honestly? I feel you. I was a class mayor once too, so I know it's harder than it looks — the reminders, the announcements, the group chats nobody replies to (sorry 😅), being the one everyone asks, and still having your own deadlines on top of it all. It can get tiring, and not everyone sees that. But I do, and you're doing a great job.

Thank you for leading us without making it feel like a burden, and for being someone the whole class can count on.

I hope this year treats you as kindly as you've treated all of us. May your wishes come true, your deadlines be gentle, and your days be full of good people and good food. 🎂

Enjoy your day. You deserve every bit of it.`;

const REASONS = [
  { emoji: "📣", label: "The Announcer", back: "You keep us updated even when half of us are asleep in the GC. Thank you for never giving up on us." },
  { emoji: "🧭", label: "The Compass", back: "When the class doesn't know what to do next, somehow you already have a plan." },
  { emoji: "🧘‍♀️", label: "Patience: Legendary", back: "Answering the same question five times a day and still staying kind? That's a talent." },
  { emoji: "🤝", label: "Always There", back: "You show up for the class, even on days you probably just wanted to rest." },
  { emoji: "🌟", label: "Leads by Example", back: "You don't just tell us what to do — you do it first. That's why people listen." },
  { emoji: "💛", label: "Makes Us a Team", back: "Because of you, we're not just a list of names on a roster — we're a class." },
];

/* ---------- helpers ---------- */
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const rand = (a, b) => Math.random() * (b - a) + a;
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- fill in personal bits ---------- */
document.title = `Happy Birthday, ${mayorName}! 🎂`;
$("#heroName").textContent = `${mayorName}!`;
$("#proName").textContent = `Mayor ${CONFIG.fullName}`;
$("#finaleName").textContent = CONFIG.name;
$("#finaleTitle").innerHTML = [..."HAPPY BIRTHDAY"]
  .map((ch, i) => ch === " " ? '<span class="gap"></span>' : `<span style="--i:${i}">${ch}</span>`)
  .join("");
$("#proDate").textContent = new Date().toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" });
$("#letterSign").textContent = signature;

/* ---------- stars ---------- */
(function makeStars() {
  const wrap = $(".stars");
  const count = innerWidth < 600 ? 70 : 140;
  for (let i = 0; i < count; i++) {
    const s = document.createElement("span");
    s.className = "star";
    s.style.left = rand(0, 100) + "%";
    s.style.top = rand(0, 100) + "%";
    s.style.setProperty("--d", rand(2, 5) + "s");
    s.style.setProperty("--delay", rand(0, 5) + "s");
    const size = rand(1, 3);
    s.style.width = s.style.height = size + "px";
    wrap.appendChild(s);
  }
})();

/* =========================================================
   Particle engine: confetti + fireworks on one canvas
   ========================================================= */
const canvas = $("#fx");
const ctx = canvas.getContext("2d");
let W, H, DPR;
function resize() {
  DPR = Math.min(devicePixelRatio || 1, 2);
  W = innerWidth; H = innerHeight;
  canvas.width = W * DPR; canvas.height = H * DPR;
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
}
resize();
addEventListener("resize", resize);

const COLORS = ["#f7c873", "#ff8fb8", "#ff5c93", "#b768ff", "#7ad3ff", "#8ce99a", "#ffffff"];
let particles = [];
let rockets = [];
let running = false;

function confetti(x = W / 2, y = H / 2, n = 160, spread = 1) {
  if (reducedMotion) n = Math.min(n, 30);
  for (let i = 0; i < n; i++) {
    const a = rand(0, Math.PI * 2);
    const v = rand(4, 13) * spread;
    particles.push({
      kind: "confetti",
      x, y,
      vx: Math.cos(a) * v,
      vy: Math.sin(a) * v - rand(3, 8),
      w: rand(6, 11), h: rand(3, 6),
      rot: rand(0, Math.PI), vr: rand(-0.3, 0.3),
      color: pick(COLORS),
      life: 1, decay: rand(0.004, 0.009),
    });
  }
  loop();
}

function confettiRain(n = 120) {
  for (let i = 0; i < n; i++) {
    particles.push({
      kind: "confetti",
      x: rand(0, W), y: rand(-H * 0.6, -10),
      vx: rand(-1, 1), vy: rand(2, 5),
      w: rand(6, 11), h: rand(3, 6),
      rot: rand(0, Math.PI), vr: rand(-0.2, 0.2),
      color: pick(COLORS),
      life: 1, decay: rand(0.002, 0.005),
    });
  }
  loop();
}

function firework(x = rand(W * 0.2, W * 0.8), y = rand(H * 0.15, H * 0.45)) {
  rockets.push({ x, y: H + 10, tx: x, ty: y, vy: -rand(9, 13), color: pick(COLORS) });
  loop();
}

function burst(x, y, color) {
  const n = reducedMotion ? 20 : 70;
  const second = pick(COLORS);
  for (let i = 0; i < n; i++) {
    const a = (Math.PI * 2 * i) / n;
    const v = rand(2, 6);
    particles.push({
      kind: "spark",
      x, y,
      vx: Math.cos(a) * v, vy: Math.sin(a) * v,
      color: Math.random() < 0.7 ? color : second,
      life: 1, decay: rand(0.012, 0.022),
      r: rand(1.5, 2.6),
    });
  }
}

function loop() {
  if (running) return;
  running = true;
  requestAnimationFrame(tick);
}

function tick() {
  ctx.clearRect(0, 0, W, H);

  rockets = rockets.filter((r) => {
    r.y += r.vy;
    r.vy *= 0.985;
    ctx.fillStyle = r.color;
    ctx.beginPath(); ctx.arc(r.x, r.y, 2.4, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "rgba(255,220,150,.5)";
    ctx.beginPath(); ctx.arc(r.x + rand(-1, 1), r.y + 8, 1.6, 0, Math.PI * 2); ctx.fill();
    if (r.y <= r.ty || r.vy > -2) { burst(r.x, r.y, r.color); return false; }
    return true;
  });

  particles = particles.filter((p) => {
    p.life -= p.decay;
    if (p.life <= 0 || p.y > H + 40) return false;
    if (p.kind === "confetti") {
      p.vx *= 0.985; p.vy = p.vy * 0.985 + 0.18;
      p.x += p.vx + Math.sin(p.rot) * 0.6; p.y += p.vy; p.rot += p.vr;
      ctx.save();
      ctx.globalAlpha = Math.min(1, p.life * 2);
      ctx.translate(p.x, p.y); ctx.rotate(p.rot);
      ctx.scale(1, Math.cos(p.rot * 3));
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    } else {
      p.vx *= 0.97; p.vy = p.vy * 0.97 + 0.06;
      p.x += p.vx; p.y += p.vy;
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color; ctx.shadowBlur = 8;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
      ctx.shadowBlur = 0; ctx.globalAlpha = 1;
    }
    return true;
  });

  if (particles.length || rockets.length) requestAnimationFrame(tick);
  else { running = false; ctx.clearRect(0, 0, W, H); }
}

/* =========================================================
   Balloons
   ========================================================= */
const BALLOON_COLORS = ["#ff5c93", "#f7c873", "#b768ff", "#7ad3ff", "#ff8fb8", "#8ce99a"];
function releaseBalloons(n = 10) {
  if (reducedMotion) return;
  const wrap = $(".balloons");
  for (let i = 0; i < n; i++) {
    setTimeout(() => {
      const b = document.createElement("span");
      b.className = "balloon";
      b.style.left = rand(2, 92) + "%";
      b.style.setProperty("--c", pick(BALLOON_COLORS));
      b.style.setProperty("--s", rand(40, 75) + "px");
      b.style.setProperty("--t", rand(10, 17) + "s");
      wrap.appendChild(b);
      b.addEventListener("animationend", () => b.remove());
    }, i * rand(250, 600));
  }
}

/* =========================================================
   Music: "Happy Birthday" (public domain) on Web Audio
   ========================================================= */
const Music = (() => {
  let ac, master, playing = false, timer;
  const N = { G4: 392, A4: 440, B4: 493.88, C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99 };
  const SONG = [
    ["G4", .75], ["G4", .25], ["A4", 1], ["G4", 1], ["C5", 1], ["B4", 2],
    ["G4", .75], ["G4", .25], ["A4", 1], ["G4", 1], ["D5", 1], ["C5", 2],
    ["G4", .75], ["G4", .25], ["G5", 1], ["E5", 1], ["C5", 1], ["B4", 1], ["A4", 2],
    ["F5", .75], ["F5", .25], ["E5", 1], ["C5", 1], ["D5", 1], ["C5", 3],
  ];
  const BEAT = 0.42;

  function note(freq, start, dur) {
    // a soft music-box tone: sine + quiet octave, quick attack, long decay
    [[1, 0.5], [2, 0.12], [3, 0.05]].forEach(([mult, gainAmt]) => {
      const o = ac.createOscillator();
      const g = ac.createGain();
      o.type = "sine";
      o.frequency.value = freq * mult;
      g.gain.setValueAtTime(0, start);
      g.gain.linearRampToValueAtTime(gainAmt, start + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, start + Math.max(dur * 1.6, 0.6));
      o.connect(g).connect(master);
      o.start(start);
      o.stop(start + Math.max(dur * 1.6, 0.6) + 0.05);
    });
  }

  function playOnce() {
    let t = ac.currentTime + 0.1;
    SONG.forEach(([n, beats]) => { note(N[n], t, beats * BEAT); t += beats * BEAT; });
    const total = (t - ac.currentTime) * 1000;
    timer = setTimeout(() => { if (playing) playOnce(); }, total + 2500);
  }

  return {
    start() {
      try {
        ac = ac || new (window.AudioContext || window.webkitAudioContext)();
        if (!master) { master = ac.createGain(); master.gain.value = 0.35; master.connect(ac.destination); }
        ac.resume();
        if (playing) return;
        playing = true;
        master.gain.cancelScheduledValues(ac.currentTime);
        master.gain.setValueAtTime(0.35, ac.currentTime);
        playOnce();
      } catch (e) { /* audio not available — the page still works */ }
    },
    stop() {
      playing = false;
      clearTimeout(timer);
      if (master) master.gain.setTargetAtTime(0, ac.currentTime, 0.1);
    },
    get playing() { return playing; },
  };
})();

const musicBtn = $("#musicBtn");
musicBtn.addEventListener("click", () => {
  if (Music.playing) { Music.stop(); musicBtn.classList.remove("playing"); }
  else { Music.start(); musicBtn.classList.add("playing"); }
});

/* =========================================================
   Intro → main
   ========================================================= */
const gift = $("#gift");
gift.addEventListener("click", () => {
  if (gift.classList.contains("open")) return;
  gift.classList.add("open");
  const r = gift.getBoundingClientRect();
  confetti(r.left + r.width / 2, r.top + r.height / 3, 200, 1.1);
  Music.start();
  musicBtn.hidden = false;
  musicBtn.classList.add("playing");

  setTimeout(() => {
    $("#intro").classList.add("leaving");
    setTimeout(() => {
      $("#intro").remove();
      $("#main").hidden = false;
      scrollTo(0, 0);
      confettiRain(140);
      releaseBalloons(14);
      setInterval(() => { if (!document.hidden) releaseBalloons(3); }, 9000);
      observeReveals();
    }, 800);
  }, 900);
});

/* =========================================================
   Scroll reveals + typewriter trigger
   ========================================================= */
function observeReveals() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add("in");
      if (e.target.querySelector(".letter")) typeLetter();
      if (e.target.classList.contains("finale")) finaleShow();
      io.unobserve(e.target);
    });
  }, { threshold: 0.2 });
  $$(".reveal").forEach((el) => io.observe(el));
}

/* =========================================================
   Cake & candles
   ========================================================= */
const candles = $$(".candle");
const wishMsg = $("#wishMsg");
let wishDone = false;

function blowOut(c) {
  if (c.classList.contains("out")) return;
  c.classList.add("out");
  c.setAttribute("aria-label", "Candle blown out");
  if (candles.every((x) => x.classList.contains("out"))) wishGranted();
}

function wishGranted() {
  if (wishDone) return;
  wishDone = true;
  stopMic();
  const r = $(".cake").getBoundingClientRect();
  setTimeout(() => {
    confetti(r.left + r.width / 2, r.top, 220, 1.2);
    firework(); setTimeout(firework, 300); setTimeout(firework, 650);
    wishMsg.textContent = "Wish sent to the universe ✨ It's going to come true.";
  }, 400);
}

candles.forEach((c) => c.addEventListener("click", () => blowOut(c)));

/* optional: blow into the microphone */
let micStream, micRaf;
const micBtn = $("#micBtn");
micBtn.addEventListener("click", async () => {
  if (micStream) return;
  try {
    micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    micBtn.textContent = "🌬️ Blow now!";
    const ac = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = ac.createAnalyser();
    analyser.fftSize = 512;
    ac.createMediaStreamSource(micStream).connect(analyser);
    const data = new Uint8Array(analyser.fftSize);
    let loud = 0;
    const listen = () => {
      analyser.getByteTimeDomainData(data);
      let sum = 0;
      for (const v of data) sum += ((v - 128) / 128) ** 2;
      const rms = Math.sqrt(sum / data.length);
      loud = rms > 0.18 ? loud + 1 : Math.max(0, loud - 1);
      if (loud > 6) {
        loud = 0;
        const lit = candles.find((c) => !c.classList.contains("out"));
        if (lit) blowOut(lit);
      }
      if (!wishDone) micRaf = requestAnimationFrame(listen);
    };
    listen();
  } catch (e) {
    micBtn.textContent = "Mic unavailable — just tap the candles 🙂";
    micBtn.disabled = true;
  }
});

function stopMic() {
  cancelAnimationFrame(micRaf);
  if (micStream) micStream.getTracks().forEach((t) => t.stop());
  micBtn.hidden = true;
}

/* =========================================================
   Reason cards
   ========================================================= */
const cardsWrap = $("#cards");
REASONS.forEach((r) => {
  const b = document.createElement("button");
  b.className = "card";
  b.setAttribute("aria-label", `${r.label}: tap to reveal`);
  b.innerHTML = `
    <span class="card-inner">
      <span class="card-face card-front"><span class="emoji"></span><span class="label"></span></span>
      <span class="card-face card-back"></span>
    </span>`;
  $(".emoji", b).textContent = r.emoji;
  $(".label", b).textContent = r.label;
  $(".card-back", b).textContent = r.back;
  b.addEventListener("click", (ev) => {
    b.classList.toggle("flipped");
    if (b.classList.contains("flipped")) confetti(ev.clientX || W / 2, ev.clientY || H / 2, 25, 0.5);
  });
  cardsWrap.appendChild(b);
});

/* =========================================================
   Letter typewriter
   ========================================================= */
let typing = false;
function typeLetter() {
  if (typing) return;
  typing = true;
  const el = $("#letterText");
  const chars = [...LETTER]; // keeps emoji intact
  const cursor = document.createElement("span");
  cursor.className = "cursor";
  const textNode = document.createTextNode("");
  el.append(textNode, cursor);
  let i = 0;
  let skip = reducedMotion;
  el.closest(".letter").addEventListener("click", () => { skip = true; }, { once: true });

  const step = () => {
    if (skip) { textNode.data = LETTER; return finish(); }
    textNode.data += chars[i++];
    if (i >= chars.length) return finish();
    const ch = chars[i - 1];
    const delay = ch === "\n" ? 260 : /[.,!?—]/.test(ch) ? 180 : rand(18, 40);
    setTimeout(step, delay);
  };
  const finish = () => {
    cursor.remove();
    $("#letterSign").classList.add("show");
  };
  setTimeout(step, 500);
}

/* =========================================================
   Finale
   ========================================================= */
function finaleShow() {
  setTimeout(() => {
    for (let i = 0; i < 8; i++) setTimeout(() => firework(), i * 300);
    setTimeout(() => confettiRain(120), 2000);
  }, 1200);
}

// tap empty sky for a firework
document.addEventListener("click", (e) => {
  if ($("#main").hidden) return;
  if (e.target.closest("button, a, .letter, .proclamation, .cake")) return;
  rockets.push({ x: e.clientX, y: H + 10, tx: e.clientX, ty: e.clientY, vy: -rand(10, 14), color: pick(COLORS) });
  loop();
});
