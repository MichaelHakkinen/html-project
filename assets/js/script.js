// ---------------- Navbar toggle ----------------
const toggleBtn = document.querySelector('.toggle_btn');
const toggleBtnIcon = document.querySelector('.toggle_btn i');
const dropDownMenu = document.querySelector('.dropdown_menu');

toggleBtn.addEventListener('click', () => {
  dropDownMenu.classList.toggle('open');
  toggleBtnIcon.className = dropDownMenu.classList.contains('open')
    ? 'fa-solid fa-xmark'
    : 'fa-solid fa-bars';
});

// ---------------- Slideshow ----------------
const slides = document.querySelectorAll('.slide');
const prev = document.querySelector('.arrows .prev');
const next = document.querySelector('.arrows .next');
const dotsContainer = document.querySelector('.dots');

if (slides.length && prev && next && dotsContainer) {
  let currentIndex = 0;
  let slideInterval;

  // Create dots dynamically
  slides.forEach((_, i) => {
    const dot = document.createElement('span');
    dot.addEventListener('click', () => {
      showSlide(i);
      resetSlideShow();
    });
    dotsContainer.appendChild(dot);
  });
  const dots = document.querySelectorAll('.dots span');

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.remove('active');
      dots[i].classList.remove('active');
    });
    slides[index].classList.add('active');
    dots[index].classList.add('active');
    currentIndex = index;
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % slides.length;
    showSlide(currentIndex);
  }

  function prevSlide() {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    showSlide(currentIndex);
  }

  function startSlideShow() {
    slideInterval = setInterval(nextSlide, 4000);
  }

  function resetSlideShow() {
    clearInterval(slideInterval);
    startSlideShow();
  }

  // Arrow events
  next.addEventListener('click', () => { nextSlide(); resetSlideShow(); });
  prev.addEventListener('click', () => { prevSlide(); resetSlideShow(); });

  // Init slideshow
  showSlide(currentIndex);
  startSlideShow();
}

// ---------------- Product Slider ----------------
const productTrack = document.querySelector('.product-track');
const prodDotsContainer = document.querySelector('.prod-dots');
const prodNext = document.querySelector('.product-slider .next');
const prodPrev = document.querySelector('.product-slider .prev');

if (productTrack && prodDotsContainer && prodNext && prodPrev) {
  let productCards = document.querySelectorAll('.product-card');
  let prodIndex = 0;
  const originalProducts = productCards.length;

  function getCardWidth() { return productCards[0].getBoundingClientRect().width; }
  function getCardsPerView() {
    const containerWidth = document.querySelector('.product-container').getBoundingClientRect().width;
    return Math.floor(containerWidth / getCardWidth());
  }

  // Create dots
  for (let i = 0; i < originalProducts; i++) {
    const dot = document.createElement('span');
    prodDotsContainer.appendChild(dot);
  }
  const prodDots = document.querySelectorAll('.prod-dots span');

  // Infinite scroll: clone products
  function cloneProducts() {
    productCards.forEach(card => productTrack.appendChild(card.cloneNode(true)));
    productCards = document.querySelectorAll('.product-card');
  }

  function updateProductSlider() {
    const cardWidth = getCardWidth();
    const cardsPerView = getCardsPerView();
    const moveX = prodIndex * cardWidth;
    productTrack.style.transform = `translateX(-${moveX}px)`;

    const activeProduct = (prodIndex + cardsPerView - 1) % originalProducts;
    prodDots.forEach(dot => dot.classList.remove('active'));
    prodDots[activeProduct].classList.add('active');
  }

  prodNext.addEventListener('click', () => {
    const cardsPerView = getCardsPerView();
    prodIndex++;
    if (prodIndex >= productCards.length - cardsPerView) cloneProducts();
    updateProductSlider();
  });

  prodPrev.addEventListener('click', () => {
    if (prodIndex > 0) prodIndex--;
    updateProductSlider();
  });

  // Window resize
  window.addEventListener('resize', updateProductSlider);
  updateProductSlider();
}

// ---------------- Image Modal ----------------
const modal = document.getElementById("imgModal");
const modalImg = document.getElementById("modalImg");

if (modal && modalImg) {
  let zoomedIn = false;

  window.openModal = function(img) {
    modal.style.display = "flex";
    modalImg.src = img.src;
    zoomedIn = false;
    modalImg.style.transform = "scale(1)";
    modalImg.style.cursor = "zoom-in";
  };

  window.closeModal = function() {
    modal.style.display = "none";
    modalImg.style.transform = "scale(1)";
    zoomedIn = false;
  };

  // Toggle zoom
  modalImg.addEventListener("click", (e) => {
    e.stopPropagation();
    zoomedIn = !zoomedIn;
    modalImg.style.transform = zoomedIn ? "scale(2)" : "scale(1)";
    modalImg.style.cursor = zoomedIn ? "zoom-out" : "zoom-in";
  });

  // Close modal on outside click
  modal.addEventListener("click", e => { if (e.target === modal) closeModal(); });
}

// ---------------- Shipping Partners Infinite Scroll ----------------
const partnerTrack = document.querySelector('.partner-track');
if (partnerTrack) {
  // Duplicate logos for seamless loop
  partnerTrack.innerHTML += partnerTrack.innerHTML;

  // Pause scroll on hover
  partnerTrack.parentElement.addEventListener('mouseenter', () => {
    partnerTrack.style.animationPlayState = 'paused';
  });
  partnerTrack.parentElement.addEventListener('mouseleave', () => {
    partnerTrack.style.animationPlayState = 'running';
  });
}

// ---------------- Navbar Scrollspy & Sticky Glassmorphic Background ----------------
const navLinks = document.querySelectorAll('.navbar .links a');
const dropdownMenuLinks = document.querySelectorAll('.dropdown_menu a');
const navbarElement = document.querySelector('.navbar');

// Track sections corresponding to navigation links
const spySections = [];
navLinks.forEach(link => {
  const targetId = link.getAttribute('href');
  if (targetId && targetId.startsWith('#')) {
    const sec = document.querySelector(targetId);
    if (sec) {
      spySections.push(sec);
    }
  }
});

// Update navbar background opacity on scroll, and highlight current active section (Scrollspy)
function handleScroll() {
  const scrollPos = window.scrollY;

  // 1. Transparency background toggle on scroll
  if (scrollPos > 30) {
    if (navbarElement) navbarElement.classList.add('scrolled');
  } else {
    if (navbarElement) navbarElement.classList.remove('scrolled');
  }

  // 2. Scrollspy - active section highlight
  let activeSectionId = '';
  // Offset to trigger earlier when scrolling down (header height + buffer)
  const offsetScrollPos = scrollPos + 120;

  spySections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    if (offsetScrollPos >= sectionTop && offsetScrollPos < sectionTop + sectionHeight) {
      activeSectionId = section.getAttribute('id');
    }
  });

  // Force highlighting the contact section if scrolled to the absolute bottom
  if ((window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 50) {
    activeSectionId = 'contact';
  }

  // Update classes
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      const id = href.replace('#', '');
      if (id === activeSectionId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    }
  });

  dropdownMenuLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href) {
      const id = href.replace('#', '');
      if (id === activeSectionId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    }
  });
}

// Attach scroll and DOM listeners
window.addEventListener('scroll', handleScroll);
window.addEventListener('DOMContentLoaded', handleScroll);
handleScroll(); // Execute immediately

// 3. Dropdown auto-close on link click
dropdownMenuLinks.forEach(link => {
  link.addEventListener('click', () => {
    if (dropDownMenu) {
      dropDownMenu.classList.remove('open');
    }
    if (toggleBtnIcon) {
      toggleBtnIcon.className = 'fa-solid fa-bars';
    }
  });
});

// ---------------- Scroll Reveal (IntersectionObserver) ----------------
(function () {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target); // fire once, then stop watching
        }
      });
    },
    { threshold: 0.12 }
  );

  document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));
})();