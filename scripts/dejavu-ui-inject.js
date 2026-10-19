'use strict';

hexo.extend.injector.register(
  'head_end',
  '<link rel="stylesheet" href="/blog/css/dejavu-ui.css" media="all">' +
  '<link rel="stylesheet" href="/blog/css/dejavu-anime.css" media="all">'
);

hexo.extend.injector.register(
  'body_end',
  '<script src="/blog/js/vendor/anime.min.js" defer></script>' +
  '<script src="/blog/js/dejavu-anime.js" defer></script>' +
  '<script src="/blog/js/dejavu-ui.js" defer></script>'
);
