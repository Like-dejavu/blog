/* global hexo */
'use strict';

/**
 * dejavu-ui 2.0 —— 静态资源注入
 * 只做三件事：注入样式表、注入启动脚本（主题色 / 站点信息）、注入页面统计占位。
 * 不改动主题模板，不影响主题自带的脚本（移动端菜单、搜索框、分享弹层）。
 */

const site = {
  title: hexo.config.title || 'dejavu',
  subtitle: hexo.config.subtitle || '',
  description: hexo.config.description || ''
};

// 提前执行：在 CSS 之前把 data-theme 放到 <html> 上，避免深色模式闪白。
const boot = `<script>(function(){try{var t=localStorage.getItem('dj-theme');if(t==="light"||t==="dark"){document.documentElement.setAttribute("data-theme",t);}}catch(e){}window.DJ_SITE=${JSON.stringify(site)
  .replace(/</g, '\\u003c')};})();</script>`;

hexo.extend.injector.register('head_begin', boot);
hexo.extend.injector.register('head_end', '<link rel="stylesheet" href="/css/dejavu-ui.css" media="all">');
hexo.extend.injector.register('body_begin', '<div id="dj-stats" hidden data-stats="__DJ_STATS__"></div>');
hexo.extend.injector.register('body_end', '<script src="/js/dejavu-ui.js" defer></script>');

// injector 在 after_render:html 之前执行，所以在渲染完成后替换统计占位符。
hexo.extend.filter.register('after_render:html', function (str) {
  if (!str || str.indexOf('__DJ_STATS__') === -1) return str;
  let stats = { posts: 0, categories: 0, tags: 0 };
  try {
    stats = {
      posts: hexo.locals.get('posts').length,
      categories: hexo.locals.get('categories').length,
      tags: hexo.locals.get('tags').length
    };
  } catch (e) {
    // 拿不到统计时保持 0，前端会隐藏对应项。
  }
  return str.replace(/__DJ_STATS__/g, JSON.stringify(stats).replace(/"/g, '&quot;'));
});
