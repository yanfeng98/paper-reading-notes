/* Paper Reading Notes — library, reader, theme. */
(function () {
  'use strict';

  var body = document.body;
  if (!body) return;
  var page = body.dataset.page;
  var root = body.dataset.root || './';
  var THEME_KEY = 'prn-theme';
  var themeMedia = window.matchMedia('(prefers-color-scheme: dark)');

  function storedTheme() {
    try { return localStorage.getItem(THEME_KEY) || 'auto'; } catch (error) { return 'auto'; }
  }

  function resolveTheme(mode) {
    if (mode === 'auto') return themeMedia.matches ? 'dark' : 'light';
    return mode === 'dark' ? 'dark' : 'light';
  }

  function updateThemeControls(mode) {
    var labels = { auto: ['◐', '自动'], light: ['☀', '浅色'], dark: ['☾', '深色'] };
    var pair = labels[mode] || labels.auto;
    document.querySelectorAll('[data-theme-toggle]').forEach(function (button) {
      var icon = button.querySelector('.theme-icon');
      var label = button.querySelector('.theme-label');
      if (icon) icon.textContent = pair[0];
      if (label) label.textContent = pair[1];
      button.setAttribute('title', '主题：' + pair[1]);
    });
  }

  function applyTheme(mode, persist) {
    var resolved = resolveTheme(mode);
    document.documentElement.dataset.theme = resolved;
    document.documentElement.dataset.themeMode = mode;
    if (persist) {
      try { localStorage.setItem(THEME_KEY, mode); } catch (error) { /* ignore */ }
    }
    updateThemeControls(mode);
    if (typeof window.__rerenderMermaid === 'function') {
      window.__rerenderMermaid().catch(function (error) {
        console.warn('Mermaid theme re-render failed:', error);
      });
    }
  }

  function initTheme() {
    var mode = storedTheme();
    if (['auto', 'light', 'dark'].indexOf(mode) < 0) mode = 'auto';
    applyTheme(mode, false);
    document.querySelectorAll('[data-theme-toggle]').forEach(function (button) {
      button.addEventListener('click', function () {
        var current = document.documentElement.dataset.themeMode || 'auto';
        var systemTheme = themeMedia.matches ? 'dark' : 'light';
        var next;
        if (current === 'auto') {
          // First click always makes a visible change: go to the opposite theme.
          next = systemTheme === 'light' ? 'dark' : 'light';
        } else if (current === 'light') {
          next = systemTheme === 'light' ? 'auto' : 'dark';
        } else {
          next = systemTheme === 'light' ? 'light' : 'auto';
        }
        applyTheme(next, true);
      });
    });
    var onChange = function () {
      if ((document.documentElement.dataset.themeMode || 'auto') === 'auto') {
        applyTheme('auto', false);
      }
    };
    if (themeMedia.addEventListener) themeMedia.addEventListener('change', onChange);
    else if (themeMedia.addListener) themeMedia.addListener(onChange);
  }

  function debounce(fn, wait) {
    var timer = null;
    return function () {
      var args = arguments;
      clearTimeout(timer);
      timer = setTimeout(function () { fn.apply(null, args); }, wait);
    };
  }

  /* ---------------- home library ---------------- */

  function initHome() {
    var params = new URLSearchParams(window.location.search);
    var legacy = window.__LEGACY_MAP__ || {};
    var requested = params.get('doc');
    if (requested) {
      var target = legacy[requested] || legacy[requested.replace(/^\.\//, '')];
      if (target) {
        window.location.replace(target + window.location.hash);
        return;
      }
    }

    var cardsEl = document.getElementById('cards');
    var cards = Array.prototype.slice.call(document.querySelectorAll('.card'));
    var featuredWrap = document.querySelector('.featured');
    var featuredCards = Array.prototype.slice.call(document.querySelectorAll('.featured-card'));
    var search = document.getElementById('search');
    var sort = document.getElementById('sort');
    var empty = document.getElementById('empty');
    var resultCount = document.getElementById('result-count');
    var clear = document.getElementById('clear-filters');
    var filters = Array.prototype.slice.call(document.querySelectorAll('.filter'));
    if (!cardsEl || !search) return;

    var state = {
      q: params.get('q') || '',
      type: params.get('type') || 'all',
      sort: params.get('sort') || 'recent'
    };
    if (['all', 'paper', 'blog', 'summary'].indexOf(state.type) < 0) state.type = 'all';
    if (['recent', 'year', 'title'].indexOf(state.sort) < 0) state.sort = 'recent';

    function sortCards() {
      cards.sort(function (a, b) {
        if (state.sort === 'title') {
          return (a.dataset.title || '').localeCompare(b.dataset.title || '', 'zh-Hans-CN');
        }
        if (state.sort === 'year') {
          var yd = (b.dataset.year || '').localeCompare(a.dataset.year || '');
          if (yd) return yd;
        }
        var rd = (b.dataset.readDate || '').localeCompare(a.dataset.readDate || '');
        if (rd) return rd;
        return (b.dataset.year || '').localeCompare(a.dataset.year || '');
      });
      cards.forEach(function (card) { cardsEl.appendChild(card); });
    }

    function matches(el) {
      var query = state.q.trim().toLowerCase();
      if (state.type !== 'all' && el.dataset.kind !== state.type) return false;
      if (!query) return true;
      return (el.dataset.search || '').indexOf(query) >= 0;
    }

    function writeUrl() {
      var next = new URLSearchParams();
      if (state.q.trim()) next.set('q', state.q.trim());
      if (state.type !== 'all') next.set('type', state.type);
      if (state.sort !== 'recent') next.set('sort', state.sort);
      var query = next.toString();
      var url = window.location.pathname + (query ? '?' + query : '') + window.location.hash;
      window.history.replaceState(null, '', url);
    }

    function apply() {
      sortCards();
      var visible = 0;
      cards.forEach(function (card) {
        var show = matches(card);
        card.hidden = !show;
        if (show) visible += 1;
      });
      var featuredVisible = 0;
      featuredCards.forEach(function (card) {
        var show = matches(card);
        card.hidden = !show;
        if (show) featuredVisible += 1;
      });
      if (featuredWrap) featuredWrap.hidden = featuredVisible === 0;
      visible += featuredVisible;
      if (empty) empty.hidden = visible !== 0;
      if (resultCount) resultCount.textContent = visible + ' 份文档';
      filters.forEach(function (button) {
        var active = button.dataset.filter === state.type;
        button.classList.toggle('is-active', active);
        button.setAttribute('aria-pressed', active ? 'true' : 'false');
      });
      if (search.value !== state.q) search.value = state.q;
      if (sort.value !== state.sort) sort.value = state.sort;
      writeUrl();
    }

    search.addEventListener('input', function () {
      state.q = search.value;
      apply();
    });
    sort.addEventListener('change', function () {
      state.sort = sort.value;
      apply();
    });
    filters.forEach(function (button) {
      button.addEventListener('click', function () {
        state.type = button.dataset.filter || 'all';
        apply();
        search.focus();
      });
    });
    if (clear) {
      clear.addEventListener('click', function () {
        state = { q: '', type: 'all', sort: 'recent' };
        apply();
        search.focus();
      });
    }
    document.addEventListener('keydown', function (event) {
      var tag = (event.target && event.target.tagName || '').toLowerCase();
      var editing = tag === 'input' || tag === 'textarea' || tag === 'select' || event.target.isContentEditable;
      if (event.key === '/' && !editing && !event.metaKey && !event.ctrlKey && !event.altKey) {
        event.preventDefault();
        search.focus();
      } else if (event.key === 'Escape' && document.activeElement === search) {
        search.value = '';
        state.q = '';
        apply();
        search.blur();
      }
    });
    apply();
  }

  /* ---------------- document reader ---------------- */

  function initDoc() {
    var content = document.getElementById('doc-content');
    var dataEl = document.getElementById('doc-data');
    if (!content || !dataEl) return;
    var data;
    try { data = JSON.parse(dataEl.textContent); }
    catch (error) { fail('文档元数据损坏：' + error.message); return; }

    var expectedMath = Number(data.expectedMath || 0);
    var expectedMermaid = Number(data.expectedMermaid || 0);
    var routes = data.routes || {};
    var pdfFiles = data.pdfFiles || {};
    var repo = data.repo || '';
    var source = data.source || '';
    window.__renderError = null;

    function fail(message) {
      var text = String(message && message.message ? message.message : message);
      window.__renderError = text;
      content.innerHTML = '';
      var box = document.createElement('div');
      box.className = 'render-error';
      box.textContent = '正文渲染失败：' + text;
      content.appendChild(box);
      window.__renderDone = true;
    }

    function loadScript(src) {
      return new Promise(function (resolve, reject) {
        var script = document.createElement('script');
        script.src = src;
        script.async = true;
        script.onload = resolve;
        script.onerror = function () { reject(new Error('加载失败：' + src)); };
        document.head.appendChild(script);
      });
    }

    function waitForMathJax() {
      return new Promise(function (resolve, reject) {
        var deadline = Date.now() + 20000;
        (function poll() {
          if (window.MathJax && MathJax.startup && MathJax.startup.promise) {
            MathJax.startup.promise.then(function () { resolve(); }, reject);
            return;
          }
          if (Date.now() > deadline) {
            reject(new Error('MathJax 加载超时'));
            return;
          }
          setTimeout(poll, 50);
        })();
      });
    }

    function slugify(text) {
      var slug = String(text || '').toLowerCase().trim()
        .replace(/\s+/g, '-')
        .replace(/[^\p{L}\p{N}\-_]/gu, '')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      return slug || 'section';
    }

    function addHeadingIds() {
      var used = Object.create(null);
      content.querySelectorAll('h2, h3').forEach(function (heading) {
        var base = slugify(heading.textContent);
        var id = base;
        var index = 2;
        while (used[id]) { id = base + '-' + index; index += 1; }
        used[id] = true;
        heading.id = id;
      });
    }

    function buildToc() {
      var desktop = document.getElementById('toc-list');
      var mobile = document.getElementById('mobile-toc-list');
      if (!desktop && !mobile) return;
      var headings = Array.prototype.slice.call(content.querySelectorAll('h2'));
      headings.forEach(function (heading) {
        [desktop, mobile].forEach(function (container) {
          if (!container) return;
          var link = document.createElement('a');
          link.href = '#' + heading.id;
          link.textContent = heading.textContent;
          container.appendChild(link);
        });
      });
      if (!headings.length) {
        var toc = document.querySelector('.toc');
        if (toc) toc.style.display = 'none';
        var mobileToc = document.querySelector('.mobile-toc');
        if (mobileToc) mobileToc.style.display = 'none';
      }
    }

    function resolveTarget(href, isImage) {
      if (!href) return null;
      if (href.charAt(0) === '#' || /^(https?:|mailto:|tel:|data:|\/\/)/i.test(href)) {
        return { href: href, external: /^(https?:|mailto:|tel:|\/\/)/i.test(href) };
      }
      if (href.charAt(0) === '/') return { href: href, external: false };
      var url;
      try {
        url = new URL(href, 'https://site.invalid/' + source);
      } catch (error) {
        return { href: href, external: false };
      }
      var path;
      try { path = decodeURIComponent(url.pathname.replace(/^\/+/, '')); }
      catch (error) { path = url.pathname.replace(/^\/+/, ''); }
      if (path.indexOf('../') === 0 || path === '..') {
        return { href: repo + '/blob/main/' + path, external: true };
      }
      var suffix = url.search + url.hash;
      var noteAsset = /^notes\/(?:papers|blogs)\/[^/]+\/assets\//.test(path);
      if (isImage) {
        if (noteAsset) {
          return { href: data.root + path + suffix, external: false };
        }
        return { href: repo + '/raw/main/' + path + suffix, external: true };
      }
      if (routes[path]) {
        return { href: data.root + routes[path] + suffix, external: false };
      }
      if (pdfFiles[path]) {
        return { href: data.root + pdfFiles[path] + suffix, external: false };
      }
      if (noteAsset) {
        return { href: data.root + path + suffix, external: false };
      }
      return { href: repo + '/blob/main/' + path + suffix, external: true };
    }

    function rewriteLinks() {
      content.querySelectorAll('a[href]').forEach(function (anchor) {
        var resolved = resolveTarget(anchor.getAttribute('href'), false);
        if (!resolved) return;
        anchor.setAttribute('href', resolved.href);
        if (resolved.external) {
          anchor.setAttribute('target', '_blank');
          anchor.setAttribute('rel', 'noopener noreferrer');
        }
      });
      content.querySelectorAll('img[src]').forEach(function (image) {
        var resolved = resolveTarget(image.getAttribute('src'), true);
        if (!resolved) return;
        image.setAttribute('src', resolved.href);
        image.setAttribute('loading', 'lazy');
        image.setAttribute('decoding', 'async');
        if (resolved.external) {
          image.setAttribute('referrerpolicy', 'no-referrer');
        }
      });
    }

    function wrapTables() {
      content.querySelectorAll('table').forEach(function (table) {
        if (table.parentElement && table.parentElement.classList.contains('table-wrap')) return;
        var wrapper = document.createElement('div');
        wrapper.className = 'table-wrap';
        table.parentNode.insertBefore(wrapper, table);
        wrapper.appendChild(table);
      });
    }

    function wrapImages() {
      content.querySelectorAll('img').forEach(function (image) {
        var parent = image.parentElement;
        if (!parent || parent.tagName !== 'P' || parent.children.length !== 1 || parent.textContent.trim()) {
          return;
        }
        var figure = document.createElement('figure');
        parent.replaceWith(figure);
        figure.appendChild(image);
        if (image.alt) {
          var caption = document.createElement('figcaption');
          caption.textContent = image.alt;
          figure.appendChild(caption);
        }
        image.addEventListener('click', function () { openLightbox(image); });
      });
    }

    function openLightbox(image) {
      var dialog = document.getElementById('lightbox');
      var target = document.getElementById('lightbox-image');
      var caption = document.getElementById('lightbox-caption');
      if (!dialog || !target) return;
      target.src = image.currentSrc || image.src;
      target.alt = image.alt || '';
      caption.textContent = image.alt || '';
      if (dialog.showModal) dialog.showModal();
      else dialog.setAttribute('open', '');
    }

    function initLightbox() {
      var dialog = document.getElementById('lightbox');
      if (!dialog) return;
      var close = dialog.querySelector('[data-lightbox-close]');
      if (close) close.addEventListener('click', function () { dialog.close(); });
      dialog.addEventListener('click', function (event) {
        if (event.target === dialog) dialog.close();
      });
    }

    /* ---------------- diagram zoom ---------------- */

    var ZOOM_STEPS = [0.5, 0.75, 1, 1.25, 1.5, 2, 2.5, 3, 4];
    var diagramState = {
      dialog: null,
      stage: null,
      percent: null,
      reset: null,
      zoomOut: null,
      zoomIn: null,
      svg: null,
      natural: null,
      scale: 1
    };

    function diagramNaturalSize(svg) {
      var box = svg.viewBox && svg.viewBox.baseVal;
      if (box && box.width > 0 && box.height > 0) {
        return { width: box.width, height: box.height };
      }
      var rect = svg.getBoundingClientRect();
      var width = parseFloat(svg.style.maxWidth) || rect.width || 960;
      var height = rect.height || width * 0.66;
      return { width: width, height: height };
    }

    function setDiagramScale(next) {
      var state = diagramState;
      if (!state.svg || !state.natural) return;
      var scale = Math.max(ZOOM_STEPS[0], Math.min(ZOOM_STEPS[ZOOM_STEPS.length - 1], next));
      var stage = state.stage;
      var stageRect = stage.getBoundingClientRect();
      var oldRect = state.svg.getBoundingClientRect();
      var focusX = oldRect.width ? (stageRect.left + stage.clientWidth / 2 - oldRect.left) / oldRect.width : 0.5;
      var focusY = oldRect.height ? (stageRect.top + stage.clientHeight / 2 - oldRect.top) / oldRect.height : 0.5;
      var width = Math.round(state.natural.width * scale);
      var height = Math.round(state.natural.height * scale);
      state.scale = scale;
      state.svg.setAttribute('width', String(width));
      state.svg.setAttribute('height', String(height));
      state.svg.style.width = width + 'px';
      state.svg.style.height = height + 'px';
      state.svg.style.maxWidth = 'none';
      var newRect = state.svg.getBoundingClientRect();
      stage.scrollLeft += (newRect.left + focusX * newRect.width) - (stageRect.left + stage.clientWidth / 2);
      stage.scrollTop += (newRect.top + focusY * newRect.height) - (stageRect.top + stage.clientHeight / 2);
      var percent = Math.round(scale * 100);
      if (state.percent) state.percent.textContent = percent + '%';
      if (state.reset) state.reset.setAttribute('aria-label', '当前缩放 ' + percent + '%，重置为 100%');
      if (state.zoomOut) state.zoomOut.disabled = scale <= ZOOM_STEPS[0];
      if (state.zoomIn) state.zoomIn.disabled = scale >= ZOOM_STEPS[ZOOM_STEPS.length - 1];
    }

    function stepDiagramScale(direction) {
      var index = ZOOM_STEPS.indexOf(diagramState.scale);
      if (index < 0) index = ZOOM_STEPS.indexOf(1);
      index = Math.max(0, Math.min(ZOOM_STEPS.length - 1, index + direction));
      setDiagramScale(ZOOM_STEPS[index]);
    }

    function resetDiagramStage() {
      var state = diagramState;
      if (state.stage) state.stage.innerHTML = '';
      state.svg = null;
      state.natural = null;
      state.scale = 1;
      if (state.percent) state.percent.textContent = '100%';
      if (state.reset) state.reset.setAttribute('aria-label', '当前缩放 100%，重置为 100%');
      if (state.zoomOut) state.zoomOut.disabled = false;
      if (state.zoomIn) state.zoomIn.disabled = false;
    }

    function closeDiagram() {
      var dialog = diagramState.dialog;
      if (!dialog || !dialog.open) return;
      resetDiagramStage();
      if (dialog.close) dialog.close();
      else dialog.removeAttribute('open');
    }

    function openDiagram(block) {
      var state = diagramState;
      if (!state.dialog || !state.stage) return;
      var source = block.querySelector(':scope > svg');
      if (!source || source.getAttribute('aria-roledescription') === 'error') return;
      var natural = diagramNaturalSize(source);
      var width = Math.round(natural.width);
      var height = Math.round(natural.height);
      var clone = source.cloneNode(true);
      clone.style.display = 'block';
      clone.style.maxWidth = 'none';
      clone.style.width = width + 'px';
      clone.style.height = height + 'px';
      clone.setAttribute('width', String(width));
      clone.setAttribute('height', String(height));
      state.natural = natural;
      state.scale = 1;
      state.svg = clone;
      state.stage.innerHTML = '';
      state.stage.appendChild(clone);
      if (!state.dialog.open) {
        if (state.dialog.showModal) state.dialog.showModal();
        else state.dialog.setAttribute('open', '');
      }
      setDiagramScale(1);
      state.stage.scrollLeft = 0;
      state.stage.scrollTop = 0;
      state.stage.focus();
    }

    function decorateMermaidBlocks() {
      mermaidBlocks.forEach(function (block) {
        if (block.querySelector('.mermaid-zoom')) return;
        var svg = block.querySelector(':scope > svg');
        if (!svg || svg.getAttribute('aria-roledescription') === 'error') return;
        var button = document.createElement('button');
        button.type = 'button';
        button.className = 'mermaid-zoom';
        button.textContent = '↗ 放大';
        button.setAttribute('aria-label', '放大查看图表');
        button.setAttribute('aria-haspopup', 'dialog');
        block.appendChild(button);
      });
    }

    function initDiagramDialog() {
      var dialog = document.getElementById('diagram-dialog');
      if (!dialog) return;
      var state = diagramState;
      state.dialog = dialog;
      state.stage = document.getElementById('diagram-stage');
      state.percent = dialog.querySelector('[data-diagram-percent]');
      state.reset = dialog.querySelector('[data-diagram-reset]');
      state.zoomOut = dialog.querySelector('[data-diagram-zoom-out]');
      state.zoomIn = dialog.querySelector('[data-diagram-zoom-in]');
      var close = dialog.querySelector('[data-diagram-close]');
      if (close) close.addEventListener('click', closeDiagram);
      if (state.reset) state.reset.addEventListener('click', function () { setDiagramScale(1); });
      if (state.zoomOut) state.zoomOut.addEventListener('click', function () { stepDiagramScale(-1); });
      if (state.zoomIn) state.zoomIn.addEventListener('click', function () { stepDiagramScale(1); });
      dialog.addEventListener('click', function (event) {
        if (event.target === dialog) closeDiagram();
      });
      if (state.stage) {
        var lastWheelZoom = 0;
        state.stage.addEventListener('wheel', function (event) {
          if (!event.ctrlKey && !event.metaKey) return;
          event.preventDefault();
          if (!event.deltaY) return;
          var now = (typeof performance !== 'undefined' && performance.now)
            ? performance.now()
            : Date.now();
          if (now - lastWheelZoom < 120) return;
          lastWheelZoom = now;
          stepDiagramScale(event.deltaY < 0 ? 1 : -1);
        }, { passive: false });
      }
      dialog.addEventListener('cancel', resetDiagramStage);
      dialog.addEventListener('close', resetDiagramStage);

      content.addEventListener('click', function (event) {
        var target = event.target;
        if (!target || !target.closest) return;
        var button = target.closest('.mermaid-zoom');
        if (button) {
          event.preventDefault();
          var buttonBlock = button.closest('.mermaid');
          if (buttonBlock) openDiagram(buttonBlock);
          return;
        }
        if (target.closest('a')) return;
        var block = target.closest('.mermaid');
        if (!block) return;
        var selection = window.getSelection ? window.getSelection() : null;
        if (selection && String(selection).trim()) return;
        openDiagram(block);
      });
    }

    function addCodeCopy() {
      content.querySelectorAll('pre').forEach(function (pre) {
        if (pre.closest('.math-display') || pre.closest('.mermaid')) return;
        if (pre.querySelector('.code-copy')) return;
        var button = document.createElement('button');
        button.type = 'button';
        button.className = 'code-copy';
        button.textContent = '复制';
        button.addEventListener('click', function () {
          var code = pre.querySelector('code');
          var text = code ? code.textContent : pre.textContent;
          var done = function () {
            button.textContent = '已复制';
            setTimeout(function () { button.textContent = '复制'; }, 1400);
          };
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(done, function () { fallbackCopy(text, done); });
          } else {
            fallbackCopy(text, done);
          }
        });
        pre.appendChild(button);
      });
    }

    function fallbackCopy(text, done) {
      var area = document.createElement('textarea');
      area.value = text;
      area.setAttribute('readonly', '');
      area.style.position = 'fixed';
      area.style.top = '-1000px';
      document.body.appendChild(area);
      area.select();
      try { document.execCommand('copy'); done(); } catch (error) { /* ignore */ }
      area.remove();
    }

    function initScrollUi() {
      var bar = document.getElementById('reading-progress');
      var toTop = document.getElementById('to-top');
      var ticking = false;
      function update() {
        var height = document.documentElement.scrollHeight - window.innerHeight;
        var progress = height > 0 ? Math.min(1, Math.max(0, window.scrollY / height)) : 0;
        if (bar) bar.style.width = (progress * 100).toFixed(2) + '%';
        if (toTop) toTop.hidden = window.scrollY < 640;
        ticking = false;
      }
      function requestUpdate() {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(update);
      }
      window.addEventListener('scroll', requestUpdate, { passive: true });
      window.addEventListener('resize', requestUpdate);
      if (toTop) toTop.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
      update();
    }

    function initScrollSpy() {
      var links = Array.prototype.slice.call(document.querySelectorAll('#toc-list a'));
      if (!links.length) return;
      var headings = links.map(function (link) {
        var id = decodeURIComponent(link.getAttribute('href').slice(1));
        return document.getElementById(id);
      }).filter(Boolean);
      var ticking = false;
      function update() {
        var active = headings[0];
        headings.forEach(function (heading) {
          if (heading.getBoundingClientRect().top <= 110) active = heading;
        });
        links.forEach(function (link) {
          link.classList.toggle('is-active', !!active && link.getAttribute('href') === '#' + active.id);
        });
        ticking = false;
      }
      window.addEventListener('scroll', function () {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(update);
      }, { passive: true });
      update();
    }

    function mermaidVariables() {
      var style = getComputedStyle(document.documentElement);
      var value = function (name) { return style.getPropertyValue(name).trim(); };
      return {
        primaryColor: value('--surface-2'),
        primaryTextColor: value('--text'),
        primaryBorderColor: value('--border-strong'),
        lineColor: value('--muted'),
        secondaryColor: value('--primary-soft'),
        tertiaryColor: value('--bg'),
        background: value('--surface'),
        mainBkg: value('--surface-2'),
        nodeBorder: value('--border-strong'),
        clusterBkg: value('--surface'),
        clusterBorder: value('--border'),
        edgeLabelBackground: value('--surface'),
        textColor: value('--text'),
        fontFamily: value('--ui')
      };
    }

    var mermaidBlocks = [];
    var mermaidReady = false;

    async function renderMermaid() {
      if (!mermaidBlocks.length) return;
      closeDiagram();
      if (!window.mermaid) {
        await loadScript(data.root + 'assets/vendor/mermaid.min.js?v=' + data.assetVersion);
      }
      if (!window.mermaid) throw new Error('Mermaid 未加载');
      window.mermaid.initialize({
        startOnLoad: false,
        theme: 'base',
        themeVariables: mermaidVariables(),
        securityLevel: 'loose',
        flowchart: { htmlLabels: true, useMaxWidth: true }
      });
      mermaidBlocks.forEach(function (block) {
        block.textContent = block.dataset.src || '';
        block.removeAttribute('data-processed');
      });
      await window.mermaid.run({ nodes: mermaidBlocks });
      decorateMermaidBlocks();
      mermaidReady = true;
    }

    window.__rerenderMermaid = function () {
      if (!mermaidReady && !window.mermaid) return Promise.resolve();
      return renderMermaid();
    };

    async function renderMath() {
      if (!expectedMath) return;
      await loadScript(data.root + 'assets/vendor/mathjax/tex-svg.js?v=' + data.assetVersion);
      await waitForMathJax();
      if (!window.MathJax || !window.MathJax.typesetPromise) {
        throw new Error('MathJax 未就绪');
      }
      await window.MathJax.typesetPromise([content]);
    }

    function validateRendered() {
      var mathRendered = content.querySelectorAll('.math-display mjx-container').length;
      var mathLeft = content.querySelectorAll('pre > code.language-math').length;
      if (expectedMath !== mathRendered || mathLeft) {
        throw new Error('公式渲染数量不符：期望 ' + expectedMath + '，实际 ' + mathRendered + '，残留 ' + mathLeft);
      }
      var mermaidRendered = content.querySelectorAll('.mermaid svg').length;
      var mermaidLeft = content.querySelectorAll('pre > code.language-mermaid').length;
      var mermaidErrors = content.querySelectorAll('.mermaid svg[aria-roledescription="error"]').length;
      if (expectedMermaid !== mermaidRendered || mermaidLeft || mermaidErrors) {
        throw new Error('Mermaid 渲染数量不符：期望 ' + expectedMermaid + '，实际 ' + mermaidRendered + '，残留 ' + mermaidLeft + '，错误 ' + mermaidErrors);
      }
    }

    async function render() {
      var response = await fetch(data.mdUrl, { cache: 'no-cache' });
      if (!response.ok) throw new Error('HTTP ' + response.status + '：' + data.mdUrl);
      var markdown = await response.text();
      if (!window.marked) throw new Error('marked 未加载');

      content.innerHTML = window.marked.parse(markdown, { gfm: true, breaks: false });
      var firstHeading = content.querySelector('h1');
      if (firstHeading) firstHeading.remove();

      content.querySelectorAll('pre > code.language-math').forEach(function (code) {
        var block = document.createElement('div');
        block.className = 'math-display';
        block.textContent = '$$' + code.textContent.trim() + '$$';
        code.parentElement.replaceWith(block);
      });
      content.querySelectorAll('pre > code.language-mermaid').forEach(function (code) {
        var block = document.createElement('div');
        block.className = 'mermaid';
        block.dataset.src = code.textContent;
        block.textContent = code.textContent;
        code.parentElement.replaceWith(block);
        mermaidBlocks.push(block);
      });

      wrapTables();
      addHeadingIds();
      buildToc();
      rewriteLinks();
      wrapImages();
      addCodeCopy();
      initLightbox();
      initDiagramDialog();
      initScrollUi();
      initScrollSpy();

      await Promise.all([renderMath(), renderMermaid()]);
      validateRendered();

      var mobileToc = document.querySelector('.mobile-toc');
      if (mobileToc) {
        mobileToc.addEventListener('click', function (event) {
          if (event.target.tagName === 'A') mobileToc.removeAttribute('open');
        });
      }
      window.__renderError = null;
    }

    render().catch(function (error) { fail(error); })
      .finally(function () { window.__renderDone = true; });
  }

  initTheme();
  if (page === 'home') initHome();
  if (page === 'doc') initDoc();
})();
