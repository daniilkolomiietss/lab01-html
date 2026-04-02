document.addEventListener('DOMContentLoaded', () => {
    initActiveNav();
    initMenuToggle();
    initThemeToggle();
    initScrollToTop();
    initDynamicYear();
    initAccordion();
    initFilters();
    initModal();
    initContactForm();
});

function initActiveNav() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-link');
  
  navLinks.forEach(link => {
    if (link.getAttribute('href').includes(currentPath) && currentPath !== '/') {
      link.classList.add('is-active');
    }
  });
}

function initMenuToggle() {
  const menuBtn = document.querySelector('.menu-btn');
  const menu = document.querySelector('.nav-list');

  if (!menuBtn || !menu) return;

  menuBtn.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('is-open');
    menuBtn.setAttribute('aria-expanded', isOpen);
  });
}

function initThemeToggle() {
  const themeBtn = document.querySelector('.theme-toggle');
  const savedTheme = localStorage.getItem('siteTheme');

  if (savedTheme === 'dark') {
    document.body.classList.add('theme-dark');
  }

  themeBtn?.addEventListener('click', () => {
    const isDark = document.body.classList.toggle('theme-dark');
    localStorage.setItem('siteTheme', isDark ? 'dark' : 'light');
  });
}

function initScrollToTop() {
  const btn = document.querySelector('.back-to-top');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      btn?.classList.add('is-visible');
    } else {
      btn?.classList.remove('is-visible');
    }
  });

  btn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

function initDynamicYear() {
  const yearSpan = document.querySelector('#current-year');
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();
}

function initAccordion() {
  const items = document.querySelectorAll('.accordion-item');

  items.forEach(item => {
    const trigger = item.querySelector('.accordion-trigger');
    trigger?.addEventListener('click', () => {
      items.forEach(i => i !== item && i.classList.remove('is-active'));
      item.classList.toggle('is-active');
    });
  });
}

function initFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.dataset.filter;
      
      cards.forEach(card => {
        const match = category === 'all' || card.dataset.category === category;
        card.hidden = !match;
      });
    });
  });
}

function initModal() {
  const openBtns = document.querySelectorAll('.open-modal');
  const modal = document.querySelector('.modal-overlay');
  const closeBtn = modal?.querySelector('.close-modal');

  if (!modal) return;

  openBtns.forEach(btn => {
    btn.addEventListener('click', () => modal.classList.add('is-open'));
  });

  closeBtn?.addEventListener('click', () => modal.classList.remove('is-open'));
  
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('is-open');
  });
}

function initContactForm() {
  const form = document.querySelector('#contact-form');
  if (!form) return;

  const textarea = form.querySelector('textarea');
  const counter = form.querySelector('.char-counter');
  const draftKey = 'contactDraft';

  textarea?.addEventListener('input', () => {
    if (counter) counter.textContent = `Символов: ${textarea.value.length}`;
    
    const formData = new FormData(form);
    localStorage.setItem(draftKey, JSON.stringify(Object.fromEntries(formData)));
  });

  const savedData = JSON.parse(localStorage.getItem(draftKey) || '{}');
  Object.keys(savedData).forEach(key => {
    const input = form.elements[key];
    if (input) input.value = savedData[key];
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (textarea.value.length < 10) {
      alert('Повідомлення занадто коротке!');
      return;
    }

    const data = Object.fromEntries(new FormData(form));
    console.log('Дані форми:', data);

    // Очистка после "отправки
    localStorage.removeItem(draftKey);
    form.reset();
    alert('Повідомлення відправлено!');
  });
}