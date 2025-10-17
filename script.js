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

// ---------------- Product Slider ----------------
const productTrack = document.querySelector('.product-track');
let productCards = document.querySelectorAll('.product-card');
const prodDotsContainer = document.querySelector('.prod-dots');
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

// Next / Prev
const prodNext = document.querySelector('.product-slider .next');
const prodPrev = document.querySelector('.product-slider .prev');

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

// ---------------- Image Modal ----------------
const modal = document.getElementById("imgModal");
const modalImg = document.getElementById("modalImg");
let zoomedIn = false;

function openModal(img) {
  modal.style.display = "block";
  modalImg.src = img.src;
  zoomedIn = false;
  modalImg.style.transform = "scale(1)";
  modalImg.style.cursor = "zoom-in";
}

function closeModal() {
  modal.style.display = "none";
  modalImg.style.transform = "scale(1)";
  zoomedIn = false;
}

// Toggle zoom
modalImg.addEventListener("click", (e) => {
  e.stopPropagation();
  zoomedIn = !zoomedIn;
  modalImg.style.transform = zoomedIn ? "scale(2)" : "scale(1)";
  modalImg.style.cursor = zoomedIn ? "zoom-out" : "zoom-in";
});

// Close modal on outside click
modal.addEventListener("click", e => { if (e.target === modal) closeModal(); });

// ---------------- Shipping Partners Infinite Scroll ----------------
const partnerTrack = document.querySelector('.partner-track');
// Duplicate logos for seamless loop
partnerTrack.innerHTML += partnerTrack.innerHTML;

// Pause scroll on hover
partnerTrack.parentElement.addEventListener('mouseenter', () => {
  partnerTrack.style.animationPlayState = 'paused';
});
partnerTrack.parentElement.addEventListener('mouseleave', () => {
  partnerTrack.style.animationPlayState = 'running';
});
