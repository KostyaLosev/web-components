const slides = document.querySelector('.slides');
const slide = document.querySelectorAll('.slide');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');
const pagination = document.querySelector('.pagination');
const body = document.body;
const canvas = document.getElementById('background-canvas');
const ctx = canvas.getContext('2d');

let index = 0;
const totalSlides = slide.length;
let animationType = 'stars'; 
let particles = [];
let animationFrameId;

for (let i = 0; i < totalSlides; i++) {
  const dot = document.createElement('div');
  dot.classList.add('dot');
  dot.addEventListener('click', () => {
    index = i;
    showSlide();
  });
  pagination.appendChild(dot);
}

const dots = document.querySelectorAll('.dot');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function drawStars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach((star) => {
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
    ctx.fillStyle = 'white'; 
    ctx.fill();
    star.y += star.speedY;
    star.x += star.speedX;
    if (star.y > canvas.height || star.x > canvas.width) {
      star.y = Math.random() * -100;
      star.x = Math.random() * canvas.width;
    }
  });
  animationFrameId = requestAnimationFrame(drawStars);
}

function drawRain() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach((drop) => {
    ctx.beginPath();
    ctx.moveTo(drop.x, drop.y);
    ctx.lineTo(drop.x + drop.wind, drop.y + drop.length);
    ctx.strokeStyle = 'rgba(113, 149, 204, 0.5)';
    ctx.lineWidth = 1;
    ctx.stroke();
    drop.y += drop.speedY;
    drop.x += drop.wind;
    if (drop.y > canvas.height) {
      drop.y = Math.random() * -20;
      drop.x = Math.random() * canvas.width;
    }
  });
  animationFrameId = requestAnimationFrame(drawRain);
}

function drawSunshine() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const gradient = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 100, canvas.width / 2, canvas.height / 2, 600);
  gradient.addColorStop(0, 'rgba(255, 255, 153, 0.8)');
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  animationFrameId = requestAnimationFrame(drawSunshine);
}

function generateParticles(type) {
  cancelAnimationFrame(animationFrameId);
  particles = [];
  if (type === 'stars') {
    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2,
        speedY: 1 + Math.random(),
        speedX: 0.5 + Math.random()
      });
    }
    drawStars();
  } else if (type === 'rain') {
    for (let i = 0; i < 200; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        length: Math.random() * 20,
        speedY: 4 + Math.random() * 4,
        wind: Math.random() * 2
      });
    }
    drawRain();
  } else if (type === 'sun') {
    drawSunshine();
  }
}

function showSlide() {
  slides.style.transform = `translateX(${-index * 600}px)`;
  updateDots();
  updateBackground();
}

function updateDots() {
  dots.forEach(dot => dot.classList.remove('active'));
  dots[index].classList.add('active');
}

function updateBackground() {
  if (index === 0) {
    animationType = 'stars';
    body.classList.remove('bg-sun', 'bg-rain');
    body.classList.add('bg-stars');
    generateParticles('stars');
  } else if (index === 1) {
    animationType = 'sun';
    body.classList.remove('bg-stars', 'bg-rain');
    body.classList.add('bg-sun');
    generateParticles('sun');
  } else if (index === 2) {
    animationType = 'rain';
    body.classList.remove('bg-stars', 'bg-sun');
    body.classList.add('bg-rain');
    generateParticles('rain');
  }
}

nextBtn.addEventListener('click', () => {
  index = (index + 1) % totalSlides;
  showSlide();
});

prevBtn.addEventListener('click', () => {
  index = (index - 1 + totalSlides) % totalSlides;
  showSlide();
});

showSlide();
