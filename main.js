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

  // Scroll Reveal Animation
  const revealElements = document.querySelectorAll('.reveal-up, .reveal-text');
  if (revealElements.length > 0 && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target); // Only animate once
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
  }

  // Parallax Effect for About Images
  const parallaxItems = document.querySelectorAll('.parallax-img');
  if (parallaxItems.length > 0) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      const windowHeight = window.innerHeight;
      
      requestAnimationFrame(() => {
        parallaxItems.forEach(item => {
          const speed = parseFloat(item.getAttribute('data-speed')) || 0;
          const rect = item.getBoundingClientRect();
          
          // Calculate offset only when item is roughly in viewport or approaching
          if (rect.top < windowHeight && rect.bottom > 0) {
            const centerY = windowHeight / 2;
            const itemCenter = rect.top + (rect.height / 2);
            const offset = (itemCenter - centerY) * speed;
            
            item.style.transform = `translateY(${offset}px)`;
          }
        });
      });
    });
  }

  // News Hover Effect
  const newsItems = document.querySelectorAll('.news-item');
  const newsPreview = document.getElementById('news-preview-img');

  if (newsItems.length > 0 && newsPreview) {
    newsItems.forEach(item => {
      item.addEventListener('mouseenter', () => {
        const newSrc = item.getAttribute('data-img');
        if (!newSrc || newsPreview.getAttribute('src').includes(newSrc)) return;

        // Simple fade transition
        newsPreview.style.opacity = 0;
        newsPreview.style.transform = 'scale(1.05)'; // slight zoom out effect
        
        setTimeout(() => {
          newsPreview.src = newSrc;
          newsPreview.onload = () => {
            newsPreview.style.opacity = 1;
            newsPreview.style.transform = 'scale(1)';
          };
          // Fallback if cached and onload doesn't fire immediately
          setTimeout(() => {
            newsPreview.style.opacity = 1;
            newsPreview.style.transform = 'scale(1)';
          }, 50);
        }, 200);
      });
    });
  }

  // Access Section Toggle
  const toggleBtns = document.querySelectorAll('.access-toggle-btn');
  const toggleBg = document.querySelector('.access-toggle-bg');
  const accessViews = document.querySelectorAll('.access-content');

  if (toggleBtns.length > 0 && toggleBg) {
    toggleBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetView = btn.getAttribute('data-view');
        
        // Update buttons state
        toggleBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Update pill position
        toggleBg.setAttribute('data-state', targetView);
        
        // Switch content view
        accessViews.forEach(view => {
          if (view.id === `view-${targetView}`) {
            view.style.display = 'none'; // Reset for fade animation
            view.classList.add('active');
            // Force reflow to trigger animation
            void view.offsetWidth;
            view.style.display = (targetView === 'access') ? 'grid' : 'flex';
          } else {
            view.classList.remove('active');
            view.style.display = 'none';
          }
        });
      });
    });
  }
});
