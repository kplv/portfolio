'use client';

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import { converter, parse } from 'culori';
import { useReducedMotion } from 'motion/react';
import { useTheme } from 'next-themes';
import styles from './grid-shader.module.css';

const toRgb = converter('rgb');

/** Former DialKit defaults; grid shader is not wired to a dev panel. */
const GRID_SHADER_DIALS = {
  radius: 168,
  feather: 96,
  blendStrength: 0.95,
  lineWidth: 0.026,
  lineOpacity: 0,
  baseAlpha: 0,
  highlightAlpha: 1,
  discreteCells: true,
  squareCells: false,
  baseFill: '#121214',
  highlightFill: '#c74040',
  lineColor: '#2e8c61',
  gridCols: 16,
  gridRows: 16,
  wispStrength: 0.004,
  wispSpeed: 1,
  rainbowMix: 0.72,
  rainbowSpeed: 0.8,
  effectsInMaskOnly: true,
} as const;

const VERT = `#version 300 es
void main() {
  vec2 verts[3] = vec2[](vec2(-1.0, -1.0), vec2(3.0, -1.0), vec2(-1.0, 3.0));
  gl_Position = vec4(verts[gl_VertexID], 0.0, 1.0);
}
`;

const FRAG = `#version 300 es
precision highp float;

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_pointerActive;
uniform float u_radius;
uniform float u_softness;
uniform float u_blendStrength;
uniform vec3 u_baseFill;
uniform vec3 u_highlightFill;
uniform float u_baseAlpha;
uniform float u_highlightAlpha;
uniform vec3 u_lineColor;
uniform float u_cols;
uniform float u_rows;
uniform float u_lineWidthFrac;
uniform float u_lineOpacity;
uniform float u_discreteMask;
uniform float u_squareCells;
uniform float u_time;
uniform float u_idleMotion;
uniform vec3 u_accentRgb;
uniform float u_wispStrength;
uniform float u_wispSpeed;
uniform float u_rainbowMix;
uniform float u_rainbowSpeed;
uniform float u_rainbowMotion;
uniform float u_effectsInMaskOnly;

out vec4 fragColor;

vec2 gridUv(vec2 uv) {
  if (u_squareCells < 0.5) return uv;
  float m = min(u_resolution.x, u_resolution.y);
  vec2 fit = (gl_FragCoord.xy - 0.5 * u_resolution) / m;
  return fit * vec2(u_resolution.x / m, u_resolution.y / m) + 0.5;
}

float gridLine(vec2 guv) {
  vec2 cell = guv * vec2(u_cols, u_rows);
  vec2 f = fract(cell);
  float edge = min(min(f.x, 1.0 - f.x), min(f.y, 1.0 - f.y));
  return 1.0 - smoothstep(0.0, u_lineWidthFrac, edge);
}

void main() {
  vec2 frag = gl_FragCoord.xy;
  vec2 uv = frag / u_resolution;
  vec2 guv = gridUv(uv);

  float pxScale = 1.0 / max(min(u_resolution.x, u_resolution.y), 1.0);
  vec2 wisp = vec2(
    sin(u_time * u_wispSpeed * 2.2 + guv.x * 12.0 + guv.y * 3.1),
    cos(u_time * u_wispSpeed * 1.8 + guv.y * 11.0 + guv.x * 2.4)
  ) * pxScale * u_wispStrength * 48.0;
  vec2 guvW = guv + wisp;

  float dPixel = length(frag - u_mouse);
  float mSmooth = 1.0 - smoothstep(u_radius, u_radius + max(u_softness, 1.0), dPixel);

  vec2 cellId = floor(guvW * vec2(u_cols, u_rows));
  vec2 cellCenterUv = (cellId + 0.5) / vec2(u_cols, u_rows);
  vec2 cellCenterPix = cellCenterUv * u_resolution;
  float dCell = length(cellCenterPix - u_mouse);
  float mCell = 1.0 - smoothstep(u_radius, u_radius + max(u_softness, 1.0), dCell);

  float m = mix(mSmooth, mCell, u_discreteMask) * u_pointerActive;
  m = clamp(m * u_blendStrength, 0.0, 1.0);

  float fillAlpha = mix(u_baseAlpha, u_highlightAlpha, m);

  float idle = sin(u_time * 0.65 + guvW.x * 4.0 + guvW.y * 3.0) * 0.5 + 0.5;
  float idleW = (idle - 0.5) * 0.012 * u_idleMotion * clamp(fillAlpha, 0.0, 1.0);

  vec2 mouseUv = u_mouse / u_resolution;
  vec2 mouseCell = floor(mouseUv * vec2(u_cols, u_rows));
  float cellDist = length(vec2(cellId) - mouseCell);
  float nearCursor = exp(-cellDist * 0.55);

  float h0 = fract(sin(dot(cellId + 3.1, vec2(12.9898, 78.233))) * 43758.5453);
  float hueCell = fract(
    h0 * 0.71 + dot(cellId, vec2(0.13, 0.19)) + u_time * 0.055 * u_rainbowMotion * u_rainbowSpeed
  );
  vec3 vivid = 0.34 + 0.66 * cos(6.2831853 * (hueCell + vec3(0.0, 0.33, 0.67)));
  vec3 pastel = mix(vivid, vec3(1.0), 0.58);
  vec3 cellRgb = mix(pastel, vivid, nearCursor);
  float pulse = 0.5 + 0.5 * sin(u_time * u_rainbowSpeed * max(u_rainbowMotion, 0.001));
  vec3 cellPick = mix(cellRgb, u_accentRgb, 0.12 + 0.18 * (1.0 - pulse));

  float rm = clamp(u_rainbowMix * pulse * mix(1.0, m, u_effectsInMaskOnly), 0.0, 1.0);
  vec3 hiColor = mix(u_highlightFill, cellPick, rm);
  vec3 fillRgb = mix(u_baseFill, hiColor, m);
  fillRgb += vec3(idleW);

  float line = gridLine(guvW) * u_lineOpacity;
  vec3 lineRgb = u_lineColor;
  float lineA = line;

  float aOut = lineA + fillAlpha * (1.0 - lineA);
  if (aOut < 0.00001) {
    fragColor = vec4(0.0);
    return;
  }
  vec3 rgbOut = (lineRgb * lineA + fillRgb * fillAlpha * (1.0 - lineA)) / aOut;

  fragColor = vec4(rgbOut, aOut);
}
`;

function compileShader(gl: WebGL2RenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createProgram(gl: WebGL2RenderingContext, vertSrc: string, fragSrc: string) {
  const vs = compileShader(gl, gl.VERTEX_SHADER, vertSrc);
  const fs = compileShader(gl, gl.FRAGMENT_SHADER, fragSrc);
  if (!vs || !fs) return null;
  const program = gl.createProgram();
  if (!program) return null;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  gl.deleteShader(vs);
  gl.deleteShader(fs);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }
  return program;
}

function parseHexRgb(hex: string): [number, number, number] {
  const raw = hex.trim().replace('#', '');
  const expanded =
    raw.length === 3
      ? raw
          .split('')
          .map((c) => c + c)
          .join('')
      : raw.slice(0, 6);
  const n = Number.parseInt(expanded, 16);
  if (!Number.isFinite(n) || expanded.length !== 6) {
    return [0.12, 0.12, 0.12];
  }
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

const ACCENT_FALLBACK: [number, number, number] = [0.45, 0.72, 0.52];

function parseCssColorToRgb01(css: string): [number, number, number] {
  const parsed = parse(css.trim());
  if (!parsed) return ACCENT_FALLBACK;
  const rgb = toRgb(parsed);
  if (!rgb || rgb.mode !== 'rgb') return ACCENT_FALLBACK;
  const norm = (channel: number) => (channel > 1.0001 ? channel / 255 : channel);
  return [norm(rgb.r), norm(rgb.g), norm(rgb.b)];
}

export function GridShader() {
  const reduceMotion = useReducedMotion();
  const { resolvedTheme } = useTheme();
  const dials = GRID_SHADER_DIALS;

  const dialsRef = useRef(dials);
  const reduceRef = useRef(reduceMotion);

  useLayoutEffect(() => {
    dialsRef.current = dials;
  }, [dials]);

  useLayoutEffect(() => {
    reduceRef.current = reduceMotion;
  }, [reduceMotion]);

  useLayoutEffect(() => {
    const el = accentProbeRef.current;
    if (!el) return;
    accentRgbRef.current = parseCssColorToRgb01(getComputedStyle(el).color);
  }, [resolvedTheme]);

  const frameRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const accentProbeRef = useRef<HTMLSpanElement>(null);
  const accentRgbRef = useRef<[number, number, number]>(ACCENT_FALLBACK);
  const glRef = useRef<WebGL2RenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const uniformRef = useRef<Record<string, WebGLUniformLocation | null>>({});
  const rafRef = useRef<number>(0);
  const startRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0, y: 0, active: false });

  const [webglError, setWebglError] = useState<string | null>(null);

  const syncCanvasSize = useCallback(() => {
    const canvas = canvasRef.current;
    const frame = frameRef.current;
    if (!canvas || !frame) return;

    const rect = frame.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.max(1, Math.floor(rect.width * dpr));
    const h = Math.max(1, Math.floor(rect.height * dpr));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
  }, []);

  const drawFrame = useCallback(() => {
    const gl = glRef.current;
    const program = programRef.current;
    const u = uniformRef.current;
    const canvas = canvasRef.current;
    if (!gl || !program || !canvas) return;

    const d = dialsRef.current;
    const reduce = reduceRef.current;

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.useProgram(program);

    const [bf0, bf1, bf2] = parseHexRgb(String(d.baseFill));
    const [hf0, hf1, hf2] = parseHexRgb(String(d.highlightFill));
    const [lf0, lf1, lf2] = parseHexRgb(String(d.lineColor));
    const [ar, ag, ab] = accentRgbRef.current;

    const now = performance.now();
    if (!startRef.current) startRef.current = now;
    const t = (now - startRef.current) / 1000;

    gl.uniform2f(u.u_resolution!, canvas.width, canvas.height);
    gl.uniform2f(u.u_mouse!, mouseRef.current.x, mouseRef.current.y);
    gl.uniform1f(u.u_pointerActive!, mouseRef.current.active ? 1 : 0);
    gl.uniform1f(u.u_radius!, d.radius);
    gl.uniform1f(u.u_softness!, d.feather);
    gl.uniform1f(u.u_blendStrength!, d.blendStrength);
    gl.uniform3f(u.u_baseFill!, bf0, bf1, bf2);
    gl.uniform3f(u.u_highlightFill!, hf0, hf1, hf2);
    gl.uniform1f(u.u_baseAlpha!, d.baseAlpha);
    gl.uniform1f(u.u_highlightAlpha!, d.highlightAlpha);
    gl.uniform3f(u.u_lineColor!, lf0, lf1, lf2);
    gl.uniform1f(u.u_cols!, d.gridCols);
    gl.uniform1f(u.u_rows!, d.gridRows);
    gl.uniform1f(u.u_lineWidthFrac!, d.lineWidth);
    gl.uniform1f(u.u_lineOpacity!, d.lineOpacity);
    gl.uniform1f(u.u_discreteMask!, d.discreteCells ? 1 : 0);
    gl.uniform1f(u.u_squareCells!, d.squareCells ? 1 : 0);
    gl.uniform1f(u.u_time!, t);
    gl.uniform1f(u.u_idleMotion!, reduce ? 0 : 1);
    gl.uniform3f(u.u_accentRgb!, ar, ag, ab);
    gl.uniform1f(u.u_wispStrength!, reduce ? 0 : d.wispStrength);
    gl.uniform1f(u.u_wispSpeed!, d.wispSpeed);
    gl.uniform1f(u.u_rainbowMix!, d.rainbowMix);
    gl.uniform1f(u.u_rainbowSpeed!, d.rainbowSpeed);
    gl.uniform1f(u.u_rainbowMotion!, reduce ? 0 : 1);
    gl.uniform1f(u.u_effectsInMaskOnly!, d.effectsInMaskOnly ? 1 : 0);

    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const gl = canvas.getContext('webgl2', {
      alpha: true,
      premultipliedAlpha: false,
      antialias: false,
    });
    if (!gl) {
      queueMicrotask(() => setWebglError('WebGL2 is not available in this browser.'));
      return undefined;
    }

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const program = createProgram(gl, VERT, FRAG);
    if (!program) {
      queueMicrotask(() => setWebglError('Shader program failed to link.'));
      return undefined;
    }

    glRef.current = gl;
    programRef.current = program;
    uniformRef.current = {
      u_resolution: gl.getUniformLocation(program, 'u_resolution'),
      u_mouse: gl.getUniformLocation(program, 'u_mouse'),
      u_pointerActive: gl.getUniformLocation(program, 'u_pointerActive'),
      u_radius: gl.getUniformLocation(program, 'u_radius'),
      u_softness: gl.getUniformLocation(program, 'u_softness'),
      u_blendStrength: gl.getUniformLocation(program, 'u_blendStrength'),
      u_baseFill: gl.getUniformLocation(program, 'u_baseFill'),
      u_highlightFill: gl.getUniformLocation(program, 'u_highlightFill'),
      u_baseAlpha: gl.getUniformLocation(program, 'u_baseAlpha'),
      u_highlightAlpha: gl.getUniformLocation(program, 'u_highlightAlpha'),
      u_lineColor: gl.getUniformLocation(program, 'u_lineColor'),
      u_cols: gl.getUniformLocation(program, 'u_cols'),
      u_rows: gl.getUniformLocation(program, 'u_rows'),
      u_lineWidthFrac: gl.getUniformLocation(program, 'u_lineWidthFrac'),
      u_lineOpacity: gl.getUniformLocation(program, 'u_lineOpacity'),
      u_discreteMask: gl.getUniformLocation(program, 'u_discreteMask'),
      u_squareCells: gl.getUniformLocation(program, 'u_squareCells'),
      u_time: gl.getUniformLocation(program, 'u_time'),
      u_idleMotion: gl.getUniformLocation(program, 'u_idleMotion'),
      u_accentRgb: gl.getUniformLocation(program, 'u_accentRgb'),
      u_wispStrength: gl.getUniformLocation(program, 'u_wispStrength'),
      u_wispSpeed: gl.getUniformLocation(program, 'u_wispSpeed'),
      u_rainbowMix: gl.getUniformLocation(program, 'u_rainbowMix'),
      u_rainbowSpeed: gl.getUniformLocation(program, 'u_rainbowSpeed'),
      u_rainbowMotion: gl.getUniformLocation(program, 'u_rainbowMotion'),
      u_effectsInMaskOnly: gl.getUniformLocation(program, 'u_effectsInMaskOnly'),
    };

    const frame = frameRef.current;
    const ro = new ResizeObserver(() => {
      syncCanvasSize();
      drawFrame();
    });
    if (frame) ro.observe(frame);

    syncCanvasSize();
    drawFrame();

    const loop = () => {
      drawFrame();
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      gl.deleteProgram(program);
      glRef.current = null;
      programRef.current = null;
    };
  }, [drawFrame, syncCanvasSize]);

  const setPointerFromEvent = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    const frame = frameRef.current;
    const canvas = canvasRef.current;
    if (!frame || !canvas) return;

    const rect = frame.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / Math.max(rect.width, 1);
    const ny = (e.clientY - rect.top) / Math.max(rect.height, 1);
    const x = nx * canvas.width;
    const y = (1 - ny) * canvas.height;
    mouseRef.current = { x, y, active: true };
  }, []);

  const handlePointerMove = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      setPointerFromEvent(e);
    },
    [setPointerFromEvent],
  );

  const handlePointerDown = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      e.currentTarget.setPointerCapture(e.pointerId);
      setPointerFromEvent(e);
    },
    [setPointerFromEvent],
  );

  const handlePointerLeave = useCallback(() => {
    mouseRef.current = { ...mouseRef.current, active: false };
  }, []);

  return (
    <div
      ref={frameRef}
      className={styles.frame}
      onPointerMove={handlePointerMove}
      onPointerDown={handlePointerDown}
      onPointerLeave={handlePointerLeave}
    >
      <span
        ref={accentProbeRef}
        className={styles.accentProbe}
        aria-hidden
      />
      {webglError ? (
        <div style={{ padding: 16, fontSize: 14 }}>{webglError}</div>
      ) : (
        <canvas ref={canvasRef} className={styles.canvas} aria-label="Interactive grid shader" />
      )}
    </div>
  );
}
