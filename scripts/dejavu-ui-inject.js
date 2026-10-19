'use strict';

hexo.extend.injector.register(
  'head_end',
  '<link rel="stylesheet" href="/css/dejavu-ui.css" media="all">' +
  '<link rel="stylesheet" href="/css/dejavu-anime.css" media="all">'
);

hexo.extend.injector.register(
  'body_end',
  '<script src="/js/vendor/anime.min.js" defer></script>' +
  '<script src="/js/dejavu-anime.js" defer></script>' +
  '<script src="/js/dejavu-ui.js" defer></script>'
);
