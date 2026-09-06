// ==========================================
// FORMA LABS — KINETIC SCROLL & MOTION ENGINE
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  // 1. SCROLL PROGRESS & ACTIVE SECTION HUD
  const progressBar = document.querySelector('.scroll-progress');
  const hudText = document.querySelector('.scroll-hud-text');
  const sections = document.querySelectorAll('main > section');

  const sectionNames = {
    '': '00 / INICIO',
    'essence': '01 / ESENCIA',
    'manifesto': '02 / VOZ',
    'logo': '03 / MARCA',
    'colors': '04 / COLOR',
    'type': '05 / TIPOGRAFÍA',
    'system': '06 / SISTEMA GRÁFICO',
    'imagery': '07 / IMAGEN',
    'closing': '08 / CIERRE'
  };

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

    const interactiveElements = document.querySelectorAll('a, button, article, .cube, .shape-card, .pill-row span, .logo-dark, .logo-light, .type-example');
    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', () => cursorGlow.classList.add('is-hovering'));
      el.addEventListener('mouseleave', () => cursorGlow.classList.remove('is-hovering'));
    });
  }

  // 3. CONTINUOUS SCROLL PARALLAX ENGINE (60FPS RAF)
  let currentScroll = window.pageYOffset;
  let targetScroll = window.pageYOffset;
  let isScrolling = false;

  const coverArt = document.querySelector('.cover-art');
  const coverCube = document.querySelector('.cube');
  const coverHeading = document.querySelector('.cover h1');
  const doodleArrow = document.querySelector('.cover .kicker');

  // Parallax elements with custom speeds
  const parallaxDoodles = [
    { el: document.querySelector('.essence'), speed: 0.08, prop: 'translateY' },
    { el: document.querySelector('.manifesto:before'), speed: -0.15, prop: 'translateY' },
    { el: document.querySelector('.logo:after'), speed: 0.05, prop: 'rotate' },
    { el: document.querySelector('.colors:before'), speed: -0.06, prop: 'translateY' },
    { el: document.querySelector('.type:before'), speed: 0.12, prop: 'translateY' },
    { el: document.querySelector('.system:before'), speed: -0.08, prop: 'translateY' },
    { el: document.querySelector('.closing:after'), speed: 0.04, prop: 'rotate' }
  ];

  const updateScrollMotion = () => {
    targetScroll = window.pageYOffset;
    currentScroll += (targetScroll - currentScroll) * 0.12;
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;

    // Update Progress Bar
    if (totalHeight > 0 && progressBar) {
      const progress = (targetScroll / totalHeight) * 100;
      progressBar.style.width = `${progress}%`;
      document.documentElement.style.setProperty('--scroll-pct', progress / 100);
    }

    // Hero Parallax while in viewport
    if (currentScroll < window.innerHeight && coverArt && coverCube) {
      coverArt.style.transform = `translateY(calc(-50% + ${currentScroll * 0.22}px)) rotate(${currentScroll * 0.04}deg)`;
      coverCube.style.transform = `rotate(${30 + currentScroll * 0.08}deg) skewY(-7deg) translateY(${currentScroll * -0.15}px)`;
      if (coverHeading) coverHeading.style.transform = `translateY(${currentScroll * 0.18}px)`;
    }

    // Determine current active section for HUD
    let activeSectionName = '00 / INICIO';
    sections.forEach((sec) => {
      const rect = sec.getBoundingClientRect();
      if (rect.top <= window.innerHeight * 0.45 && rect.bottom >= window.innerHeight * 0.2) {
        const id = sec.id || (sec.classList.contains('manifesto') ? 'manifesto' : sec.classList.contains('logo') ? 'logo' : sec.classList.contains('colors') ? 'colors' : sec.classList.contains('type') ? 'type' : sec.classList.contains('system') ? 'system' : sec.classList.contains('imagery') ? 'imagery' : sec.classList.contains('closing') ? 'closing' : '');
        if (sectionNames[id]) activeSectionName = sectionNames[id];
      }
    });

    if (hudText && hudText.textContent !== activeSectionName) {
      hudText.textContent = activeSectionName;
    }

    requestAnimationFrame(updateScrollMotion);
  };

  requestAnimationFrame(updateScrollMotion);

  // 4. SCROLL REVEAL (INTERSECTION OBSERVER)
  const revealBlocks = document.querySelectorAll('.section-reveal-block, .section');
  const observerOptions = {
    root: null,
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  }, observerOptions);

  revealBlocks.forEach((block) => sectionObserver.observe(block));

  // 5. COLOR SWATCHES INTERACTIVE CLICK-TO-COPY & SOUND PULSE
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
    let hexValue = '#17151E';
    for (const key in hexMap) {
      if (card.classList.contains(key)) {
        hexValue = hexMap[key];
        break;
      }
    }

    card.setAttribute('title', `Clic para copiar ${hexValue}`);

    card.addEventListener('click', () => {
      navigator.clipboard.writeText(hexValue).then(() => {
        const small = card.querySelector('small');
        const origText = small ? small.textContent : hexValue;
        if (small) {
          small.textContent = '¡COPIADO!';
          small.style.fontWeight = '700';
          small.style.transform = 'scale(1.2)';
        }

        if (toast) {
          toast.textContent = `✓ ${hexValue} COPIADO AL PORTAPAPELES`;
          toast.classList.add('show');
          setTimeout(() => toast.classList.remove('show'), 2200);
        }

        setTimeout(() => {
          if (small) {
            small.textContent = origText;
            small.style.fontWeight = '';
            small.style.transform = '';
          }
        }, 1400);
      });
    });
  });

  // 6. 3D TILT EFFECT ON CARDS
  const tiltCards = document.querySelectorAll('.logo-dark, .logo-light, .shape-card');
  tiltCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(800px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // 7. INTERACTIVE RETÍCULA GRID
  const gridCard = document.querySelector('.grid-card');
  const tinyGrid = document.querySelector('.tiny-grid');
  if (gridCard && tinyGrid) {
    gridCard.addEventListener('mousemove', (e) => {
      const rect = gridCard.getBoundingClientRect();
      const x = Math.round((e.clientX - rect.left) / 8);
      const y = Math.round((e.clientY - rect.top) / 8);
      tinyGrid.style.backgroundPosition = `${x}px ${y}px`;
    });
  }

  // 8. INTERACTIVE TYPE SPECIMEN WEIGHT SLIDER
  const typeExample = document.querySelector('.type-example strong');
  if (typeExample) {
    let weights = [400, 500, 600, 700];
    let currentWeightIdx = 3;
    typeExample.style.cursor = 'pointer';
    typeExample.setAttribute('title', 'Haz clic para cambiar el peso tipográfico');
    typeExample.addEventListener('click', () => {
      currentWeightIdx = (currentWeightIdx + 1) % weights.length;
      typeExample.style.fontWeight = weights[currentWeightIdx];
      typeExample.style.letterSpacing = currentWeightIdx === 3 ? '-0.07em' : '-0.02em';
    });
  }
});
