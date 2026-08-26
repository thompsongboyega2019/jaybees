/**
 * Jaybees Confectionery - Gallery Filtering & Lightbox Modal
 */

document.addEventListener('DOMContentLoaded', () => {
  initGalleryFilter();
  initGalleryLightbox();
});

function initGalleryFilter() {
  const filterBtns = document.querySelectorAll('.gallery-btn-filter');
  const galleryItems = document.querySelectorAll('.gallery-item-wrap');
  const searchInput = document.getElementById('gallerySearchInput');

  if (!filterBtns.length || !galleryItems.length) return;

  let currentCategory = 'all';
  let currentSearchQuery = '';

  function applyFilters() {
    galleryItems.forEach(item => {
      const itemCategory = item.getAttribute('data-category') || '';
      const itemTitle = (item.querySelector('h5')?.textContent || '').toLowerCase();
      const itemDesc = (item.querySelector('p')?.textContent || '').toLowerCase();

      const matchesCategory = (currentCategory === 'all' || itemCategory.includes(currentCategory));
      const matchesSearch = !currentSearchQuery || itemTitle.includes(currentSearchQuery) || itemDesc.includes(currentSearchQuery);

      if (matchesCategory && matchesSearch) {
        item.style.display = 'block';
        setTimeout(() => {
          item.style.opacity = '1';
          item.style.transform = 'scale(1)';
        }, 50);
      } else {
        item.style.opacity = '0';
        item.style.transform = 'scale(0.9)';
        setTimeout(() => {
          item.style.display = 'none';
        }, 300);
      }
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.getAttribute('data-filter') || 'all';
      applyFilters();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearchQuery = e.target.value.toLowerCase().trim();
      applyFilters();
    });
  }
}

function initGalleryLightbox() {
  const galleryGridItems = document.querySelectorAll('.gallery-grid-item');
  const lightboxModal = document.getElementById('galleryLightboxModal');
  if (!galleryGridItems.length || !lightboxModal) return;

  const lightboxImg = lightboxModal.querySelector('#lightboxImage');
  const lightboxTitle = lightboxModal.querySelector('#lightboxTitle');
  const lightboxCategory = lightboxModal.querySelector('#lightboxCategory');
  const lightboxDesc = lightboxModal.querySelector('#lightboxDesc');
  const lightboxPrev = lightboxModal.querySelector('#lightboxPrev');
  const lightboxNext = lightboxModal.querySelector('#lightboxNext');
  const lightboxInquireBtn = lightboxModal.querySelector('#lightboxInquireBtn');

  const bsModal = new bootstrap.Modal(lightboxModal);
  let currentIndex = 0;
  const itemsData = [];

  galleryGridItems.forEach((item, idx) => {
    const img = item.querySelector('img');
    const title = item.querySelector('h5')?.textContent || 'Artisanal Creation';
    const category = item.querySelector('p')?.textContent || 'Confectionery';
    const desc = item.getAttribute('data-description') || 'Handcrafted with premium ingredients and bespoke artistic detailing.';

    itemsData.push({
      src: img?.getAttribute('src') || '',
      alt: img?.getAttribute('alt') || 'Cake',
      title,
      category,
      desc
    });

    item.addEventListener('click', () => {
      currentIndex = idx;
      updateLightboxContent();
      bsModal.show();
    });
  });

  function updateLightboxContent() {
    const data = itemsData[currentIndex];
    if (!data) return;

    if (lightboxImg) {
      lightboxImg.src = data.src;
      lightboxImg.alt = data.alt;
    }
    if (lightboxTitle) lightboxTitle.textContent = data.title;
    if (lightboxCategory) lightboxCategory.textContent = data.category;
    if (lightboxDesc) lightboxDesc.textContent = data.desc;
    if (lightboxInquireBtn) {
      lightboxInquireBtn.href = `https://api.whatsapp.com/send/?phone=2349044508817&text&type=phone_number&app_absent=0&utm_source=ig`;
    }
  }

  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + itemsData.length) % itemsData.length;
      updateLightboxContent();
    });
  }

  if (lightboxNext) {
    lightboxNext.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % itemsData.length;
      updateLightboxContent();
    });
  }

  // Keyboard navigation inside lightbox
  document.addEventListener('keydown', (e) => {
    if (lightboxModal.classList.contains('show')) {
      if (e.key === 'ArrowLeft') {
        currentIndex = (currentIndex - 1 + itemsData.length) % itemsData.length;
        updateLightboxContent();
      } else if (e.key === 'ArrowRight') {
        currentIndex = (currentIndex + 1) % itemsData.length;
        updateLightboxContent();
      }
    }
  });
}
