// IDs de todos los carruseles en tu HTML
const carruselIds = ['carrusel1', 'carrusel2', 'carrusel3'];

carruselIds.forEach(id => {
  const carrusel = document.getElementById(id);
  if (!carrusel) return;

  const images = Array.from(carrusel.querySelectorAll('img'));
  if (!images.length) return; // nada que mostrar

  const prevBtn = carrusel.querySelector('.prev');
  const nextBtn = carrusel.querySelector('.next');
  let index = images.findIndex(img => img.classList.contains('active'));
  if (index === -1) index = 0; // asegurar índice inicial
  let intervalId;

  function showImage(i) {
    images.forEach((img, idx) => {
      img.classList.toggle('active', idx === i);
    });
  }

  function startAutoSlide() {
    // Sólo si hay más de una imagen
    if (images.length < 2) return;
    clearInterval(intervalId);
    intervalId = setInterval(() => {
      index = (index + 1) % images.length;
      showImage(index);
    }, 5000);
  }

  function handlePrev() {
    index = (index - 1 + images.length) % images.length;
    showImage(index);
    startAutoSlide(); // reinicia el intervalo
  }

  function handleNext() {
    index = (index + 1) % images.length;
    showImage(index);
    startAutoSlide(); // reinicia el intervalo
  }

  // mostrar la imagen inicial
  showImage(index);

  if (prevBtn) prevBtn.addEventListener('click', handlePrev);
  if (nextBtn) nextBtn.addEventListener('click', handleNext);

  // Inicia el auto-slide por primera vez
  startAutoSlide();
});

// Lightbox: abrir imagen al hacer click y cerrar al click fuera o Esc
document.addEventListener('DOMContentLoaded', () => {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');

  // selecciona las imágenes de todos los carruseles (ids que empiezan por "carrusel")
  const imgs = document.querySelectorAll('[id^="carrusel"] img');

  // pequeño SVG placeholder (en caso de error de carga)
  const placeholderSVG = 'data:image/svg+xml;utf8,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600">' +
      '<rect width="100%" height="100%" fill="#eee"/>' +
      '<text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" ' +
      'font-size="24" fill="#888">Imagen no encontrada</text>' +
    '</svg>'
  );

  // variables para navegación dentro del lightbox
  let currentImages = [];
  let currentIndex = 0;

  function openLightboxFor(img) {
    const carousel = img.closest('[id^="carrusel"]');
    if (!carousel) return;
    currentImages = Array.from(carousel.querySelectorAll('img'));
    currentIndex = currentImages.indexOf(img);
    lightboxImg.src = img.src || placeholderSVG;
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    lightboxImg.src = '';
    currentImages = [];
    currentIndex = 0;
  }

  function showLightboxIndex(i) {
    if (!currentImages.length) return;
    currentIndex = (i + currentImages.length) % currentImages.length;
    const img = currentImages[currentIndex];
    lightboxImg.src = img.getAttribute('src') || placeholderSVG;
  }

  imgs.forEach(img => {
    img.loading = 'lazy';
    img.style.cursor = 'zoom-in';

    img.addEventListener('error', () => {
      console.warn('No se pudo cargar la imagen:', img.getAttribute('src'));
      img.src = placeholderSVG;
      img.alt = 'Placeholder: imagen no encontrada';
    });

    img.addEventListener('click', (e) => {
      openLightboxFor(img);
    });
  });

  // evitar que click sobre la imagen cierre el overlay (stop propagation)
  const lightboxInner = document.querySelector('.lightbox-inner');
  if (lightboxInner) {
    lightboxInner.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }

  // cerrar al click fuera de la imagen (target === overlay) o al click en cerrar
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target === lightboxClose) {
      closeLightbox();
    }
  });

  // botones prev/next del lightbox
  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', (e) => {
      e.stopPropagation();
      showLightboxIndex(currentIndex - 1);
    });
  }
  if (lightboxNext) {
    lightboxNext.addEventListener('click', (e) => {
      e.stopPropagation();
      showLightboxIndex(currentIndex + 1);
    });
  }

  // cerrar con Escape y navegar con flechas
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('open')) {
      closeLightbox();
    } else if (e.key === 'ArrowLeft' && lightbox.classList.contains('open')) {
      showLightboxIndex(currentIndex - 1);
    } else if (e.key === 'ArrowRight' && lightbox.classList.contains('open')) {
      showLightboxIndex(currentIndex + 1);
    }
  });
});