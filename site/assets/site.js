/* Paper Reading Notes — library, reader, theme. */
(function () {
  'use strict';

  var body = document.body;
  if (!body) return;
  var page = body.dataset.page;
  var root = body.dataset.root || './';
  var THEME_KEY = 'prn-theme';
  var SKIN_KEY = 'prn-skin';
  var KIMI_PLACEHOLDER = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
  var themeMedia = window.matchMedia('(prefers-color-scheme: dark)');
  var motionMedia = window.matchMedia('(prefers-reduced-motion: reduce)');

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
          // First click always makes a visible change: go to the opposite of
          // the theme that "auto" currently resolves to (the Kimi skin's auto
          // is dark even on a light system).
          next = resolveTheme('auto') === 'light' ? 'dark' : 'light';
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

  /* ---------------- skin: classic / kimi ---------------- */

  function currentSkin() {
    return document.documentElement.dataset.skin === 'kimi' ? 'kimi' : 'classic';
  }

  function updateSkinControls() {
    var kimi = currentSkin() === 'kimi';
    document.querySelectorAll('[data-skin-toggle]').forEach(function (button) {
      var label = button.querySelector('.skin-label');
      var icon = button.querySelector('.skin-icon');
      button.setAttribute('aria-pressed', kimi ? 'true' : 'false');
      button.setAttribute('aria-label', kimi ? '切换到经典风格' : '切换到 Kimi 风格');
      button.setAttribute('title', kimi ? '当前 Kimi 风格，点击切回经典' : '当前经典风格，点击切换到 Kimi');
      if (label) label.textContent = kimi ? '经典风格' : 'Kimi 风格';
      if (icon) icon.textContent = '◈';
    });
  }

  function syncTopbar() {
    var topbar = document.querySelector('.topbar');
    var kimi = currentSkin() === 'kimi';
    var hero = document.querySelector('.hero');
    var cover = document.querySelector('.doc-cover');
    if (topbar) topbar.classList.toggle('is-scrolled', kimi && window.scrollY > 8);
    var pastCover = !cover || window.scrollY > cover.offsetHeight + 100;
    document.documentElement.classList.toggle('kimi-past-cover', kimi && pastCover);
    var pastHero = hero ? window.scrollY > hero.offsetHeight - 80 : false;
    document.documentElement.classList.toggle('kimi-past-hero', kimi && pastHero);
  }

  function layoutHeroMeta() {
    var meta = document.querySelector('.hero-meta');
    var lower = document.querySelector('.kimi-hero-lower');
    var inner = document.querySelector('.hero-inner');
    var copy = document.querySelector('.hero-copy');
    var intro = document.querySelector('[data-kimi-intro]');
    var title = document.querySelector('.hero-copy h1, [data-kimi-intro] h1');
    var lede = document.querySelector('.hero-copy .hero-lede, [data-kimi-intro] .hero-lede');
    if (!meta || !lower || !inner) return;
    if (currentSkin() === 'kimi') {
      if (meta.parentElement !== lower) lower.appendChild(meta);
      if (intro && title && title.parentElement !== intro) intro.appendChild(title);
      if (intro && lede && lede.parentElement !== intro) intro.appendChild(lede);
    } else {
      if (meta.parentElement !== inner) {
        var scroll = inner.querySelector('.hero-scroll');
        inner.insertBefore(meta, scroll || null);
      }
      if (copy && title && title.parentElement !== copy) copy.appendChild(title);
      if (copy && lede && lede.parentElement !== copy) copy.appendChild(lede);
    }
  }

  function layoutHomeSections() {
    var contrib = document.querySelector('.contrib');
    var library = document.querySelector('.library');
    if (!contrib || !library || !library.parentElement) return;
    if (currentSkin() === 'kimi') {
      if (contrib.previousElementSibling !== library) {
        library.insertAdjacentElement('afterend', contrib);
      }
    } else if (contrib.nextElementSibling !== library) {
      library.parentElement.insertBefore(contrib, library);
    }
  }

  function playHeroIntro() {
    var hero = document.querySelector('.hero');
    if (!hero || page !== 'home') return;
    var layer = document.querySelector('.hero-code-layer');
    var svg = document.querySelector('.mark-svg');
    hero.classList.remove('is-intro', 'is-intro-done');
    document.documentElement.classList.remove('kimi-intro-done');
    if (layer) layer.classList.remove('is-visible');
    if (window.__heroCodeReset) window.__heroCodeReset();
    void hero.offsetWidth;
    hero.classList.add('is-intro');
    if (svg) {
      svg.classList.remove('is-writing');
      void svg.getBoundingClientRect();
      svg.classList.add('is-writing');
    }
    clearTimeout(window.__heroIntroTimer);
    var speed = parseFloat(hero.style.getPropertyValue('--hero-speed')) || 3;
    speed = Math.max(0.2, Math.min(15, speed));
    var factor = speed / 3;
    var duration = motionMedia.matches ? 1.2 : 3.2 / factor;
    hero.style.setProperty('--intro-duration', duration + 's');
    window.__heroIntroTimer = setTimeout(function () {
      hero.classList.add('is-intro-done');
      document.documentElement.classList.add('kimi-intro-done');
    }, (duration + 0.45) * 1000);
  }

  function initKimiControls() {
    var root = document.querySelector('[data-kimi-controls]');
    var hero = document.querySelector('.hero');
    if (!root || !hero) return;
    var defaults = { cloud: 0.65, speed: 3, ink: 0.9, coverage: 1 };
    var labels = { cloud: 'Cloud', speed: 'Speed', ink: 'Ink', coverage: 'Coverage' };
    var settings = Object.assign({}, defaults);
    try {
      var stored = JSON.parse(localStorage.getItem('prn-hero-settings') || 'null');
      if (stored && typeof stored === 'object') {
        ['cloud', 'speed', 'ink', 'coverage'].forEach(function (key) {
          if (typeof stored[key] === 'number' && isFinite(stored[key])) settings[key] = stored[key];
        });
      }
    } catch (error) { /* ignore */ }

    var controls = Array.prototype.slice.call(root.querySelectorAll('[data-kimi-setting]'));

    function format(key, value) {
      if (key === 'speed') return value.toFixed(1) + '×';
      return Math.round(value * 100) + '%';
    }

    function progress(key, value) {
      if (key === 'cloud') return Math.max(0, Math.min(1, (value - 0.65) / (5 - 0.65)));
      if (key === 'speed') return Math.max(0, Math.min(1, (value - 0.2) / (15 - 0.2)));
      return Math.max(0, Math.min(1, value));
    }

    function save() {
      try { localStorage.setItem('prn-hero-settings', JSON.stringify(settings)); } catch (error) { /* ignore */ }
    }

    function apply() {
      // The reference's cloud amount raises optical depth; on the static hero
      // we lift the drifting cloud veil instead so 0.65 still reads as dense.
      hero.style.setProperty('--hero-cloud-amount', String(settings.cloud));
      hero.style.setProperty('--hero-cloud', String(Math.min(1, 0.62 + settings.cloud * 0.19)));
      hero.style.setProperty('--hero-speed', String(settings.speed));
      hero.style.setProperty('--hero-ink', String(settings.ink));
      hero.style.setProperty('--hero-scale', String(1 + settings.coverage * 0.06));
      hero.style.setProperty('--hero-immersion', String(settings.coverage));
      hero.style.setProperty('--hero-cloud-scale', String(1 / Math.max(0.2, settings.speed / 3)));
      if (window.__heroCloud) {
        window.__heroCloud.setSettings({
          cloud: settings.cloud,
          speed: settings.speed,
          coverage: settings.coverage
        });
      }
      controls.forEach(function (control) {
        var key = control.dataset.kimiSetting;
        var input = control.querySelector('.kimi-control-range');
        var value = settings[key];
        var p = progress(key, value);
        control.style.setProperty('--progress', String(p));
        control.title = labels[key] + ': ' + format(key, value);
        control.toggleAttribute('data-label-end', p < 0.5);
        if (input) {
          input.value = String(value);
          input.setAttribute('aria-valuetext', format(key, value));
        }
      });
    }

    controls.forEach(function (control) {
      var input = control.querySelector('.kimi-control-range');
      if (!input) return;
      input.addEventListener('pointerdown', function (event) {
        if (control.matches(':hover') || control.contains(document.activeElement)) return;
        event.preventDefault();
        input.focus();
      });
      input.addEventListener('input', function () {
        var key = control.dataset.kimiSetting;
        var value = parseFloat(input.value);
        if (!isFinite(value)) return;
        settings[key] = value;
        apply();
        save();
      });
      // Speed only changes the cloud clock, as in the reference; it does not
      // replay the writing intro. R still replays on demand.
    });

    var scrollHint = document.querySelector('[data-kimi-scroll]');
    if (scrollHint) scrollHint.addEventListener('click', function () {
      var target = document.querySelector('.kimi-hero-lower');
      if (!target) return;
      target.scrollIntoView({
        behavior: motionMedia.matches ? 'auto' : 'smooth',
        block: 'start'
      });
    });

    // The reference has no reset button; keep the same affordance on R so the
    // intro can still be replayed without adding another icon.
    document.addEventListener('keydown', function (event) {
      if (event.key !== 'r' || event.metaKey || event.ctrlKey || event.altKey) return;
      var tag = (event.target && event.target.tagName || '').toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select' || (event.target && event.target.isContentEditable)) return;
      playHeroIntro();
    });

    apply();
    if (currentSkin() === 'kimi') playHeroIntro();
  }

  function createMarkWindRenderer(canvas) {
    var gl = canvas.getContext('webgl2', {
      alpha: true,
      premultipliedAlpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: 'low-power'
    });
    if (!gl) return null;

    var vertex = '#version 300 es\n' +
      'in vec2 p; out vec2 vUv;\n' +
      'void main(){ vUv = p * 0.5 + 0.5; gl_Position = vec4(p, 0.0, 1.0); }';

    var fragment = [
      '#version 300 es',
      'precision highp float;',
      'in vec2 vUv;',
      'out vec4 outColor;',
      'uniform sampler2D uGlyph;',
      'uniform vec2 uPointer;',
      'uniform vec2 uWind;',
      'uniform float uStrength;',
      'uniform float uTime;',
      'float hash(vec2 p){',
      '  p = fract(p * vec2(123.34, 456.21));',
      '  p += dot(p, p + 45.32);',
      '  return fract(p.x * p.y);',
      '}',
      'float noise(vec2 p){',
      '  vec2 i = floor(p), f = fract(p);',
      '  f = f * f * (3.0 - 2.0 * f);',
      '  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),',
      '             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);',
      '}',
      'float fbm(vec2 p){',
      '  float sum = 0.0, amp = 0.5;',
      '  for (int i = 0; i < 4; i++){',
      '    sum += amp * noise(p);',
      '    p = p * 2.03 + vec2(1.7, 9.2);',
      '    amp *= 0.5;',
      '  }',
      '  return sum / 0.9375;',
      '}',
      'float glyph(vec2 uv){',
      '  if (uv.x < -0.02 || uv.x > 1.02 || uv.y < -0.02 || uv.y > 1.02) return 0.0;',
      '  return texture(uGlyph, clamp(uv, 0.0, 1.0)).a;',
      '}',
      'void main(){',
      '  vec2 uv = vUv;',
      '  float anchor = smoothstep(0.02, 0.98, uv.y);',
      '  vec2 p = uv - uPointer;',
      '  float along = dot(p, uWind);',
      '  float across = dot(p, vec2(-uWind.y, uWind.x));',
      // A downwind ellipse with a long tail, not a circle: the gust centre
      // sits at the pointer and the wake trails behind it.
      '  float nearGust = exp(-(along * along * 8.0 + across * across * 20.0));',
      '  float tail = exp(-(max(along, 0.0) * max(along, 0.0) * 2.0 + across * across * 26.0));',
      '  float gust = uStrength * (0.26 + 0.78 * nearGust + 0.68 * tail);',
      '  float sway = 0.5 + 0.5 * sin(uTime * 1.45 + uv.y * 4.3 + uv.x * 1.2);',
      // Sample upstream and draw downstream so the brush leans and smears in
      // the direction the air is moving.
      '  vec2 warp = uWind * (0.006 + 0.13 * gust + 0.008 * sway) * (0.30 + 0.95 * anchor);',
      '  warp.x += (uv.y - 0.15) * 0.09 * gust;',
      '  vec2 n = vec2(',
      '    fbm(uv * vec2(5.0, 7.0) + vec2(uTime * 0.50, 0.0)),',
      '    fbm(uv * vec2(5.0, 7.0) + vec2(3.7, -uTime * 0.38))',
      '  );',
      '  warp += (n - 0.5) * (0.004 + 0.035 * gust) * (0.25 + anchor);',
      '  float core = glyph(uv - warp);',
      '  core *= 1.0 - smoothstep(0.62, 1.0, uv.y) * gust * 0.45;',
      '  float trail = 0.015 + 0.34 * gust * (0.30 + anchor);',
      '  float streaks = 0.0;',
      '  for (int i = 1; i <= 20; i++){',
      '    float t = float(i) / 20.0;',
      '    vec2 suv = uv - warp * (1.0 + t * 0.35) - uWind * trail * t;',
      '    float s = glyph(suv);',
      '    float bands = fbm(vec2(suv.x * 8.0 - uTime * 0.55, suv.y * 30.0));',
      '    s *= smoothstep(0.30, 0.74, bands + 0.30 - t * 0.17);',
      '    streaks += s * pow(1.0 - t, 1.75) * 0.135;',
      '  }',
      '  float a = max(core, clamp(streaks, 0.0, 0.95) * (1.0 - core * 0.72) * 0.94);',
      '  vec2 fuv = uv - warp * 1.7 - uWind * trail * 1.25;',
      '  float flake = glyph(fuv);',
      '  float mask = fbm(fuv * vec2(15.0, 36.0) + vec2(-uTime * 0.8, uTime * 0.12));',
      '  a = max(a, flake * smoothstep(0.60, 0.84, mask) * 0.42 * uStrength);',
      '  a *= smoothstep(0.0, 0.16, uStrength);',
      '  vec3 ink = mix(vec3(0.975, 0.963, 0.925), vec3(0.88, 0.91, 0.89), clamp(streaks, 0.0, 1.0) * 0.5);',
      '  outColor = vec4(ink * a, a);',
      '}'
    ].join('\n');

    function compile(type, source) {
      var shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        throw new Error(gl.getShaderInfoLog(shader) || 'mark wind shader compile failed');
      }
      return shader;
    }

    var program;
    try {
      program = gl.createProgram();
      gl.attachShader(program, compile(gl.VERTEX_SHADER, vertex));
      gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragment));
      gl.bindAttribLocation(program, 0, 'p');
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw new Error(gl.getProgramInfoLog(program) || 'mark wind link failed');
      }
    } catch (error) {
      console.warn('Mark wind renderer unavailable:', error);
      return null;
    }

    var uniforms = {};
    var count = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
    for (var u = 0; u < count; u++) {
      var name = gl.getActiveUniform(program, u).name;
      uniforms[name] = gl.getUniformLocation(program, name);
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.disable(gl.DEPTH_TEST);
    gl.disable(gl.BLEND);

    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    var textureReady = false;
    function paintTexture() {
      var source = document.createElement('canvas');
      source.width = source.height = 1024;
      var sourceCtx = source.getContext('2d');
      if (!sourceCtx) return;
      sourceCtx.clearRect(0, 0, 1024, 1024);
      sourceCtx.fillStyle = '#fff';
      sourceCtx.font = '400 731px "Ma Shan Zheng", "Noto Serif SC", serif';
      sourceCtx.textAlign = 'center';
      sourceCtx.textBaseline = 'alphabetic';
      sourceCtx.fillText('读', 512, 789);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
      textureReady = true;
    }
    paintTexture();
    if (document.fonts && document.fonts.load) {
      document.fonts.load('400 512px "Ma Shan Zheng"').then(paintTexture).catch(function () {});
    }

    var width = 1;
    var height = 1;

    var api = {
      canvas: canvas,
      resize: function (w, h) {
        var dpr = Math.min(window.devicePixelRatio || 1, 2);
        var nw = Math.max(1, Math.round(w * dpr));
        var nh = Math.max(1, Math.round(h * dpr));
        if (nw === canvas.width && nh === canvas.height) return;
        canvas.width = nw;
        canvas.height = nh;
        width = nw;
        height = nh;
      },
      render: function (strength, time, pointerX, pointerY, windX, windY) {
        if (!textureReady || !width) return;
        gl.viewport(0, 0, width, height);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.useProgram(program);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.uniform1i(uniforms.uGlyph, 0);
        gl.uniform2f(uniforms.uPointer, pointerX, pointerY);
        gl.uniform2f(uniforms.uWind, windX, windY);
        gl.uniform1f(uniforms.uStrength, strength);
        gl.uniform1f(uniforms.uTime, time);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      },
      destroy: function () {
        gl.deleteTexture(texture);
        gl.deleteProgram(program);
      }
    };
    return api;
  }

  function initHeroCode() {
    var hero = document.querySelector('.hero');
    var layer = document.querySelector('.hero-code-layer');
    var canvas = layer && layer.querySelector('[data-kimi-code-canvas]');
    var mark = document.querySelector('[data-kimi-mark]');
    if (!hero || !layer || !canvas || window.__heroCodeBound) return;
    window.__heroCodeBound = true;
    var ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Real lines from NVIDIA/Megatron-LM core (main @ 7a01f00). The original
    // K3.1 hero draws a glyph grid from a code atlas; using actual training
    // source here keeps the same "wind-blown code" language.
    // https://github.com/NVIDIA/Megatron-LM
    var snippets = [
      'from megatron.core import parallel_state',
      'def initialize_model_parallel(',
      'tensor_model_parallel_size: int = 1,',
      'pipeline_model_parallel_size: int = 1,',
      'def get_tensor_model_parallel_group(check_initialized=True):',
      'return _TENSOR_MODEL_PARALLEL_GROUP',
      'def get_tensor_model_parallel_world_size():',
      'return get_tensor_model_parallel_group().size()',
      'class ColumnParallelLinear(torch.nn.Module):',
      'output_parallel = self._forward_impl(',
      'class RowParallelLinear(torch.nn.Module):',
      'input_parallel = scatter_to_tensor_model_parallel_region(input_, group=self.tp_group)',
      'def forward_backward_pipelining_with_interleaving(',
      'forward_backward_func = forward_backward_pipelining_with_interleaving',
      'loss = torch.sum(losses.view(-1) * loss_mask) / loss_mask.sum()',
      'averaged_loss = average_losses_across_data_parallel_group([loss])',
      'def forward_step_helper(virtual_microbatch_id, checkpoint_activations_microbatch):',
      'output_tensor, loss_func = forward_step_func(data_iterator, model)',
      'torch.distributed.all_reduce(grad_input, group=ctx.tp_group)',
      'handle = torch.distributed.all_reduce(grad_input, group=tp_group, async_op=True)',
      'self.force_all_reduce = False',
      'def finish_grad_sync(self, force_all_reduce: Optional[bool] = False):'
    ];

    var width = 1;
    var height = 1;
    var cols = 1;
    var rows = 1;
    var size = 12;
    var stepX = 9.6;
    var stepY = 13.8;
    var grid = new Uint8Array(2);
    var ribbons = [];
    var bodyAtlas = null;
    var hotAtlas = null;
    var atlasCellW = 1;
    var atlasCellH = 1;
    var raf = 0;
    var last = 0;
    var clock = 0;
    var pointerX = -9999;
    var pointerY = -9999;
    var prevX = -9999;
    var prevY = -9999;
    var pointerSpeed = 0;
    var active = false;
    var lastPoint = null;
    var markRect = null;
    var markWind = 0;
    var markTarget = 0;
    var markHover = false;
    var windX = -1;
    var windY = -0.16;
    var markSvg = mark && mark.querySelector('.mark-svg');
    var windCanvas = mark && mark.querySelector('[data-kimi-mark-wind]');
    var windRenderer = windCanvas ? createMarkWindRenderer(windCanvas) : null;
    var windNoise = document.getElementById('kimi-wind-noise');
    var windDisplace = document.getElementById('kimi-wind-displace');
    if (mark && windRenderer) {
      mark.classList.add('has-wind-canvas');
      windCanvas.addEventListener('webglcontextlost', function (event) {
        event.preventDefault();
        windRenderer = null;
        windCanvas.style.display = 'none';
        mark.classList.remove('has-wind-canvas');
        mark.classList.add('is-svg-wind');
        if (markSvg) markSvg.style.opacity = '';
      });
    } else if (mark) {
      mark.classList.add('is-svg-wind');
    }

    canvas.dataset.codeSource = 'https://github.com/NVIDIA/Megatron-LM';
    canvas.dataset.codeRevision = '7a01f00';

    function clamp(value, min, max) {
      return Math.max(min, Math.min(max, value));
    }

    function buildGrid() {
      // Same density law as the original hero: ~12px cells that grow only on
      // unusually large or tall viewports, so the field reads as dense data
      // rather than a few oversized letters.
      size = Math.max(13.5, width / 340, height / 250);
      stepX = size * 0.8;
      stepY = size * 1.15;
      cols = Math.ceil(width / stepX);
      rows = Math.ceil(height / stepY);
      grid = new Uint8Array(cols * rows * 2);
      for (var row = 0; row < rows; row++) {
        var text = '';
        var cursor = 0;
        while (text.length < cols + 2) {
          text += snippets[(row * 7 + 11 * cursor++) % snippets.length] + '   ';
        }
        for (var col = 0; col < cols; col++) {
          grid[(row * cols + col) * 2] = text.charCodeAt(col) - 32;
        }
      }
      ribbons.length = 0;
      lastPoint = null;
    }

    function buildAtlases() {
      // The original hero samples one 16x6 glyph atlas in a shader. Canvas 2D
      // is far slower per glyph, so bake the same atlas once (green body and
      // near-white head, both with a dark contour) and blit sprites per cell.
      var colsAtlas = 16;
      var rowsAtlas = 6;
      atlasCellW = Math.ceil(stepX * 1.55);
      atlasCellH = Math.ceil(stepY * 1.55);
      bodyAtlas = document.createElement('canvas');
      hotAtlas = document.createElement('canvas');
      bodyAtlas.width = hotAtlas.width = colsAtlas * atlasCellW;
      bodyAtlas.height = hotAtlas.height = rowsAtlas * atlasCellH;
      var body = bodyAtlas.getContext('2d');
      var hot = hotAtlas.getContext('2d');
      [body, hot].forEach(function (g) {
        g.font = '600 ' + size.toFixed(2) + 'px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';
        g.textAlign = 'center';
        g.textBaseline = 'middle';
        g.lineJoin = 'round';
        g.lineWidth = Math.max(1.2, size * 0.11);
        g.strokeStyle = 'rgba(2, 16, 6, 0.94)';
      });
      for (var code = 32; code < 127; code++) {
        var ch = String.fromCharCode(code);
        var slot = code - 32;
        var x = (slot % colsAtlas + 0.5) * atlasCellW;
        var y = (Math.floor(slot / colsAtlas) + 0.5) * atlasCellH;
        body.strokeText(ch, x, y);
        body.fillStyle = '#45e04d';
        body.fillText(ch, x, y);
        hot.strokeText(ch, x, y);
        hot.fillStyle = '#eeffdc';
        hot.fillText(ch, x, y);
      }
    }

    function resize() {
      var rect = hero.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      buildGrid();
      buildAtlases();
      syncMarkRect();
    }

    function syncMarkRect() {
      if (!mark) return;
      var heroRect = hero.getBoundingClientRect();
      var rect = mark.getBoundingClientRect();
      markRect = {
        left: rect.left - heroRect.left,
        top: rect.top - heroRect.top,
        width: rect.width,
        height: rect.height,
        cx: rect.left - heroRect.left + rect.width / 2,
        cy: rect.top - heroRect.top + rect.height / 2
      };
      if (windRenderer) windRenderer.resize(rect.width * 1.4, rect.height * 1.4);
    }

    // A ribbon is the original's unit of wind: a horizontal run of 18-40
    // glyphs whose head sits at the pointer and whose tail streams upwind.
    function addRibbon(x, y) {
      var row = clamp(Math.floor(y / stepY), 0, rows - 1);
      var col = clamp(Math.floor(x / stepX), 0, cols - 1);
      ribbons.push({
        row: row,
        head: col + 0.5,
        cols: 22 + 30 * Math.random(),
        age: 0,
        duration: 5.2 * (0.85 + 0.4 * Math.random()),
        speed: 95 * (0.55 + 0.7 * Math.random())
      });
      if (ribbons.length > 220) ribbons.shift();
      active = true;
    }

    function addRibbonsAlong(x0, y0, x1, y1) {
      var distance = Math.hypot(x1 - x0, y1 - y0);
      if (!isFinite(distance) || distance >= 180) {
        addRibbon(x1, y1);
        return;
      }
      if (distance < 1) return;
      var steps = Math.ceil(distance / Math.max(7, 1.45 * size));
      for (var i = 1; i <= steps; i++) {
        if (Math.random() > 0.84) continue;
        var px = x0 + (x1 - x0) * i / steps;
        var py = y0 + (y1 - y0) * i / steps;
        addRibbon(px, py);
        // A light vertical spread turns a single mouse row into a band of
        // data without falling back to a circular patch.
        for (var k = 1; k <= 3; k++) {
          if (Math.random() < 0.52) {
            var offset = (Math.random() < 0.5 ? -1 : 1) * stepY * (1.4 + Math.random() * 4.2);
            addRibbon(px, py + offset);
          }
        }
      }
    }

    function advance(dt) {
      if (!active && !ribbons.length) return false;
      for (var i = 1; i < grid.length; i += 2) grid[i] = 0;
      var alive = false;
      for (var r = ribbons.length - 1; r >= 0; r--) {
        var ribbon = ribbons[r];
        ribbon.age += Math.max(0, dt);
        var head = ribbon.head - ribbon.age * ribbon.speed / stepX;
        var fade = Math.pow(clamp(1 - ribbon.age / ribbon.duration, 0, 1), 1.42);
        if (fade > 0) {
          var start = Math.max(0, Math.ceil(head - ribbon.cols - 0.5));
          var end = Math.min(cols - 1, Math.floor(head + 0.05));
          for (var col = start; col <= end; col++) {
            var near = clamp(1 - (head - col - 0.5) / ribbon.cols, 0, 1);
            var value = Math.min(255, Math.max(0,
              Math.round(255 * fade * (0.24 + 1.32 * Math.pow(near, 0.72)) / 1.38)));
            var index = (ribbon.row * cols + col) * 2 + 1;
            if (value > grid[index]) grid[index] = value;
          }
        }
        if (ribbon.age < ribbon.duration && ribbon.head * stepX - ribbon.age * ribbon.speed > -stepX) {
          alive = true;
        } else {
          ribbons.splice(r, 1);
        }
      }
      if (!ribbons.length) active = false;
      return alive;
    }

    function paintCode() {
      ctx.clearRect(0, 0, width, height);
      var visible = false;
      for (var row = 0; row < rows; row++) {
        var y = row * stepY + stepY / 2 - atlasCellH / 2;
        for (var col = 0; col < cols; col++) {
          var index = (row * cols + col) * 2;
          var raw = grid[index + 1];
          if (raw < 3) continue;
          var value = Math.min(1, raw / 255 * 1.38);
          var code = grid[index];
          if (!code || code === 0) continue;
          visible = true;
          var x = col * stepX + stepX / 2 - atlasCellW / 2;
          var sx = (code % 16) * atlasCellW;
          var sy = Math.floor(code / 16) * atlasCellH;
          var head = value > 0.66;
          ctx.globalAlpha = head ? 1 : Math.min(1, 0.78 + value * 0.38);
          ctx.drawImage(head ? hotAtlas : bodyAtlas,
            sx, sy, atlasCellW, atlasCellH,
            x, y, atlasCellW, atlasCellH);
        }
      }
      ctx.globalAlpha = 1;
      return visible;
    }

    function updateMark(delta) {
      if (!mark) return;
      if (!active || !markHover) {
        markTarget *= Math.pow(0.84, delta * 60);
      } else {
        // Hovering alone bends the brush; pointer speed drives a harder gust.
        markTarget = Math.max(markTarget, clamp(0.66 + pointerSpeed / 620, 0.66, 1));
        markTarget *= 0.92 + 0.08 * Math.sin(clock * 1.9);
      }
      markWind += (markTarget - markWind) * Math.min(1, delta * 9);
      if (markWind < 0.012) {
        if (mark.classList.contains('is-windy')) {
          mark.classList.remove('is-windy');
          mark.style.removeProperty('--kimi-wind-x');
          mark.style.removeProperty('--kimi-wind-y');
          mark.style.removeProperty('--kimi-wind-r');
        }
        if (windRenderer) windCanvas.style.opacity = '0';
        if (markSvg) markSvg.style.opacity = '';
        if (windDisplace) windDisplace.setAttribute('scale', '0');
        return;
      }
      mark.classList.add('is-windy');
      var swayX = Math.sin(clock * 1.9) * (0.8 + markWind * 1.8);
      var swayY = Math.sin(clock * 1.45 + 0.9) * (0.5 + markWind * 1.1);
      mark.style.setProperty('--kimi-wind-x', clamp(windX * markWind * 4.2 + swayX, -4.5, 4.5).toFixed(2) + 'px');
      mark.style.setProperty('--kimi-wind-y', clamp(windY * markWind * 4.2 + swayY, -3.2, 3.2).toFixed(2) + 'px');
      mark.style.setProperty('--kimi-wind-r', clamp(Math.sin(clock * 1.6) * 0.45 + windX * 0.35, -1.1, 1.1).toFixed(2) + 'deg');
      if (windRenderer && markRect) {
        var pad = markRect.width * 0.2;
        var span = markRect.width * 1.4;
        var uvx = (pointerX - (markRect.left - pad)) / Math.max(1, span);
        var uvy = 1 - (pointerY - (markRect.top - pad)) / Math.max(1, span);
        windRenderer.render(markWind, clock, uvx, uvy, windX, -windY);
        windCanvas.style.opacity = String(clamp((markWind - 0.02) * 7.5, 0, 1));
        if (markSvg) markSvg.style.opacity = String(clamp(1 - markWind * 7.5, 0, 1));
      } else {
        if (windCanvas) windCanvas.style.opacity = '0';
        if (markSvg) markSvg.style.opacity = '';
        if (windDisplace) windDisplace.setAttribute('scale', (markWind * 18).toFixed(2));
        if (windNoise) {
          var grain = Math.sin(clock * 1.3) * 0.0006;
          windNoise.setAttribute(
            'baseFrequency',
            (0.008 + markWind * 0.003 + grain).toFixed(4) + ' ' +
            (0.014 + markWind * 0.006 + grain).toFixed(4)
          );
        }
      }
    }

    function draw(time) {
      raf = 0;
      if (currentSkin() !== 'kimi' || motionMedia.matches) {
        ctx.clearRect(0, 0, width, height);
        layer.classList.remove('is-visible');
        return;
      }
      var delta = last ? Math.min(0.08, (time - last) / 1000) : 0.033;
      last = time;
      clock += delta;
      pointerSpeed *= Math.pow(0.95, delta * 60);
      advance(delta);
      var visible = paintCode();
      updateMark(delta);
      if (visible) {
        layer.classList.add('is-visible');
      } else {
        layer.classList.remove('is-visible');
      }
      if (!visible && markWind < 0.012) return;
      raf = window.requestAnimationFrame(draw);
    }

    function start() {
      if (raf || motionMedia.matches) return;
      last = 0;
      raf = window.requestAnimationFrame(draw);
    }

    function move(event) {
      if (currentSkin() !== 'kimi' || event.pointerType === 'touch' || motionMedia.matches) return;
      if (!document.documentElement.classList.contains('kimi-intro-done')) return;
      if (parseFloat(hero.style.getPropertyValue('--hero-ink') || '1') <= 0) return;
      var rect = hero.getBoundingClientRect();
      var x = event.clientX - rect.left;
      var y = event.clientY - rect.top;
      var dx = prevX > -9000 ? x - prevX : 0;
      var dy = prevY > -9000 ? y - prevY : 0;
      var speed = Math.hypot(dx, dy);
      pointerSpeed = Math.max(pointerSpeed, speed);
      // Keep the ambient gale blowing left (the way the code ribbons stream)
      // while vertical flicks tilt it a little.
      windY = clamp(-0.16 + dy * 0.0028, -0.48, 0.4);
      windX = -1;
      var windLength = Math.hypot(windX, windY) || 1;
      windX /= windLength;
      windY /= windLength;
      prevX = x;
      prevY = y;
      pointerX = x;
      pointerY = y;
      syncMarkRect();
      if (lastPoint) addRibbonsAlong(lastPoint.x, lastPoint.y, x, y);
      else addRibbon(x, y);
      lastPoint = { x: x, y: y };
      markHover = !!(markRect &&
        Math.abs(x - markRect.cx) < markRect.width * 0.62 &&
        Math.abs(y - markRect.cy) < markRect.height * 0.62);
      hero.style.setProperty('--hero-pan-x', (x / width - 0.5).toFixed(3));
      hero.style.setProperty('--hero-pan-y', (y / height - 0.5).toFixed(3));
      start();
    }

    function leave() {
      active = false;
      lastPoint = null;
      prevX = prevY = -9999;
      markTarget = 0;
      markHover = false;
      pointerSpeed = 0;
      hero.style.setProperty('--hero-pan-x', '0');
      hero.style.setProperty('--hero-pan-y', '0');
      if (windDisplace) windDisplace.setAttribute('scale', '0');
      if (mark) {
        mark.classList.remove('is-windy');
        mark.style.removeProperty('--kimi-wind-x');
        mark.style.removeProperty('--kimi-wind-y');
        mark.style.removeProperty('--kimi-wind-r');
      }
      if (windRenderer) windCanvas.style.opacity = '0';
      if (markSvg) markSvg.style.opacity = '';
    }

    function reset() {
      active = false;
      lastPoint = null;
      prevX = prevY = -9999;
      markTarget = 0;
      markHover = false;
      markWind = 0;
      pointerSpeed = 0;
      last = 0;
      clock = 0;
      ribbons.length = 0;
      for (var i = 1; i < grid.length; i += 2) grid[i] = 0;
      hero.style.setProperty('--hero-pan-x', '0');
      hero.style.setProperty('--hero-pan-y', '0');
      if (raf) {
        window.cancelAnimationFrame(raf);
        raf = 0;
      }
      ctx.clearRect(0, 0, width, height);
      layer.classList.remove('is-visible');
      if (windDisplace) windDisplace.setAttribute('scale', '0');
      if (windRenderer) windCanvas.style.opacity = '0';
      if (markSvg) markSvg.style.opacity = '';
      if (mark) {
        mark.classList.remove('is-windy');
        mark.style.removeProperty('--kimi-wind-x');
        mark.style.removeProperty('--kimi-wind-y');
        mark.style.removeProperty('--kimi-wind-r');
      }
    }

    hero.addEventListener('pointermove', move, { passive: true });
    hero.addEventListener('pointerdown', move, { passive: true });
    hero.addEventListener('pointerleave', leave);
    hero.addEventListener('pointercancel', leave);
    window.addEventListener('resize', resize, { passive: true });
    window.__heroCodeReset = reset;
    resize();
  }

  function hydrateKimiImages() {
    var kimi = currentSkin() === 'kimi';
    document.querySelectorAll('source[data-kimi-srcset]').forEach(function (source) {
      if (kimi) {
        if (!source.getAttribute('srcset')) source.setAttribute('srcset', source.dataset.kimiSrcset);
      } else {
        source.removeAttribute('srcset');
      }
    });
    document.querySelectorAll('img[data-kimi-src]').forEach(function (image) {
      var target = kimi ? image.dataset.kimiSrc : KIMI_PLACEHOLDER;
      if (image.getAttribute('src') !== target) image.setAttribute('src', target);
    });
  }

  function positionDocCover() {
    var cover = document.querySelector('.doc-cover');
    if (!cover || !cover.parentElement) return;
    if (currentSkin() !== 'kimi') {
      cover.style.left = '';
      cover.style.width = '';
      cover.classList.remove('is-positioned');
      return;
    }
    var rect = cover.parentElement.getBoundingClientRect();
    var relative = window.getComputedStyle(cover).position === 'relative';
    cover.style.left = relative ? '' : (-rect.left) + 'px';
    cover.style.width = window.innerWidth + 'px';
    cover.classList.add('is-positioned');
  }

  var revealObserver = null;

  function setupReveal() {
    if (revealObserver) {
      revealObserver.disconnect();
      revealObserver = null;
    }
    document.querySelectorAll('.kimi-reveal').forEach(function (node) {
      node.classList.remove('kimi-reveal', 'is-visible');
    });
    if (currentSkin() !== 'kimi' || motionMedia.matches || !('IntersectionObserver' in window)) return;
    var selectors = page === 'home'
      ? ['.library-heading', '.featured-card', '.card', '.contrib-card']
      : ['.prose > h2', '.prose > h3', '.prose > blockquote',
         '.prose > .table-wrap', '.prose > pre', '.prose > .mermaid', '.page-navs'];
    var nodes = [];
    selectors.forEach(function (selector) {
      document.querySelectorAll(selector).forEach(function (node) { nodes.push(node); });
    });
    if (!nodes.length) return;
    revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    nodes.forEach(function (node) {
      node.classList.add('kimi-reveal');
      revealObserver.observe(node);
      var rect = node.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        node.classList.add('is-visible');
        revealObserver.unobserve(node);
      }
    });
  }

  function setupKimiParallax() {
    if (window.__kimiParallaxBound) return;
    window.__kimiParallaxBound = true;
    var ticking = false;
    var heroNode = document.querySelector('.hero');
    function frame() {
      ticking = false;
      var image = document.querySelector('.hero-media img');
      var inner = document.querySelector('.hero-inner');
      if (!image || currentSkin() !== 'kimi' || motionMedia.matches) {
        if (image) image.style.transform = '';
        if (inner) {
          inner.style.transform = '';
          inner.style.opacity = '';
        }
        return;
      }
      var hero = image.closest('.hero');
      var limit = hero ? hero.offsetHeight : window.innerHeight;
      var y = Math.min(window.scrollY, limit);
      var progress = Math.min(1, y / Math.max(1, limit));
      var panX = parseFloat(hero && hero.style.getPropertyValue('--hero-pan-x')) || 0;
      var panY = parseFloat(hero && hero.style.getPropertyValue('--hero-pan-y')) || 0;
      image.style.transform = 'translate3d(' + (panX * 9).toFixed(2) + 'px,' + (panY * 7 + y * 0.09).toFixed(2) + 'px,0) scale(1.045)';
      if (inner) {
        inner.style.transform = 'translate3d(0,' + (progress * 34).toFixed(2) + 'px,0)';
        inner.style.opacity = String(Math.max(0, 1 - progress * 1.05));
      }
    }
    window.addEventListener('scroll', function () {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(frame);
      }
      syncTopbar();
    }, { passive: true });
    window.addEventListener('resize', frame, { passive: true });
    if (heroNode) {
      heroNode.addEventListener('pointermove', function () {
        if (!ticking) {
          ticking = true;
          window.requestAnimationFrame(frame);
        }
      }, { passive: true });
    }
    frame();
  }

  function applySkin(skin, persist) {
    var next = skin === 'kimi' ? 'kimi' : 'classic';
    document.documentElement.dataset.skin = next;
    if (persist) {
      try { localStorage.setItem(SKIN_KEY, next); } catch (error) { /* ignore */ }
    }
    hydrateKimiImages();
    layoutHeroMeta();
    if (page === 'home') {
      if (next === 'kimi') {
        playHeroIntro();
      } else {
        clearTimeout(window.__heroIntroTimer);
        var hero = document.querySelector('.hero');
        var layer = document.querySelector('.hero-code-layer');
        if (hero) hero.classList.remove('is-intro', 'is-intro-done');
        document.documentElement.classList.remove('kimi-intro-done');
        if (layer) layer.classList.remove('is-visible');
        if (window.__heroCodeReset) window.__heroCodeReset();
      }
    }
    layoutHomeSections();
    applyTheme(document.documentElement.dataset.themeMode || 'auto', false);
    updateSkinControls();
    syncTopbar();
    window.requestAnimationFrame(function () {
      positionDocCover();
      setupReveal();
      setupKimiParallax();
      // The classic and Kimi heroes have different dimensions; rebuilding
      // the code field / wind buffer keeps them from stretching on a skin swap.
      window.dispatchEvent(new Event('resize'));
    });
  }

  function initSkin() {
    var skin = 'kimi';
    try { skin = localStorage.getItem(SKIN_KEY) || 'kimi'; } catch (error) { /* ignore */ }
    var params = new URLSearchParams(window.location.search);
    var fromUrl = params.get('skin');
    if (fromUrl === 'kimi' || fromUrl === 'classic') {
      skin = fromUrl;
      try { localStorage.setItem(SKIN_KEY, skin); } catch (error) { /* ignore */ }
    }
    if (skin !== 'classic') skin = 'kimi';
    applySkin(skin, false);
    document.querySelectorAll('[data-skin-toggle]').forEach(function (button) {
      button.addEventListener('click', function () {
        applySkin(currentSkin() === 'kimi' ? 'classic' : 'kimi', true);
      });
    });
    document.addEventListener('keydown', function (event) {
      if (event.key !== 'K' || !event.shiftKey || event.metaKey || event.ctrlKey || event.altKey) return;
      var tag = (event.target && event.target.tagName || '').toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select' || (event.target && event.target.isContentEditable)) return;
      event.preventDefault();
      applySkin(currentSkin() === 'kimi' ? 'classic' : 'kimi', true);
    });
    window.addEventListener('resize', debounce(function () {
      positionDocCover();
      syncTopbar();
    }, 120));
    motionMedia.addEventListener && motionMedia.addEventListener('change', setupReveal);
  }

  function debounce(fn, wait) {
    var timer = null;
    return function () {
      var args = arguments;
      clearTimeout(timer);
      timer = setTimeout(function () { fn.apply(null, args); }, wait);
    };
  }

  /* ---------------- contribution graph ---------------- */

  function initContribution() {
    var section = document.querySelector('[data-contribution]');
    if (!section) return;
    var scroll = section.querySelector('[data-contrib-scroll]');
    var select = section.querySelector('[data-contrib-select]');
    var range = section.querySelector('[data-contrib-range]');
    var views = Array.prototype.slice.call(section.querySelectorAll('.contrib-view'));
    var labelEl = section.querySelector('[data-contrib-label]');
    var totalEl = section.querySelector('[data-contrib-total]');
    var activeEl = section.querySelector('[data-contrib-active]');
    if (!scroll || !views.length) return;

    var tip = document.createElement('div');
    tip.className = 'contrib-tip';
    tip.setAttribute('aria-hidden', 'true');
    var tipDate = document.createElement('span');
    var tipCount = document.createElement('span');
    tipCount.className = 'contrib-tip-count';
    tip.appendChild(tipDate);
    tip.appendChild(tipCount);
    section.appendChild(tip);

    function hideTip() {
      tip.classList.remove('is-visible');
    }

    function placeTip(cell) {
      var rect = cell.getBoundingClientRect();
      var tipRect = tip.getBoundingClientRect();
      var left = rect.left + rect.width / 2 - tipRect.width / 2;
      left = Math.max(8, Math.min(left, window.innerWidth - tipRect.width - 8));
      var top = rect.top - tipRect.height - 8;
      if (top < 8) top = rect.bottom + 8;
      tip.style.left = left + 'px';
      tip.style.top = top + 'px';
    }

    function showTip(cell) {
      var parts = (cell.dataset.date || '').split('-');
      var count = Number(cell.dataset.count || 0);
      tipDate.textContent = parts.length === 3
        ? parts[0] + '年' + Number(parts[1]) + '月' + Number(parts[2]) + '日'
        : '';
      tipCount.textContent = count > 0 ? count + ' 次提交' : '无提交';
      tip.classList.add('is-visible');
      placeTip(cell);
    }

    section.addEventListener('pointerover', function (event) {
      if (event.pointerType === 'touch') return;
      var cell = event.target.closest('.contrib-cell[data-date]');
      if (!cell || !section.contains(cell)) return;
      // Keep native title for touch/no-JS; remove it on mouse hover so the
      // custom tooltip does not stack with the browser's delayed tooltip.
      if (cell.hasAttribute('title')) cell.removeAttribute('title');
      showTip(cell);
    });
    section.addEventListener('pointerout', function (event) {
      var cell = event.target.closest('.contrib-cell[data-date]');
      if (!cell) return;
      var next = event.relatedTarget;
      if (next && cell.contains(next)) return;
      hideTip();
    });
    section.addEventListener('pointerdown', hideTip);
    scroll.addEventListener('scroll', hideTip, { passive: true });
    window.addEventListener('scroll', hideTip, { passive: true });

    // Fill the card with square cells: derive the largest quarter-pixel size
    // that fits the visible range, clamped to 8–20px. The 8px floor keeps
    // horizontal scrolling usable on narrow screens; the 20px ceiling avoids
    // oversized cells when the current-year view is short.
    function sizeContribution() {
      var view = null;
      for (var i = 0; i < views.length; i += 1) {
        if (!views[i].hidden) {
          view = views[i];
          break;
        }
      }
      if (!view) return;
      var weeks = view.querySelectorAll('.contrib-week').length;
      var width = scroll.clientWidth;
      if (!weeks || !width) return;
      var months = view.querySelector('.contrib-months');
      if (!months) return;
      var gap = parseFloat(getComputedStyle(section).getPropertyValue('--contrib-gap')) || 3;
      var pad = parseFloat(getComputedStyle(months).paddingRight) || 0;
      var cell = (width - pad + gap) / weeks - gap;
      cell = Math.max(8, Math.min(20, Math.floor(cell * 4) / 4));
      if (weeks * (cell + gap) - gap + pad > width) {
        cell = Math.max(8, cell - 0.25);
      }
      section.style.setProperty('--contrib-cell', cell + 'px');
    }

    // Mobile URL-bar show/hide fires resize without changing the width. Only
    // re-layout on width changes so a manually scrolled graph is not snapped
    // back to the latest week while the page is being scrolled vertically.
    var resizeWidth = document.documentElement.clientWidth;
    var onResize = debounce(function () {
      hideTip();
      if (document.documentElement.clientWidth === resizeWidth) return;
      resizeWidth = document.documentElement.clientWidth;
      sizeContribution();
      requestAnimationFrame(function () {
        var key = select ? select.value : 'last-12';
        scroll.scrollLeft = key === 'last-12' ? scroll.scrollWidth : 0;
      });
    }, 120);
    window.addEventListener('resize', onResize);

    function activate(key) {
      hideTip();
      var target = null;
      views.forEach(function (view) {
        var match = view.dataset.range === key;
        view.hidden = !match;
        if (match) target = view;
      });
      if (!target) return;
      if (labelEl) labelEl.textContent = target.dataset.label || '';
      if (totalEl) totalEl.textContent = target.dataset.total || '0';
      if (activeEl) activeEl.textContent = target.dataset.active || '0';
      if (select) select.value = key;
      sizeContribution();
      requestAnimationFrame(function () {
        scroll.scrollLeft = key === 'last-12' ? scroll.scrollWidth : 0;
      });
    }

    if (select && range) {
      range.hidden = false;
      select.addEventListener('change', function () { activate(select.value); });
      var initial = select.value || views[0].dataset.range;
      if (initial !== views[0].dataset.range) {
        activate(initial);
      } else {
        sizeContribution();
        requestAnimationFrame(function () {
          scroll.scrollLeft = scroll.scrollWidth;
        });
      }
    } else {
      sizeContribution();
      requestAnimationFrame(function () { scroll.scrollLeft = scroll.scrollWidth; });
    }
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
      var next = new URLSearchParams(window.location.search);
      next.delete('q');
      next.delete('type');
      next.delete('sort');
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
    var navLinks = Array.prototype.slice.call(document.querySelectorAll('.kimi-nav a[href^="?type="]'));
    navLinks.forEach(function (link) {
      link.addEventListener('click', function (event) {
        var type = new URLSearchParams(link.search).get('type');
        if (['all', 'paper', 'blog', 'summary'].indexOf(type) < 0) return;
        event.preventDefault();
        state.type = type;
        apply();
        var library = document.getElementById('library');
        if (library) {
          library.scrollIntoView({
            behavior: motionMedia.matches ? 'auto' : 'smooth',
            block: 'start'
          });
        }
      });
    });

    // The wordmark is the home link in the reference. On the home page a
    // full reload is a no-op, so make it do something useful in both states:
    // scroll back to the top, or (already at the top) jump into the library.
    var brand = document.querySelector('.topbar .brand');
    if (brand) {
      brand.addEventListener('click', function (event) {
        if (page !== 'home') return;
        event.preventDefault();
        if (window.scrollY > 8) {
          window.scrollTo({ top: 0, behavior: motionMedia.matches ? 'auto' : 'smooth' });
          return;
        }
        var library = document.getElementById('library');
        if (library) {
          library.scrollIntoView({
            behavior: motionMedia.matches ? 'auto' : 'smooth',
            block: 'start'
          });
        }
      });
    }

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
      var toc = document.querySelector('.toc');
      if (toc) toc.hidden = true;
      var fab = document.getElementById('toc-toggle');
      if (fab) fab.hidden = true;
      var layout = document.querySelector('.doc-layout');
      if (layout) layout.classList.add('is-single-column');
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
      var mobile = document.getElementById('toc-dialog-list');
      var fab = document.getElementById('toc-toggle');
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
      var toc = document.querySelector('.toc');
      if (toc) toc.hidden = !headings.length;
      if (fab) fab.hidden = !headings.length;
      var layout = document.querySelector('.doc-layout');
      if (layout) layout.classList.toggle('is-single-column', !headings.length);
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
        block.insertBefore(button, svg);
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
      var links = Array.prototype.slice.call(
        document.querySelectorAll('#toc-list a, #toc-dialog-list a')
      );
      if (!links.length) return;
      var headings = [];
      var seen = Object.create(null);
      links.forEach(function (link) {
        var id = decodeURIComponent(link.getAttribute('href').slice(1));
        if (seen[id]) return;
        var heading = document.getElementById(id);
        if (!heading) return;
        seen[id] = true;
        headings.push(heading);
      });
      if (!headings.length) return;
      var ticking = false;
      function update() {
        var active = headings[0];
        headings.forEach(function (heading) {
          if (heading.getBoundingClientRect().top <= 110) active = heading;
        });
        links.forEach(function (link) {
          var isActive = !!active && link.getAttribute('href') === '#' + active.id;
          link.classList.toggle('is-active', isActive);
          if (isActive) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
        ticking = false;
      }
      function requestUpdate() {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(update);
      }
      window.addEventListener('scroll', requestUpdate, { passive: true });
      window.addEventListener('resize', requestUpdate);
      update();
    }

    function initTocDialog() {
      var fab = document.getElementById('toc-toggle');
      var dialog = document.getElementById('toc-dialog');
      var list = document.getElementById('toc-dialog-list');
      if (!fab || !dialog) return;
      var narrowQuery = window.matchMedia('(max-width: 1080px)');
      var scrollPadding = null;

      // 锁定页面时预留滚动条宽度，避免正文横向跳动。
      function lockScroll() {
        if (document.documentElement.classList.contains('toc-open')) return;
        var gap = window.innerWidth - document.documentElement.clientWidth;
        document.documentElement.classList.add('toc-open');
        if (gap > 0) {
          scrollPadding = document.body.style.paddingRight || '';
          document.body.style.paddingRight = gap + 'px';
        }
      }

      function unlockScroll() {
        if (!document.documentElement.classList.contains('toc-open')) return;
        document.documentElement.classList.remove('toc-open');
        if (scrollPadding !== null) {
          document.body.style.paddingRight = scrollPadding;
          scrollPadding = null;
        }
      }

      function setOpen(open) {
        if (open) {
          if (!dialog.hasAttribute('open')) {
            if (dialog.showModal) {
              try { dialog.showModal(); }
              catch (error) { dialog.setAttribute('open', ''); }
            } else {
              dialog.setAttribute('open', '');
            }
          }
          lockScroll();
          fab.setAttribute('aria-expanded', 'true');
          var closeButton = dialog.querySelector('[data-toc-close]');
          if (closeButton && document.activeElement !== closeButton) {
            closeButton.focus({ preventScroll: true });
          }
          if (list) {
            var active = list.querySelector('a.is-active') || list.querySelector('a');
            if (active) {
              var listRect = list.getBoundingClientRect();
              var activeRect = active.getBoundingClientRect();
              if (activeRect.top < listRect.top || activeRect.bottom > listRect.bottom) {
                list.scrollTop += activeRect.top - listRect.top - (list.clientHeight - activeRect.height) / 2;
              }
            }
          }
        } else {
          var wasOpen = dialog.hasAttribute('open');
          if (wasOpen) {
            if (dialog.close) {
              try { dialog.close(); }
              catch (error) { dialog.removeAttribute('open'); }
            } else {
              dialog.removeAttribute('open');
            }
          }
          unlockScroll();
          fab.setAttribute('aria-expanded', 'false');
          if (wasOpen && fab.focus) fab.focus({ preventScroll: true });
        }
      }

      fab.addEventListener('click', function () { setOpen(true); });

      var close = dialog.querySelector('[data-toc-close]');
      if (close) close.addEventListener('click', function () { setOpen(false); });

      dialog.addEventListener('click', function (event) {
        if (event.target === dialog) setOpen(false);
      });

      dialog.addEventListener('close', function () {
        unlockScroll();
        fab.setAttribute('aria-expanded', 'false');
      });

      if (list) {
        list.addEventListener('click', function (event) {
          var link = event.target.closest ? event.target.closest('a[href^="#"]') : null;
          if (!link) return;
          var hash = link.getAttribute('href');
          var current = window.location.hash;
          // location.hash 是 URL 编码后的值，link.hash 与它一致；href 属性则是原文。
          var sameHash = current && current === link.hash;
          setOpen(false);
          if (sameHash) {
            event.preventDefault();
            var target = document.getElementById(decodeURIComponent(hash.slice(1)));
            if (target) target.scrollIntoView();
          }
        });
      }

      var onViewportChange = function () { if (!narrowQuery.matches) setOpen(false); };
      if (narrowQuery.addEventListener) narrowQuery.addEventListener('change', onViewportChange);
      else if (narrowQuery.addListener) narrowQuery.addListener(onViewportChange);

      window.addEventListener('beforeprint', function () { setOpen(false); });
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

    function decodeMermaidText() {
      content.querySelectorAll('.mermaid svg text').forEach(function (text) {
        var walker = document.createTreeWalker(text, NodeFilter.SHOW_TEXT, null);
        var node;
        while ((node = walker.nextNode())) {
          if (node.nodeValue.indexOf('&') === -1) continue;
          var area = document.createElement('textarea');
          area.innerHTML = node.nodeValue;
          if (area.value !== node.nodeValue) node.nodeValue = area.value;
        }
      });
    }

    var mermaidDeferred = false;
    var mermaidPromise = null;

    function ensureMermaid() {
      if (!mermaidBlocks.length) return Promise.resolve();
      if (mermaidReady) return Promise.resolve();
      if (!mermaidPromise) {
        mermaidPromise = renderMermaidNow().catch(function (error) {
          mermaidPromise = null;
          throw error;
        });
      }
      return mermaidPromise;
    }

    window.__ensureMermaid = ensureMermaid;

    function mermaidNearViewport() {
      if (!mermaidBlocks.length) return false;
      var rect = mermaidBlocks[0].getBoundingClientRect();
      return rect.top < window.innerHeight * 2.5;
    }

    async function renderMermaid() {
      if (!mermaidBlocks.length) return;
      // Long notes: keep the text interactive and fetch the 2.7 MB vendor
      // bundle only when a diagram comes near the viewport.
      if (!mermaidReady && 'IntersectionObserver' in window && !mermaidNearViewport()) {
        mermaidDeferred = true;
        mermaidBlocks.forEach(function (block) { block.classList.add('mermaid-pending'); });
        var target = mermaidBlocks[0];
        var observer = new IntersectionObserver(function (entries) {
          if (!entries.some(function (entry) { return entry.isIntersecting; })) return;
          observer.disconnect();
          mermaidDeferred = false;
          ensureMermaid().then(function () {
            try { validateRendered(); } catch (error) { console.warn('Mermaid 校验失败：', error); }
          }).catch(function (error) { console.warn('Mermaid 渲染失败：', error); });
        }, { rootMargin: '800px 0px' });
        observer.observe(target);
        return;
      }
      return renderMermaidNow();
    }

    async function renderMermaidNow() {
      closeDiagram();
      if (!window.mermaid) {
        await loadScript(data.root + 'assets/vendor/mermaid.min.js?v=' + (data.vendorVersion || data.assetVersion));
      }
      if (!window.mermaid) throw new Error('Mermaid 未加载');
      // 用 SVG text 而不是 foreignObject + HTML 标签：不同 CJK 字体下 HTML 标签
      // 的测量宽度可能与实际渲染不一致，单行 nowrap 标签会直接溢出节点框。
      window.mermaid.initialize({
        startOnLoad: false,
        theme: 'base',
        themeVariables: mermaidVariables(),
        securityLevel: 'loose',
        htmlLabels: false,
        flowchart: { htmlLabels: false, useMaxWidth: true }
      });
      mermaidBlocks.forEach(function (block) {
        block.textContent = block.dataset.src || '';
        block.removeAttribute('data-processed');
      });
      try {
        await window.mermaid.run({ nodes: mermaidBlocks });
        decodeMermaidText();
        decorateMermaidBlocks();
        mermaidReady = true;
      } finally {
        mermaidDeferred = false;
        mermaidBlocks.forEach(function (block) { block.classList.remove('mermaid-pending'); });
      }
    }

    window.__rerenderMermaid = function () {
      if (!mermaidReady && !window.mermaid) return Promise.resolve();
      return renderMermaid();
    };

    async function renderMath() {
      if (!expectedMath) return;
      await loadScript(data.root + 'assets/vendor/mathjax/tex-svg.js?v=' + (data.vendorVersion || data.assetVersion));
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
      if (mermaidDeferred) return;
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
      initTocDialog();

      await Promise.all([renderMath(), renderMermaid()]);
      validateRendered();

      positionDocCover();
      setupReveal();
      window.__renderError = null;
    }

    render().catch(function (error) { fail(error); })
      .finally(function () { window.__renderDone = true; });
  }

  initTheme();
  initSkin();
  initHeroCode();
  initKimiControls();
  if (page === 'home') {
    initContribution();
    initHome();
  }
  if (page === 'doc') initDoc();
})();
