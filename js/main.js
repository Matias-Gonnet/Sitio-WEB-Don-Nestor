(() => {
  const portada = document.getElementById('contenido-portada');
  const logoFlotante = document.getElementById('logoFlotante');
  const reducir = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const paralaje = [...document.querySelectorAll('[data-parallax]')];
  let ultimo = 0, quieto = false;

  function cuadro() {
    quieto = false;
    const y = window.scrollY, vh = window.innerHeight;
    ultimo = y;

    if (logoFlotante) {
      logoFlotante.classList.toggle('oculto', y < 120);
    }

    if (reducir) return;
    paralaje.forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.bottom < -100 || r.top > vh + 100) return;
      const centro = r.top + r.height / 2 - vh / 2;
      el.style.setProperty('--py', (-centro * el.dataset.parallax).toFixed(1) + 'px');
    });
    if (portada && y < vh) {
      portada.style.transform = 'translate3d(0,' + (y * .12).toFixed(1) + 'px,0)';
      portada.style.opacity = Math.max(1 - y / (vh * .9), 0);
    }
  }
  const pedir = () => { if (!quieto) { quieto = true; requestAnimationFrame(cuadro); } };
  addEventListener('scroll', pedir, {passive:true});
  addEventListener('resize', pedir);
  cuadro();

  const ver = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visto'); ver.unobserve(e.target); }
  }), {threshold:.18, rootMargin:'0px 0px -6% 0px'});
  document.querySelectorAll('[data-r],[data-obs]').forEach(el => ver.observe(el));

  const enlaces = [...document.querySelectorAll('.menu a')];
  const activo = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) enlaces.forEach(a => a.classList.toggle('activo', a.getAttribute('href') === '#' + e.target.id));
  }), {rootMargin:'-45% 0px -50% 0px'});
  enlaces.forEach(a => { const s = document.querySelector(a.getAttribute('href')); if (s) activo.observe(s); });
})();
