(function () {
  'use strict';
  var doc = document;
  var root = doc.documentElement;
  var w = window;
  var prefersReduced = !!(w.matchMedia && w.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var isMobile = !!(w.matchMedia && w.matchMedia('(max-width: 768px)').matches);
  function ready(fn) {
    if (doc.readyState !== 'loading') { fn(); } else { doc.addEventListener('DOMContentLoaded', fn); }
  }
  var nav = doc.getElementById('nav') || doc.getElementById('header');
  function updateNav() {
    if (!nav) return;
    if (w.scrollY > 10) { nav.classList.add('dejavu-scrolled'); } else { nav.classList.remove('dejavu-scrolled'); }
  }
  function setupToTop() {
    var btn = doc.getElementById('to-top');
    if (!btn) {
      btn = doc.createElement('button');
      btn.type = 'button';
      btn.className = 'dejavu-to-top';
      btn.setAttribute('aria-label', '回到顶部');
      btn.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5"/><path d="M5 12l7-7 7 7"/></svg>';
      doc.body.appendChild(btn);
      btn.addEventListener('click', function () { w.scrollTo({ top: 0, behavior: 'auto' }); });
    }
    var shown = false;
    function render() {
      var y = w.scrollY || root.scrollTop || 0;
      var max = root.scrollHeight - w.innerHeight;
      var p = max > 0 ? Math.min(y / max, 1) : 0;
      btn.style.setProperty('--dejavu-progress', Math.round(p * 360) + 'deg');
      if (btn.classList.contains('dejavu-to-top')) {
        if (y > 480 && !shown) { shown = true; btn.classList.add('dejavu-show'); }
        else if (y <= 480 && shown) { shown = false; btn.classList.remove('dejavu-show'); }
      }
    }
    render();
    return render;
  }
  var REVEAL_SELECTOR = '.recent-post-item, .post-card, article.article, .archive-article-inner, #sidebar .widget-wrap';
  function setupReveal() {
    var items = doc.querySelectorAll(REVEAL_SELECTOR);
    if (!('IntersectionObserver' in w) || prefersReduced || isMobile) {
      for (var i = 0; i < items.length; i++) { items[i].classList.add('dejavu-reveal', 'dejavu-in'); }
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      for (var j = 0; j < entries.length; j++) {
        if (entries[j].isIntersecting) {
          entries[j].target.classList.add('dejavu-in');
          io.unobserve(entries[j].target);
        }
      }
    }, { threshold: 0.08, rootMargin: '0px 0px -5% 0px' });
    for (var k = 0; k < items.length; k++) {
      items[k].classList.add('dejavu-reveal');
      io.observe(items[k]);
    }
  }
  ready(function () {
    root.classList.add('dejavu-js');
    updateNav();
    var toTopRender = setupToTop();
    setupReveal();
    w.addEventListener('scroll', function () { updateNav(); toTopRender(); }, { passive: true });
    doc.addEventListener('pjax:complete', function () { updateNav(); toTopRender(); setupReveal(); });
  });
})();
