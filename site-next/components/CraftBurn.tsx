// @ts-nocheck -- direct port of the reference site's WebGL "burn" shader (de-minified, names kept for diffing).
"use client";
import { useRef } from "react";
import { useGsap } from "@/lib/gsap";

export function CraftBurn() {
  let e = useRef<HTMLCanvasElement>(null);
  return (
    useGsap(e, (e, t, n) => {
      let { gsap: a, ScrollTrigger: i } = e;
      if (t.reduce) return;
      let s = n.closest("section"),
        r = n.parentElement;
      if (!s || !r) return;
      let l = n.getContext("webgl", {
          premultipliedAlpha: !0,
          antialias: !1,
          alpha: !0,
        }),
        o = (e, t) => {
          let n = l.createShader(e);
          return (l.shaderSource(n, t), l.compileShader(n), n);
        },
        c = null;
      if (
        (l &&
          ((c = l.createProgram()),
          l.attachShader(
            c,
            o(
              l.VERTEX_SHADER,
              "attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}",
            ),
          ),
          l.attachShader(
            c,
            o(
              l.FRAGMENT_SHADER,
              "precision highp float;\nuniform vec2 uRes;\nuniform vec2 uOrigin;\nuniform float uTime;\nuniform float uBurn;   // 0 → 1 across the burn\nuniform float uRadius; // current radius of the hole, in stage heights\n\nfloat hash(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}\nfloat noise(vec2 p){\n  vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);\n  return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);\n}\nfloat fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*noise(p);p=p*2.03+17.1;a*=.5;}return v;}\n\nvoid main(){\n  vec2 uv=gl_FragCoord.xy/uRes;\n  vec2 q=(uv-uOrigin)*vec2(uRes.x/uRes.y,1.);\n  float d=length(q);\n  float grown=smoothstep(0.,.06,uRadius);\n\n  // The burn front: distance, torn up by slow noise, with fast tongues licking upward.\n  float rag=(fbm(q*2.6+vec2(0.,-uTime*.12))-.5)*.52;\n  float lick=(fbm(vec2(q.x*7.,q.y*4.-uTime*1.9))-.5)*.11;\n  // It starts as a pinprick: the rim, the scorch and the tearing are all thin until the hole has some size.\n  float w=mix(.16,1.,smoothstep(0.,.55,uRadius));\n  float f=(d-uRadius+(rag+lick)*grown*w)/w;\n\n  vec3 col=vec3(0.);\n  float a=0.;\n\n  // Scorch ahead of the flame: the page blackens before it goes.\n  float scorch=(1.-smoothstep(.1,.62,f))*grown;\n  col=vec3(.03,.012,.0);\n  a=scorch*.94;\n\n  // Embers glowing in the char.\n  float glow=fbm(q*9.+vec2(0.,-uTime*.5));\n  float ember=smoothstep(.2,.02,f)*smoothstep(.45,.75,glow)*grown;\n  col=mix(col,vec3(1.,.28,.03),ember*.9);\n  a=max(a,ember);\n\n  // The rim: deep red, orange, yellow, then white-hot at the edge of the hole.\n  float rim=1.-smoothstep(0.,.13,f);\n  vec3 fire=mix(vec3(.75,.06,.0),vec3(1.,.42,.02),smoothstep(.13,.07,f));\n  fire=mix(fire,vec3(1.,.82,.25),smoothstep(.07,.03,f));\n  fire=mix(fire,vec3(1.,.98,.88),smoothstep(.03,0.,f));\n  col=mix(col,fire,rim*grown);\n  a=max(a,rim*grown);\n\n  // Inside the hole: white, still warm near the rim.\n  float inside=1.-smoothstep(-.012,.0,f);\n  vec3 ground=mix(vec3(1.),vec3(1.,.8,.5),smoothstep(-.16,0.,f)*.75);\n  col=mix(col,ground,inside);\n  a=max(a,inside);\n\n  // Sparks thrown up off the rim.\n  vec2 sp=q*vec2(26.,20.);\n  sp.y-=uTime*5.;\n  vec2 cell=floor(sp);\n  float r=hash(cell);\n  vec2 off=(vec2(hash(cell+3.1),hash(cell+7.7))-.5)*.6;\n  float dotv=smoothstep(.16,0.,length(fract(sp)-.5-off));\n  float spark=dotv*step(.9,r)*smoothstep(.42,.0,abs(f-.06))*grown*(.6+.4*sin(uTime*14.+r*40.));\n  col+=vec3(1.,.55,.12)*spark;\n  a=max(a,spark);\n\n  // Ignition: a flash at the origin, and the whole page heats up as it goes.\n  float flash=exp(-d*d/.0016)*smoothstep(0.,.04,uBurn)*(1.-smoothstep(.04,.16,uBurn))*.8;\n  col+=vec3(1.,.8,.45)*flash;\n  a=max(a,flash);\n  float heat=sin(min(uBurn*1.4,1.)*3.14159)*.2*smoothstep(.1,.5,uBurn)*(1.-inside);\n  col=mix(col,vec3(1.,.3,.02),heat*(1.-a));\n  a=a+heat*(1.-a);\n\n  gl_FragColor=vec4(min(col,1.)*a,a);\n}",
            ),
          ),
          l.linkProgram(c),
          l.getProgramParameter(c, l.LINK_STATUS) || (c = null)),
        !l || !c)
      )
        return (
          (r.dataset.fallback = ""),
          () => {
            delete r.dataset.fallback;
          }
        );
      (l.useProgram(c),
        l.bindBuffer(l.ARRAY_BUFFER, l.createBuffer()),
        l.bufferData(
          l.ARRAY_BUFFER,
          new Float32Array([-1, -1, 3, -1, -1, 3]),
          l.STATIC_DRAW,
        ));
      let d = l.getAttribLocation(c, "a");
      (l.enableVertexAttribArray(d),
        l.vertexAttribPointer(d, 2, l.FLOAT, !1, 0, 0));
      let h = (e) => l.getUniformLocation(c, e),
        u = h("uRes"),
        m = h("uOrigin"),
        p = h("uTime"),
        f = h("uBurn"),
        x = h("uRadius"),
        v = r.querySelector(".slop-collage"),
        b = 0.5,
        g = 0.5,
        w = 1,
        j = () => {
          let e = n.clientWidth,
            a = n.clientHeight;
          if (!e || !a) return;
          if (v) {
            let e = v.getBoundingClientRect(),
              t = n.getBoundingClientRect();
            ((b = (e.left + e.width / 2 - t.left) / t.width),
              (g = 1 - (e.top + e.height / 2 - t.top) / t.height));
          }
          let i = Math.min(window.devicePixelRatio || 1, t.mobile ? 1 : 1.5);
          ((n.width = Math.round(e * i)),
            (n.height = Math.round(a * i)),
            (w = e / a),
            l.viewport(0, 0, n.width, n.height));
        },
        y = new ResizeObserver(j);
      (y.observe(n), j());
      let k = 0,
        N = 0,
        A = !1,
        E = "",
        C = (e) => {
          e !== E && (r.dataset.burn = E = e);
        },
        S = (e) => {
          ((N += (k - N) * 0.1), 0.002 > Math.abs(k - N) && (N = k));
          let t = Math.hypot(w * Math.max(b, 1 - b), Math.max(g, 1 - g)) + 0.75;
          (l.uniform2f(u, n.width, n.height),
            l.uniform2f(m, b, g),
            l.uniform1f(p, e),
            l.uniform1f(f, N),
            l.uniform1f(x, -0.03 + Math.pow(N, 2.3) * t),
            l.drawArrays(l.TRIANGLES, 0, 3),
            C(N <= 0 ? "before" : N >= 1 ? "after" : "on"),
            N === k && (N <= 0 || N >= 1) && R());
        },
        M = () => {
          A || ((A = !0), a.ticker.add(S));
        },
        R = () => {
          A && ((A = !1), a.ticker.remove(S));
        },
        T = i.create({
          trigger: s,
          start: "top top",
          end: "bottom bottom",
          onUpdate: (e) => {
            (k = Math.min(1, Math.max(0, (e.progress - 0.04) / 0.46))) !== N &&
              M();
          },
          onRefresh: (e) => {
            ((k = N = Math.min(1, Math.max(0, (e.progress - 0.04) / 0.46))),
              M());
          },
        });
      return (
        C("before"),
        () => {
          (R(), y.disconnect(), T.kill(), delete r.dataset.burn);
        }
      );
    }),
    (<canvas ref={e} aria-hidden className="craft-fire" />)
  );
}
