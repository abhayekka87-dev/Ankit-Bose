const navLinks = document.querySelectorAll('.nav-link');
const panels = document.querySelectorAll('.panel');
const typedElement = document.getElementById('typed-text');
const form = document.getElementById('contact-form');
const statusMessage = document.getElementById('form-status');

const phrases = [
  'SYNCING WITH MAINFRAME... ',
  'AUTHORIZATION ACCEPTED... ',
  'MISSION SETUP: DEPLOYING...' 
];

let phraseIndex = 0;
let charIndex = 0;

function typeText() {
  if (phraseIndex >= phrases.length) {
    phraseIndex = 0;
  }
  const current = phrases[phraseIndex];
  if (charIndex < current.length) {
    typedElement.textContent = current.slice(0, charIndex + 1);
    charIndex += 1;
    setTimeout(typeText, 40);
  } else {
    setTimeout(() => {
      charIndex = 0;
      phraseIndex += 1;
      typeText();
    }, 1200);
  }
}

typeText();

navLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    const targetId = link.getAttribute('data-target');
    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

const observerOptions = {
  threshold: 0.22,
};

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    const sec = entry.target;
    const id = sec.getAttribute('id');

    if (entry.isIntersecting) {
      sec.classList.add('active');
      navLinks.forEach((link) => {
        if (link.dataset.target === id) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }
  });
}, observerOptions);

panels.forEach((panel) => {
  sectionObserver.observe(panel);
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  statusMessage.textContent = 'INVITE SENT. AWAITING SQUAD RESPONSE...';
  form.reset();
  setTimeout(() => {
    statusMessage.textContent = '';
  }, 3600);
});

/* Background canvas particles */
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let w = 0;
let h = 0;
const particles = [];

function resizeCanvas() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function createParticles() {
  const count = Math.min(Math.floor(w * h / 24000), 150);
  particles.length = 0;
  for (let i = 0; i < count; i += 1) {
    particles.push({
      x: Math.random() * w,
      y: Math.random() * h,
      size: Math.random() * 1.5 + 0.6,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.25 + 0.07,
    });
  }
}

createParticles();

function drawBackground() {
  ctx.clearRect(0, 0, w, h);

  // subtle noise overlay
  ctx.fillStyle = 'rgba(4, 6, 10, 0.22)';
  ctx.fillRect(0, 0, w, h);

  // faint grid
  ctx.strokeStyle = 'rgba(255,255,255,0.03)';
  ctx.lineWidth = 1;
  for (let x = 0; x < w; x += 48) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }
  for (let y = 0; y < h; y += 48) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }

  particles.forEach((p) => {
    p.x += p.vx;
    p.y += p.vy;

    if (p.x < 0) p.x = w;
    if (p.x > w) p.x = 0;
    if (p.y < 0) p.y = h;
    if (p.y > h) p.y = 0;

    ctx.fillStyle = `rgba(220, 220, 226, ${p.alpha})`;
    ctx.fillRect(p.x, p.y, p.size, p.size);
  });

  requestAnimationFrame(drawBackground);
}

drawBackground();

// Relayout after particle creation for new size
window.addEventListener('resize', () => {
  setTimeout(() => {
    createParticles();
  }, 120);
});
