const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reduceMotion) {
  const cursor = document.querySelector('.cursor-glow');
  window.addEventListener('pointermove', ({ clientX, clientY }) => {
    cursor.style.transform = `translate(${clientX - 110}px, ${clientY - 110}px)`;
  });

  const visual = document.querySelector('.hero-visual');
  const cube = document.querySelector('.cube');
  visual.addEventListener('pointermove', (event) => {
    const box = visual.getBoundingClientRect();
    const x = (event.clientX - box.left) / box.width - .5;
    const y = (event.clientY - box.top) / box.height - .5;
    cube.style.transform = `translate(${x * 22}px, ${y * 22}px) rotate(${30 + x * 12}deg) skewY(-7deg)`;
    visual.style.transform = `rotate(${x * 2}deg)`;
  });
  visual.addEventListener('pointerleave', () => {
    cube.style.transform = '';
    visual.style.transform = '';
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('is-visible');
    });
  }, { threshold: .16 });
  document.querySelectorAll('.reveal-section, .step-card').forEach((item, index) => {
    item.style.transitionDelay = `${index % 3 * 100}ms`;
    observer.observe(item);
  });

  window.addEventListener('scroll', () => {
    const progress = Math.min(window.scrollY / 700, 1);
    document.documentElement.style.setProperty('--hero-shift', `${progress * -100}px`);
    const pageProgress = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight) * 100;
    document.documentElement.style.setProperty('--scroll-progress', `${pageProgress}%`);
  }, { passive: true });

  document.querySelectorAll('.button, .nav-cta').forEach((button) => {
    button.addEventListener('pointermove', (event) => {
      const box = button.getBoundingClientRect();
      const x = (event.clientX - box.left) / box.width - .5;
      const y = (event.clientY - box.top) / box.height - .5;
      button.style.translate = `${x * 5}px ${y * 4}px`;
    });
    button.addEventListener('pointerleave', () => { button.style.translate = ''; });
  });
}
