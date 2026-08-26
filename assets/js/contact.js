/**
 * Jaybees Confectionery - Contact & Price Estimator Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  initContactForm();
  initPriceEstimator();
  handleUrlParams();
});

/* --- Pre-fill Form Fields based on URL Query Parameters --- */
function handleUrlParams() {
  const urlParams = new URLSearchParams(window.location.search);
  const cakeParam = urlParams.get('cake');
  const serviceParam = urlParams.get('service');
  const estimatedTotalParam = urlParams.get('estimate');

  const cakeTypeSelect = document.getElementById('contactCakeType');
  const messageTextarea = document.getElementById('contactMessage');

  if (cakeParam && cakeTypeSelect) {
    // If cake name is passed, mention it in message or select relevant option
    if (messageTextarea) {
      messageTextarea.value = `Hello Jaybees Team! I am interested in inquiring about the "${cakeParam}" design seen in your gallery.`;
    }
  }

  if (serviceParam && cakeTypeSelect) {
    for (let i = 0; i < cakeTypeSelect.options.length; i++) {
      if (cakeTypeSelect.options[i].value.toLowerCase().includes(serviceParam.toLowerCase())) {
        cakeTypeSelect.selectedIndex = i;
        break;
      }
    }
  }

  if (estimatedTotalParam && messageTextarea) {
    messageTextarea.value += `\n[Estimated Budget calculated from online tool: ${estimatedTotalParam}]`;
  }
}

/* --- Contact & Custom Order Form Validation --- */
function initContactForm() {
  const contactForm = document.getElementById('jaybeesBookingForm');
  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!contactForm.checkValidity()) {
      e.stopPropagation();
      contactForm.classList.add('was-validated');
      return;
    }

    const name = document.getElementById('contactName')?.value || 'Valued Client';
    const email = document.getElementById('contactEmail')?.value || '';
    const date = document.getElementById('contactDate')?.value || 'your upcoming date';
    const cakeType = document.getElementById('contactCakeType')?.value || 'Custom Cake';

    // Show Confirmation Modal or Toast
    const toastEl = document.getElementById('successToast');
    if (toastEl) {
      const toastBody = toastEl.querySelector('.toast-body');
      if (toastBody) {
        toastBody.innerHTML = `<strong>Thank you, ${name}!</strong><br>Your custom order request for <em>${cakeType}</em> for <em>${date}</em> has been sent to our master pastry team. We will review flavor availability and contact you at <strong>${email}</strong> within 24 hours.`;
      }
      const toast = new bootstrap.Toast(toastEl, { delay: 6000 });
      toast.show();
    } else {
      alert(`Thank you, ${name}! Your inquiry for ${cakeType} on ${date} has been received. Our team will contact you shortly.`);
    }

    contactForm.reset();
    contactForm.classList.remove('was-validated');
  });
}

/* --- Interactive Cake Price Estimator (on Services page) --- */
function initPriceEstimator() {
  const estimatorForm = document.getElementById('cakePriceEstimatorForm');
  if (!estimatorForm) return;

  const typeSelect = document.getElementById('calcCakeType');
  const sizeSelect = document.getElementById('calcCakeSize');
  const finishSelect = document.getElementById('calcCakeFinish');
  const addonCheckboxes = estimatorForm.querySelectorAll('.calc-addon');
  const totalDisplay = document.getElementById('calculatedPriceDisplay');
  const bookSpecBtn = document.getElementById('bookCalculatedSpecBtn');

  function calculatePrice() {
    let basePrice = 0;

    // Type Base
    const typeValue = typeSelect?.value || 'celebration';
    switch (typeValue) {
      case 'wedding':
        basePrice += 180;
        break;
      case 'celebration':
        basePrice += 65;
        break;
      case 'dessert-table':
        basePrice += 220;
        break;
      case 'cupcake-tower':
        basePrice += 80;
        break;
      default:
        basePrice += 65;
    }

    // Size Multiplier / Addition
    const sizeValue = sizeSelect?.value || '10-20';
    switch (sizeValue) {
      case '10-20':
        basePrice += 0;
        break;
      case '20-40':
        basePrice += 45;
        break;
      case '40-70':
        basePrice += 95;
        break;
      case '70-120':
        basePrice += 175;
        break;
      case '120+':
        basePrice += 260;
        break;
    }

    // Finish Additions
    const finishValue = finishSelect?.value || 'buttercream';
    switch (finishValue) {
      case 'buttercream':
        basePrice += 0;
        break;
      case 'fondant':
        basePrice += 40;
        break;
      case 'semi-naked':
        basePrice += 15;
        break;
      case 'velvet-spray':
        basePrice += 35;
        break;
    }

    // Add-on checkboxes
    let addonsTotal = 0;
    addonCheckboxes.forEach(cb => {
      if (cb.checked) {
        addonsTotal += parseFloat(cb.getAttribute('data-price') || 0);
      }
    });

    const finalEstimate = basePrice + addonsTotal;
    const minEstimate = finalEstimate;
    const maxEstimate = Math.round(finalEstimate * 1.15);

    if (totalDisplay) {
      totalDisplay.textContent = `$${minEstimate} - $${maxEstimate}`;
    }

    if (bookSpecBtn) {
      bookSpecBtn.href = `contact.html?service=${encodeURIComponent(typeValue)}&estimate=${encodeURIComponent('$' + minEstimate + ' - $' + maxEstimate)}`;
    }
  }

  // Bind change events
  [typeSelect, sizeSelect, finishSelect].forEach(el => {
    if (el) el.addEventListener('change', calculatePrice);
  });

  addonCheckboxes.forEach(cb => {
    cb.addEventListener('change', calculatePrice);
  });

  calculatePrice();
}
