/*
 * Sea-of-clouds hero (WebGL2).
 *
 * Port of the Kimi K3.1 article hero: a raymarched fBm cloud deck, the brush
 * wordmark, and the pointer-driven code field are all composited by one WebGL
 * pipeline.  The static build keeps its photograph fallback when WebGL2 is
 * unavailable or the visitor asks for reduced motion.
 *
 * The wordmark interaction follows the reference: a 32x32 wave surface warps
 * the glyph locally, and a short-lived ink wash erases it along the pointer
 * trail.  There is no whole-word wind displacement.
 */
(function () {
  'use strict';

  var hero = document.querySelector('.hero');
  var photo = hero && hero.querySelector('.hero-media img');
  if (!hero || !photo) return;

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var mark = hero.querySelector('[data-kimi-mark]');
  var markSvg = mark && mark.querySelector('.mark-svg');
  var settings = { cloud: 0.65, speed: 3, coverage: 1, ink: 0.9 };
  var api = {
    ready: false,
    setSettings: function (next) {
      if (!next) return;
      if (typeof next.cloud === 'number') settings.cloud = Math.max(0.65, Math.min(5, next.cloud));
      if (typeof next.speed === 'number') settings.speed = Math.max(0.2, Math.min(15, next.speed));
      if (typeof next.coverage === 'number') settings.coverage = Math.max(0, Math.min(1, next.coverage));
      if (typeof next.ink === 'number') settings.ink = Math.max(0, Math.min(1, next.ink));
      if (settings.ink <= 0) resetMark();
    },
    resetMark: resetMark,
    releaseMark: releaseMark
  };
  window.__heroCloud = api;

  var vertex = '#version 300 es\n' +
    'in vec2 p; out vec2 v, viewportUV;\n' +
    'void main(){ v = p*0.5+0.5; viewportUV = v; gl_Position = vec4(p,0.,1.); }';

  var cloudFragment = [
    '#version 300 es',
    'precision highp float;',
    'in vec2 v;',
    'layout(location=0) out vec4 o;',
    'layout(location=1) out vec4 frontCloud;',
    'uniform vec2 res, mouse;',
    'uniform float T, horizon;',
    'uniform vec3 cloudAmount;',
    'float hash(vec3 p){ p = fract(p*.3183099 + .1); p *= 17.; return fract(p.x*p.y*p.z*(p.x+p.y+p.z)); }',
    'float noise(vec3 x){',
    '  vec3 i = floor(x), f = fract(x); f = f*f*(3.-2.*f);',
    '  return mix(mix(mix(hash(i),            hash(i+vec3(1,0,0)), f.x),',
    '                 mix(hash(i+vec3(0,1,0)), hash(i+vec3(1,1,0)), f.x), f.y),',
    '             mix(mix(hash(i+vec3(0,0,1)), hash(i+vec3(1,0,1)), f.x),',
    '                 mix(hash(i+vec3(0,1,1)), hash(i+vec3(1,1,1)), f.x), f.y), f.z);',
    '}',
    'float fbm(vec3 p, int oct){',
    '  float s = 0., a = .5, n = 0.;',
    '  for (int i = 0; i < 5; i++){',
    '    if (i >= oct) break;',
    '    s += a*noise(p); n += a;',
    '    p = p*2.03 + vec3(1.7, 9.2, 3.1); a *= .5;',
    '  }',
    '  return s/n;',
    '}',
    'const vec3 WIND = vec3(.34, 0., .14);',
    'float map(vec3 p, int oct){',
    '  vec3 q = p + WIND*T;',
    '  q += .22*sin(q.zxy*1.12 + T*vec3(.12,.16,.10));',
    '  float f = fbm(q*vec3(.82, 1.38, .82), oct);',
    '  return clamp(2.05*f - .84 - 1.18*p.y + cloudAmount.y, 0., 1.);',
    '}',
    'float cloudCoverage(vec3 p){',
    '  vec3 q = p + WIND*T - vec3(13.4,0.,8.2);',
    '  float cell = floor(q.x/12.);',
    '  float center = (cell+.5)*12. + (hash(vec3(cell,7.3,19.1))-.5)*2.8;',
    '  float radius = mix(2.1,2.65,hash(vec3(cell,13.7,5.4)))*cloudAmount.z;',
    '  float bend = (noise(vec3(q.z*.22,q.y*.3,cell+11.7))-.5)*1.2;',
    '  float gaps = smoothstep(radius,radius+1.,abs(q.x-center-bend));',
    '  float nearCloud = 1.-smoothstep(13.0,18.0,p.z);',
    '  return mix(1.,gaps,nearCloud);',
    '}',
    'void main(){',
    '  frontCloud = vec4(0.);',
    '  if(cloudAmount.x <= 0.){ o = vec4(0.); return; }',
    '  vec2 q = (gl_FragCoord.xy - .5*res) / res.y;',
    '  const float F = 1.6;',
    '  float th = atan(horizon / F);',
    '  vec3 rd = normalize(vec3(q, F));',
    '  float c = cos(th), s = sin(th);',
    '  rd = vec3(rd.x, rd.y*c - rd.z*s, rd.y*s + rd.z*c);',
    '  float yw = mouse.x*.035; float cy = cos(yw), sy = sin(yw);',
    '  rd.xz = mat2(cy, -sy, sy, cy)*rd.xz;',
    '  vec3 ro = vec3(0., 1.25 - mouse.y*.04, 0.);',
    '  if (rd.y > -.004){ o = vec4(0.); return; }',
    '  float t0 = max((.9 - ro.y)/rd.y, 0.);',
    '  float t1 = min((-1.1 - ro.y)/rd.y, t0 + 14.);',
    '  if (t0 > 11.){ o = vec4(0.); return; }',
    '  const vec3 SUN = normalize(vec3(-.5, .42, .75));',
    '  vec3 hazeC = vec3(.82, .84, .85);',
    '  vec4 sum = vec4(0.);',
    '  vec4 foreground = vec4(0.);',
    '  float tt = t0 + hash(vec3(gl_FragCoord.xy, fract(T)))*.08;',
    '  for (int i = 0; i < 64; i++){',
    '    if (sum.a > .995 || tt > t1) break;',
    '    float dt = max(.05, .03*tt);',
    '    vec3 p = ro + rd*tt;',
    '    int oct = tt < 7. ? 5 : 3;',
    '    float den = map(p, oct);',
    '    if (den > .01){',
    '      float dif = clamp((den - map(p + .3*SUN, 3))/.6, 0., 1.);',
    '      float light = clamp(.80-.70*den+1.1*dif,0.,1.);',
    '      vec3 col = mix(vec3(.50,.59,.64),vec3(.90,.90,.865),light);',
    '      col += vec3(.05,.043,.026)*dif*pow(1.-den,2.);',
    '      col = mix(col, hazeC, 1. - exp(-.0035*tt*tt));',
    '      float a = 1.-exp(-den*dt*1.35*cloudAmount.x*cloudCoverage(p));',
    '      float front = 1.-smoothstep(11.7,12.3,p.z);',
    '      float fa = a*front;',
    '      foreground += vec4(col*fa,fa)*(1.-foreground.a);',
    '      sum += vec4(col*a, a)*(1. - sum.a);',
    '    }',
    '    tt += dt;',
    '  }',
    '  float distanceFade = 1.-smoothstep(4.5,11.,t0);',
    '  frontCloud = foreground*distanceFade;',
    '  o = sum*distanceFade;',
    '}'
  ].join('\n');

  var compositeFragment = [
    '#version 300 es',
    'precision highp float;',
    'in vec2 viewportUV; out vec4 o;',
    'vec2 v;',
    'uniform sampler2D img, clouds, frontClouds, codeGrid, codeAtlas, titleGlyph, titleSurface, inkNoise;',
    'uniform vec2 res, imgSize, mouse, sceneSize, codeStep;',
    'uniform float T, coverage, codeSize, titleOpacity, titleStrength;',
    'uniform float writingProgress, ink, particles, titleActive, washSolidity, titleCloudPresence;',
    'uniform vec4 titleRect, inkBounds, inkStarts[16], inkEnds[16], inkTipStart, inkTipEnd;',
    'uniform int inkCount;',
    'float h(vec2 p){ p = fract(p*vec2(123.34,456.21)); p += dot(p,p+45.32); return fract(p.x*p.y); }',
    'float lum(vec3 c){ return dot(c,vec3(.299,.587,.114)); }',
    'vec2 photoScale(){',
    '  float ra = res.x/res.y, ia = imgSize.x/imgSize.y;',
    '  return ra > ia ? vec2(1.,ia/ra) : vec2(ra/ia,1.);',
    '}',
    'vec2 photoUV(vec2 screen){',
    '  return (vec2(screen.x,1.-screen.y)-.5)*photoScale()+.5+mouse*.0024;',
    '}',
    'float ridgeVisibility(vec3 base, vec2 uv, float y){',
    '  float L = mix(lum(base),lum(textureLod(img,uv,3.).rgb),.45);',
    '  float rock = 1.-smoothstep(.24,.48,L);',
    '  return 1.-rock*mix(.95,.35,smoothstep(.55,.95,y));',
    '}',
    'vec3 composeGlyphs(vec3 color, vec3 landscape){',
    '  if(particles < .5 || ink <= 0. || writingProgress < 1.) return color;',
    '  vec2 pixel = vec2(v.x,1.-v.y)*sceneSize;',
    '  ivec2 cell = ivec2(floor(pixel/codeStep));',
    '  if(any(greaterThanEqual(cell,textureSize(codeGrid,0)))) return color;',
    '  vec2 entry = texelFetch(codeGrid,cell,0).rg;',
    '  float visibility = entry.g*1.38;',
    '  if(visibility <= 0.) return color;',
    '  float glyph = floor(entry.r*255.+.5);',
    '  vec2 local = (mod(pixel,codeStep)-codeStep*.5)/(codeSize*1.5)+.5;',
    '  vec2 atlas = (vec2(mod(glyph,16.),floor(glyph/16.))+local)/vec2(16.,6.);',
    '  float alpha = textureLod(codeAtlas,atlas,0.).r;',
    '  float luminance = dot(landscape,vec3(.2126,.7152,.0722));',
    '  float contrast = .07+.93*pow(clamp(1.-luminance,0.,1.),1.45);',
    '  float strength = clamp(visibility*contrast,0.,1.);',
    '  vec3 tail = vec3(65.,190.,57.)/255.;',
    '  vec3 head = mix(tail,vec3(1.),.62);',
    '  vec3 pigment = mix(tail,head,smoothstep(.44,.60,strength));',
    '  return mix(color,pigment,alpha*strength*sqrt(ink));',
    '}',
    'float strokeReveal(vec2 pixel, vec3 grain, vec3 fiber, vec4 start, vec4 end, bool attached){',
    '  float age = end.w;',
    '  float drying = (attached ? 1. : smoothstep(0.,.085,age))*(1.-smoothstep(.10,.65,age));',
    '  float spread = attached ? 1. : 1.+.34*(1.-exp(-age*3.));',
    '  float limit = max(start.z,end.z)*2.4;',
    '  if(any(lessThan(pixel,min(start.xy,end.xy)-limit)) ||',
    '    any(greaterThan(pixel,max(start.xy,end.xy)+limit))) return 0.;',
    '  vec2 path = end.xy-start.xy;',
    '  vec2 warp = (grain.rg-.5)*max(start.z,end.z)*(attached ? .2 : .56);',
    '  vec2 offset = pixel+warp-start.xy;',
    '  float along = clamp(dot(offset,path)/max(dot(path,path),.001),0.,1.);',
    '  float radius = mix(start.z,end.z,along)*spread;',
    '  float distance = length(offset-path*along)/radius;',
    '  distance += (grain.b-.5)*(attached ? .06 : .22)+(fiber.r-.5)*(attached ? .03 : .09);',
    '  float core = 1.-smoothstep(mix(.2,.8,washSolidity),mix(.82,1.06,washSolidity),distance);',
    '  float wet = (1.-smoothstep(.45,1.38,distance))*mix(.48,.28,washSolidity);',
    '  float edge = smoothstep(mix(.35,.9,washSolidity),mix(1.1,1.3,washSolidity),distance);',
    '  float paper = mix(1.,smoothstep(.18,.7,fiber.g+grain.b*.22),edge*.88);',
    '  return max(core,wet)*paper*drying*mix(start.w,1.,washSolidity);',
    '}',
    'float designReveal(){',
    '  if(ink <= 0. || (inkCount == 0 && inkTipStart.w <= 0.) || particles < .5) return 0.;',
    '  vec2 pixel = v*sceneSize;',
    '  if(any(lessThan(pixel,inkBounds.xy)) || any(greaterThan(pixel,inkBounds.zw))) return 0.;',
    '  vec3 grain = texture(inkNoise,pixel/1800.).rgb;',
    '  vec3 fiber = texture(inkNoise,pixel/410.+vec2(.31,.73)).rgb;',
    '  float reveal = inkTipStart.w > 0. ? strokeReveal(pixel,grain,fiber,inkTipStart,inkTipEnd,true) : 0.;',
    '  for(int i=0; i<16; i++){',
    '    if(i >= inkCount) break;',
    '    reveal = max(reveal,strokeReveal(pixel,grain,fiber,inkStarts[i],inkEnds[i],false));',
    '  }',
    '  return reveal;',
    '}',
    'vec3 composeTitle(vec3 color, vec3 cleanRear, vec4 front){',
    '  if(titleActive <= .001 || titleRect.z <= 0. || titleRect.w <= 0.) return color;',
    '  vec2 uv = (v*sceneSize-titleRect.xy)/titleRect.zw;',
    '  if(any(lessThan(uv,vec2(-.08))) || any(greaterThan(uv,vec2(1.08)))) return color;',
    '  vec4 encoded = texture(titleSurface,clamp(uv,vec2(0.),vec2(1.)));',
    '  vec2 displacement = (encoded.rg-.5)*0.32;',
    '  vec2 source = writingProgress >= 1. ? uv-displacement*titleStrength : uv;',
    '  vec4 title = texture(titleGlyph,clamp(source,vec2(0.),vec2(1.)));',
    '  title *= titleActive;',
    '  if(title.a <= .001) return color;',
    '  vec3 lettering = cleanRear*((1.-titleOpacity)*title.a)+vec3(1.)*titleOpacity*title.a;',
    '  lettering = lettering*(1.-front.a)+front.rgb*title.a;',
    '  return color*(1.-title.a)+lettering;',
    '}',
    'vec3 sceneAt(vec2 screen){',
    '  v = screen;',
    '  vec2 uv = photoUV(v);',
    '  vec3 base = texture(img, uv).rgb;',
    '  float k = ridgeVisibility(base,uv,1.-v.y);',
    '  vec4 c = texture(clouds,v)*k;',
    '  c.a = min(1., c.a * mix(.82,1.12,coverage));',
    '  c.rgb *= mix(.94,1.04,coverage);',
    '  vec4 front = clamp(texture(frontClouds,v)*k*titleCloudPresence,vec4(0.),c);',
    '  vec4 behind = (c-front)/max(1.-front.a,.001);',
    '  vec3 cleanRear = base*(1.-behind.a)+behind.rgb;',
    '  vec3 landscape = base*(1.-c.a)+c.rgb;',
    '  vec3 col = composeGlyphs(landscape,landscape);',
    '  vec3 withTitle = composeTitle(col,cleanRear,front);',
    '  float titleCover = (titleActive > .001 && writingProgress >= 1.) ? clamp(designReveal(),0.,1.) : 0.;',
    '  col = mix(withTitle,col,titleCover);',
    '  return col;',
    '}',
    'void main(){',
    '  vec3 col = sceneAt(viewportUV);',
    '  float grain = (h(gl_FragCoord.xy + fract(T)*97.) - .5)*.018;',
    '  vec2 q = viewportUV-.5;',
    '  float vignette = 1.-dot(q,q)*.28;',
    '  col = (col+grain)*vignette;',
    '  o = vec4(col,1.);',
    '}'
  ].join('\n');

  /* ---------- code field state (ported from the K3.1 hero) ---------- */

  function createCodeState(snippets) {
    var state = {
      cols: 1,
      rows: 1,
      size: 12,
      step: [9.6, 13.8],
      data: new Uint8Array(2),
      revision: 0
    };
    var width = 1;
    var height = 1;
    var ribbons = [];
    var lastPoint = null;
    var active = false;

    function clamp(value, min, max) {
      return Math.max(min, Math.min(max, value));
    }

    function reset() {
      lastPoint = null;
      ribbons = [];
      for (var i = 1; i < state.data.length; i += 2) state.data[i] = 0;
      state.revision++;
      active = false;
    }

    function rebuild() {
      reset();
      state.size = Math.max(12, width / 409.6, height / 294.4);
      state.step = [0.8 * state.size, 1.15 * state.size];
      state.cols = Math.ceil(width / state.step[0]);
      state.rows = Math.ceil(height / state.step[1]);
      state.data = new Uint8Array(state.cols * state.rows * 2);
      for (var row = 0; row < state.rows; row++) {
        var text = '';
        var cursor = 0;
        while (text.length < state.cols) {
          text += snippets[(row * 7 + 11 * cursor++) % snippets.length] + '   ';
        }
        for (var col = 0; col < state.cols; col++) {
          state.data[(row * state.cols + col) * 2] = text.charCodeAt(col) - 32;
        }
      }
      state.revision++;
    }

    function addRibbon(x, y) {
      var row = clamp(Math.floor(y / state.step[1]), 0, state.rows - 1);
      var col = clamp(Math.floor(x / state.step[0]), 0, state.cols - 1);
      ribbons.push({
        row: row,
        head: col + 0.5,
        cols: 18 + 20 * Math.random(),
        age: 0,
        duration: 5 * (0.85 + 0.4 * Math.random()),
        speed: 70 * (0.55 + 0.7 * Math.random())
      });
      if (ribbons.length > 256) ribbons.shift();
      active = true;
    }

    function move(x, y) {
      if (x < 0 || y < 0 || x >= width || y >= height) {
        lastPoint = null;
        return;
      }
      var distance = lastPoint ? Math.hypot(x - lastPoint.x, y - lastPoint.y) : Infinity;
      if (!lastPoint || distance > 180) {
        addRibbon(x, y);
      } else if (distance >= 1) {
        var steps = Math.ceil(distance / Math.max(9, 1.8 * state.size));
        for (var i = 1; i <= steps; i++) {
          if (Math.random() < 0.51) {
            addRibbon(
              lastPoint.x + (x - lastPoint.x) * i / steps,
              lastPoint.y + (y - lastPoint.y) * i / steps
            );
          }
        }
      }
      lastPoint = { x: x, y: y };
    }

    function advance(dt) {
      if (!active && !ribbons.length) return;
      for (var i = 1; i < state.data.length; i += 2) state.data[i] = 0;
      for (var r = 0; r < ribbons.length; r++) {
        var ribbon = ribbons[r];
        ribbon.age += Math.max(0, dt);
        var head = ribbon.head - ribbon.age * ribbon.speed / state.step[0];
        var fade = Math.pow(clamp(1 - ribbon.age / ribbon.duration, 0, 1), 1.42);
        if (fade <= 0) continue;
        var start = Math.max(0, Math.ceil(head - ribbon.cols - 0.5));
        var end = Math.min(state.cols - 1, Math.floor(head + 0.05));
        for (var col = start; col <= end; col++) {
          var value = Math.round(
            255 * fade * (0.1 + 1.28 * Math.pow(
              clamp(1 - (head - col - 0.5) / ribbon.cols, 0, 1), 0.92
            )) / 1.38
          );
          var index = (ribbon.row * state.cols + col) * 2 + 1;
          if (value > state.data[index]) state.data[index] = value;
        }
      }
      ribbons = ribbons.filter(function (ribbon) {
        return ribbon.age < ribbon.duration &&
          ribbon.head * state.step[0] - ribbon.age * ribbon.speed > -state.step[0];
      });
      state.revision++;
      active = ribbons.length > 0 || state.data.some(function (value, index) {
        return index % 2 === 1 && value > 0;
      });
    }

    return {
      state: state,
      resize: function (w, h) {
        w = Math.max(1, w);
        h = Math.max(1, h);
        if (w !== width || h !== height) {
          width = w;
          height = h;
          rebuild();
        }
      },
      move: move,
      release: function () { lastPoint = null; },
      reset: reset,
      advance: advance
    };
  }

  /* ---------- ink wash state (ported from the K3.1 hero) ---------- */

  function createWashState() {
    var state = {
      starts: new Float32Array(64),
      ends: new Float32Array(64),
      bounds: new Float32Array(4),
      tipStart: new Float32Array(4),
      tipEnd: new Float32Array(4),
      count: 0,
      radiusScale: 1.5,
      dampingMs: 130
    };
    var strokes = [];
    var width = 1;
    var height = 1;
    var elapsed = 0;
    var accum = 0;
    var pointerX = 0;
    var pointerY = 0;
    var lastX = 0;
    var lastY = 0;
    var prevX = 0;
    var prevY = 0;
    var hover = false;
    var moved = false;
    var lastStampX = 0;
    var lastStampY = 0;
    var lastStampTime = 0;
    var radiusFactor = 0.72;
    var lastStroke = null;
    var dt = 1 / 60;

    function clamp(value, min, max) {
      return Math.max(min, Math.min(max, value));
    }

    function radius() {
      return Math.max(48, Math.min(125, 0.19 * Math.min(width, height))) * state.radiusScale;
    }

    function addStroke(x, y, r, density) {
      var stroke = {
        ax: x,
        ay: y,
        bx: x,
        by: y,
        ar: r,
        br: r,
        density: density,
        born: Math.min(elapsed, lastStampTime + dt)
      };
      if (strokes.length === 16) strokes.shift();
      strokes.push(stroke);
      lastStroke = stroke;
      return stroke;
    }

    function publish() {
      state.count = strokes.length;
      state.bounds[0] = width;
      state.bounds[1] = height;
      state.bounds[2] = 0;
      state.bounds[3] = 0;
      for (var i = 0; i < strokes.length; i++) {
        var stroke = strokes[i];
        var offset = 4 * i;
        state.starts[offset] = stroke.ax;
        state.starts[offset + 1] = stroke.ay;
        state.starts[offset + 2] = stroke.ar;
        state.starts[offset + 3] = stroke.density;
        state.ends[offset] = stroke.bx;
        state.ends[offset + 1] = stroke.by;
        state.ends[offset + 2] = stroke.br;
        state.ends[offset + 3] = elapsed - stroke.born;
        var margin = 2.4 * Math.max(stroke.ar, stroke.br);
        state.bounds[0] = Math.min(state.bounds[0], stroke.ax - margin, stroke.bx - margin);
        state.bounds[1] = Math.min(state.bounds[1], stroke.ay - margin, stroke.by - margin);
        state.bounds[2] = Math.max(state.bounds[2], stroke.ax + margin, stroke.bx + margin);
        state.bounds[3] = Math.max(state.bounds[3], stroke.ay + margin, stroke.by + margin);
      }
    }

    function publishTip() {
      state.tipStart.fill(0);
      state.tipEnd.fill(0);
      if (!hover || elapsed - lastStampTime >= 0.65) return;
      var tipRadius = radius() * radiusFactor;
      var dx = pointerX - lastX;
      var dy = pointerY - lastY;
      var scale = Math.min(1, (0.65 * tipRadius) / Math.max(Math.hypot(dx, dy), 0.001));
      var x = pointerX - dx * scale;
      var y = pointerY - dy * scale;
      state.tipStart.set([x, y, tipRadius, 0.98]);
      state.tipEnd.set([pointerX, pointerY, 0.55 * tipRadius, elapsed - lastStampTime]);
      var margin = 2.4 * tipRadius;
      state.bounds[0] = Math.min(state.bounds[0], x - margin, pointerX - margin);
      state.bounds[1] = Math.min(state.bounds[1], y - margin, pointerY - margin);
      state.bounds[2] = Math.max(state.bounds[2], x + margin, pointerX + margin);
      state.bounds[3] = Math.max(state.bounds[3], y + margin, pointerY + margin);
    }

    function release() {
      hover = false;
      moved = false;
      lastStroke = null;
      state.tipStart.fill(0);
      state.tipEnd.fill(0);
    }

    function reset() {
      release();
      strokes = [];
      elapsed = 0;
      accum = 0;
      state.count = 0;
      state.starts.fill(0);
      state.ends.fill(0);
      state.bounds.fill(0);
    }

    function step() {
      elapsed += dt;
      while (strokes.length && elapsed - strokes[0].born >= 0.65) strokes.shift();
      if (!hover) return;
      if (moved) {
        addStroke(lastX, lastY, 0.72 * radius(), 0.85);
        lastStampX = lastX;
        lastStampY = lastY;
        lastStampTime = elapsed;
        moved = false;
      }
      var fromX = lastX;
      var fromY = lastY;
      var damping = state.dampingMs > 0
        ? 1 - Math.exp(-(1000 * dt) / state.dampingMs)
        : 1;
      lastX += (pointerX - lastX) * damping;
      lastY += (pointerY - lastY) * damping;
      var dx = pointerX - lastX;
      var dy = pointerY - lastY;
      var distance = Math.hypot(dx, dy);
      var maxOffset = 0.48 * radius() * 0.65;
      if (distance > maxOffset) {
        lastX = pointerX - (dx / distance) * maxOffset;
        lastY = pointerY - (dy / distance) * maxOffset;
      }
      var speed = Math.hypot(lastX - fromX, lastY - fromY) / dt;
      if (elapsed - lastStampTime >= 0.65 + dt ||
          Math.hypot(lastX - lastStampX, lastY - lastStampY) < 1.5) return;
      var intensity = Math.min(1, speed / 1400);
      radiusFactor = 1 - 0.52 * intensity;
      var r = radius() * radiusFactor;
      var density = 0.98 - 0.36 * intensity;
      var aged = elapsed - lastStampTime > 0.18;
      var strokeAge = lastStroke ? elapsed - lastStroke.born : 0.65;
      var changedDirection = false;
      if (lastStroke) {
        var ex = lastStroke.bx - lastStroke.ax;
        var ey = lastStroke.by - lastStroke.ay;
        var rx = lastX - lastStampX;
        var ry = lastY - lastStampY;
        var dot = Math.hypot(ex, ey) * Math.hypot(rx, ry);
        changedDirection = dot > 10 && (ex * rx + ey * ry) / dot < 0.55;
      }
      if (!lastStroke || strokeAge >= 0.1 || aged || changedDirection) {
        addStroke(lastStampX, lastStampY, lastStroke ? lastStroke.br : r, density);
      }
      lastStroke.bx = lastX;
      lastStroke.by = lastY;
      lastStroke.br = r;
      lastStroke.density = density;
      lastStampX = lastX;
      lastStampY = lastY;
      lastStampTime = elapsed;
    }

    return {
      state: state,
      resize: function (w, h) {
        width = Math.max(1, w);
        height = Math.max(1, h);
        reset();
      },
      move: function (x, y) {
        pointerX = clamp(x, 0, width);
        pointerY = clamp(y, 0, height);
        if (!hover || Math.hypot(pointerX - prevX, pointerY - prevY) >= 1.5) {
          lastStampTime = elapsed;
          prevX = pointerX;
          prevY = pointerY;
        }
        if (!hover) {
          radiusFactor = 0.72;
          lastX = pointerX;
          lastY = pointerY;
          moved = true;
          lastStroke = null;
        }
        hover = true;
      },
      release: release,
      reset: reset,
      advance: function (delta) {
        accum += Math.max(0, Math.min(delta, 0.1));
        while (accum >= dt - 1e-8) {
          step();
          accum -= dt;
        }
        publish();
        publishTip();
      },
      setRadiusScale: function (value) {
        if (!isFinite(value)) return;
        var next = Math.max(0.5, Math.min(3, value));
        if (next === state.radiusScale) return;
        var ratio = next / state.radiusScale;
        state.radiusScale = next;
        for (var i = 0; i < strokes.length; i++) {
          strokes[i].ar *= ratio;
          strokes[i].br *= ratio;
        }
        publish();
        publishTip();
      },
      setDamping: function (value) {
        if (isFinite(value)) state.dampingMs = Math.max(0, Math.min(1000, value));
      }
    };
  }

  /* ---------- 32x32 displacement surface (ported from the K3.1 hero) ---------- */

  function createSurfaceState() {
    var displacement = new Float32Array(2048);
    var velocity = new Float32Array(2048);
    var pixels = new Uint8Array(4096);
    var pointer = null;
    var active = false;
    var revision = 0;
    var encodedRevision = -1;

    function clampCell(index) {
      var length = Math.hypot(displacement[index], displacement[index + 1]);
      if (length > 0.12) {
        displacement[index] *= 0.12 / length;
        displacement[index + 1] *= 0.12 / length;
        velocity[index] *= 0.5;
        velocity[index + 1] *= 0.5;
      }
    }

    return {
      move: function (x, y) {
        var previous = pointer;
        pointer = [x, y];
        if (!previous) return;
        var dx = x - previous[0];
        var dy = y - previous[1];
        var distance = Math.hypot(dx, dy);
        if (distance < 1e-4) return;
        var scale = Math.min(1, 0.065 / distance);
        var vx = dx * scale;
        var vy = dy * scale;
        var cx = (x + previous[0]) / 2;
        var cy = (y + previous[1]) / 2;
        if (cx < -0.2 || cx > 1.2 || cy < -0.2 || cy > 1.2) return;
        for (var row = 1; row < 31; row++) {
          for (var col = 1; col < 31; col++) {
            var ox = (col + 0.5) / 32 - cx;
            var oy = (row + 0.5) / 32 - cy;
            var weight = Math.exp((-(ox * ox + oy * oy) / 0.0484) * 2);
            if (weight < 0.001) continue;
            var index = (32 * row + col) * 2;
            displacement[index] += vx * weight * 0.8;
            displacement[index + 1] += vy * weight * 0.8;
            velocity[index] += vx * weight * 4;
            velocity[index + 1] += vy * weight * 4;
            clampCell(index);
          }
        }
        active = true;
        revision++;
      },
      advance: function (delta) {
        if (!active || delta <= 0) return;
        var span = Math.min(delta, 0.1);
        var steps = Math.ceil(120 * span);
        var step = span / steps;
        var peak = 0;
        for (var s = 0; s < steps; s++) {
          for (var row = 1; row < 31; row++) {
            for (var col = 1; col < 31; col++) {
              var index = (32 * row + col) * 2;
              for (var axis = 0; axis < 2; axis++) {
                var i = index + axis;
                var laplace = displacement[i - 2] + displacement[i + 2] +
                  displacement[i - 64] + displacement[i + 64];
                velocity[i] += ((laplace - 4 * displacement[i]) * 95 -
                  18 * displacement[i] - 5.5 * velocity[i]) * step;
              }
            }
          }
          peak = 0;
          for (var j = 0; j < displacement.length; j += 2) {
            displacement[j] += velocity[j] * step;
            displacement[j + 1] += velocity[j + 1] * step;
            clampCell(j);
            peak = Math.max(peak, Math.abs(displacement[j]), Math.abs(displacement[j + 1]),
              0.1 * Math.abs(velocity[j]), 0.1 * Math.abs(velocity[j + 1]));
          }
        }
        if (peak < 2e-5) {
          displacement.fill(0);
          velocity.fill(0);
          active = false;
        }
        revision++;
      },
      pixels: function () {
        if (encodedRevision === revision) return pixels;
        for (var cell = 0; cell < 1024; cell++) {
          var source = cell * 2;
          pixels[cell * 4] = Math.round((displacement[source] / 0.32 + 0.5) * 255);
          pixels[cell * 4 + 1] = Math.round((displacement[source + 1] / 0.32 + 0.5) * 255);
          pixels[cell * 4 + 2] = 0;
          pixels[cell * 4 + 3] = 255;
        }
        encodedRevision = revision;
        return pixels;
      },
      get revision() { return revision; },
      release: function () { pointer = null; },
      reset: function () {
        displacement.fill(0);
        velocity.fill(0);
        pointer = null;
        active = false;
        revision++;
      }
    };
  }

  /* ---------- texture helpers ---------- */

  function createCodeAtlas(gl) {
    var canvas = document.createElement('canvas');
    canvas.width = 1152;
    canvas.height = 432;
    var ctx = canvas.getContext('2d');
    if (!ctx) return null;
    ctx.font = '600 48px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#fff';
    for (var code = 0; code < 95; code++) {
      ctx.fillText(
        String.fromCharCode(code + 32),
        ((code % 16) + 0.5) * 72,
        (Math.floor(code / 16) + 0.5) * 72
      );
    }
    var image = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    var alpha = new Uint8Array(canvas.width * canvas.height);
    for (var i = 0; i < alpha.length; i++) alpha[i] = image[i * 4 + 3];
    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.R8, canvas.width, canvas.height, 0,
      gl.RED, gl.UNSIGNED_BYTE, alpha);
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 4);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    return texture;
  }

  function createTitleTexture(gl) {
    var canvas = document.createElement('canvas');
    canvas.width = canvas.height = 1024;
    var ctx = canvas.getContext('2d');
    if (!ctx) return null;
    ctx.clearRect(0, 0, 1024, 1024);
    ctx.fillStyle = '#fff';
    ctx.font = '400 1024px "Ma Shan Zheng", "Noto Serif SC", serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText('读', 512, 900);
    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    return texture;
  }

  function createNoiseTexture(gl) {
    var data = new Uint8Array(64 * 64 * 4);
    var seed = 9137;
    for (var i = 0; i < data.length; i += 4) {
      for (var channel = 0; channel < 3; channel++) {
        seed ^= seed << 13;
        seed ^= seed >>> 17;
        seed ^= seed << 5;
        data[i + channel] = seed & 255;
      }
      data[i + 3] = 255;
    }
    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 64, 64, 0, gl.RGBA, gl.UNSIGNED_BYTE, data);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    return texture;
  }

  /* ---------- renderer ---------- */

  var state = null;
  var canvas = null;
  var raf = 0;
  var pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  var heroBox = { left: 0, top: 0, width: 1, height: 1 };
  var last = 0;
  var time = 30;
  var inView = true;
  var running = false;
  var bootPending = false;
  var bootScheduled = false;
  var cloudRetried = false;
  var fallbackBound = false;
  var fallbackTimer = 0;
  var photoFallbackTimer = 0;

  function isKimi() {
    return document.documentElement.dataset.skin === 'kimi';
  }

  function introDone() {
    return document.documentElement.classList.contains('kimi-intro-done');
  }

  function photoReady() {
    return !!photo.complete && photo.naturalWidth > 0 &&
      !!photo.currentSrc && photo.currentSrc.indexOf('data:image') !== 0;
  }

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

  function resetMark() {
    if (state) state.reset();
    if (mark) mark.classList.remove('is-webgl-title', 'is-mask-erase');
    if (mark) {
      mark.style.webkitMaskImage = '';
      mark.style.maskImage = '';
    }
  }

  function releaseMark() {
    if (state) state.release();
  }

  function enableMaskFallback() {
    if (fallbackBound || !isKimi() || !mark || !markSvg || reduce.matches) return;
    fallbackBound = true;
    mark.classList.remove('is-webgl-title');
    function applyMask(event) {
      if (!introDone() || settings.ink <= 0 || reduce.matches) return;
      var rect = mark.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right ||
          event.clientY < rect.top || event.clientY > rect.bottom) return;
      var x = event.clientX - rect.left;
      var y = event.clientY - rect.top;
      var radius = Math.max(40, rect.width * 0.17);
      var mask = 'radial-gradient(circle at ' + x.toFixed(1) + 'px ' + y.toFixed(1) + 'px,' +
        ' transparent 0 ' + (radius * 0.45).toFixed(1) + 'px,' +
        ' rgba(0,0,0,.92) ' + radius.toFixed(1) + 'px,' +
        ' #000 ' + (radius * 1.7).toFixed(1) + 'px)';
      mark.style.webkitMaskImage = mask;
      mark.style.maskImage = mask;
      mark.classList.add('is-mask-erase');
      if (fallbackTimer) window.clearTimeout(fallbackTimer);
      fallbackTimer = window.setTimeout(function () {
        fallbackTimer = 0;
        mark.style.webkitMaskImage = '';
        mark.style.maskImage = '';
        mark.classList.remove('is-mask-erase');
      }, 420);
    }
    hero.addEventListener('pointermove', applyMask, { passive: true });
    hero.addEventListener('pointerdown', applyMask, { passive: true });
    hero.addEventListener('pointermove', function (event) {
      var rect = hero.getBoundingClientRect();
      hero.style.setProperty('--hero-pan-x', ((event.clientX - rect.left) / Math.max(1, rect.width) - 0.5).toFixed(3));
      hero.style.setProperty('--hero-pan-y', ((event.clientY - rect.top) / Math.max(1, rect.height) - 0.5).toFixed(3));
    }, { passive: true });
    hero.addEventListener('pointerleave', function () {
      hero.style.setProperty('--hero-pan-x', '0');
      hero.style.setProperty('--hero-pan-y', '0');
    }, { passive: true });
    hero.addEventListener('pointerleave', function () {
      if (fallbackTimer) window.clearTimeout(fallbackTimer);
      fallbackTimer = 0;
      mark.style.webkitMaskImage = '';
      mark.style.maskImage = '';
      mark.classList.remove('is-mask-erase');
    }, { passive: true });
  }

  function init() {
    if (reduce.matches || !isKimi()) return;
    if (canvas && state) {
      state.resizeDirty = true;
      start();
      return;
    }
    if (bootPending) return;
    if (!photoReady()) {
      bootPending = true;
      var onLoad = function () {
        photo.removeEventListener('load', onLoad);
        bootPending = false;
        if (photoFallbackTimer) {
          window.clearTimeout(photoFallbackTimer);
          photoFallbackTimer = 0;
        }
        init();
      };
      photo.addEventListener('load', onLoad);
      if (!photoFallbackTimer) {
        photoFallbackTimer = window.setTimeout(function () {
          photoFallbackTimer = 0;
          bootPending = false;
          if (!api.ready) enableMaskFallback();
        }, 5000);
      }
      if (photoReady()) onLoad();
      return;
    }
    if (!bootScheduled) {
      bootScheduled = true;
      var boot = function () {
        bootScheduled = false;
        if (reduce.matches || !isKimi()) return;
        if (!photoReady()) {
          init();
          return;
        }
        bootRenderer(photo);
      };
      if (window.requestIdleCallback) window.requestIdleCallback(boot, { timeout: 900 });
      else window.setTimeout(boot, 120);
    }
  }

  var listenersBound = false;

  function bindHeroListeners() {
    if (listenersBound) return;
    listenersBound = true;
    var renderNow = function () {
      if (!state || !isKimi() || reduce.matches) return;
      state.resizeDirty = true;
      try { state.draw(0); markCloudReady(); } catch (error) {
        failRenderer();
      }
    };
    if ('ResizeObserver' in window) {
      var resizeObserver = new ResizeObserver(renderNow);
      resizeObserver.observe(hero);
    }
    window.addEventListener('resize', renderNow, { passive: true });
    if ('IntersectionObserver' in window) {
      var intersection = new IntersectionObserver(function (entries) {
        inView = entries[0].isIntersecting;
        if (inView) start(); else stop();
      }, { threshold: 0 });
      intersection.observe(hero);
    }
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stop(); else if (inView) start();
    });
    hero.addEventListener('pointermove', function (event) {
      if (state && state.rectDirty) state.refreshRect();
      var x = event.clientX - heroBox.left;
      var y = event.clientY - heroBox.top;
      pointer.tx = (x / Math.max(1, heroBox.width) - 0.5) * 2;
      pointer.ty = (y / Math.max(1, heroBox.height) - 0.5) * 2;
      hero.style.setProperty('--hero-pan-x', (pointer.tx / 2).toFixed(3));
      hero.style.setProperty('--hero-pan-y', (pointer.ty / 2).toFixed(3));
      if (event.target instanceof Element && event.target.closest('[data-kimi-controls]')) {
        releaseMark();
        return;
      }
      if (state) state.move(x, y);
      start();
    }, { passive: true });
    hero.addEventListener('pointerleave', function () {
      pointer.tx = 0;
      pointer.ty = 0;
      hero.style.setProperty('--hero-pan-x', '0');
      hero.style.setProperty('--hero-pan-y', '0');
      releaseMark();
    }, { passive: true });
    hero.addEventListener('pointerdown', function (event) {
      if (event.target instanceof Element && event.target.closest('[data-kimi-controls]')) return;
      if (state) state.move(event.clientX - heroBox.left, event.clientY - heroBox.top);
    }, { passive: true });
    hero.addEventListener('pointerup', function (event) {
      if (event.pointerType !== 'mouse') releaseMark();
    }, { passive: true });
    hero.addEventListener('pointercancel', releaseMark, { passive: true });
    window.addEventListener('scroll', function () {
      if (!state || !isKimi() || reduce.matches) return;
      state.rectDirty = true;
      if (window.scrollY > 8) state.reset();
    }, { passive: true });
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
      enableMaskFallback();
      return;
    }
    try {
      state = createRenderer(gl, sourceImage);
    } catch (error) {
      console.warn('Hero renderer unavailable:', error);
      canvas.remove();
      canvas = null;
      enableMaskFallback();
      return;
    }

    api.ready = true;
    if (mark) {
      mark.style.webkitMaskImage = '';
      mark.style.maskImage = '';
      mark.classList.remove('is-mask-erase');
    }
    bindHeroListeners();
    canvas.addEventListener('webglcontextlost', function (event) {
      event.preventDefault();
      if (mark) mark.classList.remove('is-webgl-title');
      stop();
      api.ready = false;
      hero.classList.remove('hero-cloud-ready');
      state = null;
      if (canvas) {
        canvas.remove();
        canvas = null;
      }
      if (!cloudRetried) {
        cloudRetried = true;
        window.setTimeout(function () {
          if (isKimi() && !reduce.matches) init();
        }, 300);
      } else {
        enableMaskFallback();
      }
    });
    start();
  }

  function createRenderer(gl, sourceImage) {
    var alive = true;
    var cloudProgram = program(gl, vertex, cloudFragment);
    var compositeProgram = program(gl, vertex, compositeFragment);
    var codeAtlas = createCodeAtlas(gl);
    var noiseTexture = createNoiseTexture(gl);
    var titleTexture = createTitleTexture(gl);
    if (document.fonts && document.fonts.load) {
      document.fonts.load('400 1024px "Ma Shan Zheng"').then(function () {
        if (!alive) return;
        var next = createTitleTexture(gl);
        if (!next) return;
        if (titleTexture) gl.deleteTexture(titleTexture);
        titleTexture = next;
      }).catch(function () { /* keep the initial texture */ });
    }

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

    var frontTexture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_2D, frontTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    var codeGrid = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, codeGrid);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    var titleSurface = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, titleSurface);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, 32, 32, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    gl.bindTexture(gl.TEXTURE_2D, cloudTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.bindTexture(gl.TEXTURE_2D, frontTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

    var framebuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, cloudTexture, 0);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT1, gl.TEXTURE_2D, frontTexture, 0);
    gl.drawBuffers([gl.COLOR_ATTACHMENT0, gl.COLOR_ATTACHMENT1]);
    if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) {
      throw new Error('cloud framebuffer incomplete');
    }
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    var snippets = [
      'import parallel_state',
      'def initialize_model_parallel(',
      'tensor_model_parallel_size=1,',
      'pipeline_model_parallel_size=1,',
      'return _TENSOR_MODEL_PARALLEL_GROUP',
      'class ColumnParallelLinear(',
      'class RowParallelLinear(',
      'output_parallel = self._forward_impl(',
      'loss = torch.sum(losses * mask)',
      'averaged_loss = average_losses(',
      'torch.distributed.all_reduce(',
      'handle = all_reduce(..., async_op=True)',
      'self.force_all_reduce = False',
      'def finish_grad_sync(self):',
      'forward_backward_func = f',
      'output_tensor, loss_func = step(',
      'input_parallel = scatter_to_tp(input_)'
    ];
    var code = createCodeState(snippets);
    var wash = createWashState();
    var surface = createSurfaceState();
    wash.setRadiusScale(0.8);
    wash.setDamping(1000);

    var output = {
      width: 0,
      height: 0,
      cloudWidth: 0,
      cloudHeight: 0
    };
    var renderer = {
      resizeDirty: true,
      rectDirty: false,
      halted: false
    };
    var titleRect = [0, 0, 1, 1];
    var sceneSize = [1, 1];
    var lastDpr = 0;
    var markBox = { left: 0, top: 0, width: 1, height: 1 };
    var titleActive = 0;
    var titleTarget = 0;
    var titleHoldUntil = 0;
    var overMark = false;
    var svgHidden = false;
    var lastCodeRevision = -1;
    var lastSurfaceRevision = -1;
    var codeGridSize = [0, 0];

    function syncMarkRect() {
      if (!mark || !isKimi()) return;
      var heroRect = hero.getBoundingClientRect();
      var rect = mark.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      heroBox = {
        left: heroRect.left,
        top: heroRect.top,
        width: heroRect.width,
        height: heroRect.height
      };
      markBox = {
        left: rect.left - heroRect.left,
        top: rect.top - heroRect.top,
        width: rect.width,
        height: rect.height
      };
      titleRect = [
        markBox.left,
        heroRect.height - markBox.top - markBox.height,
        markBox.width,
        markBox.height
      ];
      sceneSize = [Math.max(1, heroRect.width), Math.max(1, heroRect.height)];
    }

    function resize() {
      var rect = hero.getBoundingClientRect();
      var dpr = window.devicePixelRatio || 1;
      lastDpr = dpr;
      var composite = fitSize(
        Math.max(1, rect.width),
        Math.max(1, rect.height),
        8000000,
        Math.min(2, Math.max(1, dpr)),
        maxTexture
      );
      var compact = window.matchMedia('(max-width: 760px)').matches;
      var cloud = fitSize(
        composite[0],
        composite[1],
        compact ? 240000 : 450000,
        compact ? 0.4 : 0.5,
        maxTexture
      );
      canvas.width = composite[0];
      canvas.height = composite[1];
      if (output.cloudWidth !== cloud[0] || output.cloudHeight !== cloud[1]) {
        gl.bindTexture(gl.TEXTURE_2D, cloudTexture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, cloud[0], cloud[1], 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        gl.bindTexture(gl.TEXTURE_2D, frontTexture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, cloud[0], cloud[1], 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
      }
      output.width = composite[0];
      output.height = composite[1];
      output.cloudWidth = cloud[0];
      output.cloudHeight = cloud[1];
      syncMarkRect();
      code.resize(rect.width, rect.height);
      wash.resize(rect.width, rect.height);
      surface.reset();
      renderer.resizeDirty = false;
      renderer.rectDirty = false;
    }

    function washTouchesTitle() {
      var inkState = wash.state;
      if (inkState.count === 0 && inkState.tipStart[3] <= 0) return false;
      var x1 = titleRect[0];
      var y1 = titleRect[1];
      var x2 = x1 + titleRect[2];
      var y2 = y1 + titleRect[3];

      function reach(ax, ay, ar, bx, by, br) {
        var radius = Math.max(ar, br) + 2;
        for (var step = 0; step <= 8; step++) {
          var t = step / 8;
          var x = ax + (bx - ax) * t;
          var y = ay + (by - ay) * t;
          var dx = Math.max(x1 - x, 0, x - x2);
          var dy = Math.max(y1 - y, 0, y - y2);
          if (Math.hypot(dx, dy) <= radius) return true;
        }
        return false;
      }

      for (var i = 0; i < inkState.count; i++) {
        var offset = 4 * i;
        if (reach(
          inkState.starts[offset], inkState.starts[offset + 1], inkState.starts[offset + 2],
          inkState.ends[offset], inkState.ends[offset + 1], inkState.ends[offset + 2]
        )) return true;
      }
      return inkState.tipStart[3] > 0 && reach(
        inkState.tipStart[0], inkState.tipStart[1], inkState.tipStart[2],
        inkState.tipEnd[0], inkState.tipEnd[1], inkState.tipEnd[2]
      );
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

    function uploadCodeGrid() {
      var grid = code.state;
      if (grid.revision === lastCodeRevision) return;
      gl.bindTexture(gl.TEXTURE_2D, codeGrid);
      gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
      if (codeGridSize[0] !== grid.cols || codeGridSize[1] !== grid.rows) {
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RG8, grid.cols, grid.rows, 0,
          gl.RG, gl.UNSIGNED_BYTE, grid.data);
        codeGridSize = [grid.cols, grid.rows];
      } else {
        gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, grid.cols, grid.rows,
          gl.RG, gl.UNSIGNED_BYTE, grid.data);
      }
      gl.pixelStorei(gl.UNPACK_ALIGNMENT, 4);
      lastCodeRevision = grid.revision;
    }

    function uploadSurface() {
      if (surface.revision === lastSurfaceRevision) return;
      gl.bindTexture(gl.TEXTURE_2D, titleSurface);
      gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, 32, 32, gl.RGBA, gl.UNSIGNED_BYTE, surface.pixels());
      lastSurfaceRevision = surface.revision;
    }

    renderer.move = function (x, y) {
      if (!introDone() || settings.ink <= 0 || reduce.matches) return;
      if (renderer.rectDirty) renderer.refreshRect();
      overMark = x >= markBox.left && x <= markBox.left + markBox.width &&
        y >= markBox.top && y <= markBox.top + markBox.height;
      var now = performance.now();
      if (overMark) titleHoldUntil = now + 700;
      code.move(x, y);
      // The wash shader works in the same bottom-up scene space as WebGL.
      wash.move(x, sceneSize[1] - y);
      if (markBox.width > 0) {
        var tx = (x - markBox.left) / markBox.width;
        var ty = 1 - (y - markBox.top) / markBox.height;
        if (tx > -0.2 && tx < 1.2 && ty > -0.2 && ty < 1.2) surface.move(tx, ty);
      }
    };

    renderer.release = function () {
      var hold = overMark;
      overMark = false;
      if (hold) titleHoldUntil = performance.now() + 700;
      code.release();
      wash.release();
      surface.release();
    };

    renderer.reset = function () {
      titleActive = 0;
      titleTarget = 0;
      titleHoldUntil = 0;
      overMark = false;
      svgHidden = false;
      code.reset();
      wash.reset();
      surface.reset();
      if (mark) mark.classList.remove('is-webgl-title');
    };

    renderer.draw = function (dt) {
      if ((window.devicePixelRatio || 1) !== lastDpr) renderer.resizeDirty = true;
      if (renderer.resizeDirty) resize();
      if (renderer.rectDirty) renderer.refreshRect();
      if (!output.width) return;
      if (reduce.matches || settings.ink <= 0) {
        if (!renderer.halted) {
          renderer.halted = true;
          renderer.reset();
        }
        titleTarget = 0;
      } else {
        renderer.halted = false;
        code.advance(dt);
        wash.advance(dt);
        surface.advance(dt);
        // Keep the SVG wordmark as the only visible title. The WebGL title
        // is a separate canvas rasterisation; crossfading to it made the
        // glyph jump/flicker and look different from the DOM wordmark.
        titleTarget = 0;
      }
      titleActive += (titleTarget - titleActive) * Math.min(1, dt * 14);
      if (titleActive < 0.01) titleActive = 0;
      if (mark && mark.classList.contains('is-webgl-title')) {
        mark.classList.remove('is-webgl-title');
      }

      uploadCodeGrid();
      uploadSurface();

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
      gl.activeTexture(gl.TEXTURE2);
      gl.bindTexture(gl.TEXTURE_2D, frontTexture);
      gl.activeTexture(gl.TEXTURE3);
      gl.bindTexture(gl.TEXTURE_2D, codeGrid);
      gl.activeTexture(gl.TEXTURE4);
      gl.bindTexture(gl.TEXTURE_2D, codeAtlas);
      gl.activeTexture(gl.TEXTURE5);
      gl.bindTexture(gl.TEXTURE_2D, titleTexture);
      gl.activeTexture(gl.TEXTURE6);
      gl.bindTexture(gl.TEXTURE_2D, titleSurface);
      gl.activeTexture(gl.TEXTURE7);
      gl.bindTexture(gl.TEXTURE_2D, noiseTexture);
      var uniforms = compositeProgram.uniforms;
      gl.uniform1i(uniforms.img, 0);
      gl.uniform1i(uniforms.clouds, 1);
      gl.uniform1i(uniforms.frontClouds, 2);
      gl.uniform1i(uniforms.codeGrid, 3);
      gl.uniform1i(uniforms.codeAtlas, 4);
      gl.uniform1i(uniforms.titleGlyph, 5);
      gl.uniform1i(uniforms.titleSurface, 6);
      gl.uniform1i(uniforms.inkNoise, 7);
      gl.uniform2f(uniforms.res, output.width, output.height);
      gl.uniform2f(uniforms.imgSize, srcW, srcH);
      gl.uniform2f(uniforms.mouse, pointer.x, pointer.y);
      gl.uniform2f(uniforms.sceneSize, sceneSize[0], sceneSize[1]);
      gl.uniform1f(uniforms.coverage, settings.coverage);
      gl.uniform2fv(uniforms.codeStep, code.state.step);
      gl.uniform1f(uniforms.codeSize, code.state.size);
      gl.uniform1f(uniforms.T, time);
      gl.uniform4fv(uniforms.titleRect, titleRect);
      gl.uniform1f(uniforms.titleOpacity, 0.9 * settings.ink);
      gl.uniform1f(uniforms.titleStrength, 0.22);
      gl.uniform1f(uniforms.writingProgress, introDone() ? 1 : 0);
      gl.uniform1f(uniforms.ink, settings.ink);
      gl.uniform1f(uniforms.particles, 1);
      gl.uniform1f(uniforms.titleActive, titleActive);
      gl.uniform1f(uniforms.washSolidity, 1);
      // Our foreground-cloud layer is denser than the reference's; scale it
      // with Coverage so the wordmark keeps a crisp core at the default.
      gl.uniform1f(uniforms.titleCloudPresence, 0.3 * settings.coverage);
      gl.uniform4fv(uniforms.inkBounds, wash.state.bounds);
      gl.uniform4fv(uniforms.inkTipStart, wash.state.tipStart);
      gl.uniform4fv(uniforms.inkTipEnd, wash.state.tipEnd);
      gl.uniform1i(uniforms.inkCount, wash.state.count);
      if (wash.state.count > 0) {
        gl.uniform4fv(uniforms['inkStarts[0]'], wash.state.starts);
        gl.uniform4fv(uniforms['inkEnds[0]'], wash.state.ends);
      }
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    renderer.refreshRect = function () {
      syncMarkRect();
      renderer.rectDirty = false;
    };
    syncMarkRect();
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () {
        syncMarkRect();
      }).catch(function () { /* ignore */ });
    }

    renderer.destroy = function () {
      alive = false;
      gl.deleteFramebuffer(framebuffer);
      gl.deleteTexture(cloudTexture);
      gl.deleteTexture(frontTexture);
      gl.deleteTexture(photoTexture);
      gl.deleteTexture(codeGrid);
      gl.deleteTexture(codeAtlas);
      gl.deleteTexture(titleTexture);
      gl.deleteTexture(titleSurface);
      gl.deleteTexture(noiseTexture);
      gl.deleteBuffer(buffer);
      gl.deleteVertexArray(vao);
      gl.deleteProgram(cloudProgram.program);
      gl.deleteProgram(compositeProgram.program);
    };
    return renderer;
  }

  function failRenderer() {
    stop();
    api.ready = false;
    hero.classList.remove('hero-cloud-ready');
    if (mark) {
      mark.classList.remove('is-webgl-title');
      mark.style.webkitMaskImage = '';
      mark.style.maskImage = '';
    }
    if (state && state.destroy) {
      try { state.destroy(); } catch (error) { /* context may already be gone */ }
    }
    state = null;
    if (canvas) {
      canvas.remove();
      canvas = null;
    }
    enableMaskFallback();
  }

  function markCloudReady() {
    if (hero.classList.contains('hero-cloud-ready')) return;
    hero.classList.add('hero-cloud-ready');
    syncMarkAfterBoot();
  }

  function syncMarkAfterBoot() {
    if (state && state.resizeDirty) return;
    if (mark) mark.classList.remove('is-webgl-title');
  }

  function frame(now) {
    raf = 0;
    if (!state || reduce.matches || !isKimi()) return;
    var dt = last ? Math.min(0.1, (now - last) / 1000) : 0.033;
    last = now;
    var ease = 1 - Math.pow(0.94, 60 * dt);
    pointer.x += (pointer.tx - pointer.x) * ease;
    pointer.y += (pointer.ty - pointer.y) * ease;
    time += dt * Math.max(0.2, Math.min(15, settings.speed));
    try {
      state.draw(dt);
      markCloudReady();
    } catch (error) {
      console.warn('Hero draw failed:', error);
      failRenderer();
      return;
    }
    if (running) raf = window.requestAnimationFrame(frame);
  }

  function start() {
    if (!canvas || !state || reduce.matches) return;
    if (!isKimi()) return;
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
      resetMark();
      hero.classList.remove('hero-cloud-ready');
    } else {
      init();
    }
  });

  if ('MutationObserver' in window) {
    new MutationObserver(function () {
      if (isKimi()) {
        init();
        if (canvas && state) start();
      } else {
        stop();
        resetMark();
        hero.classList.remove('hero-cloud-ready');
      }
    }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-skin'] });
  }

  init();
})();
