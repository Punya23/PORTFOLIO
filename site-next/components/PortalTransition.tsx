// @ts-nocheck -- direct port of the reference site's WebGL "void" transition (de-minified; variable names kept
// so it stays diffable against the original). Phases/timeline are the reference's own tuning.
"use client";
import { useRef } from "react";
import { useGsap } from "@/lib/gsap";

type PortalProps = {
  sectionA?: string;
  sectionB?: string;
  originX?: number;
  originY?: number;
  config?: Record<string, unknown>;
};

let r = {
    duration: 3.6,
    scrub: 0.6,
    phases: [0.03, 0.2, 0.6, 0.84],
    radius: 1.05,
    noiseScale: 2.5,
    noiseAmp: 0.15,
    edgeWidth: 0.12,
    bloom: 0.08,
    particles: 3600,
    flares: 10,
    maxDpr: 2,
    voidColor: [0, 0, 0],
    glowColor: [1, 1, 1],
    lineColor: [0.86, 0.93, 1],
  },
  l = [0, 0, 1, 1];
export function PortalTransition(e: PortalProps) {
  let {
      sectionA: t,
      sectionB: n,
      originX: o = 0.5,
      originY: c = 0.42,
      config: d,
    } = e,
    h = useRef<HTMLDivElement>(null);
  return (
    useGsap(
      h,
      (e, a, i) => {
        let s,
          { gsap: h, ScrollTrigger: u } = e;
        if (a.reduce) return;
        let m = t ? document.querySelector(t) : i.closest("section"),
          p = n ? document.querySelector(n) : null,
          f = i.querySelector("canvas");
        if (!m || !f) return;
        let x = { ...r, ...d },
          v = m.querySelector("[data-portal-origin]"),
          b = Array.from(m.querySelectorAll("img[data-portal-layer]")).slice(
            0,
            2,
          ),
          g = {
            hint: 0,
            bloom: 0,
            gain: 0,
            burst: 0,
            follow: 0,
            parts: 0,
            radius: 0,
            flare: 0,
            filter: 1,
            push: 0,
            fall: 0,
            rise: 0,
            fill: 0,
            settle: 0,
          },
          w = [o, c],
          j = [],
          y = () => {
            let e = i.getBoundingClientRect();
            if (e.width && e.height) {
              if ((null == s || s.resize(e.width, e.height), v)) {
                let t = v.getBoundingClientRect();
                w = [
                  (t.left + t.width / 2 - e.left) / e.width,
                  (t.top + t.height / 2 - e.top) / e.height,
                ];
              }
              (i.style.setProperty(
                "--ox",
                "".concat((100 * w[0]).toFixed(2), "%"),
              ),
                i.style.setProperty(
                  "--oy",
                  "".concat((100 * w[1]).toFixed(2), "%"),
                ),
                null == p ||
                  p.style.setProperty(
                    "--pb-ox",
                    "".concat(((w[0] - 0.5) * e.width).toFixed(1), "px"),
                  ),
                null == p ||
                  p.style.setProperty(
                    "--pb-oy",
                    "".concat(((w[1] - 0.5) * e.height).toFixed(1), "px"),
                  ));
            }
          },
          k = () => {
            if (void 0 !== s) return;
            if (
              !(s = (function (e, t, n) {
                let a = e.getContext("webgl", {
                  alpha: !0,
                  premultipliedAlpha: !0,
                  antialias: !1,
                  powerPreference: "high-performance",
                });
                if (!a) return null;
                let i = (e, t) => {
                    var n;
                    let i = a.createShader(e);
                    if (
                      (a.shaderSource(i, t),
                      a.compileShader(i),
                      !a.getShaderParameter(i, a.COMPILE_STATUS))
                    )
                      throw Error(
                        null != (n = a.getShaderInfoLog(i)) ? n : "shader",
                      );
                    return i;
                  },
                  s = (e, t, n) => {
                    var s;
                    let r = a.createProgram();
                    if (
                      (a.attachShader(r, i(a.VERTEX_SHADER, e)),
                      a.attachShader(r, i(a.FRAGMENT_SHADER, t)),
                      a.bindAttribLocation(r, 0, n),
                      a.linkProgram(r),
                      !a.getProgramParameter(r, a.LINK_STATUS))
                    )
                      throw Error(
                        null != (s = a.getProgramInfoLog(r)) ? s : "link",
                      );
                    return r;
                  },
                  r = (e, t) =>
                    Object.fromEntries(
                      t.map((t) => [t, a.getUniformLocation(e, t)]),
                    );
                try {
                  let i = "#define OCTAVES "
                      .concat(n ? 2 : 3, "\n#define FLARES ")
                      .concat(Math.max(1, Math.round(t.flares)), "\n"),
                    l = s(
                      "\nattribute vec2 p;\nvarying vec2 vUv;\nvoid main() { vUv = vec2(p.x * 0.5 + 0.5, 0.5 - p.y * 0.5); gl_Position = vec4(p, 0.0, 1.0); }\n",
                      i +
                        "\nprecision highp float;\nvarying vec2 vUv;\nuniform vec2 uResolution;\nuniform vec2 uOrigin;\nuniform float uProgress;\nuniform float uTime;\nuniform float uRadius;\nuniform float uNoiseScale;\nuniform float uNoiseAmp;\nuniform float uEdgeWidth;\nuniform float uFilter;\nuniform float uBloom;      // sigma, as a fraction of the viewport width\nuniform float uGain;\nuniform float uFlare;\nuniform float uShock;      // 0..1, the shock ring's travel\nuniform float uDone;      // 1 once only the void and its stars are left\nuniform float uPx;         // device pixels per CSS pixel\nuniform sampler2D uTexA0;  // section A's cut-outs, premultiplied\nuniform sampler2D uTexA1;\nuniform vec4 uRectA0;\nuniform vec4 uRectA1;\nuniform vec3 uVoid;\nuniform vec3 uGlow;\nuniform vec3 uLine;\n\nconst vec3 LUMA = vec3(0.299, 0.587, 0.114);\n\nfloat hash(float n) { return fract(sin(n) * 43758.5453123); }\n\n// Simplex noise (Ian McEwan, Ashima Arts; MIT).\nvec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }\nfloat snoise(vec2 v) {\n  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);\n  vec2 i = floor(v + dot(v, C.yy));\n  vec2 x0 = v - i + dot(i, C.xx);\n  vec2 i1 = x0.x > x0.y ? vec2(1.0, 0.0) : vec2(0.0, 1.0);\n  vec4 x12 = x0.xyxy + C.xxzz;\n  x12.xy -= i1;\n  i = mod(i, 289.0);\n  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));\n  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);\n  m = m * m;\n  m = m * m;\n  vec3 x = 2.0 * fract(p * C.www) - 1.0;\n  vec3 h = abs(x) - 0.5;\n  vec3 ox = floor(x + 0.5);\n  vec3 a0 = x - ox;\n  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);\n  vec3 g;\n  g.x = a0.x * x0.x + h.x * x0.y;\n  g.yz = a0.yz * x12.xz + h.yz * x12.yw;\n  return 130.0 * dot(m, g);\n}\nfloat fbm(vec2 p) {\n  float sum = 0.0, amp = 0.5;\n  for (int i = 0; i < OCTAVES; i++) {\n    sum += amp * snoise(p);\n    p = p * 2.03 + 17.0;\n    amp *= 0.5;\n  }\n  return sum;\n}\n\n// Section A, as luminance: each cut-out sampled through its on-screen rect.\nfloat layer(sampler2D tex, vec4 rect, vec2 uv) {\n  vec2 a = (uv - rect.xy) / rect.zw;\n  // feathered, so the image's own border never reads as an edge\n  vec2 f = smoothstep(0.0, 0.03, a) * smoothstep(0.0, 0.03, 1.0 - a);\n  float inside = f.x * f.y;\n  return dot(texture2D(tex, clamp(a, 0.0, 1.0)).rgb, LUMA) * inside;\n}\nfloat lumA(vec2 uv) { return layer(uTexA0, uRectA0, uv) + layer(uTexA1, uRectA1, uv); }\n\n// 4-point star flares, scattered through the void, each on its own slow blink.\nfloat flares(vec2 q, float diag) {\n  if (uFlare < 0.004) return 0.0;\n  float stars = 0.0;\n  for (int i = 0; i < FLARES; i++) {\n    float fi = float(i);\n    vec2 at = vec2(0.08 + 0.84 * hash(fi * 1.7 + 0.3), 0.12 + 0.72 * hash(fi * 3.1 + 7.0));\n    vec2 sq = (at - uOrigin) * uResolution / diag;\n    float life = fract(uTime * (0.16 + 0.14 * hash(fi + 11.0)) + hash(fi + 5.0));\n    float fade = sin(life * 3.14159265);\n    fade *= fade;\n    float reached = smoothstep(0.02, 0.14, uRadius - uEdgeWidth - length(sq));\n    vec2 dd = (q - sq) * diag / uPx;\n    float size = mix(12.0, 44.0, hash(fi + 2.3)) * (0.55 + 0.45 * fade);\n    // short, faint streaks: the star is mostly its round core\n    float len = size * 0.45;\n    float cross = exp(-abs(dd.x) / len) * exp(-abs(dd.y) / 0.8) + exp(-abs(dd.y) / len) * exp(-abs(dd.x) / 0.8);\n    stars += (0.5 * cross + 0.9 * exp(-dot(dd, dd) / (size * 0.7))) * fade * reached;\n  }\n  return stars * uFlare;\n}\n\nvoid main() {\n  float diag = length(uResolution);\n  vec2 q = (vUv - uOrigin) * uResolution / diag; // origin-relative, in viewport diagonals\n  float d = length(q);\n\n  // Afterwards the canvas is just the ground for the particle field behind section B.\n  if (uDone > 0.5) {\n    gl_FragColor = vec4(uVoid, 1.0);\n    return;\n  }\n\n  // The boundary: a circle whose edge is pushed around by drifting noise, so it reads as cloud, not as a disc.\n  float n = fbm(q * uNoiseScale * 2.4 + vec2(uTime * 0.045, -uTime * 0.03) - normalize(q + 1e-5) * uRadius * 0.5);\n  float open = smoothstep(0.0, 0.1, uRadius);\n  float dn = d + n * uNoiseAmp * open;\n  float inVoid = (1.0 - smoothstep(uRadius - uEdgeWidth, uRadius, dn)) * open;\n  float band = (1.0 - smoothstep(uRadius, uRadius + uEdgeWidth, dn)) * open;\n\n  // uFilter 1 → 0 clears the line art from the origin outward; the far edges go last.\n  // A wide, soft front plus an overall fade, so nothing is left standing and then cut.\n  float rf = (1.0 - uFilter) * 1.3;\n  float keep = smoothstep(rf - 0.5, rf, d + n * 0.06) * smoothstep(0.0, 0.45, uFilter);\n  float fm = band * keep;\n\n  vec3 col = vec3(0.0);\n\n  // Grayscale → Sobel → contrast: section A's edges as white chrome on the dark, highlights blown out in patches.\n  if (fm > 0.004) {\n    vec2 px = uPx * 1.1 / uResolution;\n    float tl = lumA(vUv + px * vec2(-1.0, -1.0));\n    float tc = lumA(vUv + px * vec2(0.0, -1.0));\n    float tr = lumA(vUv + px * vec2(1.0, -1.0));\n    float ml = lumA(vUv + px * vec2(-1.0, 0.0));\n    float mc = lumA(vUv);\n    float mr = lumA(vUv + px * vec2(1.0, 0.0));\n    float bl = lumA(vUv + px * vec2(-1.0, 1.0));\n    float bc = lumA(vUv + px * vec2(0.0, 1.0));\n    float br = lumA(vUv + px * vec2(1.0, 1.0));\n    float gx = (tr + 2.0 * mr + br) - (tl + 2.0 * ml + bl);\n    float gy = (bl + 2.0 * bc + br) - (tl + 2.0 * tc + tr);\n    float edge = length(vec2(gx, gy));\n    float chrome = smoothstep(0.14, 0.8, edge);\n    float patches = smoothstep(-0.15, 0.55, snoise(q * 7.0 + uTime * 0.12));\n    float blown = smoothstep(0.55, 0.95, mc) * patches;\n    col += (uLine * chrome * 1.2 + vec3(blown) * 0.7 + uLine * mc * 0.08) * fm;\n  }\n\n  // A lit, uneven rim where the void is eating the page.\n  float rim = exp(-pow((dn - uRadius + uEdgeWidth * 0.5) / (uEdgeWidth * 0.45), 2.0)) * open;\n  rim *= 0.25 + 0.75 * smoothstep(-0.3, 0.5, snoise(q * 5.0 - uTime * 0.2));\n  col += uGlow * rim * 0.42 * smoothstep(1.0, 0.6, uProgress);\n\n  // Spark → overexposed bloom at the origin, with a faint cross of light through it.\n  vec2 dp = (vUv - uOrigin) * uResolution / uPx; // CSS px\n  // (The width is capped, so on a wide screen the bloom stays a spark instead of growing with the window.)\n  float sigma = max(uBloom * min(uResolution.x / uPx, 760.0), 0.75);\n  float r2 = dot(dp, dp);\n  float glow = exp(-r2 / (2.0 * sigma * sigma)) + 1.6 * exp(-r2 / (0.18 * sigma * sigma));\n  float thin = sigma * 0.05 + 0.6;\n  glow += 0.42 * exp(-abs(dp.y) / thin) * exp(-abs(dp.x) / (sigma * 1.7 + 1.0));\n  glow += 0.26 * exp(-abs(dp.x) / thin) * exp(-abs(dp.y) / (sigma * 1.1 + 1.0));\n  col += uGlow * glow * uGain;\n\n  // The blast: a thin, uneven shock ring thrown out with the glitter, gone by the time it has slowed.\n  if (uShock > 0.001 && uShock < 0.999) {\n    float ring = exp(-pow((d - uShock * 0.17) / (0.004 + 0.022 * uShock), 2.0));\n    ring *= smoothstep(0.0, 0.12, uShock) * pow(1.0 - uShock, 2.0);\n    ring *= 0.5 + 0.5 * smoothstep(-0.4, 0.6, snoise(normalize(q + 1e-5) * 2.6 + uTime * 0.15));\n    col += uGlow * ring * 0.85;\n  }\n\n  col += uGlow * flares(q, diag);\n\n  // The band dims the page under the line art; the void replaces it with section B's ground.\n  float alpha = clamp(mix(band * 0.94, 1.0, inVoid), 0.0, 1.0);\n  // Light over the still-transparent page (the spark, the bloom) has to carry its own alpha: colour brighter\n  // than alpha is not valid premultiplied output, and desktop compositors drop it instead of adding it.\n  vec3 rgb = uVoid * alpha + col;\n  gl_FragColor = vec4(rgb, clamp(max(alpha, max(rgb.r, max(rgb.g, rgb.b))), 0.0, 1.0));\n}\n",
                      "p",
                    ),
                    o = s(
                      "\nattribute vec4 aSeed; // angle, reach, size, phase\nuniform vec2 uResolution;\nuniform vec2 uOrigin;\nuniform float uSpread;\nuniform float uTime;\nuniform float uPx;\nuniform float uAlpha;\nvarying float vA;\nvoid main() {\n  float ang = aSeed.x * 6.2831853;\n  float reach = pow(aSeed.y, 0.6) * mix(0.5, 1.3, fract(aSeed.w * 7.13)); // no hard outer ring\n  vec2 wobble = vec2(sin(uTime * 0.7 + aSeed.w * 6.2831853), cos(uTime * 0.6 + aSeed.w * 4.1)) * 0.006;\n  vec2 q = vec2(cos(ang), sin(ang)) * reach * uSpread + wobble * smoothstep(0.0, 0.2, uSpread);\n  vec2 uv = uOrigin + q * length(uResolution) / uResolution;\n  gl_Position = vec4(uv.x * 2.0 - 1.0, 1.0 - uv.y * 2.0, 0.0, 1.0);\n  float twinkle = 0.55 + 0.45 * sin(uTime * (2.0 + 3.0 * aSeed.z) + aSeed.w * 6.2831853);\n  vA = twinkle * uAlpha;\n  // mostly small, with a few medium ones; soft round points, no streaks\n  float size = mix(1.0, 4.0, aSeed.z * aSeed.z) + 3.5 * step(0.95, fract(aSeed.w * 13.7));\n  gl_PointSize = size * uPx * (0.7 + 0.3 * twinkle);\n}\n",
                      "\nprecision mediump float;\nuniform vec3 uGlow;\nvarying float vA;\nvoid main() {\n  float a = smoothstep(0.5, 0.0, length(gl_PointCoord - 0.5));\n  vec3 c = uGlow * a * vA;\n  gl_FragColor = vec4(c, max(c.r, max(c.g, c.b))); // alpha covers the colour, so it stays valid premultiplied\n\n}\n",
                      "aSeed",
                    ),
                    c = r(l, [
                      "uResolution",
                      "uOrigin",
                      "uProgress",
                      "uTime",
                      "uRadius",
                      "uNoiseScale",
                      "uNoiseAmp",
                      "uEdgeWidth",
                      "uFilter",
                      "uBloom",
                      "uGain",
                      "uFlare",
                      "uShock",
                      "uDone",
                      "uPx",
                      "uTexA0",
                      "uTexA1",
                      "uRectA0",
                      "uRectA1",
                      "uVoid",
                      "uGlow",
                      "uLine",
                    ]),
                    d = r(o, [
                      "uResolution",
                      "uOrigin",
                      "uSpread",
                      "uTime",
                      "uPx",
                      "uAlpha",
                      "uGlow",
                    ]),
                    h = a.createBuffer();
                  (a.bindBuffer(a.ARRAY_BUFFER, h),
                    a.bufferData(
                      a.ARRAY_BUFFER,
                      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
                      a.STATIC_DRAW,
                    ));
                  let u = Math.round(t.particles * (n ? 0.5 : 1)),
                    m = new Float32Array(4 * u);
                  for (let e = 0; e < m.length; e++) m[e] = Math.random();
                  let p = a.createBuffer();
                  (a.bindBuffer(a.ARRAY_BUFFER, p),
                    a.bufferData(a.ARRAY_BUFFER, m, a.STATIC_DRAW),
                    a.pixelStorei(a.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !0));
                  let f = [0, 1].map((e) => {
                    let t = a.createTexture();
                    return (
                      a.activeTexture(a.TEXTURE0 + e),
                      a.bindTexture(a.TEXTURE_2D, t),
                      a.texParameteri(
                        a.TEXTURE_2D,
                        a.TEXTURE_WRAP_S,
                        a.CLAMP_TO_EDGE,
                      ),
                      a.texParameteri(
                        a.TEXTURE_2D,
                        a.TEXTURE_WRAP_T,
                        a.CLAMP_TO_EDGE,
                      ),
                      a.texParameteri(
                        a.TEXTURE_2D,
                        a.TEXTURE_MIN_FILTER,
                        a.LINEAR,
                      ),
                      a.texParameteri(
                        a.TEXTURE_2D,
                        a.TEXTURE_MAG_FILTER,
                        a.LINEAR,
                      ),
                      a.texImage2D(
                        a.TEXTURE_2D,
                        0,
                        a.RGBA,
                        1,
                        1,
                        0,
                        a.RGBA,
                        a.UNSIGNED_BYTE,
                        new Uint8Array(4),
                      ),
                      t
                    );
                  });
                  (a.useProgram(l),
                    a.uniform1i(c.uTexA0, 0),
                    a.uniform1i(c.uTexA1, 1),
                    a.uniform1f(c.uNoiseScale, t.noiseScale),
                    a.uniform1f(c.uNoiseAmp, t.noiseAmp),
                    a.uniform1f(c.uEdgeWidth, t.edgeWidth),
                    a.uniform3fv(c.uVoid, t.voidColor),
                    a.uniform3fv(c.uGlow, t.glowColor),
                    a.uniform3fv(c.uLine, t.lineColor),
                    a.useProgram(o),
                    a.uniform3fv(d.uGlow, t.glowColor),
                    a.enableVertexAttribArray(0),
                    a.clearColor(0, 0, 0, 0),
                    a.blendFunc(a.ONE, a.ONE));
                  let x = 1;
                  return {
                    resize(n, i) {
                      x = Math.min(window.devicePixelRatio || 1, t.maxDpr);
                      let s = Math.max(2, Math.round(n * x)),
                        r = Math.max(2, Math.round(i * x));
                      (e.width !== s || e.height !== r) &&
                        ((e.width = s), (e.height = r), a.viewport(0, 0, s, r));
                    },
                    setLayer(e, t) {
                      (a.activeTexture(a.TEXTURE0 + e),
                        a.bindTexture(a.TEXTURE_2D, f[e]),
                        a.texImage2D(
                          a.TEXTURE_2D,
                          0,
                          a.RGBA,
                          a.RGBA,
                          a.UNSIGNED_BYTE,
                          t,
                        ));
                    },
                    render(n) {
                      (a.clear(a.COLOR_BUFFER_BIT),
                        a.disable(a.BLEND),
                        a.colorMask(!0, !0, !0, !0),
                        a.useProgram(l),
                        a.bindBuffer(a.ARRAY_BUFFER, h),
                        a.vertexAttribPointer(0, 2, a.FLOAT, !1, 0, 0),
                        a.uniform2f(c.uResolution, e.width, e.height),
                        a.uniform2f(c.uOrigin, n.origin[0], n.origin[1]),
                        a.uniform1f(c.uProgress, n.progress),
                        a.uniform1f(c.uTime, n.time),
                        a.uniform1f(c.uRadius, n.radius),
                        a.uniform1f(c.uFilter, n.filter),
                        a.uniform1f(c.uBloom, n.bloom * t.bloom),
                        a.uniform1f(c.uGain, n.gain),
                        a.uniform1f(c.uFlare, n.flare),
                        a.uniform1f(c.uShock, n.shock),
                        a.uniform1f(c.uDone, +!!n.done),
                        a.uniform1f(c.uPx, x),
                        a.uniform4fv(c.uRectA0, n.rects[0]),
                        a.uniform4fv(c.uRectA1, n.rects[1]),
                        a.drawArrays(a.TRIANGLE_STRIP, 0, 4),
                        n.particles > 0.004 &&
                          (a.enable(a.BLEND),
                          a.useProgram(o),
                          a.bindBuffer(a.ARRAY_BUFFER, p),
                          a.vertexAttribPointer(0, 4, a.FLOAT, !1, 0, 0),
                          a.uniform2f(d.uResolution, e.width, e.height),
                          a.uniform2f(d.uOrigin, n.origin[0], n.origin[1]),
                          a.uniform1f(d.uSpread, n.spread),
                          a.uniform1f(d.uTime, n.time),
                          a.uniform1f(d.uPx, x),
                          a.uniform1f(d.uAlpha, n.particles),
                          a.drawArrays(a.POINTS, 0, u)));
                    },
                    dispose() {
                      (f.forEach((e) => a.deleteTexture(e)),
                        a.deleteBuffer(h),
                        a.deleteBuffer(p),
                        a.deleteProgram(l),
                        a.deleteProgram(o));
                    },
                  };
                } catch (e) {
                  return null;
                }
              })(f, x, a.mobile))
            ) {
              i.dataset.fallback = "";
              return;
            }
            b.forEach((e, t) => {
              let n = () => {
                if (e.naturalWidth)
                  try {
                    null == s || s.setLayer(t, e);
                  } catch (e) {}
              };
              (n(),
                e.addEventListener("load", n),
                j.push(() => e.removeEventListener("load", n)));
            });
            let e = (e) => {
              (e.preventDefault(), (s = null), (i.dataset.fallback = ""));
            };
            (f.addEventListener("webglcontextlost", e),
              j.push(() => f.removeEventListener("webglcontextlost", e)),
              y());
          },
          N = (e, t) => {
            if (!e) return l;
            let n = e.getBoundingClientRect();
            return n.width && n.height
              ? [
                  (n.left - t.left) / t.width,
                  (n.top - t.top) / t.height,
                  n.width / t.width,
                  n.height / t.height,
                ]
              : l;
          },
          A = !1,
          E = (e) => {
            let t = W.progress();
            if (s) {
              let n = i.getBoundingClientRect(),
                a = 0.55 + 0.25 * Math.sin(2.6 * e) + 0.12 * Math.sin(7.3 * e);
              s.render({
                progress: t,
                time: e,
                origin: w,
                radius: g.radius,
                filter: g.filter,
                bloom: 0.035 * g.hint + g.bloom,
                gain: g.hint * a * (1 - g.bloom) + 1.7 * g.gain,
                flare: g.flare,
                shock: g.burst / 0.12,
                done: t >= 1,
                spread: g.burst + g.follow,
                particles: g.parts,
                rects: [N(b[0], n), N(b[1], n)],
              });
            }
            !U.isActive && (t <= 0 || t >= 1) && S();
          },
          C = () => {
            A || (k(), (A = !0), h.ticker.add(E));
          },
          S = () => {
            A && ((A = !1), h.ticker.remove(E));
          },
          M = "",
          R = () => {
            let e = W.progress(),
              t = e <= 0 ? "before" : e >= 1 ? "after" : "on";
            (t !== M &&
              ((M = t), (m.dataset.portal = t), p && (p.dataset.portal = t)),
              m.style.setProperty("--pa-push", g.push.toFixed(4)),
              m.style.setProperty("--pa-fall", g.fall.toFixed(4)),
              i.style.setProperty("--pa-r", g.radius.toFixed(4)),
              p &&
                (p.style.setProperty("--pb-in", g.rise.toFixed(4)),
                p.style.setProperty("--pb-fill", g.fill.toFixed(4)),
                p.style.setProperty("--pb-settle", g.settle.toFixed(4))));
          },
          [T, P, F, B] = x.phases,
          L = x.duration,
          z = P - T,
          I = F - P,
          D = (e, t, n) => W.to(g, { ...n, duration: (t - e) * L }, e * L),
          O = (e) =>
            Math.round(
              ((parseFloat(getComputedStyle(m).getPropertyValue(e)) || 0) /
                100) *
                i.offsetHeight,
            ),
          _ = () => "bottom-=".concat(O("--pt") + O("--pe"), " bottom"),
          W = h.timeline({
            defaults: { ease: "none" },
            onUpdate: R,
            scrollTrigger: {
              trigger: m,
              start: _,
              end: () => "bottom-=".concat(O("--pe"), " bottom"),
              scrub: x.scrub,
              invalidateOnRefresh: !0,
              onRefresh: () => {
                (y(), R());
              },
            },
          }),
          U = u.create({
            trigger: m,
            start: _,
            end: "bottom top",
            onToggle: (e) => e.isActive && C(),
            onRefresh: (e) => e.isActive && C(),
          });
        (D(0, T, { hint: 1, ease: "sine.inOut" }),
          D(T, T + 0.68 * z, { bloom: 1, gain: 1, ease: "power1.in" }),
          D(T + 0.68 * z, P + 0.04, { gain: 0, ease: "power2.out" }),
          D(T + 0.6 * z, T + 0.8 * z, { parts: 1 }),
          D(T + 0.6 * z, P + 0.05, { burst: 0.12, ease: "power3.out" }),
          D(P, F, { radius: x.radius, ease: "power2.inOut" }),
          D(P + 0.01, F + 0.03, { follow: 0.72, ease: "power2.inOut" }),
          D(P, F + 0.08, { push: 1, ease: "sine.inOut" }),
          D(P, P + 0.85 * I, { fall: 1, ease: "power2.in" }),
          D(P + 0.3 * I, P + 0.7 * I, { flare: 1, ease: "sine.inOut" }),
          D(P + 0.08 * I, F, { rise: 1, ease: "power2.inOut" }),
          D(P + 0.55 * I, F + 0.08, { filter: 0, ease: "sine.inOut" }),
          D(F + 0.02, B, { parts: 0.7, ease: "sine.inOut" }),
          D(F + 0.03, B, { fill: 1, ease: "power2.out" }),
          D(B, 1, { settle: 1, ease: "power2.out" }),
          D(B, 1, { flare: 0, ease: "sine.inOut" }),
          R());
        let H = u.create({
            trigger: m,
            start: "top bottom",
            once: !0,
            onEnter: k,
          }),
          q = new ResizeObserver(y);
        return (
          q.observe(i),
          () => {
            var e;
            for (let t of (S(),
            q.disconnect(),
            H.kill(),
            U.kill(),
            null == (e = W.scrollTrigger) || e.kill(),
            W.kill(),
            j.forEach((e) => e()),
            null == s || s.dispose(),
            delete i.dataset.fallback,
            delete m.dataset.portal,
            ["--pa-push", "--pa-fall"]))
              m.style.removeProperty(t);
            if (p)
              for (let e of (delete p.dataset.portal,
              ["--pb-in", "--pb-fill", "--pb-settle", "--pb-ox", "--pb-oy"]))
                p.style.removeProperty(e);
          }
        );
      },
      [t, n, o, c],
    ),
    (
      <div ref={h} aria-hidden className="portal">
        <canvas />
      </div>
    )
  );
}
