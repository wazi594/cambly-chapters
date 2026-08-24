import { useEffect, useRef } from "react";
import * as THREE from "three";
import { getPaintTint, prefersReducedMotion } from "@/lib/paint-store";

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
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p *= 2.02;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = vUv;
    vec2 st = uv * vec2(uRes.x / uRes.y, 1.0);

    // 光标扰动：颜料被手指抹开的感觉
    vec2 m = uMouse * vec2(uRes.x / uRes.y, 1.0);
    float d = distance(st, m);
    float pull = exp(-d * 2.6) * 0.55;

    vec2 q = st * 1.6 + vec2(uTime * 0.018, uTime * -0.012);
    q += vec2(fbm(q + 3.1), fbm(q + 7.7)) * (0.55 + pull);

    float paint = fbm(q * 1.25);
    paint = paint * 0.5 + 0.5;

    // 笔刷条纹，模拟刷痕
    float streak = fbm(vec2(st.x * 3.0, st.y * 22.0 + paint * 2.0)) * 0.08;

    float v = clamp(paint + streak + pull * 0.18, 0.0, 1.0);
    vec3 col = mix(uDeep, uTint, smoothstep(0.05, 0.78, v));

    // 边缘压暗，像纸的四角
    float vig = smoothstep(1.25, 0.25, distance(uv, vec2(0.5)));
    col *= mix(0.9, 1.0, vig);

    // 颗粒
    float g = fract(sin(dot(uv * uRes, vec2(12.9898, 78.233))) * 43758.5453);
    col += (g - 0.5) * 0.028;

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
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
    renderer.setSize(window.innerWidth, window.innerHeight);
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const uniforms = {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uRes: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      uTint: { value: new THREE.Vector3(...getPaintTint()) },
      uDeep: { value: new THREE.Vector3(0.76, 0.71, 0.62) },
    };

    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      new THREE.ShaderMaterial({ vertexShader, fragmentShader, uniforms }),
    );
    scene.add(mesh);

    const target = new THREE.Vector2(0.5, 0.5);
    const onPointer = (e: PointerEvent) => {
      target.set(e.clientX / window.innerWidth, 1 - e.clientY / window.innerHeight);
    };
    const onResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      uniforms.uRes.value.set(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("resize", onResize);

    let raf = 0;
    const clock = new THREE.Clock();
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!reduced) uniforms.uTime.value = clock.getElapsedTime();
      uniforms.uMouse.value.lerp(target, reduced ? 1 : 0.045);
      const t = getPaintTint();
      uniforms.uTint.value.lerp(new THREE.Vector3(t[0], t[1], t[2]), 0.03);
      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("resize", onResize);
      mesh.geometry.dispose();
      (mesh.material as THREE.Material).dispose();
      renderer.dispose();
      host.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={hostRef} aria-hidden className="fixed inset-0 -z-10" />;
}
