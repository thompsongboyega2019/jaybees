/**
 * Jaybees Confectionery - Main JavaScript
 * Handles navigation effects, scroll reveals, animated stats, interactive sparkles,
 * 3D card tilt effects, and global micro-interactions.
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbarScroll();
  initActiveNavLink();
  initScrollReveal();
  initCounterStats();
  initBackToTop();
  initNewsletterForm();
  initSparkleParticles();
  initCard3DTilt();
});

/* --- Navbar Sticky on Scroll --- */
function initNavbarScroll() {
  const navbar = document.querySelector('.navbar-jaybees');
  if (!navbar) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* --- Highlight Active Navigation Link --- */
function initActiveNavLink() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/* --- Scroll Reveal Animations --- */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal');
  if (!revealElements.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        obs.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

/* --- Animated Number Counters --- */
function initCounterStats() {
  const counters = document.querySelectorAll('.counter-number');
  if (!counters.length) return;

  let animated = false;

  const runCounter = (el) => {
    const target = parseInt(el.getAttribute('data-target'), 10) || 0;
    const prefix = el.getAttribute('data-prefix') || '';
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 2000; // ms
    const startTime = performance.now();

    const updateCount = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(easeProgress * target);

      el.textContent = `${prefix}${current.toLocaleString()}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        el.textContent = `${prefix}${target.toLocaleString()}${suffix}`;
      }
    };

    requestAnimationFrame(updateCount);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        counters.forEach(counter => runCounter(counter));
      }
    });
  }, { threshold: 0.25 });

  const counterSection = document.querySelector('.counter-section');
  if (counterSection) {
    observer.observe(counterSection);
  }
}

/* --- Back to Top Button --- */
function initBackToTop() {
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }
  }, { passive: true });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* --- Newsletter Form Feedback --- */
function initNewsletterForm() {
  const newsletterForms = document.querySelectorAll('.newsletter-form');
  newsletterForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = form.querySelector('input[type="email"]');
      if (emailInput && emailInput.value) {
        alert(`✨ Thank you for subscribing to Jaybees Sweet Club with ${emailInput.value}! Expect our delicious seasonal updates and exclusive perks soon.`);
        emailInput.value = '';
      }
    });
  });
}

/* --- Interactive Confectionery Sparkle Particles --- */
function initSparkleParticles() {
  const canvas = document.createElement('canvas');
  canvas.id = 'sweetSparkleCanvas';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const sparkles = [];
  const colors = ['#fcc403', '#d73e72', '#ffd1dc', '#ffffff', '#e83a77'];

  class Sparkle {
    constructor(x, y, isMouse = false) {
      this.x = x || Math.random() * width;
      this.y = y || (isMouse ? y : height + 10);
      this.size = Math.random() * 3.5 + 1.5;
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.speedX = (Math.random() - 0.5) * (isMouse ? 2.5 : 0.8);
      this.speedY = isMouse ? (Math.random() - 0.5) * 2.5 : -(Math.random() * 1.2 + 0.4);
      this.alpha = 1;
      this.decay = isMouse ? Math.random() * 0.03 + 0.02 : Math.random() * 0.006 + 0.003;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotSpeed = (Math.random() - 0.5) * 0.08;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.alpha -= this.decay;
      this.rotation += this.rotSpeed;
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = Math.max(this.alpha, 0);
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.fillStyle = this.color;
      ctx.shadowBlur = 8;
      ctx.shadowColor = this.color;

      // Draw 4-point sparkle star
      ctx.beginPath();
      for (let i = 0; i < 4; i++) {
        ctx.lineTo(Math.cos((i * Math.PI) / 2) * this.size, Math.sin((i * Math.PI) / 2) * this.size);
        ctx.lineTo(
          Math.cos((i * Math.PI) / 2 + Math.PI / 4) * (this.size * 0.35),
          Math.sin((i * Math.PI) / 2 + Math.PI / 4) * (this.size * 0.35)
        );
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
  }

  // Mouse sparkle trail
  let lastMouseTime = 0;
  window.addEventListener('mousemove', (e) => {
    const now = Date.now();
    if (now - lastMouseTime > 40) {
      lastMouseTime = now;
      for (let i = 0; i < 2; i++) {
        sparkles.push(new Sparkle(e.clientX, e.clientY, true));
      }
    }
  }, { passive: true });

  // Ambient gentle floating sparkles
  function animateParticles() {
    ctx.clearRect(0, 0, width, height);

    if (sparkles.length < 35 && Math.random() < 0.25) {
      sparkles.push(new Sparkle());
    }

    for (let i = sparkles.length - 1; i >= 0; i--) {
      sparkles[i].update();
      sparkles[i].draw();
      if (sparkles[i].alpha <= 0 || sparkles[i].y < -20 || sparkles[i].x < -20 || sparkles[i].x > width + 20) {
        sparkles.splice(i, 1);
      }
    }

    requestAnimationFrame(animateParticles);
  }

  animateParticles();
}

/* --- 3D Subtle Tilt Effect on Cards --- */
function initCard3DTilt() {
  const cards = document.querySelectorAll('.product-card, .service-card, .testimonial-card');
  if (!cards.length || window.innerWidth < 992) return;

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });
}
