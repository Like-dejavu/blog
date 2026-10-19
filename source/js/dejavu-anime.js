(function () {
  'use strict';
  function init() {
    try {
      if (!window.anime) { return; }
      var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      var aurora = document.querySelector('.dejavu-aurora');
      if (!aurora) {
        aurora = document.createElement('div');
        aurora.className = 'dejavu-aurora';
        for (var i = 1; i <= 3; i++) {
          var s = document.createElement('span');
          s.className = 'dj-a' + i;
          aurora.appendChild(s);
        }
        document.body.insertBefore(aurora, document.body.firstChild);
      }
      if (reduceMotion || window.innerWidth <= 768) { return; }
      var blobs = aurora.children;
      if (blobs.length === 3) {
        anime({ targets: blobs[0], translateX: ['0vw', '14vw'], translateY: ['0vh', '9vh'], scale: [1, 1.16], duration: 21000, easing: 'easeInOutSine', direction: 'alternate', loop: true });
        anime({ targets: blobs[1], translateX: ['0vw', '-12vw'], translateY: ['0vh', '-7vh'], scale: [1, 1.22], duration: 26000, easing: 'easeInOutSine', direction: 'alternate', loop: true, delay: 1200 });
        anime({ targets: blobs[2], translateX: ['0vw', '10vw'], translateY: ['0vh', '12vh'], scale: [1, 0.88], duration: 30000, easing: 'easeInOutSine', direction: 'alternate', loop: true, delay: 2400 });
      }
      anime({ targets: '.article-title, .post-title, .page-title', opacity: [0, 1], translateY: [18, 0], duration: 720, easing: 'easeOutCubic' });
    } catch (e) {}
  }
  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', init); } else { init(); }
  document.addEventListener('pjax:complete', init);
})();
