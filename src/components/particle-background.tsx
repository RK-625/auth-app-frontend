import { useEffect, useRef } from "react";
import { useTheme } from "@/components/theme-context";

type ParticleType = "bubble" | "line";

type Particle = {
  type: ParticleType;
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  hex: string;
  color: string;
  strokeWidth: number;
  diameter: number;
  angle: number;
  length: number;
  rotateSpeed: number;
  rotateClockwise: boolean;
};

type Bounds = {
  width: number;
  height: number;
};

const randomFromArray = <T,>(arr: readonly T[]): T =>
  arr[Math.floor(Math.random() * arr.length)];

const hexToRGBA = (hex: string, alpha: number) => {
  const trimHex = hex.replace("#", "");
  const r = parseInt(trimHex.substring(0, 2), 16);
  const g = parseInt(trimHex.substring(2, 4), 16);
  const b = parseInt(trimHex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const getBounds = (canvas: HTMLCanvasElement): Bounds => {
  const parent = canvas.parentElement;
  return {
    width: parent ? parent.offsetWidth : window.innerWidth,
    height: parent ? parent.offsetHeight : window.innerHeight,
  };
};

const createParticle = (bounds: Bounds, colors: readonly string[]): Particle => {
  const type: ParticleType = Math.random() < 0.2 ? "line" : "bubble";
  const hex = randomFromArray(colors);

  const particle: Particle = {
    type,
    x: Math.round(Math.random() * bounds.width),
    y: Math.round(Math.random() * bounds.height),
    vx: (Math.random() < 0.5 ? -1 : 1) * (Math.random() * 0.4),
    vy: (Math.random() < 0.5 ? -1 : 1) * (Math.random() * 0.4),
    alpha: 0.1,
    hex,
    color: hexToRGBA(hex, 0.1),
    strokeWidth: Math.random() * (Math.random() > 0.5 ? 1 : 2),
    diameter: 0,
    angle: 0,
    length: 0,
    rotateSpeed: 0,
    rotateClockwise: false,
  };

  if (type === "bubble") {
    let diameter = 0;
    while (diameter < 2) diameter = Math.random() * 14;
    particle.diameter = diameter;
  } else {
    particle.angle = Math.atan2(particle.y, particle.x);
    particle.length = randomFromArray([5, 7, 3, 10] as const);
    particle.rotateSpeed = randomFromArray([10, 30, 60, 120] as const);
    particle.rotateClockwise = Math.random() < 0.5;
  }

  return particle;
};

const updateParticle = (particle: Particle, bounds: Bounds) => {
  if (particle.alpha < 1) {
    particle.alpha += 0.01;
    particle.color = hexToRGBA(particle.hex, particle.alpha);
  }

  particle.x += particle.vx;
  particle.y += particle.vy;

  if (particle.type === "line") {
    const angleStep = Math.PI / particle.rotateSpeed;
    particle.angle += particle.rotateClockwise
      ? -Math.abs(angleStep)
      : Math.abs(angleStep);
  }

  return !(
    particle.x > bounds.width + 10 ||
    particle.x < -10 ||
    particle.y > bounds.height + 10 ||
    particle.y < -10
  );
};

const drawParticle = (context: CanvasRenderingContext2D, particle: Particle) => {
  context.lineWidth = particle.strokeWidth;
  context.strokeStyle = particle.color;
  context.save();

  if (particle.type === "line") {
    context.translate(particle.x, particle.y);
    context.rotate(particle.angle);
    context.beginPath();
    context.moveTo(-particle.length / 2, 0);
    context.lineTo(particle.length / 2, 0);
  } else {
    context.beginPath();
    context.arc(particle.x, particle.y, particle.diameter, 0, Math.PI * 2, false);
  }

  context.stroke();
  context.restore();
};

export function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const observer = new MutationObserver(() => {});
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    const getColors = () => {
      const isDark = document.documentElement.classList.contains("dark");
      if (isDark) {
        return ["#ec4899", "#8b5cf6", "#f59e0b", "#4c1d95", "#831843"] as const;
      }

      return ["#d946ef", "#6366f1", "#d97706", "#818cf8", "#f472b6"] as const;
    };

    let animationFrameId = 0;
    let particles: Particle[] = [];
    const maxParticles = 70;

    const updateCanvasSize = () => {
      const bounds = getBounds(canvas);
      const dpr = window.devicePixelRatio || 1;
      canvas.width = bounds.width * dpr;
      canvas.height = bounds.height * dpr;
      canvas.style.width = `${bounds.width}px`;
      canvas.style.height = `${bounds.height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const generate = () => {
      const bounds = getBounds(canvas);
      const colors = getColors();

      while (particles.length < maxParticles) {
        particles.push(createParticle(bounds, colors));
      }
    };

    const animate = () => {
      if (particles.length < maxParticles - 5) {
        generate();
      }

      const bounds = getBounds(canvas);
      particles = particles.filter((particle) => updateParticle(particle, bounds));

      context.clearRect(0, 0, bounds.width, bounds.height);
      particles.forEach((particle) => drawParticle(context, particle));

      animationFrameId = requestAnimationFrame(animate);
    };

    updateCanvasSize();
    generate();
    animate();

    window.addEventListener("resize", updateCanvasSize);

    return () => {
      window.removeEventListener("resize", updateCanvasSize);
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
    };
  }, [theme]);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-background transition-colors duration-500">
      <canvas ref={canvasRef} className="absolute inset-0" />
      <div className="absolute inset-0 bg-gradient-to-tr from-background via-background/80 to-transparent pointer-events-none" />
    </div>
  );
}
