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

});
