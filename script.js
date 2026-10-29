document.addEventListener('DOMContentLoaded', () => {
  // 1. Unconditional Auto-play Music (Cannot be turned off by user)
  function ensureAudioStarted() {
    if (window.birthdayAudio) {
      window.birthdayAudio.startMelody();
    }
    const notice = document.getElementById('firstTapNotice');
    if (notice) {
      notice.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
      notice.style.opacity = '0';
      notice.style.transform = 'translateY(20px)';
      setTimeout(() => {
        if (notice.parentNode) notice.remove();
      }, 500);
    }
  }

  // Attempt auto-start immediately
  ensureAudioStarted();

  // Listen to any interaction to unlock browser autoplay policy immediately
  const unlockEvents = ['click', 'touchstart', 'pointerdown', 'scroll', 'keydown', 'wheel'];
  unlockEvents.forEach(evt => {
    window.addEventListener(evt, ensureAudioStarted, { once: true, passive: true });
  });

  // Always keep playing even if visibility changes
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && window.birthdayAudio) {
      window.birthdayAudio.startMelody();
    }
  });

  // 2. Interactive Floating Canvas Particles
  initBackgroundCanvas();

  // 3. Confetti Blast Hero Button
  const celebrateBlastBtn = document.getElementById('celebrateBlastBtn');
  if (celebrateBlastBtn) {
    celebrateBlastBtn.addEventListener('click', () => {
      ensureAudioStarted();
      fireGrandCelebration();
      if (window.birthdayAudio) {
        window.birthdayAudio.playConfettiChime();
      }
    });
  }

  // 4. Birthday Cake & Candle Logic
  const candleGroup = document.getElementById('candleGroup');
  const flame = document.getElementById('flame');
  const smoke = document.getElementById('smoke');
  const blowCandleBtn = document.getElementById('blowCandleBtn');
  const relightCandleBtn = document.getElementById('relightCandleBtn');
  const wishCelebrationCard = document.getElementById('wishCelebrationCard');

  let candleExtinguished = false;

  function blowOutCandle() {
    ensureAudioStarted();
    if (candleExtinguished) return;
    candleExtinguished = true;

    if (window.birthdayAudio) {
      window.birthdayAudio.playBlowSound();
      setTimeout(() => {
        window.birthdayAudio.playConfettiChime();
      }, 350);
    }

    flame.classList.add('opacity-0', 'scale-0');
    smoke.classList.remove('hidden');

    setTimeout(() => {
      smoke.classList.add('hidden');
    }, 1800);

    triggerConfetti(0.5, 0.45);
    setTimeout(() => triggerConfetti(0.3, 0.4), 250);
    setTimeout(() => triggerConfetti(0.7, 0.4), 500);

    if (wishCelebrationCard) {
      wishCelebrationCard.classList.remove('hidden');
    }

    blowCandleBtn.classList.add('hidden');
    relightCandleBtn.classList.remove('hidden');
  }

  function relightCandle() {
    ensureAudioStarted();
    candleExtinguished = false;
    flame.classList.remove('opacity-0', 'scale-0');
    smoke.classList.add('hidden');

    if (wishCelebrationCard) {
      wishCelebrationCard.classList.add('hidden');
    }

    relightCandleBtn.classList.add('hidden');
    blowCandleBtn.classList.remove('hidden');
  }

  if (candleGroup) candleGroup.addEventListener('click', blowOutCandle);
  if (blowCandleBtn) blowCandleBtn.addEventListener('click', blowOutCandle);
  if (relightCandleBtn) relightCandleBtn.addEventListener('click', relightCandle);

  // 5. Interactive Letter / Envelope
  const envelopeCover = document.getElementById('envelopeCover');
  const letterContent = document.getElementById('letterContent');
  const closeLetterBtn = document.getElementById('closeLetterBtn');
  const letterDate = document.getElementById('letterDate');

  if (letterDate) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    letterDate.textContent = new Date().toLocaleDateString(undefined, options);
  }

  if (envelopeCover && letterContent) {
    envelopeCover.addEventListener('click', () => {
      ensureAudioStarted();
      envelopeCover.classList.add('hidden');
      letterContent.classList.remove('hidden');
      triggerConfetti(0.5, 0.7);
      if (window.birthdayAudio) {
        window.birthdayAudio.playConfettiChime();
      }
    });

    if (closeLetterBtn) {
      closeLetterBtn.addEventListener('click', () => {
        letterContent.classList.add('hidden');
        envelopeCover.classList.remove('hidden');
      });
    }
  }

  // 6. Balloon Popping Minigame
  initBalloonMinigame();

  // 7. Sister Wish Generator for Chey Kolroth
  const wishes = [
    "May your year be overflowing with unconditional laughter, fabulous food, and boundless joy, Chey Kolroth! 🌸",
    "To the one and only Chey Kolroth: May every single door of opportunity swing open for you! ✨",
    "Wishing you flawless skin, zero stress, unlimited delicious meals, and perpetual happiness! 🍰",
    "May you continue to inspire everyone around you with your great humor and bright spirit, Chey Kolroth! 💖",
    "You're not just family—you're a legend and a lifetime blessing. Cheers to your best year yet, Chey Kolroth! 🥂",
    "May your life be as radiant, colorful, and joyful as the love you share with everyone! 🌈",
    "Here's to another 365 days of turning heads, reaching new heights, and making unforgettable memories! 👑"
  ];

  const nextWishBtn = document.getElementById('nextWishBtn');
  const randomWishText = document.getElementById('randomWishText');

  if (nextWishBtn && randomWishText) {
    let lastIdx = 0;
    nextWishBtn.addEventListener('click', () => {
      ensureAudioStarted();
      let idx;
      do {
        idx = Math.floor(Math.random() * wishes.length);
      } while (idx === lastIdx && wishes.length > 1);
      lastIdx = idx;

      randomWishText.classList.add('opacity-0', 'scale-95');
      setTimeout(() => {
        randomWishText.textContent = `"${wishes[idx]}"`;
        randomWishText.classList.remove('opacity-0', 'scale-95');
        triggerConfetti(0.5, 0.85);
      }, 200);
    });
  }
});

// Canvas Confetti helper
function triggerConfetti(x = 0.5, y = 0.5) {
  if (typeof confetti === 'function') {
    confetti({
      particleCount: 65,
      spread: 70,
      origin: { x, y },
      colors: ['#ff4d6d', '#ffb3c6', '#ffd166', '#c77dff', '#ffffff']
    });
  }
}

function fireGrandCelebration() {
  if (typeof confetti !== 'function') return;

  const duration = 2.5 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1000 };

  function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  const interval = setInterval(() => {
    const timeLeft = animationEnd - Date.now();
    if (timeLeft <= 0) {
      return clearInterval(interval);
    }
    const particleCount = 45 * (timeLeft / duration);
    confetti(Object.assign({}, defaults, {
      particleCount,
      origin: { x: randomInRange(0.15, 0.4), y: Math.random() - 0.2 },
      colors: ['#ff4d6d', '#ff758f', '#ffb3c6', '#ffe5ec', '#c77dff', '#ffd166']
    }));
    confetti(Object.assign({}, defaults, {
      particleCount,
      origin: { x: randomInRange(0.6, 0.85), y: Math.random() - 0.2 },
      colors: ['#ff4d6d', '#ff758f', '#ffb3c6', '#ffe5ec', '#c77dff', '#ffd166']
    }));
  }, 220);
}

// Background Floating Stars, Hearts & Sparkles Canvas
function initBackgroundCanvas() {
  const canvas = document.getElementById('bgCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const particleCount = 45;
  const symbols = ['✨', '💖', '⭐', '🌸', '✨'];

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 14 + 10,
      symbol: symbols[Math.floor(Math.random() * symbols.length)],
      speedY: -(Math.random() * 0.6 + 0.2),
      speedX: (Math.random() - 0.5) * 0.4,
      opacity: Math.random() * 0.6 + 0.2,
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 0.8
    });
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach((p) => {
      p.y += p.speedY;
      p.x += p.speedX;
      p.rotation += p.rotSpeed;

      if (p.y < -30) {
        p.y = height + 30;
        p.x = Math.random() * width;
      }
      if (p.x < -30) p.x = width + 30;
      if (p.x > width + 30) p.x = -30;

      ctx.save();
      ctx.globalAlpha = p.opacity;
      ctx.font = `${p.size}px serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillText(p.symbol, 0, 0);
      ctx.restore();
    });

    requestAnimationFrame(render);
  }
  render();
}

// Balloon Minigame Setup for Chey Kolroth
function initBalloonMinigame() {
  const arena = document.getElementById('balloonArena');
  const scoreSpan = document.getElementById('balloonScore');
  const resetBtn = document.getElementById('resetBalloonsBtn');
  if (!arena || !scoreSpan) return;

  const balloonColors = [
    { bg: 'from-pink-500 to-rose-400', word: 'Chey Kolroth ✨' },
    { bg: 'from-purple-500 to-indigo-400', word: 'Gorgeous! 🌸' },
    { bg: 'from-amber-400 to-yellow-300', word: 'Brilliant! 🌟' },
    { bg: 'from-rose-500 to-red-400', word: 'Pure Love! 💖' },
    { bg: 'from-cyan-400 to-blue-400', word: 'Always Joyful! 🎈' },
    { bg: 'from-emerald-400 to-teal-300', word: 'Iconic Kolroth! 👑' }
  ];

  let score = 0;

  function spawnBalloons() {
    arena.innerHTML = '';
    score = 0;
    scoreSpan.textContent = score;

    balloonColors.forEach((b, index) => {
      const balloon = document.createElement('div');
      balloon.className = `absolute cursor-pointer transition-transform hover:scale-110 active:scale-90 select-none`;
      
      const leftPercent = 8 + index * 14 + (Math.random() * 4 - 2);
      const topPercent = 20 + Math.random() * 40;

      balloon.style.left = `${Math.min(85, Math.max(5, leftPercent))}%`;
      balloon.style.top = `${topPercent}%`;

      balloon.innerHTML = `
        <div class="relative flex flex-col items-center animate-bounce" style="animation-duration: ${2.5 + (index % 3) * 0.6}s;">
          <div class="w-12 h-14 sm:w-14 sm:h-16 rounded-[50%_50%_50%_50%/60%_60%_40%_40%] bg-gradient-to-tr ${b.bg} shadow-lg shadow-pink-500/20 flex items-center justify-center border border-white/30 text-white font-bold text-xs">
            🎈
          </div>
          <div class="w-1 h-3 bg-pink-300/60 -mt-0.5"></div>
          <div class="w-0.5 h-6 bg-white/40"></div>
        </div>
      `;

      balloon.addEventListener('click', () => {
        if (window.birthdayAudio) {
          window.birthdayAudio.playPopSound();
        }

        const rect = balloon.getBoundingClientRect();
        triggerConfetti(
          (rect.left + rect.width / 2) / window.innerWidth,
          (rect.top + rect.height / 2) / window.innerHeight
        );

        const toast = document.createElement('div');
        toast.className = 'absolute font-serif text-sm font-bold text-amber-200 pointer-events-none transform -translate-y-4 animate-ping';
        toast.style.left = balloon.style.left;
        toast.style.top = balloon.style.top;
        toast.textContent = b.word;
        arena.appendChild(toast);
        setTimeout(() => toast.remove(), 700);

        balloon.remove();
        score++;
        scoreSpan.textContent = score;

        if (score === balloonColors.length) {
          setTimeout(() => {
            fireGrandCelebration();
          }, 300);
        }
      });

      arena.appendChild(balloon);
    });
  }

  spawnBalloons();

  if (resetBtn) {
    resetBtn.addEventListener('click', spawnBalloons);
  }
}
