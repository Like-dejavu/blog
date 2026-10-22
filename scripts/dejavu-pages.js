/* global hexo */
'use strict';

/**
 * dejavu-ui 2.0 —— 分类 / 标签总览页
 * hexo-generator-category 只会生成每个分类自己的页面，/categories/ 与 /tags/ 默认不存在，
 * 菜单点过去就是 404。这里补两个总览页，沿用主题 page 布局，样式由 dejavu-ui.css 提供。
 */

function escapeHtml(str) {
  return String(str == null ? '' : str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function hrefOf(item) {
  const p = String(item.path || '');
  const withSlash = p.endsWith('/') ? p : p + '/';
  return '/' + (withSlash.indexOf('%') === -1 ? encodeURI(withSlash) : withSlash);
}

function grid(items, baseLabel) {
  const total = items.reduce((sum, item) => sum + (item.length || 0), 0);
  const cards = items
    .map((item) => {
      const href = hrefOf(item);
      return (
        '<li class="dj-tax-item">' +
        '<a href="' + href + '">' +
        '<span class="dj-tax-name">' + escapeHtml(item.name) + '</span>' +
        '<span class="dj-tax-count">' + (item.length || 0) + '</span>' +
        '</a></li>'
      );
    })
    .join('');

  return (
    '<p class="dj-tax-intro">共 ' +
    items.length +
    ' 个' + baseLabel + '，' + total + ' 篇文章。按名称排序。</p>' +
    '<ul class="dj-tax-grid">' + cards + '</ul>'
  );
}

function sortByName(list) {
  return list.slice().sort((a, b) => String(a.name).localeCompare(String(b.name), 'zh-Hans-CN'));
}

hexo.extend.generator.register('dejavu_taxonomy_index', function (locals) {
  const categories = sortByName(locals.categories.toArray());
  const tags = sortByName(locals.tags.toArray());

  return [
    {
      path: 'categories/index.html',
      layout: 'page',
      data: {
        layout: 'page',
        title: '分类',
        slug: 'categories-index',
        content: grid(categories, '分类')
      }
    },
    {
      path: 'tags/index.html',
      layout: 'page',
      data: {
        layout: 'page',
        title: '标签',
        slug: 'tags-index',
        content: grid(tags, '标签')
      }
    }
  ];
});
