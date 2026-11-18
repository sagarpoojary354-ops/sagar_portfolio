/**
 * ==========================================================================
 * SAGAR - PERSONAL DEVELOPER PORTFOLIO JAVASCRIPT
 * First-Year MCA Student | Poornaprajna Institute of Management (PIM), Udupi
 * Pure Vanilla JavaScript (ES6+)
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // --------------------------------------------------------------------------
  // 1. THEME SWITCHER (Dark Default with Light Mode Toggle)
  // --------------------------------------------------------------------------
  const themeToggleBtn = document.getElementById('theme-toggle');
  const htmlRoot = document.documentElement;

  // Read stored preference, fallback to 'dark' as default per specification
  const currentTheme = localStorage.getItem('sagar-portfolio-theme') || 'dark';
  setTheme(currentTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const activeTheme = htmlRoot.getAttribute('data-theme') || 'dark';
      const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
      setTheme(newTheme);
      localStorage.setItem('sagar-portfolio-theme', newTheme);
    });
  }

  function setTheme(theme) {
    htmlRoot.setAttribute('data-theme', theme);
    if (themeToggleBtn) {
      themeToggleBtn.setAttribute(
        'aria-label',
        theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'
      );
    }
  }

  // --------------------------------------------------------------------------
  // 2. STICKY NAVBAR & SCROLL BEHAVIOR
  // --------------------------------------------------------------------------
  const siteHeader = document.querySelector('.site-header');
  const backToTopBtn = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Header blur / border intensity
    if (scrollY > 30) {
      siteHeader?.classList.add('scrolled');
    } else {
      siteHeader?.classList.remove('scrolled');
    }

    // Back to top button visibility
    if (scrollY > 400) {
      backToTopBtn?.style.setProperty('display', 'flex');
    } else {
      backToTopBtn?.style.setProperty('display', 'none');
    }
  }, { passive: true });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --------------------------------------------------------------------------
  // 3. ACTIVE SECTION HIGHLIGHTING (IntersectionObserver)
  // --------------------------------------------------------------------------
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-drawer-link');

  if ('IntersectionObserver' in window && sections.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const currentId = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${currentId}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach(section => sectionObserver.observe(section));
  }

  // --------------------------------------------------------------------------
  // 4. MOBILE DRAWER NAVIGATION
  // --------------------------------------------------------------------------
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileDrawerLinks = document.querySelectorAll('.mobile-drawer-link');

  function openMobileMenu() {
    mobileToggle?.classList.add('open');
    mobileToggle?.setAttribute('aria-expanded', 'true');
    mobileDrawer?.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    mobileToggle?.classList.remove('open');
    mobileToggle?.setAttribute('aria-expanded', 'false');
    mobileDrawer?.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.contains('open');
      if (isOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    mobileDrawerLinks.forEach(link => {
      link.addEventListener('click', closeMobileMenu);
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileDrawer.classList.contains('open')) {
        closeMobileMenu();
      }
    });
  }

  // --------------------------------------------------------------------------
  // 5. PROJECT & LEARNING JOURNEY FILTERING TABS
  // --------------------------------------------------------------------------
  const filterBtns = document.querySelectorAll('.filter-btn');
  const expCards = document.querySelectorAll('.exp-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      expCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (filterValue === 'all' || cardCategory === filterValue) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // --------------------------------------------------------------------------
  // 6. COPY TO CLIPBOARD WITH TOAST NOTIFICATION
  // --------------------------------------------------------------------------
  const copyBtns = document.querySelectorAll('.copy-btn');
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toast-msg');
  let toastTimer = null;

  function showToast(message) {
    if (!toast || !toastMessage) return;
    toastMessage.textContent = message;
    toast.classList.add('show');

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  copyBtns.forEach(btn => {
    btn.addEventListener('click', async () => {
      const textToCopy = btn.getAttribute('data-copy');
      if (!textToCopy) return;

      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(textToCopy);
        } else {
          // Fallback for older contexts
          const textArea = document.createElement('textarea');
          textArea.value = textToCopy;
          textArea.style.position = 'fixed';
          textArea.style.left = '-999999px';
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          document.execCommand('copy');
          textArea.remove();
        }
        showToast(`Copied "${textToCopy}" to clipboard!`);
      } catch (err) {
        showToast(`Unable to copy: ${textToCopy}`);
      }
    });
  });

  // --------------------------------------------------------------------------
  // 7. RESUME MODAL & PRINT HANDLER
  // --------------------------------------------------------------------------
  const resumeModal = document.getElementById('resume-modal');
  const openResumeBtns = document.querySelectorAll('.open-resume-btn');
  const closeResumeBtn = document.getElementById('close-resume-modal');
  const printResumeBtn = document.getElementById('print-resume-btn');

  function openResume() {
    if (resumeModal) {
      resumeModal.classList.add('open');
      document.body.style.overflow = 'hidden';
      closeResumeBtn?.focus();
    }
  }

  function closeResume() {
    if (resumeModal) {
      resumeModal.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  openResumeBtns.forEach(btn => btn.addEventListener('click', openResume));
  closeResumeBtn?.addEventListener('click', closeResume);

  if (resumeModal) {
    resumeModal.addEventListener('click', (e) => {
      if (e.target === resumeModal) {
        closeResume();
      }
    });
  }

  if (printResumeBtn) {
    printResumeBtn.addEventListener('click', () => {
      window.print();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && resumeModal?.classList.contains('open')) {
      closeResume();
    }
  });

  // --------------------------------------------------------------------------
  // 8. CONTACT MESSAGE FORM HANDLER
  // --------------------------------------------------------------------------
  const contactForm = document.getElementById('portfolio-contact-form');
  const formStatus = document.getElementById('form-status');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('sender-name');
      const emailInput = document.getElementById('sender-email');
      const subjectInput = document.getElementById('sender-subject');
      const messageInput = document.getElementById('sender-message');

      const name = nameInput?.value.trim();
      const email = emailInput?.value.trim();
      const subject = subjectInput?.value.trim() || 'Inquiry regarding MCA Developer Profile';
      const message = messageInput?.value.trim();

      if (!name || !email || !message) {
        if (formStatus) {
          formStatus.className = 'form-status-msg error';
          formStatus.textContent = 'Please fill out all required fields (Name, Email, and Message).';
        }
        return;
      }

      // Compose mailto link to Sagar's verified email
      const encodedSubject = encodeURIComponent(`[Portfolio Contact] ${subject} - from ${name}`);
      const encodedBody = encodeURIComponent(
        `Hello Sagar,\n\nMy name is ${name} (${email}).\n\nMessage:\n${message}\n\n---\nSent via Sagar's Developer Portfolio`
      );

      const mailtoUrl = `mailto:Sagarpoojary354@gmail.com?subject=${encodedSubject}&body=${encodedBody}`;

      if (formStatus) {
        formStatus.className = 'form-status-msg success';
        formStatus.textContent = 'Thank you! Launching your default email application to deliver your message to Sagar...';
      }

      // Open user's email client
      setTimeout(() => {
        window.location.href = mailtoUrl;
      }, 400);

      contactForm.reset();
    });
  }

  // --------------------------------------------------------------------------
  // 9. SUBTLE SCROLL REVEAL (Progressive Enhancement)
  // --------------------------------------------------------------------------
  const revealElements = document.querySelectorAll('.content-card, .lang-card, .exp-card, .trajectory-card');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
      el.style.opacity = '0.85';
      el.style.transform = 'translateY(8px)';
      el.style.transition = 'opacity 0.4s ease, transform 0.4s ease, border-color 0.25s ease';
      revealObserver.observe(el);
    });
  }
});
