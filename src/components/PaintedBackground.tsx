import { useEffect, useRef } from "react";
import * as THREE from "three";
import { getPaintDeep, getPaintTint, prefersReducedMotion } from "@/lib/paint-store";
import { PAINT_MAX_PIXEL_RATIO, shouldRenderPaintFrame } from "@/lib/paint-performance";

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uMouse;
  uniform vec2 uTrail;
  uniform float uSpeed;
  uniform vec2 uRes;
  uniform vec3 uTint;
  uniform vec3 uDeep;

  vec2 hash(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(dot(hash(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0)),
          dot(hash(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
      mix(dot(hash(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)),
          dot(hash(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x),
      u.y);
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 4; i++) {
      v += a * noise(p);
      p *= 2.03;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = vUv;
    float aspect = uRes.x / uRes.y;
    vec2 st = uv * vec2(aspect, 1.0);

    // 光标扰动：颜料被指腹抹开，拖尾留下更湿的痕迹
    vec2 m = uMouse * vec2(aspect, 1.0);
    vec2 tr = uTrail * vec2(aspect, 1.0);
    float d = distance(st, m);
    float dTrail = distance(st, tr);
    float pull = exp(-d * 2.35) * (0.68 + uSpeed * 1.45);
    float smear = exp(-dTrail * 1.65) * 0.34;
    vec2 delta = st - m;
    vec2 tangent = vec2(-delta.y, delta.x);
    vec2 push = normalize(delta + 1e-4) * pull * 0.15 + tangent * pull * 0.2;

    // 两层颜料：底层缓慢流动的湿颜料，上层薄涂
    vec2 q = st * 1.35 + vec2(uTime * 0.01, uTime * -0.007) + push;
    q += vec2(fbm(q + 3.1), fbm(q + 7.7)) * (0.76 + pull * 0.48 + smear);

    float base = fbm(q * 1.15) * 0.5 + 0.5;
    float glaze = fbm(q * 2.6 + vec2(uTime * 0.014, 0.0)) * 0.5 + 0.5;
    float paint = mix(base, glaze, 0.26);

    // 刷痕与颜料边缘的沉积（wet edge）
    float streak = fbm(vec2(st.x * 4.0 + paint * 1.4, st.y * 26.0)) * 0.16;
    float edge = smoothstep(0.46, 0.5, paint) - smoothstep(0.5, 0.56, paint);

    float v = clamp(paint + streak + pull * 0.17 + smear * 0.1, 0.0, 1.0);
    v = smoothstep(0.12, 0.88, v);

    vec3 col = mix(uDeep, uTint, v);
    col = mix(col, uDeep * 0.86, edge * 0.35);          // 颜料堆积的深边
    float cursorHalo = exp(-d * 2.0);
    float cursorCore = exp(-d * 6.0);
    col = mix(col, uTint * 1.24, cursorHalo * 0.2);      // 宽而柔和的流动光带
    col = mix(col, uDeep * 1.06, cursorCore * 0.28);     // 深色核心让跟随位置清楚可见
    col = mix(col, uDeep * 0.78, clamp(smear * 0.24, 0.0, 0.12)); // 拖尾留下湿痕

    // 边缘压暗，像纸的四角
    float vig = smoothstep(1.3, 0.2, distance(uv, vec2(0.5)));
    col *= mix(0.84, 1.0, vig);

    // 颗粒
    float g = fract(sin(dot(uv * uRes, vec2(12.9898, 78.233))) * 43758.5453);
    col += (g - 0.5) * 0.035;

    gl_FragColor = vec4(col, 1.0);
  }
`;

export default function PaintedBackground() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const reduced = prefersReducedMotion();
    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, PAINT_MAX_PIXEL_RATIO));
    renderer.setSize(window.innerWidth, window.innerHeight);
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const t0 = getPaintTint();
    const d0 = getPaintDeep();
    const uniforms = {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uTrail: { value: new THREE.Vector2(0.5, 0.5) },
      uSpeed: { value: 0 },
      uRes: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      uTint: { value: new THREE.Vector3(...t0) },
      uDeep: { value: new THREE.Vector3(...d0) },
    };

    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      new THREE.ShaderMaterial({ vertexShader, fragmentShader, uniforms }),
    );
    scene.add(mesh);

    const target = new THREE.Vector2(0.5, 0.5);
    const pointer = new THREE.Vector2(0.5, 0.5);
    let speed = 0;

    const onPointer = (e: PointerEvent) => {
      const x = e.clientX / window.innerWidth;
      const y = 1 - e.clientY / window.innerHeight;
      pointer.set(x, y);
      speed = Math.min(target.distanceTo(pointer) * 4.0, 0.8);
      target.set(x, y);
    };
    const onResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      uniforms.uRes.value.set(window.innerWidth, window.innerHeight);
      if (reduced) renderer.render(scene, camera);
    };
    if (!reduced) window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("resize", onResize);

    let raf = 0;
    let lastFrame = 0;
    let visible = !document.hidden;
    let scrolling = false;
    let scrollTimer: number | undefined;
    const timer = new THREE.Timer();
    timer.connect(document);
    const tintVec = new THREE.Vector3();
    const deepVec = new THREE.Vector3();

    const tick = (now: number) => {
      raf = 0;
      if (!shouldRenderPaintFrame(lastFrame, now, visible, reduced, scrolling)) {
        if (visible && !reduced) raf = requestAnimationFrame(tick);
        return;
      }
      lastFrame = now;
      timer.update(now);
      uniforms.uTime.value = timer.getElapsed();

      uniforms.uMouse.value.lerp(target, 0.12);
      uniforms.uTrail.value.lerp(uniforms.uMouse.value, 0.035);
      speed *= 0.86;
      uniforms.uSpeed.value += (speed - uniforms.uSpeed.value) * 0.14;

      const t = getPaintTint();
      const dp = getPaintDeep();
      uniforms.uTint.value.lerp(tintVec.set(t[0], t[1], t[2]), 0.035);
      uniforms.uDeep.value.lerp(deepVec.set(dp[0], dp[1], dp[2]), 0.035);

      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };

    const onVisibility = () => {
      visible = !document.hidden;
      if (!visible && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      } else if (visible && !reduced && !raf) {
        lastFrame = 0;
        raf = requestAnimationFrame(tick);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    const onScroll = () => {
      scrolling = true;
      window.clearTimeout(scrollTimer);
      scrollTimer = window.setTimeout(() => {
        scrolling = false;
        lastFrame = 0;
      }, 120);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    if (reduced) renderer.render(scene, camera);
    else raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
      window.clearTimeout(scrollTimer);
      mesh.geometry.dispose();
      (mesh.material as THREE.Material).dispose();
      timer.dispose();
      renderer.dispose();
      host.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={hostRef} aria-hidden className="fixed inset-0 -z-10" />;
}
