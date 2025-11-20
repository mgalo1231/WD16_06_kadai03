// Smooth spin-down on mouse leave for decorative images
document.addEventListener('DOMContentLoaded', () => {
  const images = document.querySelectorAll('.decor img');
  images.forEach((img) => {
    img.addEventListener('mouseenter', () => {
      img.classList.remove('spin-down');
    });
    img.addEventListener('mouseleave', () => {
      // restart spin-down animation
      img.classList.remove('spin-down');
      // force reflow to restart animation if it was running
      void img.offsetWidth;
      img.classList.add('spin-down');
    });
    img.addEventListener('animationend', (e) => {
      if (e.animationName === 'spin' && img.classList.contains('spin-down')) {
        img.classList.remove('spin-down');
      }
    });
  });

  const body = document.body;
  const hero = document.querySelector('.hero');
  const hamburger = document.querySelector('.hamburger');
  const pills = document.querySelector('.pills');

  const handleStickyState = () => {
    if (!hero) return;
    const shouldStick = window.scrollY > hero.offsetHeight * 0.1;
    if (shouldStick) {
      body.classList.add('is-sticky');
    } else {
      body.classList.remove('is-sticky', 'nav-open');
    }
  };
  handleStickyState();
  window.addEventListener('scroll', handleStickyState);

  if (hamburger && pills) {
    hamburger.addEventListener('click', () => {
      body.classList.toggle('nav-open');
    });
    pills.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        body.classList.remove('nav-open');
      });
    });
  }

  // Tab Switching Logic
  const folder = document.querySelector('.menu-folder');
  const tabs = document.querySelectorAll('.tab-btn');
  const contents = document.querySelectorAll('.menu-grid');

  if (folder && tabs.length > 0) {
    tabs.forEach(tab => {
      // Click to switch tab
      tab.addEventListener('click', () => {
        const target = tab.getAttribute('data-target');
        
        // Update active class on buttons
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        // Update folder background via data attribute
        folder.setAttribute('data-active', target);

        // Show relevant content
        contents.forEach(content => {
          if (content.id === `content-${target}`) {
            content.style.display = 'grid';
            content.classList.add('active');
          } else {
            content.style.display = 'none';
            content.classList.remove('active');
          }
        });
      });

      // Hover effect to peek background layer
      tab.addEventListener('mouseenter', () => {
        const target = tab.getAttribute('data-target');
        const currentActive = folder.getAttribute('data-active');
        
        // Only peek if not currently active
        if (target !== currentActive) {
          const targetBg = folder.querySelector(`.bg-${target}`);
          if (targetBg) {
            targetBg.classList.add('hover-peek');
          }
        }
      });

      tab.addEventListener('mouseleave', () => {
        const target = tab.getAttribute('data-target');
        const targetBg = folder.querySelector(`.bg-${target}`);
        if (targetBg) {
          targetBg.classList.remove('hover-peek');
        }
      });
    });
  }
});
