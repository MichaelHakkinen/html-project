// ---------------- Navbar toggle ----------------
const toggleBtn = document.querySelector('.toggle_btn');
const toggleBtnIcon = document.querySelector('.toggle_btn i');
const dropDownMenu = document.querySelector('.dropdown_menu');

toggleBtn.addEventListener('click', () => {
    dropDownMenu.classList.toggle('open');
    const isOpen = dropDownMenu.classList.contains('open');

    toggleBtnIcon.className = isOpen
        ? 'fa-solid fa-xmark'
        : 'fa-solid fa-bars';
});

// ---------------- Slideshow ----------------
const slides = document.querySelectorAll('.slide');
const prev = document.querySelector('.arrows .prev'); // make sure it's the slideshow arrow
const next = document.querySelector('.arrows .next'); // make sure it's the slideshow arrow
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

// Events for arrows (ONLY slideshow)
next.addEventListener('click', () => {
    nextSlide();
    resetSlideShow();
});

prev.addEventListener('click', () => {
    prevSlide();
    resetSlideShow();
});

// Init
showSlide(currentIndex);
startSlideShow();

// ---------------- Product Slider ----------------
const productTrack = document.querySelector('.product-track');
let productCards = document.querySelectorAll('.product-card');
const prodPrev = document.querySelector('.product-slider .prev');
const prodNext = document.querySelector('.product-slider .next');
const prodDotsContainer = document.querySelector('.prod-dots');

let prodIndex = 0;
const originalProducts = productCards.length;

function getCardWidth() {
    return productCards[0].getBoundingClientRect().width;
}

function getCardsPerView() {
    const containerWidth = document.querySelector('.product-container').getBoundingClientRect().width;
    return Math.floor(containerWidth / getCardWidth());
}

// Create fixed dots (for original products only)
for (let i = 0; i < originalProducts; i++) {
    const dot = document.createElement('span');
    prodDotsContainer.appendChild(dot);
}
const prodDots = document.querySelectorAll('.prod-dots span');

// Infinite scroll: clone when needed
function cloneProducts() {
    productCards.forEach(card => {
        let clone = card.cloneNode(true);
        productTrack.appendChild(clone);
    });
    productCards = document.querySelectorAll('.product-card');
}

function updateProductSlider() {
    const cardWidth = getCardWidth();
    const cardsPerView = getCardsPerView();

    const moveX = prodIndex * cardWidth;
    productTrack.style.transform = `translateX(-${moveX}px)`;

    // highlight last visible product
    let activeProduct = (prodIndex + cardsPerView - 1) % originalProducts;
    prodDots.forEach(dot => dot.classList.remove('active'));
    prodDots[activeProduct].classList.add('active');
}

// Next / Prev
prodNext.addEventListener('click', () => {
    const cardsPerView = getCardsPerView();
    prodIndex++;
    if (prodIndex >= productCards.length - cardsPerView) {
        cloneProducts();
    }
    updateProductSlider();
});

prodPrev.addEventListener('click', () => {
    if (prodIndex > 0) {
        prodIndex--;
        updateProductSlider();
    }
});

// Handle window resize (keep 4-at-a-time consistent)
window.addEventListener('resize', updateProductSlider);

// Init
updateProductSlider();


function openModal(img) {
  document.getElementById("imgModal").style.display = "block";
  document.getElementById("modalImg").src = img.src;
}

function closeModal() {
  document.getElementById("imgModal").style.display = "none";
}

const modal = document.getElementById("imgModal");
const modalImg = document.getElementById("modalImg");

let zoomedIn = false;

function openModal(img) {
  modal.style.display = "block";
  modalImg.src = img.src;
  resetZoom();
}

function closeModal() {
  modal.style.display = "none";
  resetZoom();
}

function resetZoom() {
  zoomedIn = false;
  modalImg.style.transform = "scale(1)";
  modalImg.style.cursor = "zoom-in";
}

// Toggle zoom on photo click
modalImg.addEventListener("click", (e) => {
  e.stopPropagation(); // prevent modal from closing when clicking on the photo
  zoomedIn = !zoomedIn;
  if (zoomedIn) {
    modalImg.style.transform = "scale(2)"; // zoom factor
    modalImg.style.cursor = "zoom-out";
  } else {
    resetZoom();
  }
});

// Close when clicking outside the photo
modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    closeModal();
  }
});
