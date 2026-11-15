/*
 * Section clouds for the Kimi-style reader.
 *
 * Port of the Kimi blog "BlogV2Motion" cloud effect: every `h2` in the
 * article owns one raymarched cloud. When the heading centre reaches 90% of
 * the viewport the cloud drifts in from the left or right over 0.8s, holds
 * while the heading crosses the 65% line, then drifts out over 2.4s after the
 * reader scrolls another 4% of the viewport.
 *
 * The renderer is the reference WebGL2 fBm cloud shader (48 raymarch steps,
 * half-resolution canvas capped at 448px wide, 24fps, low-power context).
 * Clouds live behind the text in a full-bleed layer and never take pointer
 * events. WebGL2 failure, lost contexts and `prefers-reduced-motion` fall
 * back to no cloud, exactly like the reference.
 */
(function () {
  'use strict';

  var CLASS = {
    clouds: 'kimi-clouds',
    track: 'kimi-cloud-track',
    cloud: 'kimi-cloud',
    visible: 'is-visible'
  };

  var vertexShader = [
    '#version 300 es',
    'layout(location=0) in vec2 p;',
    'out vec2 uv;',
    'void main(){ uv=p*.5+.5; gl_Position=vec4(p,0.,1.); }'
  ].join('\n');

  var fragmentShader = [
    '#version 300 es',
    'precision highp float;',
    'in vec2 uv;',
    'out vec4 color;',
    'uniform float time, seed;',
    'uniform bool darkMode;',
    '',
    'float hash(vec3 p){ p=fract(p*.3183099+.1); p*=17.; return fract(p.x*p.y*p.z*(p.x+p.y+p.z)); }',
    'float noise(vec3 x){',
    '  vec3 i=floor(x), f=fract(x); f=f*f*(3.-2.*f);',
    '  return mix(mix(mix(hash(i),hash(i+vec3(1,0,0)),f.x),',
    '                 mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),',
    '             mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),',
    '                 mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z);',
    '}',
    'float fbm(vec3 p,int oct){',
    '  float s=0., a=.5, n=0.;',
    '  for(int i=0;i<5;i++){',
    '    if(i>=oct) break;',
    '    s+=a*noise(p); n+=a;',
    '    p=p*2.03+vec3(1.7,9.2,3.1); a*=.5;',
    '  }',
    '  return s/n;',
    '}',
    'float merge(float a,float b){',
    '  float h=max(.32-abs(a-b),0.)/.32;',
    '  return min(a,b)-h*h*.08;',
    '}',
    'float density(vec3 p,int oct){',
    '  vec3 q=p+vec3(.34,0.,.14)*time+vec3(seed,seed*.37,-seed*.23);',
    '  q+=.22*sin(q.zxy*1.12+time*vec3(.12,.16,.10));',
    '  vec3 shape=p+.12*sin(q.zxy*1.6);',
    '  float edge=length((shape-vec3(-1.15,-.17,.12))/vec3(1.25,.55,.68));',
    '  edge=merge(edge,length((shape-vec3(-.25,.13,0.))/vec3(1.15,.79,.86)));',
    '  edge=merge(edge,length((shape-vec3(.95,-.08,-.1))/vec3(1.3,.59,.71)));',
    '  float envelope=1.-smoothstep(.65,1.2,edge);',
    '  if(envelope<=0.) return 0.;',
    '  float f=fbm(q*vec3(1.3,1.65,1.3),oct);',
    '  return clamp(2.05*f-.52-.46*edge,0.,1.)*envelope;',
    '}',
    'void main(){',
    '  vec2 xy=(uv-.5)*vec2(6.,2.8);',
    '  const vec3 SUN=normalize(vec3(-.5,.42,-.75));',
    '  const float stepSize=2.5/48.;',
    '  float z=-1.25+hash(vec3(gl_FragCoord.xy,seed))*stepSize;',
    '  vec4 sum=vec4(0.);',
    '  for(int i=0;i<48;i++){',
    '    vec3 p=vec3(xy,z);',
    '    float den=density(p,4);',
    '    if(den>.002){',
    '      vec3 col=vec3(1.);',
    '      if(darkMode){',
    '        float dif=clamp((den-density(p+.3*SUN,3))/.35,0.,1.);',
    '        float light=exp(-density(p+.55*SUN,3)*1.6);',
    '        vec3 lin=vec3(.60,.66,.74)+vec3(.48,.44,.38)*dif;',
    '        col=mix(vec3(.965,.97,.975),vec3(.37,.44,.53),den)*lin;',
    '        col*=.8+.2*light;',
    '      }',
    '      float a=1.-exp(-den*stepSize*3.8);',
    '      sum+=vec4(col*a,a)*(1.-sum.a);',
    '      if(sum.a>.98) break;',
    '    }',
    '    z+=stepSize;',
    '  }',
    '  color=sum;',
    '}'
  ].join('\n');

  var instance = null;

  function setVars(node, vars) {
    Object.keys(vars).forEach(function (key) {
      node.style.setProperty(key, vars[key]);
    });
  }

  function createRenderer(canvas, seed) {
    var gl = canvas.getContext('webgl2', {
      alpha: true,
      premultipliedAlpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: 'low-power'
    });
    if (!gl) throw new Error('WebGL 2 is unavailable');

    var cleanup = [];
    function dispose() {
      while (cleanup.length) cleanup.pop()();
    }

    function shader(type, source) {
      var shaderObject = gl.createShader(type);
      if (!shaderObject) throw new Error('Cloud shader allocation failed');
      cleanup.push(function () { gl.deleteShader(shaderObject); });
      gl.shaderSource(shaderObject, source);
      gl.compileShader(shaderObject);
      if (!gl.getShaderParameter(shaderObject, gl.COMPILE_STATUS)) {
        throw new Error(gl.getShaderInfoLog(shaderObject) || 'Cloud shader compilation failed');
      }
      return shaderObject;
    }

    try {
      var program = gl.createProgram();
      if (!program) throw new Error('Cloud shader program allocation failed');
      cleanup.push(function () { gl.deleteProgram(program); });
      gl.attachShader(program, shader(gl.VERTEX_SHADER, vertexShader));
      gl.attachShader(program, shader(gl.FRAGMENT_SHADER, fragmentShader));
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw new Error(gl.getProgramInfoLog(program) || 'Cloud shader linking failed');
      }

      var timeLocation = gl.getUniformLocation(program, 'time');
      var seedLocation = gl.getUniformLocation(program, 'seed');
      var darkLocation = gl.getUniformLocation(program, 'darkMode');
      var vao = gl.createVertexArray();
      cleanup.push(function () { gl.deleteVertexArray(vao); });
      gl.bindVertexArray(vao);
      var buffer = gl.createBuffer();
      cleanup.push(function () { gl.deleteBuffer(buffer); });
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(0);
      gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
      gl.disable(gl.DEPTH_TEST);
      gl.disable(gl.BLEND);

      return {
        resize: function (width) {
          var w = Math.max(1, Math.min(448, Math.round((Number.isFinite(width) ? width : 0) * 0.5)));
          var h = Math.max(1, Math.round(7 * w / 15));
          if (canvas.width !== w || canvas.height !== h) {
            canvas.width = w;
            canvas.height = h;
          }
        },
        draw: function (time) {
          gl.viewport(0, 0, canvas.width, canvas.height);
          gl.useProgram(program);
          gl.bindVertexArray(vao);
          gl.uniform1f(timeLocation, time);
          gl.uniform1f(seedLocation, seed);
          gl.uniform1i(darkLocation, document.documentElement.dataset.theme === 'dark' ? 1 : 0);
          gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        },
        destroy: dispose
      };
    } catch (error) {
      dispose();
      throw error;
    }
  }

  function create(host, headings) {
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    var layer = document.createElement('div');
    layer.className = CLASS.clouds;
    layer.setAttribute('aria-hidden', 'true');

    var clouds = headings.map(function (heading, index) {
      var track = document.createElement('div');
      track.className = CLASS.track;
      var cloud = document.createElement('div');
      cloud.className = CLASS.cloud;
      var fromLeft = index % 2 === 0;
      setVars(track, {
        '--cloud-width': (720 + (73 * index) % 260) + 'px',
        '--cloud-opacity': (0.52 + (index % 3) * 0.04).toFixed(2),
        '--cloud-rotation': ((7 * index) % 19 - 9) + 'deg',
        '--cloud-vertical-drift': ((40 + (index % 4) * 8) * (fromLeft ? 1 : -1)) + 'px',
        '--cloud-direction': fromLeft ? '1' : '-1',
        '--cloud-origin': fromLeft ? '0%' : '100%',
        '--cloud-offset': fromLeft ? '-100%' : '0%'
      });
      var canvas = document.createElement('canvas');
      canvas.width = 1;
      canvas.height = 1;
      cloud.appendChild(canvas);
      track.appendChild(cloud);
      layer.appendChild(track);
      return {
        heading: heading,
        track: track,
        canvas: canvas,
        seed: 17 + 13.7 * index,
        time: 0,
        renderer: null,
        visible: false,
        active: false,
        lost: false,
        unavailable: false,
        phase: 'idle',
        holdScrollY: null
      };
    });

    host.append(layer);

    var byHeading = new Map();
    clouds.forEach(function (cloud) { byHeading.set(cloud.heading, cloud); });

    var abort = new AbortController();
    var signal = abort.signal;
    var raf = 0;
    var lastFrame = 0;
    var lastDraw = 0;

    function setPhase(cloud, phase) {
      cloud.phase = phase;
      cloud.track.dataset.phase = phase;
    }

    function canRun(cloud) {
      return cloud.visible && cloud.phase !== 'done' && !host.inert && !document.hidden &&
        !reduce.matches && !cloud.lost && !cloud.unavailable;
    }

    function isMoving(cloud) {
      return cloud.phase === 'entering' || cloud.phase === 'holding';
    }

    function centre(cloud) {
      // The heading's reveal animation translates it by 16px.  Anchor to
      // its layout position (offsetTop) so a cloud that enters while the
      // reveal is still running does not stay 16px off after it settles.
      if (cloud.heading.offsetParent === host) {
        var hostRect = host.getBoundingClientRect();
        return hostRect.top + host.clientTop + cloud.heading.offsetTop + cloud.heading.offsetHeight / 2;
      }
      var rect = cloud.heading.getBoundingClientRect();
      return rect.top + rect.height / 2;
    }

    function shouldEnter(cloud) {
      return cloud.phase === 'waiting' && centre(cloud) <= 0.9 * window.innerHeight;
    }

    function position(list) {
      if (!list.length) return;
      var origin = layer.getBoundingClientRect().top;
      list.forEach(function (cloud) {
        var y = centre(cloud);
        if (isMoving(cloud)) y = Math.min(0.65 * window.innerHeight, y);
        cloud.track.style.setProperty('--cloud-y', (y - origin) + 'px');
      });
    }

    function maybeLeave(cloud) {
      if (centre(cloud) > 0.65 * window.innerHeight) {
        cloud.holdScrollY = null;
        return;
      }
      if (cloud.holdScrollY == null) cloud.holdScrollY = window.scrollY;
      if (window.scrollY - cloud.holdScrollY >= 0.04 * window.innerHeight) {
        setPhase(cloud, 'leaving');
      }
    }

    function drawCloud(cloud) {
      try {
        if (!cloud.renderer) {
          cloud.renderer = createRenderer(cloud.canvas, cloud.seed);
        }
        cloud.renderer.resize(cloud.canvas.clientWidth);
        cloud.renderer.draw(cloud.time);
      } catch (error) {
        cloud.unavailable = true;
        cloud.active = false;
        cloud.track.classList.remove(CLASS.visible);
        if (cloud.renderer) {
          cloud.renderer.destroy();
          cloud.renderer = null;
        }
      }
    }

    function frame(now) {
      raf = 0;
      var active = clouds.filter(function (cloud) { return cloud.active; });
      if (!active.length) {
        lastFrame = 0;
        return;
      }
      var delta = lastFrame ? Math.min((now - lastFrame) / 1000, 0.1) : 0;
      lastFrame = now;
      active.forEach(function (cloud) { cloud.time += delta; });
      if (now - lastDraw >= 1000 / 24) {
        lastDraw = now;
        active.forEach(drawCloud);
      }
      if (clouds.some(function (cloud) { return cloud.active; })) {
        raf = window.requestAnimationFrame(frame);
      }
    }

    function tick() {
      clouds.forEach(function (cloud) {
        if (!cloud.visible) setPhase(cloud, 'idle');
        var runnable = canRun(cloud);
        if (runnable && cloud.phase === 'idle') {
          cloud.time = 0;
          cloud.holdScrollY = null;
          setPhase(cloud, 'waiting');
        }
        if (runnable && shouldEnter(cloud)) setPhase(cloud, 'entering');
        var active = runnable && cloud.phase !== 'waiting';
        cloud.active = active;
        cloud.track.classList.toggle(CLASS.visible, active);
      });
      position(clouds.filter(function (cloud) { return cloud.active && isMoving(cloud); }));
      clouds.filter(function (cloud) { return cloud.active; }).forEach(drawCloud);
      if (clouds.some(function (cloud) { return cloud.active; })) {
        lastDraw = performance.now();
        if (!raf) raf = window.requestAnimationFrame(frame);
      }
    }

    function refresh() {
      position(clouds);
      tick();
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var cloud = byHeading.get(entry.target);
        if (!cloud) return;
        cloud.visible = entry.isIntersecting && (cloud.visible || entry.intersectionRatio === 1);
      });
      tick();
    }, { rootMargin: '-64px 0px -40px', threshold: [0, 1] });

    var resizeObserver = new ResizeObserver(refresh);
    var mutationObserver = new MutationObserver(tick);
    mutationObserver.observe(host, { attributes: true, attributeFilter: ['inert'] });
    resizeObserver.observe(host);

    clouds.forEach(function (cloud) {
      observer.observe(cloud.heading);
      resizeObserver.observe(cloud.heading);
      cloud.track.addEventListener('animationend', function (event) {
        if (event.target !== cloud.canvas.parentElement) return;
        if (cloud.phase === 'entering') {
          setPhase(cloud, 'holding');
          if (canRun(cloud)) maybeLeave(cloud);
        } else if (cloud.phase === 'leaving') {
          setPhase(cloud, 'done');
          tick();
        }
      }, { signal: signal });
      cloud.canvas.addEventListener('webglcontextlost', function (event) {
        event.preventDefault();
        cloud.lost = true;
        cloud.renderer = null;
        tick();
      }, { signal: signal });
      cloud.canvas.addEventListener('webglcontextrestored', function () {
        cloud.lost = false;
        tick();
      }, { signal: signal });
    });

    window.addEventListener('scroll', function () {
      var moving = clouds.filter(function (cloud) { return cloud.active && isMoving(cloud); });
      var changed = false;
      clouds.forEach(function (cloud) {
        if (!canRun(cloud)) return;
        if (shouldEnter(cloud)) {
          setPhase(cloud, 'entering');
          changed = true;
        } else if (cloud.phase === 'holding') {
          maybeLeave(cloud);
        }
      });
      position(moving);
      if (changed) tick();
    }, { passive: true, signal: signal });

    window.addEventListener('resize', refresh, { signal: signal });
    document.addEventListener('visibilitychange', tick, { signal: signal });
    reduce.addEventListener && reduce.addEventListener('change', tick);
    if (reduce.addEventListener) signal.addEventListener('abort', function () {
      reduce.removeEventListener('change', tick);
    }, { once: true });

    refresh();

    return {
      host: host,
      headings: headings,
      refresh: refresh,
      destroy: function () {
        abort.abort();
        if (raf) window.cancelAnimationFrame(raf);
        raf = 0;
        observer.disconnect();
        resizeObserver.disconnect();
        mutationObserver.disconnect();
        clouds.forEach(function (cloud) {
          if (cloud.renderer) cloud.renderer.destroy();
        });
        layer.remove();
      }
    };
  }

  function mount() {
    if (document.documentElement.dataset.skin !== 'kimi') return;
    if (typeof IntersectionObserver !== 'function' || typeof ResizeObserver !== 'function') return;
    var host = document.getElementById('doc-content');
    if (!host) return;
    var headings = [];
    for (var i = 0; i < host.children.length; i += 1) {
      if (host.children[i].tagName === 'H2') headings.push(host.children[i]);
    }
    if (!headings.length) return;
    if (instance && instance.host === host && instance.headings[0] === headings[0]) {
      instance.refresh();
      return;
    }
    if (instance) destroy();
    try {
      instance = create(host, headings);
    } catch (error) {
      // The clouds are decoration: never let a shader or observer failure
      // leave a half-built layer or break the article.
      Array.prototype.forEach.call(host.querySelectorAll(':scope > .' + CLASS.clouds), function (node) {
        node.remove();
      });
      instance = null;
      if (window.console && console.warn) console.warn('Reader clouds unavailable:', error);
    }
  }

  function destroy() {
    if (!instance) return;
    try {
      instance.destroy();
    } catch (error) {
      if (window.console && console.warn) console.warn('Reader clouds cleanup failed:', error);
    }
    instance = null;
  }

  window.__readerClouds = { mount: mount, destroy: destroy };
})();
