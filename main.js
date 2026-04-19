/* ── Nav scroll behavior ─────────────────────────────────── */
(function () {
  const nav = document.querySelector('.nav');
  if (!nav) return;

  function updateNav() {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  }

  updateNav();
  window.addEventListener('scroll', updateNav, { passive: true });

  /* Mobile toggle */
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');

  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open);
      toggle.querySelectorAll('span')[0].style.transform = open ? 'translateY(6.5px) rotate(45deg)' : '';
      toggle.querySelectorAll('span')[1].style.opacity = open ? '0' : '';
      toggle.querySelectorAll('span')[2].style.transform = open ? 'translateY(-6.5px) rotate(-45deg)' : '';
    });

    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        links.classList.remove('open');
        toggle.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      });
    });
  }

  /* Active nav link */
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
})();

/* ── Scroll reveal ───────────────────────────────────────── */
(function () {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  items.forEach(el => io.observe(el));
})();

/* ── Contact form ────────────────────────────────────────── */
(function () {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const btn = form.querySelector('[type="submit"]');
    const note = form.querySelector('.form-note');
    const origText = btn.textContent;

    btn.disabled = true;
    btn.textContent = 'Sending…';

    const data = Object.fromEntries(new FormData(form));

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(data)
      });

      const json = await res.json();

      if (res.ok && json.success) {
        btn.textContent = 'Message sent ✓';
        btn.style.background = '#2d6a4f';
        if (note) {
          note.textContent = "Thanks — we'll be in touch within one business day.";
          note.style.color = '#2d6a4f';
        }
        form.reset();
        setTimeout(() => {
          btn.textContent = origText;
          btn.disabled = false;
          btn.style.background = '';
          if (note) {
            note.textContent = 'We respond to all inquiries within one business day.';
            note.style.color = '';
          }
        }, 5000);
      } else {
        throw new Error(json.message || 'Submission failed');
      }
    } catch (err) {
      btn.textContent = 'Something went wrong — please try again';
      btn.style.background = '#c0392b';
      btn.disabled = false;
      setTimeout(() => {
        btn.textContent = origText;
        btn.style.background = '';
      }, 4000);
    }
  });
})();
