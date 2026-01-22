// Year
document.getElementById("year").textContent = new Date().getFullYear();

// Typed description (minimal + classy)
const lines = [
  "A tactical 90-day roadmap to scale trust and adoption.",
  "Designed for localized growth loops, fast experimentation, and measurable ROI.",
  "Built for Africa & Asia remittance corridors — execution-ready."
];

const typedEl = document.getElementById("typed");
let line = 0, i = 0;

function typeNext() {
  const current = lines[line];
  typedEl.textContent = current.slice(0, i++);
  if (i <= current.length) return setTimeout(typeNext, 18);

  // Pause, then next line
  setTimeout(() => {
    i = 0;
    line = (line + 1) % lines.length;
    typeNext();
  }, 1100);
}
typeNext();

// Slides (lazy render for speed)
const totalSlides = 13;
const grid = document.getElementById("slidesGrid");
const slidePaths = Array.from({ length: totalSlides }, (_, idx) => {
  const n = String(idx + 1).padStart(2, "0");
  return `assets/slides/slide_${n}.png`;
});

// Create thumbnails
slidePaths.forEach((src, idx) => {
  const btn = document.createElement("button");
  btn.className = "slideThumb";
  btn.type = "button";
  btn.setAttribute("aria-label", `Open slide ${idx + 1}`);

  const img = document.createElement("img");
  img.loading = "lazy";
  img.decoding = "async";
  img.src = src;
  img.alt = `Slide ${idx + 1}`;

  btn.appendChild(img);
  btn.addEventListener("click", () => openLightbox(idx));
  grid.appendChild(btn);
});

// Lightbox
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxCap = document.getElementById("lightboxCap");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

let currentIndex = 0;

function openLightbox(index) {
  currentIndex = index;
  renderSlide();
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  lightbox.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function renderSlide() {
  const src = slidePaths[currentIndex];
  lightboxImg.src = src;
  lightboxImg.alt = `Slide ${currentIndex + 1}`;
  lightboxCap.textContent = `Slide ${currentIndex + 1} of ${totalSlides}`;
}

function prevSlide() {
  currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
  renderSlide();
}
function nextSlide() {
  currentIndex = (currentIndex + 1) % totalSlides;
  renderSlide();
}

prevBtn.addEventListener("click", prevSlide);
nextBtn.addEventListener("click", nextSlide);

lightbox.addEventListener("click", (e) => {
  if (e.target && e.target.dataset && e.target.dataset.close) closeLightbox();
});

document.addEventListener("keydown", (e) => {
  if (lightbox.getAttribute("aria-hidden") === "true") return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowLeft") prevSlide();
  if (e.key === "ArrowRight") nextSlide();
});

// basic swipe for mobile
let touchStartX = 0;
lightbox.addEventListener("touchstart", (e) => {
  touchStartX = e.changedTouches[0].clientX;
}, { passive: true });

lightbox.addEventListener("touchend", (e) => {
  const endX = e.changedTouches[0].clientX;
  const dx = endX - touchStartX;
  if (Math.abs(dx) < 40) return;
  dx > 0 ? prevSlide() : nextSlide();
}, { passive: true });
