// main.js — navigation toggle, form validation, small animations
document.addEventListener('DOMContentLoaded', function() {

  // set current year in footer spans
  const y = new Date().getFullYear();
  ['year','year-2','year-3','year-4'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = y;
  });

  // Mobile menu toggle (simple)
  const menuToggle = document.getElementById('menu-toggle');
  const nav = document.getElementById('main-nav');
  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      if (!nav) return;
      const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', String(!expanded));
      nav.style.display = expanded ? '' : 'flex';
      nav.style.flexDirection = 'column';
      nav.style.gap = '12px';
      nav.style.background = 'white';
      nav.style.padding = '12px';
      nav.style.position = 'absolute';
      nav.style.right = '20px';
      nav.style.top = '64px';
      nav.style.borderRadius = '10px';
      nav.style.boxShadow = '0 6px 20px rgba(0,0,0,0.08)';
    });
  }

  // Simple form handling (Contact page)
  const form = document.getElementById('contact-form');
  const resultBox = document.getElementById('form-result');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const address = form.address.value.trim();

      // minimal validation
      if (!name || !email || !address) {
        resultBox.textContent = 'Please fill in the required fields (name, email, address).';
        resultBox.style.color = 'crimson';
        return;
      }

      // Simulate sending — replace with AJAX/Fetch to your backend endpoint
      const data = {
        name, email, studentId: form.studentId.value, address,
        plan: form.plan.value, startDate: form.startDate.value, message: form.message.value
      };

      // show success
      resultBox.style.color = 'green';
      resultBox.textContent = 'Thanks! Your request has been received. We will email you shortly.';

      // reset the form after short delay
      setTimeout(()=> form.reset(), 800);

      // For debugging/development we log to console
      console.log('Contact request', data);
    });
  }

  // Small reveal on scroll using IntersectionObserver
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  // attach to elements with .reveal class
  document.querySelectorAll('.reveal').forEach(el => {
    observer.observe(el);
  });

});
