/* dejavu-ui 2.0 · 前端增强
   全部为渐进增强：脚本不执行时页面依旧完整可用（主题原生交互不受影响）。 */
(function () {
  'use strict';

  var doc = document;
  var root = doc.documentElement;
  var site = window.DJ_SITE || {};
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var path = location.pathname.replace(/index\.html$/, '');
  var isRoot = /^\/?$/.test(path);
  var isHome = isRoot || /\/page\/\d+\/?$/.test(path);
  var $ = function (sel, ctx) { return (ctx || doc).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || doc).querySelectorAll(sel)); };

  /* ---------- 1. 主题切换 ---------- */
  var THEME_KEY = 'dj-theme';
  var sunPath = '<circle cx="12" cy="12" r="4.2"/><path d="M12 3v2.2M12 18.8V21M3 12h2.2M18.8 12H21M5.6 5.6l1.6 1.6M16.8 16.8l1.6 1.6M18.4 5.6l-1.6 1.6M7.2 16.8l-1.6 1.6"/>';
  var moonPath = '<path d="M20.5 14.6A8.6 8.6 0 0 1 9.4 3.5 8.6 8.6 0 1 0 20.5 14.6Z"/>';

  function svgIcon(inner) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + inner + '</svg>';
  }

  function applyTheme(theme) {
    if (theme === 'light' || theme === 'dark') {
      root.setAttribute('data-theme', theme);
    } else {
      root.removeAttribute('data-theme');
    }
  }

  function currentTheme() {
    var stored = null;
    try { stored = localStorage.getItem(THEME_KEY); } catch (e) { /* 隐私模式 */ }
    if (stored === 'light' || stored === 'dark') return stored;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function buildThemeButton() {
    var subNav = $('#sub-nav');
    if (!subNav || $('#dj-theme-btn')) return;
    var btn = doc.createElement('button');
    btn.id = 'dj-theme-btn';
    btn.type = 'button';
    btn.title = '切换深色 / 浅色';
    btn.setAttribute('aria-label', '切换深色 / 浅色');
    btn.innerHTML = '<span class="dj-moon">' + svgIcon(moonPath) + '</span><span class="dj-sun">' + svgIcon(sunPath) + '</span>';
    btn.addEventListener('click', function () {
      var next = currentTheme() === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      try { localStorage.setItem(THEME_KEY, next); } catch (e) { /* 忽略 */ }
    });
    subNav.appendChild(btn);
  }

  /* ---------- 2. 顶栏 / 进度 ---------- */
  function initScrollChrome() {
    var header = $('#header');
    var bar = null;

    if (!isHome) {
      bar = doc.createElement('div');
      bar.id = 'dj-progress';
      doc.body.appendChild(bar);
    }

    var ticking = false;

    function update() {
      ticking = false;
      var y = window.pageYOffset || doc.documentElement.scrollTop;
      if (header) header.classList.toggle('dj-scrolled', y > 8);

      if (bar) {
        var docH = doc.documentElement.scrollHeight - window.innerHeight;
        var ratio = docH > 0 ? Math.min(1, Math.max(0, y / docH)) : 0;
        bar.style.width = (ratio * 100).toFixed(2) + '%';
      }

      var toTop = $('.dj-to-top');
      if (toTop) toTop.classList.toggle('dj-visible', y > 620);
    }

    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    }, { passive: true });

    window.addEventListener('resize', update, { passive: true });
    update();
  }

  /* ---------- 3. 回到顶部 ---------- */
  function initToTop() {
    if ($('.dj-to-top')) return;
    var btn = doc.createElement('button');
    btn.className = 'dj-to-top';
    btn.type = 'button';
    btn.title = '回到顶部';
    btn.setAttribute('aria-label', '回到顶部');
    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
    doc.body.appendChild(btn);
  }

  /* ---------- 4. 首页 hero ---------- */
  function readStats() {
    var holder = $('#dj-stats');
    if (!holder) return null;
    try {
      return JSON.parse(holder.getAttribute('data-stats') || '{}');
    } catch (e) {
      return null;
    }
  }

  function initHero() {
    if (!isRoot || $('.dj-hero')) return;
    var wrap = $('#wrap');
    var outer = null;
    if (wrap) {
      for (var i = 0; i < wrap.children.length; i++) {
        if (wrap.children[i].classList.contains('outer')) { outer = wrap.children[i]; break; }
      }
    }
    if (!outer) return;

    var stats = readStats() || {};
    var title = site.title || 'dejavu';
    var sub = site.description || site.subtitle || '记录代码、思考与一些笨办法。';

    var hero = doc.createElement('section');
    hero.className = 'dj-hero';
    hero.setAttribute('aria-label', '站点介绍');

    var metaBits = [];
    if (stats.posts) metaBits.push('<span class="dj-stat"><b>' + stats.posts + '</b>篇文章</span>');
    if (stats.categories) metaBits.push('<span class="dj-stat"><b>' + stats.categories + '</b>个分类</span>');
    if (stats.tags) metaBits.push('<span class="dj-stat"><b>' + stats.tags + '</b>个标签</span>');
    if (!metaBits.length) metaBits.push('<span class="dj-stat">持续更新中</span>');

    hero.innerHTML =
      '<div class="dj-hero-inner">' +
        '<p class="dj-hero-eyebrow">Journal · 技术笔记</p>' +
        '<h1 class="dj-hero-title"><em>' + escapeHtml(title) + '</em></h1>' +
        '<p class="dj-hero-sub">' + escapeHtml(sub) + '</p>' +
        '<div class="dj-hero-meta">' + metaBits.join('') + '</div>' +
        '<div class="dj-hero-actions">' +
          '<a class="dj-btn dj-btn-primary" href="#dj-posts">开始阅读</a>' +
          '<a class="dj-btn" href="/archives">全部归档</a>' +
        '</div>' +
      '</div>';

    outer.parentNode.insertBefore(hero, outer);
  }

  // 首页列表区标题（第 2 页之后没有 hero，也要有这一条）
  function initListHead() {
    if (!isHome || $('#dj-posts')) return;
    var main = $('#main');
    if (!main) return;
    var head = doc.createElement('div');
    head.className = 'dj-listhead';
    head.id = 'dj-posts';
    head.innerHTML = isRoot
      ? '<span>最新文章</span><a href="/archives">全部归档 →</a>'
      : '<span>更多文章</span><a href="/archives">全部归档 →</a>';
    main.insertBefore(head, main.firstChild);
  }

  function escapeHtml(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /* ---------- 5. 首页摘要 ---------- */
  // 按「块」边界折叠：只隐藏整块元素，不会把代码块/表格切成两半。
  var CLAMP_LIMIT = 470;
  var CLAMP_MIN_BLOCKS = 2;

  function initExcerpts() {
    if (!isHome) return;
    $$('#main > article.article').forEach(function (article) {
      var entry = $('.article-entry', article);
      if (!entry || entry.dataset.djClamp === 'done') return;
      entry.dataset.djClamp = 'done';

      if (entry.scrollHeight < 620) return;

      var kids = Array.prototype.slice.call(entry.children).filter(function (k) {
        return !k.classList.contains('dj-fade-tail');
      });
      if (kids.length <= CLAMP_MIN_BLOCKS) return;

      var base = entry.getBoundingClientRect().top;
      var cut = kids.length;
      for (var i = 0; i < kids.length; i++) {
        var bottom = kids[i].getBoundingClientRect().bottom - base;
        if (bottom > CLAMP_LIMIT) { cut = i; break; }
      }
      if (cut >= kids.length) return;
      if (cut < CLAMP_MIN_BLOCKS) cut = CLAMP_MIN_BLOCKS;

      // 不要把标题孤零零留成最后一行
      var HEADING = /^H[1-6]$/;
      var guard = 0;
      while (cut > CLAMP_MIN_BLOCKS && HEADING.test(kids[cut - 1].tagName) && guard < 4) {
        cut--;
        guard++;
      }
      // 文章开头是连续标题时，往回退只会剩标题：改为继续吞掉标题、把第一块正文纳入预览
      if (cut > 0 && HEADING.test(kids[cut - 1].tagName)) {
        var guard2 = 0;
        while (cut < kids.length && HEADING.test(kids[cut].tagName) && guard2 < 3) {
          cut++;
          guard2++;
        }
        if (cut < kids.length) {
          // 第一块正文太高（比如 30 行代码）就只露出开头一段
          if (kids[cut].getBoundingClientRect().height > 420) kids[cut].classList.add('dj-peek');
          cut++;
        }
      }

      for (var j = cut; j < kids.length; j++) {
        kids[j].classList.add('dj-hide');
      }

      entry.classList.add('dj-clamped');

      var link = $('.article-title a', article) || $('.article-meta a.article-date', article);
      var href = link ? link.getAttribute('href') : null;
      if (href) {
        var more = doc.createElement('a');
        more.className = 'dj-readmore';
        more.href = href;
        more.textContent = '阅读全文';
        entry.parentNode.insertBefore(more, entry.nextSibling);
      }
    });
  }

  /* ---------- 6. 代码块工具条 ---------- */
  function langOf(node) {
    var cls = (node.getAttribute('class') || '') + ' ';
    var m = cls.match(/highlight\s+([a-z0-9+#-]+)/i) || cls.match(/language-([a-z0-9+#-]+)/i);
    if (m && m[1] && m[1].toLowerCase() !== 'highlight') return m[1];
    var code = node.tagName === 'PRE' ? $('code', node) : null;
    if (code) {
      var m2 = (code.getAttribute('class') || '').match(/language-([a-z0-9+#-]+)/i);
      if (m2) return m2[1];
    }
    return 'code';
  }

  function initCodeBlocks() {
    var entry = $('.article-entry');
    if (!entry) return;

    var blocks = $$('figure.highlight, pre', entry).filter(function (node) {
      return !node.closest('.dj-code') && !node.parentNode.closest('figure.highlight');
    });

    blocks.forEach(function (node) {
      var lang = langOf(node);

      var box = doc.createElement('div');
      box.className = 'dj-code';
      node.parentNode.insertBefore(box, node);
      box.appendChild(node);

      var bar = doc.createElement('div');
      bar.className = 'dj-code-bar';

      var dot = doc.createElement('span');
      dot.className = 'dj-code-dot';
      var label = doc.createElement('span');
      label.className = 'dj-code-lang';
      label.textContent = lang;

      var copy = doc.createElement('button');
      copy.className = 'dj-code-copy';
      copy.type = 'button';
      copy.textContent = '复制';

      bar.appendChild(dot);
      bar.appendChild(label);
      bar.appendChild(copy);
      box.insertBefore(bar, node);

      copy.addEventListener('click', function () {
        var text = node.innerText || node.textContent || '';
        copyText(text.replace(/\n{3,}/g, '\n\n').replace(/\s+$/, '')).then(function (ok) {
          copy.textContent = ok ? '已复制' : '复制失败';
          copy.classList.toggle('dj-copied', ok);
          setTimeout(function () {
            copy.textContent = '复制';
            copy.classList.remove('dj-copied');
          }, 1800);
        });
      });
    });
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).then(function () { return true; }).catch(fallback);
    }
    return Promise.resolve(fallback());

    function fallback() {
      try {
        var ta = doc.createElement('textarea');
        ta.value = text;
        ta.setAttribute('readonly', '');
        ta.style.cssText = 'position:fixed;top:-1000px;opacity:0';
        doc.body.appendChild(ta);
        ta.select();
        var ok = doc.execCommand('copy');
        doc.body.removeChild(ta);
        return ok;
      } catch (e) {
        return false;
      }
    }
  }

  /* ---------- 6.5 上一篇 / 下一篇 ---------- */
  // 只有单侧文章时，让卡片占满整行，避免半行留白。
  function initArticleNav() {
    var nav = $('#article-nav');
    if (!nav) return;
    var count = 0;
    for (var i = 0; i < nav.children.length; i++) {
      if (nav.children[i].classList.contains('article-nav-link-wrap')) count++;
    }
    if (!count) {
      nav.style.display = 'none';
      return;
    }
    nav.classList.toggle('dj-single', count === 1);
  }

  /* ---------- 7. 文章目录 ---------- */  function initToc() {
    if (isHome) return;
    var entry = $('.article-entry');
    var sidebar = $('#sidebar');
    if (!entry || !sidebar) return;

    var heads = $$('h2, h3', entry).filter(function (h) {
      return h.id && h.textContent.trim().length > 0;
    });
    if (heads.length < 2) return;

    var card = doc.createElement('div');
    card.className = 'widget-wrap dj-toc';
    var title = doc.createElement('h3');
    title.className = 'widget-title';
    title.textContent = '目录';
    var list = doc.createElement('ol');
    list.className = 'dj-toc-list';

    heads.forEach(function (h) {
      var li = doc.createElement('li');
      li.className = h.tagName === 'H3' ? 'dj-lv3' : 'dj-lv2';
      var a = doc.createElement('a');
      a.href = '#' + h.id;
      a.textContent = h.textContent.trim();
      a.dataset.target = h.id;
      li.appendChild(a);
      list.appendChild(li);
    });

    card.appendChild(title);
    card.appendChild(list);
    sidebar.insertBefore(card, sidebar.firstChild);

    var links = $$('a', list);
    var map = {};
    links.forEach(function (a) { map[a.dataset.target] = a; });

    var ticking = false;

    function spy() {
      ticking = false;
      var offset = (parseInt(getComputedStyle(root).getPropertyValue('--dj-header-h'), 10) || 62) + 90;
      var active = null;
      for (var i = 0; i < heads.length; i++) {
        if (heads[i].getBoundingClientRect().top - offset <= 0) active = heads[i];
        else break;
      }
      links.forEach(function (a) { a.classList.remove('dj-active'); });
      if (active && map[active.id]) {
        var cur = map[active.id];
        cur.classList.add('dj-active');
        var box = list;
        var top = cur.offsetTop - box.offsetTop;
        if (top < box.scrollTop || top > box.scrollTop + box.clientHeight - 40) {
          box.scrollTop = Math.max(0, top - box.clientHeight / 2);
        }
      }
    }

    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(spy);
    }, { passive: true });

    spy();
  }

  /* ---------- 8. 入场动效 ---------- */
  function initReveal() {
    if (reduceMotion || !('IntersectionObserver' in window)) return;

    var items = $$('#main > article.article, #sidebar .widget-wrap, .archives-wrap, #page-nav');
    if (!items.length) return;

    items.forEach(function (el) { el.classList.add('dj-reveal'); });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('dj-in');
        io.unobserve(en.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });

    items.forEach(function (el) { io.observe(el); });

    // 首屏元素（hero 之后的头两张卡片）直接显示，避免闪烁
    items.slice(0, 2).forEach(function (el, i) {
      setTimeout(function () { el.classList.add('dj-in'); }, 90 * i);
    });
  }

  /* ---------- 9. 页脚 ---------- */
  function initFooter() {
    var info = $('#footer-info');
    if (!info || $('.dj-footer-top', info)) return;

    var year = new Date().getFullYear();
    var title = site.title || 'dejavu';

    var top = doc.createElement('div');
    top.className = 'dj-footer-top';
    top.innerHTML =
      '<span class="dj-footer-title">' + escapeHtml(title) + '</span>' +
      '<span class="dj-footer-links">' +
        '<a href="/">首页</a>' +
        '<a href="/archives">归档</a>' +
        '<a href="/categories">分类</a>' +
        '<a href="/tags">标签</a>' +
        '<a href="/atom.xml">RSS</a>' +
      '</span>';
    info.insertBefore(top, info.firstChild);

    // 版权行改为站点名 + 年份（主题默认会打印 author）
    var html = info.innerHTML;
    if (/&copy;\s*\d{4}/.test(html)) {
      html = html.replace(/(&copy;\s*)\d{4}(\s*)([^<]*)/, function (m, p1, p2, p3) {
        var name = p3.trim() === 'John Doe' || !p3.trim() ? title : p3.trim();
        return p1 + year + ' ' + name;
      });
      // 避免替换到刚插入的链接区
      if (html.indexOf('dj-footer-top') !== -1) info.innerHTML = html;
    }
  }

  /* ---------- 10. 导航 ---------- */
  // 主题自带菜单（Home / Archives）与 _config.landscape.yml 的中文菜单会合并成重复项，
  // 这里按 href 去重，保留中文标签那条。
  function dedupeNav() {
    var links = $$('#main-nav .main-nav-link');
    var seen = {};

    links.forEach(function (a) {
      var key = (a.getAttribute('href') || '/').replace(/\/+$/, '') || '/';
      var isCjk = /[\u4e00-\u9fa5]/.test(a.textContent || '');
      var prev = seen[key];

      if (!prev) { seen[key] = a; return; }

      if (isCjk && !/[\u4e00-\u9fa5]/.test(prev.textContent || '')) {
        prev.parentNode.removeChild(prev);
        seen[key] = a;
      } else {
        a.parentNode.removeChild(a);
      }
    });
  }

  // 主题的 widgets 数组会与 _config.landscape.yml 合并（取并集），
  // 于是「标签」列表与「标签云」同时出现。保留标签云，收起纯列表。
  function tidyWidgets() {
    var titles = $$('#sidebar .widget-wrap');
    var hasCloud = false;
    titles.forEach(function (wrap) {
      var t = $('.widget-title', wrap);
      if (t && (t.textContent || '').indexOf('标签云') !== -1) hasCloud = true;
    });
    if (!hasCloud) return;

    titles.forEach(function (wrap) {
      var t = $('.widget-title', wrap);
      if (t && (t.textContent || '').trim() === '标签') wrap.classList.add('dj-widget-quiet');
    });
  }

  function markCurrentNav() {
    $$('#main-nav .main-nav-link').forEach(function (a) {
      var href = (a.getAttribute('href') || '/').replace(/\/$/, '');
      var here = location.pathname.replace(/index\.html$/, '').replace(/\/$/, '');
      if (href === here || (href !== '' && href !== '/' && here.indexOf(href) === 0)) {
        a.classList.add('dj-current');
      }
    });
  }

  /* ---------- 启动 ---------- */
  function boot() {
    // 支持用 ?dj-theme=dark|light 直接切换（便于分享带主题的链接）
    var forced = (location.search.match(/[?&]dj-theme=(dark|light)/) || [])[1];
    if (forced) {
      applyTheme(forced);
      try { localStorage.setItem(THEME_KEY, forced); } catch (e) { /* 忽略 */ }
    }

    buildThemeButton();
    dedupeNav();
    tidyWidgets();
    markCurrentNav();
    initHero();
    initListHead();
    initCodeBlocks();
    initExcerpts();
    initArticleNav();
    initToc();
    initReveal();
    initFooter();
    initToTop();
    initScrollChrome();
  }

  if (doc.readyState === 'loading') {
    doc.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
