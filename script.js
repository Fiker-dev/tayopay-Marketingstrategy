
const slides = window.__SLIDES__ || [];
const highlights = window.__HIGHLIGHTS__ || [];

const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

// Theme toggle
const themeBtn = document.getElementById('themeBtn');
const savedTheme = localStorage.getItem('tp_theme');
if (savedTheme) document.documentElement.setAttribute('data-theme', savedTheme);

themeBtn?.addEventListener('click', () => {
  const cur = document.documentElement.getAttribute('data-theme') || 'dark';
  const next = cur === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('tp_theme', next);
});

// Lightbox state
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxMeta = document.getElementById('lightboxMeta');
const closeBtn = document.getElementById('closeLightbox');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
let currentIndex = 0;

function openLightbox(index){
  currentIndex = Math.max(0, Math.min(slides.length - 1, index));
  if (!lightbox) return;
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
  render();
}

function render(){
  if (!lightboxImg) return;
  lightboxImg.src = slides[currentIndex];
  if (lightboxMeta) lightboxMeta.textContent = `Slide ${currentIndex + 1} of ${slides.length}`;
}

function closeLightbox(){
  if (!lightbox) return;
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  if (lightboxImg) lightboxImg.src = '';
}

function prev(){
  currentIndex = (currentIndex - 1 + slides.length) % slides.length;
  render();
}
function next(){
  currentIndex = (currentIndex + 1) % slides.length;
  render();
}

closeBtn?.addEventListener('click', closeLightbox);
prevBtn?.addEventListener('click', prev);
nextBtn?.addEventListener('click', next);
lightbox?.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });

window.addEventListener('keydown', (e) => {
  if (!lightbox?.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') prev();
  if (e.key === 'ArrowRight') next();
});

// Wire mini open buttons
document.querySelectorAll('[data-open]').forEach(btn => {
  btn.addEventListener('click', () => openLightbox(parseInt(btn.getAttribute('data-open') || '0', 10)));
});

// Build highlights
const highlightGrid = document.getElementById('highlightGrid');
if (highlightGrid){
  highlights.forEach((i) => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'highlightCard';
    card.setAttribute('aria-label', `Open highlight slide ${i+1}`);

    const img = document.createElement('img');
    img.loading = 'lazy';
    img.src = slides[i];
    img.alt = `Highlight slide ${i+1}`;

    const meta = document.createElement('div');
    meta.className = 'meta';
    meta.innerHTML = `<span>Highlight</span><span>Slide ${i+1}</span>`;

    card.appendChild(img);
    card.appendChild(meta);
    card.addEventListener('click', () => openLightbox(i));
    highlightGrid.appendChild(card);
  });
}

// Build full grid
const grid = document.getElementById('grid');
function buildGrid(filterStr = ''){
  if (!grid) return;
  grid.innerHTML = '';
  const normalized = (filterStr || '').trim();

  slides.forEach((src, idx) => {
    const slideNo = String(idx + 1);
    if (normalized && !slideNo.includes(normalized)) return;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'thumb';
    btn.setAttribute('aria-label', `Open slide ${idx + 1}`);

    const img = document.createElement('img');
    img.loading = 'lazy';
    img.src = src;
    img.alt = `Slide ${idx + 1}`;

    const badge = document.createElement('div');
    badge.className = 'badge';
    badge.textContent = `Slide ${idx + 1}`;

    btn.appendChild(img);
    btn.appendChild(badge);
    btn.addEventListener('click', () => openLightbox(idx));

    grid.appendChild(btn);
  });
}
buildGrid();

// Filter + jump
const filterInput = document.getElementById('filterInput');
const clearFilterBtn = document.getElementById('clearFilterBtn');
filterInput?.addEventListener('input', () => buildGrid(filterInput.value));
clearFilterBtn?.addEventListener('click', () => { if (filterInput) filterInput.value=''; buildGrid(''); });

const jumpInput = document.getElementById('jumpInput');
const jumpBtn = document.getElementById('jumpBtn');
jumpBtn?.addEventListener('click', () => {
  const n = parseInt(jumpInput?.value || '', 10);
  if (!n || n < 1 || n > slides.length) return;
  const target = document.querySelectorAll('.thumb')[n-1];
  target?.scrollIntoView({behavior:'smooth', block:'center'});
  openLightbox(n-1);
});

// Present mode
const presentBtn = document.getElementById('presentBtn');
presentBtn?.addEventListener('click', () => {
  openLightbox(0);
  lightbox?.requestFullscreen?.().catch(() => {});
});

// Video URL tool
const videoUrl = document.getElementById('videoUrl');
const applyVideoUrl = document.getElementById('applyVideoUrl');
const resetVideo = document.getElementById('resetVideo');
const localVideo = document.getElementById('localVideo');

applyVideoUrl?.addEventListener('click', () => {
  const url = (videoUrl?.value || '').trim();
  if (!url) return;

  const isMp4 = url.toLowerCase().includes('.mp4');
  if (!isMp4) {
    window.open(url, '_blank', 'noopener,noreferrer');
    return;
  }

  localVideo?.pause();
  const source = localVideo?.querySelector('source');
  if (!source || !localVideo) return;
  source.src = url;
  localVideo.load();
  localVideo.play().catch(() => {});
});

resetVideo?.addEventListener('click', () => {
  localVideo?.pause();
  const source = localVideo?.querySelector('source');
  if (!source || !localVideo) return;
  source.src = './assets/video.mp4';
  localVideo.load();
  if (videoUrl) videoUrl.value = '';
});
