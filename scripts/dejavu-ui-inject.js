'use strict';

// 强制覆盖背景的内联样式（优先级最高，确保玻璃拟态生效）
const bgStyle = `<style>
:root {
  --dj-bg: #eef1f4;
  --dj-blob-1: rgba(160, 205, 193, .50);
  --dj-blob-2: rgba(168, 190, 220, .45);
  --dj-blob-3: rgba(228, 205, 175, .42);
  --dj-ink: #333d47;
  --dj-accent: #3e7d74;
  --dj-accent-2: #a8794e;
  --dj-accent-soft: rgba(62, 125, 116, .12);
  --dj-glass: rgba(255, 255, 255, .65);
  --dj-glass-strong: rgba(255, 255, 255, .85);
  --dj-line: rgba(51, 61, 71, .1);
  --dj-blur: 16px;
}
body {
  background: radial-gradient(1100px 760px at 12% -8%, var(--dj-blob-1) 0%, transparent 56%),
    radial-gradient(980px 700px at 102% 4%, var(--dj-blob-2) 0%, transparent 52%),
    radial-gradient(1150px 900px at 50% 118%, var(--dj-blob-3) 0%, transparent 56%),
    var(--dj-bg) !important;
  background-attachment: fixed !important;
}
#wrap {
  background: transparent !important;
}
#header {
  background: var(--dj-glass-strong) !important;
  -webkit-backdrop-filter: blur(var(--dj-blur)) saturate(1.5) !important;
  backdrop-filter: blur(var(--dj-blur)) saturate(1.5) !important;
  border-bottom: 1px solid var(--dj-line) !important;
}
article.article {
  background: var(--dj-glass) !important;
  -webkit-backdrop-filter: blur(var(--dj-blur)) saturate(1.4) !important;
  backdrop-filter: blur(var(--dj-blur)) saturate(1.4) !important;
  border: 1px solid var(--dj-line) !important;
  border-radius: 22px !important;
  box-shadow: 0 10px 28px -14px rgba(28, 42, 52, .16) !important;
  overflow: hidden !important;
}
.article-inner {
  background: transparent !important;
  box-shadow: none !important;
  border: none !important;
}
.article-entry h2 {
  padding-left: 14px;
  position: relative;
}
.article-entry h2::before {
  content: "";
  position: absolute;
  left: 0;
  top: .16em;
  bottom: .16em;
  width: 4px;
  border-radius: 4px;
  background: linear-gradient(180deg, var(--dj-accent), var(--dj-accent-2));
}
.article-entry a {
  color: var(--dj-accent);
  text-decoration: none;
}
.article-entry blockquote {
  border-left: 4px solid var(--dj-accent);
  background: var(--dj-accent-soft);
  border-radius: 12px;
  padding: 14px 20px;
}
.article-entry code {
  background: var(--dj-accent-soft);
  color: var(--dj-accent);
  padding: 2px 6px;
  border-radius: 6px;
}
.article-entry pre {
  border: 1px solid var(--dj-line);
  border-radius: 12px;
  padding: 16px 18px;
}
#banner { display: none !important; }
</style>`;

hexo.extend.injector.register(
  'head_end',
  bgStyle +
  '<link rel="stylesheet" href="/css/dejavu-ui.css" media="all">' +
  '<link rel="stylesheet" href="/css/dejavu-anime.css" media="all">'
);

hexo.extend.injector.register(
  'body_end',
  '<script src="/js/dejavu-ui.js" defer></script>'
);
