/* ==========================================================================
   DeeDiva Beauty — Site Script
   Shared across all pages: mobile nav toggle + sticky header shadow.
   Home-page-only: testimonial carousel (safely no-ops on other pages).
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {

  /* ---- Mobile nav toggle ------------------------------------------------ */
  var navToggle = document.getElementById('nav-toggle');
  var navLinks = document.getElementById('nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      var isOpen = navLinks.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close menu when a link is tapped (mobile)
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---- Sticky header shadow on scroll ------------------------------------ */
  var header = document.querySelector('.site-header');
  if (header) {
    var applyScrollState = function () {
      if (window.scrollY > 8) {
        header.style.boxShadow = '0 6px 18px rgba(26,26,26,0.06)';
      } else {
        header.style.boxShadow = 'none';
      }
    };
    applyScrollState();
    window.addEventListener('scroll', applyScrollState, { passive: true });
  }

  /* ---- Testimonial carousel (Home page) ---------------------------------- */
  var slides = document.querySelectorAll('.testimonial-slide');
  var dots = document.querySelectorAll('.testimonial-dots button');
  if (slides.length && dots.length) {
    var current = 0;
    var interval;

    var showSlide = function (index) {
      slides[current].classList.remove('is-active');
      dots[current].classList.remove('is-active');
      dots[current].setAttribute('aria-selected', 'false');

      current = (index + slides.length) % slides.length;

      slides[current].classList.add('is-active');
      dots[current].classList.add('is-active');
      dots[current].setAttribute('aria-selected', 'true');
    };

    var startAutoplay = function () {
      interval = setInterval(function () { showSlide(current + 1); }, 6000);
    };
    var stopAutoplay = function () { clearInterval(interval); };

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        stopAutoplay();
        showSlide(i);
        startAutoplay();
      });
    });

    var section = document.querySelector('.testimonial-section');
    if (section) {
      section.addEventListener('mouseenter', stopAutoplay);
      section.addEventListener('mouseleave', startAutoplay);
    }

    startAutoplay();
  }

  /* ---- Portfolio filter + lightbox (Portfolio page) ----------------------- */
  var filterTabs = document.querySelectorAll('.filter-tab');
  var galleryTiles = document.querySelectorAll('.gallery-tile');

  if (filterTabs.length && galleryTiles.length) {
    filterTabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        filterTabs.forEach(function (t) { t.classList.remove('is-active'); });
        tab.classList.add('is-active');

        var filter = tab.getAttribute('data-filter');
        galleryTiles.forEach(function (tile) {
          var match = filter === 'all' || tile.getAttribute('data-category') === filter;
          tile.style.display = match ? '' : 'none';
        });
      });
    });
  }

  var lightbox = document.getElementById('lightbox');
  var lightboxTag = document.getElementById('lightbox-tag');
  var lightboxClose = document.getElementById('lightbox-close');

  if (lightbox && lightboxTag && galleryTiles.length) {
    var openLightbox = function (category) {
      lightboxTag.textContent = category.charAt(0).toUpperCase() + category.slice(1);
      lightbox.hidden = false;
      lightboxClose.focus();
    };
    var closeLightbox = function () { lightbox.hidden = true; };

    galleryTiles.forEach(function (tile) {
      tile.addEventListener('click', function () {
        openLightbox(tile.getAttribute('data-category') || '');
      });
    });

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !lightbox.hidden) closeLightbox();
    });
  }

  /* ---- Booking form -> WhatsApp (Contact page) ----------------------------- */
  var bookingForm = document.getElementById('booking-form');
  var formNote = document.getElementById('form-note');

  if (bookingForm) {
    bookingForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var name = document.getElementById('name').value.trim();
      var phone = document.getElementById('phone').value.trim();
      var service = document.getElementById('service').value;
      var date = document.getElementById('date').value;
      var location = document.getElementById('location').value.trim();
      var details = document.getElementById('details').value.trim();

      if (!name || !phone || !service) {
        if (formNote) formNote.textContent = 'Please fill in your name, phone number, and service before sending.';
        return;
      }

      var lines = [
        'Hi DeeDiva Beauty, I would like to make a booking request:',
        '',
        'Name: ' + name,
        'Phone: ' + phone,
        'Service: ' + service
      ];
      if (date) lines.push('Preferred date: ' + date);
      if (location) lines.push('Location: ' + location);
      if (details) lines.push('Details: ' + details);

      var message = encodeURIComponent(lines.join('\n'));
      var whatsappUrl = 'https://wa.me/2347074073883?text=' + message;

      if (formNote) formNote.textContent = 'Opening WhatsApp with your booking details…';
      window.open(whatsappUrl, '_blank', 'noopener');
    });
  }

});
