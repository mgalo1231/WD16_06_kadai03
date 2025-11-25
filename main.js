// Smooth spin-down on mouse leave for decorative images
document.addEventListener('DOMContentLoaded', () => {
  // Preloader hide on window load
  const preloader = document.getElementById('preloader');
  if (preloader) {
    const hide = () => preloader.classList.add('hide');
    // Prefer 'load' (images, fonts done). Fallback timeout to avoid being stuck.
    window.addEventListener('load', () => setTimeout(hide, 450));
    setTimeout(hide, 4500);
  }
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
  const contents = document.querySelectorAll('.menu-grid, .menu-drink-list');

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
          // Use flex for scrollable menu, grid for others
          if (content.classList.contains('menu-scrollable')) {
            content.style.display = 'flex';
            
            // Auto-scroll hint animation for scrollable menus
            setTimeout(() => {
              // Scroll right a bit
              content.scrollTo({ left: 200, behavior: 'smooth' });
              
              // Scroll back to start after a short delay
              setTimeout(() => {
                content.scrollTo({ left: 0, behavior: 'smooth' });
              }, 600);
            }, 300);
          } else if (content.classList.contains('menu-drink-list')) {
            content.style.display = 'flex';
            
            // Auto-scroll hint animation for drink menu
            setTimeout(() => {
              content.scrollTo({ left: 150, behavior: 'smooth' });
              setTimeout(() => {
                content.scrollTo({ left: 0, behavior: 'smooth' });
              }, 600);
            }, 300);
          } else {
            content.style.display = 'grid';
          }
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

  // ==========================================
  // Message Board Logic (Retro Beeper)
  // ==========================================
  const beeperInput = document.getElementById('beeperInput');
  const btnSend = document.getElementById('btnSend');
  const messageWall = document.getElementById('messageWall');

  if (beeperInput && btnSend && messageWall) {
    
    // 1. Drag and Drop Logic
    let activeCard = null;
    let initialX, initialY;
    let xOffset = 0, yOffset = 0;

    // Initialize drag for existing cards
    document.querySelectorAll('.note-card').forEach(card => {
      initDrag(card);
    });

    function initDrag(card) {
      card.addEventListener('mousedown', dragStart);
      // Touch support
      card.addEventListener('touchstart', dragStart, {passive: false});
    }

    function dragStart(e) {
      // Prevent default to stop text selection etc., but allow touch scroll if not dragging card?
      // e.preventDefault(); 

      activeCard = e.currentTarget;
      
      const rect = activeCard.getBoundingClientRect();
      
      // Store offset from the card's top-left corner
      if (e.type === 'touchstart') {
        xOffset = e.touches[0].clientX - rect.left;
        yOffset = e.touches[0].clientY - rect.top;
      } else {
        xOffset = e.clientX - rect.left;
        yOffset = e.clientY - rect.top;
      }

      // Add listeners to document to handle fast moves outside the element
      if (e.type === 'touchstart') {
        document.addEventListener('touchmove', drag, {passive: false});
        document.addEventListener('touchend', dragEnd);
        document.addEventListener('touchcancel', dragEnd);
      } else {
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', dragEnd);
      }
    }

    function drag(e) {
      if (activeCard) {
        e.preventDefault(); // Stop scrolling on touch
        
        let currentX, currentY;
        
        if (e.type === 'touchmove') {
          currentX = e.touches[0].clientX;
          currentY = e.touches[0].clientY;
        } else {
          currentX = e.clientX;
          currentY = e.clientY;
        }

        // Calculate new position relative to the wall
        const parentRect = messageWall.getBoundingClientRect();
        let newLeft = currentX - parentRect.left - xOffset;
        let newTop = currentY - parentRect.top - yOffset;

        // Boundary checks (keep inside wall)
        const minLeft = -50;
        const maxLeft = parentRect.width - 50;
        const minTop = -20;
        const maxTop = parentRect.height - 50;

        // Optional: Clamp position to keep somewhat inside
        // newLeft = Math.max(minLeft, Math.min(newLeft, maxLeft));
        // newTop = Math.max(minTop, Math.min(newTop, maxTop));

        activeCard.style.left = newLeft + 'px';
        activeCard.style.top = newTop + 'px';
      }
    }

    function dragEnd(e) {
      activeCard = null;

      // Clean up all listeners
      document.removeEventListener('mousemove', drag);
      document.removeEventListener('mouseup', dragEnd);
      document.removeEventListener('touchmove', drag);
      document.removeEventListener('touchend', dragEnd);
      document.removeEventListener('touchcancel', dragEnd);
    }


    // 2. Typewriter & Card Generation Logic
    const beeperName = document.getElementById('beeperName');

    btnSend.addEventListener('click', () => {
      const text = beeperInput.value.trim();
      const name = beeperName ? beeperName.value.trim() : '';
      
      if (!text) return;

      createCard(text, name);
      beeperInput.value = '';
      if (beeperName) beeperName.value = '';
    });

    // Allow "Enter" key to send
    beeperInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        btnSend.click();
      }
    });
    
    if (beeperName) {
      beeperName.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          btnSend.click();
        }
      });
    }

    function createCard(message, author) {
      // Create elements
      const card = document.createElement('div');
      card.classList.add('note-card');
      
      // Random Color
      const colorId = Math.floor(Math.random() * 5) + 1; // 1 to 5
      card.classList.add(`color-${colorId}`);
      
      // Random position near center-ish but varied
      const randomAngle = (Math.random() * 6) - 3; // -3 to 3 deg
      const randomTop = 30 + (Math.random() * 20); // 30% to 50%
      const randomLeft = 30 + (Math.random() * 40); // 30% to 70%
      
      // Store final position and rotation for animation
      card.style.setProperty('--final-rotation', `${randomAngle}deg`);
      card.style.top = `${randomTop}%`;
      card.style.left = `${randomLeft}%`;
      
      // Start position: center bottom (from beeper)
      card.style.transform = `translate(-50%, 100vh) rotate(0deg) scale(0.3)`;
      card.style.opacity = '0';
      card.style.zIndex = '100';

      const p = document.createElement('p');
      p.classList.add('note-text');
      
      // Footer container for date and author
      const cardFooter = document.createElement('div');
      cardFooter.style.marginTop = 'auto';
      
      const dateSpan = document.createElement('div');
      dateSpan.classList.add('note-date');
      const today = new Date();
      dateSpan.textContent = `${today.getFullYear()}.${today.getMonth()+1}.${today.getDate()}`;
      
      cardFooter.appendChild(dateSpan);

      if (author) {
        const authorSpan = document.createElement('div');
        authorSpan.classList.add('note-author');
        authorSpan.textContent = `- ${author}`;
        cardFooter.appendChild(authorSpan);
      }

      card.appendChild(p);
      card.appendChild(cardFooter);
      messageWall.appendChild(card);

      // Animate In - Printing Effect
      // 1. Fly from beeper to position
      setTimeout(() => {
        card.classList.add('printing-animation');
        
        // After flying animation completes
        setTimeout(() => {
          card.classList.remove('printing-animation');
          card.style.transform = `rotate(${randomAngle}deg) scale(1)`;
          card.style.opacity = '1';
        }, 1200);
      }, 50);

      // 2. Typewriter effect (starts during flight)
      let i = 0;
      const speed = 50; // ms per char
      
      function typeWriter() {
        if (i < message.length) {
          p.textContent += message.charAt(i);
          i++;
          setTimeout(typeWriter, speed);
        } else {
          // Finished typing
          // Make draggable after animation completes
          setTimeout(() => {
            initDrag(card);
          }, 1300);
        }
      }
      
      // Start typing during flight
      setTimeout(typeWriter, 700);
    }
  }

  // ==========================================
  // Back to Top Button
  // ==========================================
  const backToTopBtn = document.getElementById('backToTop');

  if (backToTopBtn) {
    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
      if (window.scrollY > 500) {
        backToTopBtn.classList.add('show');
      } else {
        backToTopBtn.classList.remove('show');
      }
    });

    // Scroll to top on click
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
});
