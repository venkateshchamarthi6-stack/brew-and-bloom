/**
 * BREW & BLOOM — Premium Café Interactive Scripts
 * Provides silky-smooth UI interactions, menu filtering, modals, and toasts.
 */

document.addEventListener('DOMContentLoaded', () => {

  // --- 1. Sticky Navbar & Active Link Highlight on Scroll ---
  const navbar = document.getElementById('navbar');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links .nav-link');

  const handleScroll = () => {
    // Add scrolled class for shadow/background density
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // ScrollSpy: highlight active navigation link
    const scrollY = window.pageYOffset;

    sections.forEach((current) => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // --- 2. Mobile Menu Drawer Toggle ---
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  const toggleMobileMenu = () => {
    const isOpen = mobileDrawer.classList.toggle('open');
    mobileMenuBtn.classList.toggle('active', isOpen);
    mobileMenuBtn.setAttribute('aria-expanded', isOpen);
  };

  if (mobileMenuBtn && mobileDrawer) {
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);

    // Close mobile drawer when any link is clicked
    mobileLinks.forEach((link) => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
        mobileMenuBtn.classList.remove('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // --- 3. Signature Menu Category Filtering ---
  const filterBtns = document.querySelectorAll('.menu-filter-btn');
  const menuCards = document.querySelectorAll('.menu-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      // Update active tab button
      filterBtns.forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filterValue = btn.getAttribute('data-filter');

      // Filter cards with smooth opacity transition
      menuCards.forEach((card) => {
        const category = card.getAttribute('data-category');

        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });

  // --- 4. Quick Order Toast Notification ---
  const orderToast = document.getElementById('orderToast');
  const toastMessage = document.getElementById('toastMessage');
  const orderButtons = document.querySelectorAll('.btn-order-direct');
  let toastTimeout;

  const showToast = (item, price) => {
    if (!orderToast) return;
    toastMessage.textContent = `Selected: ${item} (₹${price}) — added to counter inquiry!`;
    orderToast.classList.add('visible');

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      orderToast.classList.remove('visible');
    }, 3800);
  };

  orderButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const item = btn.getAttribute('data-item') || 'Signature Brew';
      const price = btn.getAttribute('data-price') || '149';
      showToast(item, price);
    });
  });

  // --- 5. Full Menu Modal Dialog ---
  const openMenuModalBtn = document.getElementById('openMenuModalBtn');
  const closeMenuModalBtn = document.getElementById('closeMenuModalBtn');
  const closeMenuModalBtn2 = document.getElementById('closeMenuModalBtn2');
  const menuModal = document.getElementById('menuModal');

  const openModal = () => {
    if (!menuModal) return;
    menuModal.classList.add('open');
    menuModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    if (!menuModal) return;
    menuModal.classList.remove('open');
    menuModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  if (openMenuModalBtn) openMenuModalBtn.addEventListener('click', openModal);
  if (closeMenuModalBtn) closeMenuModalBtn.addEventListener('click', closeModal);
  if (closeMenuModalBtn2) closeMenuModalBtn2.addEventListener('click', closeModal);

  // Close modal when clicking backdrop
  if (menuModal) {
    menuModal.addEventListener('click', (e) => {
      if (e.target === menuModal) closeModal();
    });
  }

  // Close modal with ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menuModal && menuModal.classList.contains('open')) {
      closeModal();
    }
  });

  // --- 6. Reservation Form Interactive Submission ---
  const reservationForm = document.getElementById('reservationForm');
  const formSuccess = document.getElementById('formSuccess');
  const reserveSubmitBtn = document.getElementById('reserveSubmitBtn');
  const dateInput = document.getElementById('resDate');

  // Pre-fill tomorrow's date for user convenience
  if (dateInput) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yyyy = tomorrow.getFullYear();
    const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const dd = String(tomorrow.getDate()).padStart(2, '0');
    dateInput.value = `${yyyy}-${mm}-${dd}`;
    dateInput.min = `${yyyy}-${mm}-${dd}`;
  }

  if (reservationForm) {
    reservationForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const originalText = reserveSubmitBtn.innerHTML;
      reserveSubmitBtn.disabled = true;
      reserveSubmitBtn.innerHTML = `<span>Checking Availability...</span>`;

      setTimeout(() => {
        reserveSubmitBtn.innerHTML = `<span>Confirmed!</span>`;
        if (formSuccess) {
          formSuccess.classList.add('visible');
          formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        reservationForm.reset();
        
        // Restore button state after a bit
        setTimeout(() => {
          reserveSubmitBtn.disabled = false;
          reserveSubmitBtn.innerHTML = originalText;
        }, 4000);
      }, 900);
    });
  }

  // --- 7. Newsletter Subscription Form ---
  const newsletterForm = document.getElementById('newsletterForm');
  const newsletterSuccess = document.getElementById('newsletterSuccess');

  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = newsletterForm.querySelector('input[type="email"]');
      if (input && input.value.trim() !== '') {
        if (newsletterSuccess) newsletterSuccess.classList.add('visible');
        newsletterForm.reset();
        setTimeout(() => {
          if (newsletterSuccess) newsletterSuccess.classList.remove('visible');
        }, 5000);
      }
    });
  }

  // --- 8. Smooth scrolling for internal anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

});
