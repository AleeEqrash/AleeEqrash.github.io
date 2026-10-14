// Theme toggle with persistence
const themeBtn = document.getElementById('themeBtn');
function syncThemeIcon(){ if(themeBtn) themeBtn.textContent = document.documentElement.getAttribute('data-theme')==='dark' ? '☀️' : '🌙'; }
syncThemeIcon();
if(themeBtn){ themeBtn.addEventListener('click', () => {
  const dark = document.documentElement.getAttribute('data-theme')==='dark';
  if(dark){ document.documentElement.removeAttribute('data-theme'); try{localStorage.removeItem('theme')}catch(e){} }
  else{ document.documentElement.setAttribute('data-theme','dark'); try{localStorage.setItem('theme','dark')}catch(e){} }
  syncThemeIcon();
}); }

// Mobile nav + scroll reveal + active link + year
const btn = document.getElementById('menuBtn');
const links = document.getElementById('navLinks');
if (btn && links) {
  btn.addEventListener('click', () => links.classList.toggle('open'));
  links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => links.classList.remove('open')));
}

const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

document.getElementById('year').textContent = new Date().getFullYear();

// Active nav highlighting
const sections = [...document.querySelectorAll('main section[id]')];
const navA = [...document.querySelectorAll('.links a')];
const spy = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navA.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });
sections.forEach(s => spy.observe(s));
