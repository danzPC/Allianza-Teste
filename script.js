// Loading & page intro
window.addEventListener('load', () => {
  const loading = document.querySelector('.loading-screen');
  if (loading){
    gsap.to(loading, {opacity:0, duration:.6, onComplete:()=>loading.style.display='none'});
  }
  animatePage();
});

function animatePage(){
  if (window.gsap && window.ScrollTrigger) { gsap.registerPlugin(ScrollTrigger); }

  // Header on scroll
  const header = document.querySelector('.floating-header');
  const shrink = () => {
    if (window.scrollY > 10) header.classList.add('shrink');
    else header.classList.remove('shrink');
  };
  shrink();
  window.addEventListener('scroll', shrink, {passive:true});

  // Parallax
  gsap.to('.parallax-bg', {
    yPercent: 20, ease: 'none',
    scrollTrigger: {trigger: '.hero-section', start: 'top bottom', end: 'bottom top', scrub: true}
  });

  // Hero reveal
  gsap.from('.hero-title', {y:40, opacity:0, duration:1, ease:'power3.out', delay:.2});
  gsap.from('.hero-subtitle', {y:30, opacity:0, duration:.9, ease:'power3.out', delay:.45});
  gsap.from('.hero-buttons', {y:20, opacity:0, duration:.9, ease:'power3.out', delay:.65});

  // Services cards
  gsap.utils.toArray('.servico-card').forEach((card,i)=>{
    gsap.from(card, {y:40, opacity:0, duration:.8, delay: i*0.1, scrollTrigger:{trigger: card, start:'top 85%'}});
    card.addEventListener('mousemove', e=>{
      const r = card.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      const rx = ((y - r.height/2) / r.height) * -10;
      const ry = ((x - r.width/2) / r.width) * 10;
      gsap.to(card, {rotationX: rx, rotationY: ry, transformPerspective: 800, transformOrigin: 'center', duration:.4});
    });
    card.addEventListener('mouseleave', ()=> gsap.to(card, {rotationX:0, rotationY:0, duration:.6, ease:'power3.out'}));
  });

  // Stats counter
  document.querySelectorAll('.stat-number').forEach(el=>{
    const target = +el.getAttribute('data-count');
    const obj = {v:0};
    gsap.to(obj, {
      v: target, duration: 2,
      scrollTrigger: {trigger: el, start: 'top 85%', once:true},
      onUpdate: ()=> el.textContent = Math.floor(obj.v)
    });
  });

  // Testimonials carousel (simple)
  const track = document.querySelector('.carousel-track');
  const prev = document.querySelector('.prev');
  const next = document.querySelector('.next');
  let index = 0;
  const items = () => Array.from(track.children);
  function updateCarousel(){
    const w = track.clientWidth;
    track.scrollTo({left: index*w, behavior: 'smooth'});
  }
  prev?.addEventListener('click', ()=>{ index = Math.max(0, index-1); updateCarousel(); });
  next?.addEventListener('click', ()=>{ index = Math.min(items().length-1, index+1); updateCarousel(); });
  window.addEventListener('resize', updateCarousel);

  // Smooth anchors
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', e=>{
      const id = a.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (target){
        e.preventDefault();
        const headerH = document.querySelector('header').offsetHeight;
        const top = target.getBoundingClientRect().top + window.pageYOffset - headerH - 8;
        window.scrollTo({top, behavior: 'smooth'});
      }
    });
  });

  // Mobile nav
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.dynamic-nav');
  navToggle?.addEventListener('click', ()=>{
    const open = nav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
  });
  nav?.querySelectorAll('a').forEach(link=> link.addEventListener('click', ()=>{
    nav.classList.remove('open');
    navToggle?.setAttribute('aria-expanded','false');
  }));

  // Theme toggle
  const modeBtn = document.querySelector('.mode-toggle');
  const root = document.documentElement;
  const THEME_KEY = 'allianza-theme';
  const applyTheme = (t)=> root.classList.toggle('dark', t==='dark');
  applyTheme(localStorage.getItem(THEME_KEY) || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark':'light'));
  modeBtn?.addEventListener('click', ()=>{
    const next = root.classList.contains('dark') ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem(THEME_KEY, next);
  });

  // Contact form (client-side)
  const form = document.getElementById('contact-form');
  const feedback = document.querySelector('.form-feedback');
  form?.addEventListener('submit', (e)=>{
    e.preventDefault();
    const data = new FormData(form);
    const nome = data.get('nome')?.toString().trim();
    const email = data.get('email')?.toString().trim();
    const msg = data.get('mensagem')?.toString().trim();
    if(!nome || !email || !msg){
      feedback.textContent = 'Por favor, preencha todos os campos.';
      feedback.style.color = '#dc2626';
      return;
    }
    // Demo: open mailto (pode integrar com backend)
    const body = encodeURIComponent(`Nome: ${nome}\nEmail: ${email}\n\n${msg}`);
    window.location.href = `mailto:contato@allianza.com.br?subject=Contato pelo site&body=${body}`;
    feedback.textContent = 'Obrigado! Vamos responder em breve.';
    feedback.style.color = '#16a34a';
    form.reset();
  });

  // Current year
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
}
