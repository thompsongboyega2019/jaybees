/**
 * Jaybees Confectionery - 5-Second Hero Carousel Slider
 * Implements smooth slide transitions, animated headings, subheadings,
 * progress bar timer, pagination dots, and swipe gestures.
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeroSlider();
});

function initHeroSlider() {
  const slider = document.querySelector('.hero-slider-section');
  if (!slider) return;

  const slides = slider.querySelectorAll('.hero-slide');
  const dotsContainer = slider.querySelector('.slider-dots');
  const progressBar = slider.querySelector('.slider-progress-bar');
  const prevBtn = slider.querySelector('.slider-prev');
  const nextBtn = slider.querySelector('.slider-next');

  if (!slides.length) return;

  let currentSlide = 0;
  const totalSlides = slides.length;
  const SLIDE_DURATION = 5000; // Exactly 5 seconds per requirement
  let slideInterval = null;
  let progressInterval = null;
  let progress = 0;
  const progressStepTime = 50; // Update progress bar every 50ms

  // Generate pagination dots dynamically
  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    slides.forEach((_, idx) => {
      const dot = document.createElement('div');
      dot.classList.add('slider-dot');
      if (idx === 0) dot.classList.add('active');
      dot.setAttribute('aria-label', `Go to slide ${idx + 1}`);
      dot.addEventListener('click', () => {
        goToSlide(idx);
        restartTimer();
      });
      dotsContainer.appendChild(dot);
    });
  }

  const dots = slider.querySelectorAll('.slider-dot');

  function showSlide(index) {
    slides.forEach((slide, idx) => {
      if (idx === index) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });

    dots.forEach((dot, idx) => {
      if (idx === index) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });

    currentSlide = index;
  }

  function nextSlide() {
    const nextIndex = (currentSlide + 1) % totalSlides;
    showSlide(nextIndex);
  }

  function prevSlide() {
    const prevIndex = (currentSlide - 1 + totalSlides) % totalSlides;
    showSlide(prevIndex);
  }

  function goToSlide(index) {
    if (index >= 0 && index < totalSlides) {
      showSlide(index);
    }
  }

  function startProgressBar() {
    progress = 0;
    if (progressBar) progressBar.style.width = '0%';

    clearInterval(progressInterval);
    progressInterval = setInterval(() => {
      progress += (progressStepTime / SLIDE_DURATION) * 100;
      if (progressBar) {
        progressBar.style.width = `${Math.min(progress, 100)}%`;
      }
      if (progress >= 100) {
        clearInterval(progressInterval);
      }
    }, progressStepTime);
  }

  function startSlideTimer() {
    clearInterval(slideInterval);
    startProgressBar();

    slideInterval = setInterval(() => {
      nextSlide();
      startProgressBar();
    }, SLIDE_DURATION);
  }

  function restartTimer() {
    clearInterval(slideInterval);
    clearInterval(progressInterval);
    startSlideTimer();
  }

  // Event Listeners for Nav Buttons
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      restartTimer();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prevSlide();
      restartTimer();
    });
  }

  // Pause on hover
  slider.addEventListener('mouseenter', () => {
    clearInterval(slideInterval);
    clearInterval(progressInterval);
  });

  slider.addEventListener('mouseleave', () => {
    startSlideTimer();
  });

  // Touch Swipe Support for Mobile
  let touchStartX = 0;
  let touchEndX = 0;

  slider.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  slider.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });

  function handleSwipe() {
    const swipeThreshold = 50;
    if (touchEndX < touchStartX - swipeThreshold) {
      nextSlide();
      restartTimer();
    }
    if (touchEndX > touchStartX + swipeThreshold) {
      prevSlide();
      restartTimer();
    }
  }

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    const isSliderInView = slider.getBoundingClientRect().top < window.innerHeight && slider.getBoundingClientRect().bottom > 0;
    if (!isSliderInView) return;

    if (e.key === 'ArrowRight') {
      nextSlide();
      restartTimer();
    } else if (e.key === 'ArrowLeft') {
      prevSlide();
      restartTimer();
    }
  });

  // Start the 5-second carousel
  showSlide(0);
  startSlideTimer();
}
