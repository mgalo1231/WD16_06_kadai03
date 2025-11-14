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
});

