// ---------- Typewriter (animated description) ----------
const lines = [
  "A tactical 90-day roadmap to scale trust and adoption across Africa and Asia remittance corridors.",
  "Localized growth loops, measurable KPIs, and fast execution — designed to be easy to scan and hard to ignore."
];

const target = document.getElementById("typeTarget");
let lineIndex = 0;
let charIndex = 0;
let deleting = false;

function typeLoop(){
  if (!target) return;

  const current = lines[lineIndex];
  const speed = deleting ? 18 : 28;

  if (!deleting) {
    target.textContent = current.slice(0, charIndex++);
    if (charIndex > current.length + 14) {
      deleting = true;
    }
  } else {
    target.textContent = current.slice(0, charIndex--);
    if (charIndex < 0) {
      deleting = false;
      charIndex = 0;
      lineIndex = (lineIndex + 1) % lines.length;
    }
  }
  setTimeout(typeLoop, speed);
}
typeLoop();

// ---------- Video hint if missing ----------
const heroVideo = document.getElementById("heroVideo");
const videoHint = document.getElementById("videoHint");
if (heroVideo && videoHint) {
  heroVideo.addEventListener("error", () => {
    videoHint.style.display = "block";
  });
  // If it can’t load metadata, likely missing
  heroVideo.addEventListener("loadedmetadata", () => {
    videoHint.style.display = "none";
  });
}

// ---------- Slides grid + lightbox ----------
const slidesGrid = document.getElementById("slidesGrid");
const lightbox = document.getElementById("lightbox");
const lbImg = document.getElementById("lbImg");
const lbClose = document.getElementById("lbClose");
const lbPrev = document.getElementById("lbPrev");
const lbNext = document.getElementById("lbNext");
const lbCount = document.getElementById("lbCount");

const SLIDE_COUNT = 13;

// If your slides are slide_01.png ... slide_13.png in assets/slides/
const slides = Array.from({length: SLIDE_COUNT}, (_, i) => {
  const n = String(i + 1).padStart(2, "0");
  return `assets/slides/slide_${n}.png`;
});

let currentSlide = 0;

function renderSlides(){
  if (!slidesGrid) return;
  slidesGrid.innerHTML = "";

  slides.forEach((src, idx) => {
    const card = document.createElement("button");
    card.className = "slideThumb";
    card.type = "button";
    card.setAttribute("aria-label", `Open slide ${idx + 1}`);

    const img = document.createElement("img");
    img.src = src;
    img.alt = `Slide ${idx + 1}`;

    card.appendChild(img);
    card.addEventListener("click", () => openLightbox(idx));
    slidesGrid.appendChild(card);
  });
}

function openLightbox(idx){
  currentSlide = idx;
  if (!lightbox || !lbImg || !lbCount) return;
  lbImg.src = slides[currentSlide];
  lbCount.textContent = `Slide ${currentSlide + 1} of ${slides.length}`;
  lightbox.classList.add("isOpen");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeLightbox(){
  if (!lightbox) return;
  lightbox.classList.remove("isOpen");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function navSlide(dir){
  currentSlide = (currentSlide + dir + slides.length) % slides.length;
  lbImg.src = slides[currentSlide];
  lbCount.textContent = `Slide ${currentSlide + 1} of ${slides.length}`;
}

if (lbClose) lbClose.addEventListener("click", closeLightbox);
if (lbPrev) lbPrev.addEventListener("click", () => navSlide(-1));
if (lbNext) lbNext.addEventListener("click", () => navSlide(1));

if (lightbox) {
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });
}

window.addEventListener("keydown", (e) => {
  if (!lightbox || !lightbox.classList.contains("isOpen")) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowLeft") navSlide(-1);
  if (e.key === "ArrowRight") navSlide(1);
});

renderSlides();

// ---------- Footer year ----------
const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();
