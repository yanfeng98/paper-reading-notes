/*
 * Sea-of-clouds hero (WebGL2).
 *
 * Port of the volumetric cloud pass used by the Kimi K3.1 article hero:
 * a raymarched fBm cloud deck is composited over the hero photograph.  The
 * static build keeps its photograph fallback when WebGL2 is unavailable or
 * the visitor asks for reduced motion.
 */
(function () {
  'use strict';

  var hero = document.querySelector('.hero');
  var photo = hero && hero.querySelector('.hero-media img');
  if (!hero || !photo) return;

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var settings = { cloud: 0.65, speed: 3, coverage: 1 };
  var api = {
    ready: false,
    setSettings: function (next) {
      if (next && typeof next.cloud === 'number') settings.cloud = next.cloud;
      if (next && typeof next.speed === 'number') settings.speed = next.speed;
      if (next && typeof next.coverage === 'number') settings.coverage = next.coverage;
      if (state) state.amountDirty = true;
    }
  };
  window.__heroCloud = api;

  var vertex = '#version 300 es\n' +
    'in vec2 p; out vec2 v, viewportUV;\n' +
    'void main(){ v = p*0.5+0.5; viewportUV = v; gl_Position = vec4(p,0.,1.); }';

  var cloudFragment = '#version 300 es\n' +
    'precision highp float;\n' +
    'in vec2 v; out vec4 o;\n' +
    'uniform vec2 res, mouse;\n' +
    'uniform float T, horizon;\n' +
    'uniform vec3 cloudAmount;\n' +
    'float hash(vec3 p){ p = fract(p*.3183099 + .1); p *= 17.; return fract(p.x*p.y*p.z*(p.x+p.y+p.z)); }\n' +
    'float noise(vec3 x){\n' +
    '  vec3 i = floor(x), f = fract(x); f = f*f*(3.-2.*f);\n' +
    '  return mix(mix(mix(hash(i),            hash(i+vec3(1,0,0)), f.x),\n' +
    '                 mix(hash(i+vec3(0,1,0)), hash(i+vec3(1,1,0)), f.x), f.y),\n' +
    '             mix(mix(hash(i+vec3(0,0,1)), hash(i+vec3(1,0,1)), f.x),\n' +
    '                 mix(hash(i+vec3(0,1,1)), hash(i+vec3(1,1,1)), f.x), f.y), f.z);\n' +
    '}\n' +
    'float fbm(vec3 p, int oct){\n' +
    '  float s = 0., a = .5, n = 0.;\n' +
    '  for (int i = 0; i < 5; i++){\n' +
    '    if (i >= oct) break;\n' +
    '    s += a*noise(p); n += a;\n' +
    '    p = p*2.03 + vec3(1.7, 9.2, 3.1); a *= .5;\n' +
    '  }\n' +
    '  return s/n;\n' +
    '}\n' +
    'const vec3 WIND = vec3(.34, 0., .14);\n' +
    'float map(vec3 p, int oct){\n' +
    '  vec3 q = p + WIND*T;\n' +
    '  q += .22*sin(q.zxy*1.12 + T*vec3(.12,.16,.10));\n' +
    '  float f = fbm(q*vec3(.82, 1.38, .82), oct);\n' +
    '  return clamp(2.05*f - .84 - 1.18*p.y + cloudAmount.y, 0., 1.);\n' +
    '}\n' +
    'float cloudCoverage(vec3 p){\n' +
    '  vec3 q = p + WIND*T - vec3(13.4,0.,8.2);\n' +
    '  float cell = floor(q.x/12.);\n' +
    '  float center = (cell+.5)*12. + (hash(vec3(cell,7.3,19.1))-.5)*2.8;\n' +
    '  float radius = mix(2.1,2.65,hash(vec3(cell,13.7,5.4)))*cloudAmount.z;\n' +
    '  float bend = (noise(vec3(q.z*.22,q.y*.3,cell+11.7))-.5)*1.2;\n' +
    '  float gaps = smoothstep(radius,radius+1.,abs(q.x-center-bend));\n' +
    '  float nearCloud = 1.-smoothstep(13.0,18.0,p.z);\n' +
    '  return mix(1.,gaps,nearCloud);\n' +
    '}\n' +
    'void main(){\n' +
    '  if(cloudAmount.x <= 0.){ o = vec4(0.); return; }\n' +
    '  vec2 q = (gl_FragCoord.xy - .5*res) / res.y;\n' +
    '  const float F = 1.6;\n' +
    '  float th = atan(horizon / F);\n' +
    '  vec3 rd = normalize(vec3(q, F));\n' +
    '  float c = cos(th), s = sin(th);\n' +
    '  rd = vec3(rd.x, rd.y*c - rd.z*s, rd.y*s + rd.z*c);\n' +
    '  float yw = mouse.x*.035; float cy = cos(yw), sy = sin(yw);\n' +
    '  rd.xz = mat2(cy, -sy, sy, cy)*rd.xz;\n' +
    '  vec3 ro = vec3(0., 1.25 - mouse.y*.04, 0.);\n' +
    '  if (rd.y > -.004){ o = vec4(0.); return; }\n' +
    '  float t0 = max((.9 - ro.y)/rd.y, 0.);\n' +
    '  float t1 = min((-1.1 - ro.y)/rd.y, t0 + 14.);\n' +
    '  if (t0 > 11.){ o = vec4(0.); return; }\n' +
    '  const vec3 SUN = normalize(vec3(-.5, .42, .75));\n' +
    '  vec3 hazeC = vec3(.82, .84, .85);\n' +
    '  vec4 sum = vec4(0.);\n' +
    '  float tt = t0 + hash(vec3(gl_FragCoord.xy, fract(T)))*.08;\n' +
    '  for (int i = 0; i < 64; i++){\n' +
    '    if (sum.a > .995 || tt > t1) break;\n' +
    '    float dt = max(.05, .03*tt);\n' +
    '    vec3 p = ro + rd*tt;\n' +
    '    int oct = tt < 7. ? 5 : 3;\n' +
    '    float den = map(p, oct);\n' +
    '    if (den > .01){\n' +
    '      float dif = clamp((den - map(p + .3*SUN, 3))/.6, 0., 1.);\n' +
    '      float light = clamp(.80-.70*den+1.1*dif,0.,1.);\n' +
    '      vec3 col = mix(vec3(.50,.59,.64),vec3(.90,.90,.865),light);\n' +
    '      col += vec3(.05,.043,.026)*dif*pow(1.-den,2.);\n' +
    '      col = mix(col, hazeC, 1. - exp(-.0035*tt*tt));\n' +
    '      float a = 1.-exp(-den*dt*1.35*cloudAmount.x*cloudCoverage(p));\n' +
    '      sum += vec4(col*a, a)*(1. - sum.a);\n' +
    '    }\n' +
    '    tt += dt;\n' +
    '  }\n' +
    '  float distanceFade = 1.-smoothstep(4.5,11.,t0);\n' +
    '  o = sum*distanceFade;\n' +
    '}';

  var compositeFragment = '#version 300 es\n' +
    'precision highp float;\n' +
    'in vec2 viewportUV; out vec4 o;\n' +
    'uniform sampler2D img, clouds;\n' +
    'uniform vec2 res, imgSize, mouse;\n' +
    'uniform float T, coverage;\n' +
    'float h(vec2 p){ p = fract(p*vec2(123.34,456.21)); p += dot(p,p+45.32); return fract(p.x*p.y); }\n' +
    'float lum(vec3 c){ return dot(c,vec3(.299,.587,.114)); }\n' +
    'vec2 photoScale(){\n' +
    '  float ra = res.x/res.y, ia = imgSize.x/imgSize.y;\n' +
    '  return ra > ia ? vec2(1.,ia/ra) : vec2(ra/ia,1.);\n' +
    '}\n' +
    'vec2 photoUV(vec2 screen){\n' +
    '  return (vec2(screen.x,1.-screen.y)-.5)*photoScale()+.5+mouse*.0024;\n' +
    '}\n' +
    'float ridgeVisibility(vec3 base, vec2 uv, float y){\n' +
    '  float L = mix(lum(base),lum(textureLod(img,uv,3.).rgb),.45);\n' +
    '  float rock = 1.-smoothstep(.24,.48,L);\n' +
    '  return 1.-rock*mix(.95,.35,smoothstep(.55,.95,y));\n' +
    '}\n' +
    'void main(){\n' +
    '  vec2 v = viewportUV;\n' +
    '  vec2 uv = photoUV(v);\n' +
    '  vec3 base = texture(img, uv).rgb;\n' +
    '  float k = ridgeVisibility(base,uv,1.-v.y);\n' +
    '  vec4 c = texture(clouds,v)*k;\n' +
    '  c.a *= mix(.82, 1.12, coverage);\n' +
    '  c.rgb *= mix(.94, 1.04, coverage);\n' +
    '  vec3 col = base*(1.-c.a)+c.rgb;\n' +
    '  float grain = (h(gl_FragCoord.xy + fract(T)*97.) - .5)*.018;\n' +
    '  vec2 q = v-.5;\n' +
    '  float vignette = 1.-dot(q,q)*.28;\n' +
    '  col = (col+grain)*vignette;\n' +
    '  o = vec4(col,1.);\n' +
    '}';

  var state = null;
  var canvas = null;
  var raf = 0;
  var pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  var last = 0;
  var time = 30;
  var inView = true;
  var running = false;

  function compile(gl, type, source) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      throw new Error(gl.getShaderInfoLog(shader) || 'shader compile failed');
    }
    return shader;
  }

  function program(gl, vs, fs) {
    var p = gl.createProgram();
    gl.attachShader(p, compile(gl, gl.VERTEX_SHADER, vs));
    gl.attachShader(p, compile(gl, gl.FRAGMENT_SHADER, fs));
    gl.bindAttribLocation(p, 0, 'p');
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
      throw new Error(gl.getProgramInfoLog(p) || 'program link failed');
    }
    var uniforms = {};
    var count = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);
    for (var i = 0; i < count; i++) {
      var name = gl.getActiveUniform(p, i).name;
      uniforms[name] = gl.getUniformLocation(p, name);
    }
    return { program: p, uniforms: uniforms };
  }

  function fitSize(w, h, pixels, scale, maxSide) {
    var s = Math.min(scale, Math.sqrt(pixels / (w * h)), maxSide / w, maxSide / h);
    return [Math.max(1, Math.floor(w * s)), Math.max(1, Math.floor(h * s))];
  }

  function init() {
    if (reduce.matches) return;
    // site.js hydrates the real hero photograph after this defer script has
    // run, so decode the Kimi source explicitly instead of sampling the 1x1
    // transparent placeholder.
    var sourceImage = photo;
    if (photo.dataset.kimiSrc && (!photo.currentSrc || photo.currentSrc.indexOf('data:image') === 0)) {
      sourceImage = new Image();
      sourceImage.decoding = 'async';
      sourceImage.src = photo.dataset.kimiSrc;
    }
    var boot = function () {
      if (reduce.matches) return;
      bootRenderer(sourceImage);
    };
    if (sourceImage.complete && sourceImage.naturalWidth) {
      boot();
    } else if (sourceImage.decode) {
      sourceImage.decode().then(boot).catch(function () {
        if (sourceImage.naturalWidth) boot();
      });
    } else {
      sourceImage.addEventListener('load', boot, { once: true });
    }
  }

  function bootRenderer(sourceImage) {
    canvas = document.createElement('canvas');
    canvas.className = 'hero-cloud-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    hero.querySelector('.hero-media').appendChild(canvas);
    var gl = canvas.getContext('webgl2', {
      alpha: false,
      premultipliedAlpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: 'low-power'
    });
    if (!gl) {
      canvas.remove();
      canvas = null;
      return;
    }
    try {
      state = createRenderer(gl, sourceImage);
    } catch (error) {
      console.warn('Hero cloud renderer unavailable:', error);
      canvas.remove();
      canvas = null;
      return;
    }

    api.ready = true;
    hero.classList.add('hero-cloud-ready');

    var renderNow = function () {
      if (!state) return;
      state.resizeDirty = true;
      try { state.draw(0); } catch (error) { /* keep the last frame */ }
    };
    var resizeObserver = new ResizeObserver(renderNow);
    resizeObserver.observe(hero);
    window.addEventListener('resize', renderNow, { passive: true });
    var intersection = new IntersectionObserver(function (entries) {
      inView = entries[0].isIntersecting;
      if (inView) start(); else stop();
    }, { threshold: 0 });
    intersection.observe(hero);
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stop(); else if (inView) start();
    });
    new MutationObserver(function () {
      if (document.documentElement.dataset.skin === 'kimi') {
        if (inView) start();
      } else {
        stop();
      }
    }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-skin'] });
    hero.addEventListener('pointermove', function (event) {
      var rect = hero.getBoundingClientRect();
      pointer.tx = ((event.clientX - rect.left) / Math.max(1, rect.width) - .5) * 2;
      pointer.ty = ((event.clientY - rect.top) / Math.max(1, rect.height) - .5) * 2;
    }, { passive: true });
    hero.addEventListener('pointerleave', function () {
      pointer.tx = 0;
      pointer.ty = 0;
    }, { passive: true });
    hero.addEventListener('webglcontextlost', function (event) {
      event.preventDefault();
      stop();
      api.ready = false;
      hero.classList.remove('hero-cloud-ready');
    });
    hero.addEventListener('webglcontextrestored', function () {
      if (state) { state = null; }
      try {
        state = createRenderer(gl, sourceImage);
        api.ready = true;
        hero.classList.add('hero-cloud-ready');
        start();
      } catch (error) { /* keep photograph */ }
    });
    start();
  }

  function createRenderer(gl, sourceImage) {
    var cloudProgram = program(gl, vertex, cloudFragment);
    var compositeProgram = program(gl, vertex, compositeFragment);
    var vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.disable(gl.DEPTH_TEST);
    gl.disable(gl.BLEND);

    var photoTexture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, photoTexture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    var maxTexture = Math.min(4096, gl.getParameter(gl.MAX_TEXTURE_SIZE));
    var source = document.createElement('canvas');
    var srcW = sourceImage.naturalWidth || sourceImage.width || 2400;
    var srcH = sourceImage.naturalHeight || sourceImage.height || 1800;
    var size = fitSize(srcW, srcH, 2400000, 1, Math.min(2048, maxTexture));
    source.width = size[0];
    source.height = size[1];
    var sourceCtx = source.getContext('2d');
    sourceCtx.imageSmoothingQuality = 'high';
    sourceCtx.drawImage(sourceImage, 0, 0, source.width, source.height);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
    source.width = source.height = 1;

    var cloudTexture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, cloudTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    var framebuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, cloudTexture, 0);
    if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) {
      throw new Error('cloud framebuffer incomplete');
    }
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    var output = {
      width: 0,
      height: 0,
      cloudWidth: 0,
      cloudHeight: 0
    };
    var renderer = {
      resizeDirty: true,
      amountDirty: true
    };

    function resize() {
      var rect = hero.getBoundingClientRect();
      var dpr = window.devicePixelRatio || 1;
      var composite = fitSize(
        Math.max(1, rect.width),
        Math.max(1, rect.height),
        8000000,
        Math.min(2, Math.max(1, dpr)),
        maxTexture
      );
      var cloud = fitSize(composite[0], composite[1], 450000, 0.5, maxTexture);
      canvas.width = composite[0];
      canvas.height = composite[1];
      if (output.cloudWidth !== cloud[0] || output.cloudHeight !== cloud[1]) {
        gl.bindTexture(gl.TEXTURE_2D, cloudTexture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, cloud[0], cloud[1], 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
      }
      output.width = composite[0];
      output.height = composite[1];
      output.cloudWidth = cloud[0];
      output.cloudHeight = cloud[1];
      renderer.resizeDirty = false;
    }

    function cloudAmount(value) {
      var u = Math.max(0, Math.min(5, value));
      var f = Math.max(0, u - 0.25);
      var h = Math.log1p(2 * f) / Math.log(10.5);
      return {
        opticalDepth: Math.min(u, 0.25) + f / (1 + 0.45 * f),
        densityLift: 0.16 * h,
        gapScale: 1 - 0.7 * h
      };
    }

    renderer.draw = function (dt) {
      if (renderer.resizeDirty) resize();
      if (!output.width) return;
      var amount = cloudAmount(settings.cloud);
      var cw = output.cloudWidth;
      var ch = output.cloudHeight;
      gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
      gl.viewport(0, 0, cw, ch);
      gl.useProgram(cloudProgram.program);
      gl.uniform2f(cloudProgram.uniforms.res, cw, ch);
      gl.uniform2f(cloudProgram.uniforms.mouse, pointer.x, pointer.y);
      gl.uniform1f(cloudProgram.uniforms.T, time);
      gl.uniform3f(cloudProgram.uniforms.cloudAmount, amount.opticalDepth, amount.densityLift, amount.gapScale);
      gl.uniform1f(
        cloudProgram.uniforms.horizon,
        0.2 / Math.min(
          1,
          Math.max(1, srcW) / Math.max(1, srcH) /
            (Math.max(1, output.width) / Math.max(1, output.height))
        )
      );
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, output.width, output.height);
      gl.useProgram(compositeProgram.program);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, photoTexture);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, cloudTexture);
      gl.uniform1i(compositeProgram.uniforms.img, 0);
      gl.uniform1i(compositeProgram.uniforms.clouds, 1);
      gl.uniform2f(compositeProgram.uniforms.res, output.width, output.height);
      gl.uniform2f(compositeProgram.uniforms.imgSize, srcW, srcH);
      gl.uniform2f(compositeProgram.uniforms.mouse, pointer.x, pointer.y);
      gl.uniform1f(compositeProgram.uniforms.T, time);
      gl.uniform1f(compositeProgram.uniforms.coverage, settings.coverage);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      renderer.amountDirty = false;
    };

    renderer.destroy = function () {
      gl.deleteFramebuffer(framebuffer);
      gl.deleteTexture(cloudTexture);
      gl.deleteTexture(photoTexture);
      gl.deleteBuffer(buffer);
      gl.deleteVertexArray(vao);
      gl.deleteProgram(cloudProgram.program);
      gl.deleteProgram(compositeProgram.program);
    };
    return renderer;
  }

  function frame(now) {
    raf = 0;
    if (!state || reduce.matches) return;
    var dt = last ? Math.min(0.1, (now - last) / 1000) : 0.033;
    last = now;
    var ease = 1 - Math.pow(0.94, 60 * dt);
    pointer.x += (pointer.tx - pointer.x) * ease;
    pointer.y += (pointer.ty - pointer.y) * ease;
    time += dt * Math.max(0.2, Math.min(15, settings.speed));
    try {
      state.draw(dt);
    } catch (error) {
      console.warn('Hero cloud draw failed:', error);
      stop();
      return;
    }
    if (running) raf = window.requestAnimationFrame(frame);
  }

  function start() {
    if (!canvas || !state || reduce.matches) return;
    if (document.documentElement.dataset.skin !== 'kimi') return;
    if (running && raf) return;
    running = true;
    last = 0;
    if (!raf) raf = window.requestAnimationFrame(frame);
  }

  function stop() {
    running = false;
    if (raf) {
      window.cancelAnimationFrame(raf);
      raf = 0;
    }
    last = 0;
  }

  reduce.addEventListener && reduce.addEventListener('change', function () {
    if (reduce.matches) {
      stop();
      if (canvas) canvas.remove();
      canvas = null;
      state = null;
      api.ready = false;
      hero.classList.remove('hero-cloud-ready');
    } else {
      init();
    }
  });

  init();
})();
