/**
 * SIRPI DEVELOPERS - Interactive & Reactive Web Application Logic
 * Location: Othakalmandapam, Coimbatore, Tamil Nadu
 * Contact: +91 98422 69100 / +91 99655 48434
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initEstimator();
  initBlueprintToggle();
  initProcessStepper();
  initProjectModals();
  initContactForm();
  initStatCounters();
});

/* ==========================================================================
   1. NAVIGATION & SCROLL
   ========================================================================== */
function initNavigation() {
  const mainNav = document.getElementById('mainNav');
  const mobileToggle = document.getElementById('mobileMenuToggle');
  const mobileDrawer = document.getElementById('mobileNavDrawer');
  const mobileClose = document.getElementById('mobileCloseBtn');
  const mobileBackdrop = document.getElementById('mobileBackdrop');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  // Sticky Navbar on Scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      mainNav.classList.add('scrolled');
    } else {
      mainNav.classList.remove('scrolled');
    }
  });

  // Mobile Drawer Toggle
  function openDrawer() {
    mobileDrawer.classList.add('open');
    mobileBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    mobileDrawer.classList.remove('open');
    mobileBackdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (mobileToggle) mobileToggle.addEventListener('click', openDrawer);
  if (mobileClose) mobileClose.addEventListener('click', closeDrawer);
  if (mobileBackdrop) mobileBackdrop.addEventListener('click', closeDrawer);

  mobileLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });
}

/* ==========================================================================
   2. INTERACTIVE CONSTRUCTION COST & TIMELINE ESTIMATOR
   ========================================================================== */
function initEstimator() {
  const areaSlider = document.getElementById('calcAreaSlider');
  const areaValBadge = document.getElementById('calcAreaValue');
  const typePills = document.querySelectorAll('.type-pill');
  const gradeCards = document.querySelectorAll('.grade-card');
  const floorsSelect = document.getElementById('calcFloorsSelect');
  
  // Results Elements
  const costEstimateEl = document.getElementById('costEstimateDisplay');
  const timelineEstimateEl = document.getElementById('timelineEstimateDisplay');
  const rateBreakdownEl = document.getElementById('rateBreakdownDisplay');
  const steelEstEl = document.getElementById('steelEstimateDisplay');
  const cementEstEl = document.getElementById('cementEstimateDisplay');
  const whatsappCalcBtn = document.getElementById('calcWhatsappBtn');

  // State
  let currentType = 'residential';
  let currentArea = 1800;
  let currentFloors = 2; // G+1
  let currentGrade = 'premium';

  // Base rates per sq.ft in Coimbatore (INR)
  const baseRates = {
    standard: {
      residential: 2050,
      villa: 2400,
      apartment: 2150,
      commercial: 1950,
      contracting: 1850
    },
    premium: {
      residential: 2450,
      villa: 2950,
      apartment: 2550,
      commercial: 2350,
      contracting: 2200
    },
    luxury: {
      residential: 3100,
      villa: 3850,
      apartment: 3300,
      commercial: 2950,
      contracting: 2800
    }
  };

  function updateCalculation() {
    // Current base rate per sq.ft
    const ratePerSqFt = baseRates[currentGrade][currentType] || 2450;
    
    // Multiplier for number of floors
    let floorFactor = 1.0;
    if (currentFloors === 1) floorFactor = 1.0;
    else if (currentFloors === 2) floorFactor = 1.03; // G+1 structural footing
    else if (currentFloors === 3) floorFactor = 1.07; // G+2
    else if (currentFloors >= 4) floorFactor = 1.12;  // G+3+

    const totalCost = Math.round(currentArea * ratePerSqFt * floorFactor);

    // Format Indian Rupees
    let formattedCost = '';
    if (totalCost >= 10000000) {
      const cr = (totalCost / 10000000).toFixed(2);
      formattedCost = `₹ ${cr} Cr*`;
    } else {
      const lakhs = (totalCost / 100000).toFixed(2);
      formattedCost = `₹ ${lakhs} Lakhs*`;
    }

    // Timeline calculation based on sqft & floors
    let baseMonths = 5;
    if (currentArea > 1500) baseMonths += Math.ceil((currentArea - 1500) / 1000);
    if (currentFloors > 2) baseMonths += (currentFloors - 2) * 1.5;
    const durationText = `${Math.floor(baseMonths)} - ${Math.ceil(baseMonths + 2)} Months`;

    // Material consumption approx
    const cementBags = Math.round(currentArea * 0.4 * currentFloors);
    const steelTons = (currentArea * 0.0038 * currentFloors).toFixed(1);

    // Update DOM
    if (costEstimateEl) costEstimateEl.textContent = formattedCost;
    if (timelineEstimateEl) timelineEstimateEl.textContent = durationText;
    if (rateBreakdownEl) rateBreakdownEl.textContent = `₹${ratePerSqFt}/sq.ft base rate`;
    if (steelEstEl) steelEstEl.textContent = `~${steelTons} Metric Tons`;
    if (cementEstEl) cementEstEl.textContent = `~${cementBags} Bags`;

    // Update WhatsApp link with pre-filled message
    if (whatsappCalcBtn) {
      const typeLabel = currentType.charAt(0).toUpperCase() + currentType.slice(1);
      const gradeLabel = currentGrade.charAt(0).toUpperCase() + currentGrade.slice(1);
      const text = encodeURIComponent(
        `Hi Sirpi Developers, I calculated a project estimate on your website:\n` +
        `• Type: ${typeLabel} Construction\n` +
        `• Area: ${currentArea} Sq.Ft\n` +
        `• Floors: ${currentFloors === 1 ? 'Ground Floor (G+0)' : 'G+' + (currentFloors - 1)}\n` +
        `• Grade: ${gradeLabel} Quality\n` +
        `• Estimated Budget: ${formattedCost}\n` +
        `• Location: Coimbatore\n\n` +
        `I would like to schedule a free site visit in Othakalmandapam / Coimbatore.`
      );
      whatsappCalcBtn.href = `https://wa.me/919842269100?text=${text}`;
    }
  }

  // Event Listeners for Area Slider
  if (areaSlider) {
    areaSlider.addEventListener('input', (e) => {
      currentArea = parseInt(e.target.value, 10);
      if (areaValBadge) areaValBadge.textContent = `${currentArea.toLocaleString()} Sq.Ft`;
      updateCalculation();
    });
  }

  // Event Listeners for Project Types
  typePills.forEach(pill => {
    pill.addEventListener('click', () => {
      typePills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentType = pill.getAttribute('data-type');
      updateCalculation();
    });
  });

  // Event Listeners for Material Grades
  gradeCards.forEach(card => {
    card.addEventListener('click', () => {
      gradeCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      currentGrade = card.getAttribute('data-grade');
      updateCalculation();
    });
  });

  // Event Listeners for Floors
  if (floorsSelect) {
    floorsSelect.addEventListener('change', (e) => {
      currentFloors = parseInt(e.target.value, 10);
      updateCalculation();
    });
  }

  // Initial Calculation Run
  updateCalculation();
}

/* ==========================================================================
   3. CAD BLUEPRINT / PHOTO-REALISTIC TOGGLE
   ========================================================================== */
function initBlueprintToggle() {
  const toggleBtns = document.querySelectorAll('.project-mode-toggle-btn');
  
  toggleBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const mediaWrapper = btn.closest('.project-media-wrapper');
      if (mediaWrapper) {
        mediaWrapper.classList.toggle('blueprint-mode');
        const isBlueprint = mediaWrapper.classList.contains('blueprint-mode');
        btn.innerHTML = isBlueprint 
          ? `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg> Realistic View` 
          : `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg> CAD Blueprint Mode`;
        
        showToast(isBlueprint ? 'Switched to Architectural Blueprint Mode' : 'Switched to Photorealistic Render View');
      }
    });
  });
}

/* ==========================================================================
   4. INTERACTIVE 4-STEP PROCESS ROADMAP
   ========================================================================== */
function initProcessStepper() {
  const stepCards = document.querySelectorAll('.step-card');
  
  stepCards.forEach(card => {
    card.addEventListener('click', () => {
      stepCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
    });
  });
}

/* ==========================================================================
   5. PROJECT SHOWCASE MODAL SYSTEM
   ========================================================================== */
const projectData = {
  independent_house: {
    title: "Independent House, Coimbatore",
    category: "Residential Construction",
    location: "Othakalmandapam & Coimbatore Suburbs",
    area: "2,450 Sq.Ft (G+1)",
    timeline: "7.5 Months (Delivered on schedule)",
    structure: "Framed RCC structure with Fe550D TMT Steel & M25 Grade Concrete",
    features: [
      "Vastu-compliant luxury 4-BHK contemporary layout",
      "Teak wood finish architectural louvers and sunshades",
      "Rainwater harvesting chamber and solar conduit provisioning",
      "Custom Italian marble flooring in living lounge & granite staircase",
      "Premium sanitary fittings and 3-phase concealed electrical layout"
    ],
    image: "assets/images/independent_house.png"
  },
  mixed_use: {
    title: "Mixed-Use Commercial & Residential Building, Coimbatore",
    category: "Commercial + Residential",
    location: "Coimbatore Prime Commercial Corridor",
    area: "6,800 Sq.Ft (G+3 Floors)",
    timeline: "11 Months (Full handover)",
    structure: "Heavy-duty commercial RCC column framework with post-tensioned slabs",
    features: [
      "Ground floor high-ceiling retail showroom with structural glass facade",
      "Floors 1-3 dedicated to modern 2-BHK & 3-BHK luxury rental apartments",
      "Dedicated lift shaft, fire exit stairwell, and basement parking",
      "Independent sub-metering, overhead commercial water storage & generator backup",
      "Energy-efficient LED architectural perimeter lighting"
    ],
    image: "assets/images/mixed_use_project.png"
  }
};

function initProjectModals() {
  const modal = document.getElementById('projectModal');
  const modalClose = document.getElementById('modalCloseBtn');
  const openButtons = document.querySelectorAll('.open-project-modal-btn');
  
  const modalImg = document.getElementById('modalProjectImg');
  const modalTitle = document.getElementById('modalProjectTitle');
  const modalCategory = document.getElementById('modalProjectCategory');
  const modalLocation = document.getElementById('modalProjectLocation');
  const modalArea = document.getElementById('modalProjectArea');
  const modalTimeline = document.getElementById('modalProjectTimeline');
  const modalStructure = document.getElementById('modalProjectStructure');
  const modalFeaturesList = document.getElementById('modalProjectFeatures');
  const modalWhatsappEnquiry = document.getElementById('modalWhatsappEnquiry');

  function openProject(projectId) {
    const data = projectData[projectId];
    if (!data) return;

    if (modalImg) modalImg.src = data.image;
    if (modalTitle) modalTitle.textContent = data.title;
    if (modalCategory) modalCategory.textContent = data.category;
    if (modalLocation) modalLocation.textContent = data.location;
    if (modalArea) modalArea.textContent = data.area;
    if (modalTimeline) modalTimeline.textContent = data.timeline;
    if (modalStructure) modalStructure.textContent = data.structure;

    if (modalFeaturesList) {
      modalFeaturesList.innerHTML = '';
      data.features.forEach(feat => {
        const li = document.createElement('li');
        li.className = 'service-feature-item';
        li.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg> ${feat}`;
        modalFeaturesList.appendChild(li);
      });
    }

    if (modalWhatsappEnquiry) {
      const text = encodeURIComponent(`Hi Sirpi Developers, I am interested in details regarding your "${data.title}" project. Could you share more information and pricing details?`);
      modalWhatsappEnquiry.href = `https://wa.me/919842269100?text=${text}`;
    }

    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal() {
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  openButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const projectId = btn.getAttribute('data-project');
      openProject(projectId);
    });
  });

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }
}

/* ==========================================================================
   6. CONTACT FORM VALIDATION & WHATSAPP SYNC
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contactQuoteForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('formName')?.value.trim();
    const phone = document.getElementById('formPhone')?.value.trim();
    const service = document.getElementById('formService')?.value;
    const location = document.getElementById('formLocation')?.value.trim() || 'Coimbatore';
    const message = document.getElementById('formMessage')?.value.trim();

    if (!name || !phone) {
      showToast('Please fill in your name and phone number.', 'error');
      return;
    }

    // Construct WhatsApp message
    const waText = encodeURIComponent(
      `*New Construction Enquiry - Sirpi Developers*\n` +
      `👤 *Name:* ${name}\n` +
      `📞 *Phone:* ${phone}\n` +
      `🏗️ *Service:* ${service}\n` +
      `📍 *Location:* ${location}\n` +
      `💬 *Requirements:* ${message || 'Looking for site visit & quotation'}`
    );

    // Provide instant feedback
    showToast('Enquiry received! Connecting to Sirpi Developers on WhatsApp...');
    
    setTimeout(() => {
      window.open(`https://wa.me/919842269100?text=${waText}`, '_blank');
      form.reset();
    }, 800);
  });
}

/* ==========================================================================
   7. ANIMATED STAT COUNTERS
   ========================================================================== */
function initStatCounters() {
  const counters = document.querySelectorAll('.stat-counter');
  let animated = false;

  function runCounters() {
    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'), 10);
      const duration = 2000;
      const step = Math.ceil(target / (duration / 25));
      let current = 0;

      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          counter.textContent = target;
          clearInterval(timer);
        } else {
          counter.textContent = current;
        }
      }, 25);
    });
  }

  window.addEventListener('scroll', () => {
    if (!animated && window.scrollY > 200) {
      animated = true;
      runCounters();
    }
  });

  // Trigger on initial page load if already scrolled
  if (window.scrollY > 200) {
    animated = true;
    runCounters();
  }
}

/* ==========================================================================
   8. TOAST NOTIFICATION UTILITY
   ========================================================================== */
function showToast(message, type = 'success') {
  let toast = document.getElementById('globalToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'globalToast';
    toast.className = 'toast-notification';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${type === 'error' ? '#ef4444' : '#f59e0b'}" stroke-width="2">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
    <span>${message}</span>
  `;

  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3800);
}
