// ==========================================
// FORMA LABS — BRAND GUIDELINES MOTION SYSTEM
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  // 1. SCROLL PROGRESS BAR
  const progressBar = document.querySelector('.scroll-progress');
  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight > 0 && progressBar) {
      const progress = (window.pageYOffset / totalHeight) * 100;
      progressBar.style.width = `${progress}%`;
    }
  });

  // 2. KINETIC CURSOR GLOW (SMOOTH LERP)
  const cursorGlow = document.querySelector('.cursor-glow');
  let mouseX = -500, mouseY = -500;
  let cursorX = -500, cursorY = -500;

  if (cursorGlow && window.innerWidth > 768) {
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    const animateCursor = () => {
      cursorX += (mouseX - cursorX) * 0.15;
      cursorY += (mouseY - cursorY) * 0.15;
      cursorGlow.style.transform = `translate(${cursorX - 140}px, ${cursorY - 140}px)`;
      requestAnimationFrame(animateCursor);
    };
    animateCursor();

    // Hover expand on interactive elements
    const interactiveElements = document.querySelectorAll('a, button, article, .cube, .shape-card, .pill-row span, .logo-dark, .logo-light');
    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', () => cursorGlow.classList.add('is-hovering'));
      el.addEventListener('mouseleave', () => cursorGlow.classList.remove('is-hovering'));
    });
  }

  // 3. SCROLL REVEAL (INTERSECTION OBSERVER)
  const revealSections = document.querySelectorAll('.section, .cover');
  const observerOptions = {
    root: null,
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };

  const sectionObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealSections.forEach((sec) => sectionObserver.observe(sec));

  // 4. HERO 3D PARALLAX EFFECT
  const coverSection = document.querySelector('.cover');
  const coverArt = document.querySelector('.cover-art');
  const cube = document.querySelector('.cube');

  if (coverSection && coverArt && cube && window.innerWidth > 768) {
    coverSection.addEventListener('mousemove', (e) => {
      const rect = coverSection.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      coverArt.style.transform = `translateY(-50%) translate3d(${x * 30}px, ${y * 30}px, 0) rotate(${x * 8}deg)`;
      cube.style.transform = `rotate(${30 + x * 20}deg) skewY(${-7 + y * 10}deg) translate3d(${x * -25}px, ${y * -25}px, 20px)`;
    });

    coverSection.addEventListener('mouseleave', () => {
      coverArt.style.transform = 'translateY(-50%) translate3d(0, 0, 0) rotate(0deg)';
      cube.style.transform = 'rotate(30deg) skewY(-7deg)';
    });
  }

  // 5. COLOR SWATCHES INTERACTIVE COPY WITH TOAST
  const toast = document.querySelector('.copy-toast');
  const swatches = document.querySelectorAll('.swatches article');

  const hexMap = {
    ink: '#17151E',
    acid: '#D9FF4C',
    pink: '#FF4FA3',
    blue: '#6276FF',
    orange: '#FF7043',
    paper: '#F6F3ED'
  };

  swatches.forEach((card) => {
    // Find class that matches color
    let hexValue = '#17151E';
    for (const key in hexMap) {
      if (card.classList.contains(key)) {
        hexValue = hexMap[key];
        break;
      }
    }

    card.setAttribute('title', `Copiar ${hexValue}`);

    card.addEventListener('click', () => {
      navigator.clipboard.writeText(hexValue).then(() => {
        // Visual feedback on card
        const small = card.querySelector('small');
        const origText = small ? small.textContent : hexValue;
        if (small) small.textContent = '¡COPIADO!';

        // Toast feedback
        if (toast) {
          toast.textContent = `✓ ${hexValue} COPIADO AL PORTAPAPELES`;
          toast.classList.add('show');
          setTimeout(() => toast.classList.remove('show'), 2200);
        }

        setTimeout(() => {
          if (small) small.textContent = origText;
        }, 1500);
      });
    });
  });

  // 6. 3D TILT ON LOGO CARDS
  const logoCards = document.querySelectorAll('.logo-dark, .logo-light');
  logoCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(600px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(600px) rotateY(0deg) rotateX(0deg) translateY(0)';
    });
  });

  // 7. INTERACTIVE RETÍCULA GRID
  const gridCard = document.querySelector('.grid-card');
  const tinyGrid = document.querySelector('.tiny-grid');
  if (gridCard && tinyGrid) {
    gridCard.addEventListener('mousemove', (e) => {
      const rect = gridCard.getBoundingClientRect();
      const x = Math.round((e.clientX - rect.left) / 10);
      const y = Math.round((e.clientY - rect.top) / 10);
      tinyGrid.style.backgroundPosition = `${x}px ${y}px`;
    });
  }
});
