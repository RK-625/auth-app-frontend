import React, { useEffect, useRef } from "react";
import { useTheme } from "@/components/theme-provider";

export function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    // Observer to detect theme class change dynamically if system theme changes
    const observer = new MutationObserver(() => {
      // Forcing a subtle background re-paint logic could go here
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    const getColors = () => {
      const isDark = document.documentElement.classList.contains("dark");
      if (isDark) {
        // Neon Magenta, Deep Indigo, and Gold accents
        return ["#ec4899", "#8b5cf6", "#f59e0b", "#4c1d95", "#831843"];
      } else {
        // Orchid, Soft Indigo, and Burnished Amber
        return ["#d946ef", "#6366f1", "#d97706", "#818cf8", "#f472b6"];
      }
    };

    let animationFrameId: number;
    let particles: Particle[] = [];
    const maxParticles = 70;

    const updateCanvasSize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = parent.offsetWidth * dpr;
      canvas.height = parent.offsetHeight * dpr;
      canvas.style.width = parent.offsetWidth + "px";
      canvas.style.height = parent.offsetHeight + "px";
      context.scale(dpr, dpr);
    };

    const randomFromArray = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];
    const hexToRGBA = (hex: string, alpha: number) => {
      const trimHex = hex.replace("#", "");
      const r = parseInt(trimHex.substring(0, 2), 16);
      const g = parseInt(trimHex.substring(2, 4), 16);
      const b = parseInt(trimHex.substring(4, 6), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    class Particle {
      type: "bubble" | "line";
      x: number;
      y: number;
      vx: number;
      vy: number;
      alpha: number;
      hex: string;
      color: string;
      strokeWidth: number;
      diameter: number = 0;
      angle: number = 0;
      length: number = 0;
      rotateSpeed: number = 0;
      rotateClockwise: boolean = false;

      constructor() {
        this.type = Math.random() < 0.2 ? "line" : "bubble";
        const parent = canvas.parentElement;
        const width = parent ? parent.offsetWidth : window.innerWidth;
        const height = parent ? parent.offsetHeight : window.innerHeight;

        this.x = Math.round(Math.random() * width);
        this.y = Math.round(Math.random() * height);
        this.vx = (Math.random() < 0.5 ? -1 : 1) * (Math.random() * 0.4);
        this.vy = (Math.random() < 0.5 ? -1 : 1) * (Math.random() * 0.4);
        this.alpha = 0.1;
        this.hex = randomFromArray(getColors());
        this.color = hexToRGBA(this.hex, this.alpha);
        this.strokeWidth = Math.random() * (Math.random() > 0.5 ? 1 : 2);

        if (this.type === "bubble") {
          let d = 0;
          while (d < 2) d = Math.random() * 7 * 2;
          this.diameter = d;
        } else {
          this.angle = Math.atan2(this.y, this.x);
          this.length = randomFromArray([5, 7, 3, 10]);
          this.rotateSpeed = randomFromArray([10, 30, 60, 120]);
          this.rotateClockwise = Math.random() < 0.5;
        }
      }

      update() {
        if (this.alpha < 1) {
          this.alpha += 0.01;
          this.color = hexToRGBA(this.hex, this.alpha);
        }

        this.x += this.vx;
        this.y += this.vy;

        if (this.type === "line") {
          const angleStep = Math.PI / this.rotateSpeed;
          this.angle += this.rotateClockwise ? -Math.abs(angleStep) : Math.abs(angleStep);
        }

        const parent = canvas.parentElement;
        const width = parent ? parent.offsetWidth : window.innerWidth;
        const height = parent ? parent.offsetHeight : window.innerHeight;

        return !(this.x > width + 10 || this.x < -10 || this.y > height + 10 || this.y < -10);
      }

      draw() {
        if (!context) return;
        context.lineWidth = this.strokeWidth;
        context.strokeStyle = this.color;
        context.save();

        if (this.type === "line") {
          context.translate(this.x, this.y);
          context.rotate(this.angle);
          context.beginPath();
          context.moveTo(-this.length / 2, 0);
          context.lineTo(this.length / 2, 0);
        } else {
          context.beginPath();
          context.arc(this.x, this.y, this.diameter, 0, Math.PI * 2, false);
        }
        
        context.stroke();
        context.restore();
      }
    }

    const generate = () => {
      while (particles.length < maxParticles) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      if (particles.length < maxParticles - 5) generate();

      particles = particles.filter((p) => p.update());

      const parent = canvas.parentElement;
      const width = parent ? parent.offsetWidth : window.innerWidth;
      const height = parent ? parent.offsetHeight : window.innerHeight;

      context.clearRect(0, 0, width, height);
      particles.forEach((p) => p.draw());

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
  }, [theme]); // Re-initialize particles when theme toggles so they adapt perfectly

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-background transition-colors duration-500">
      <canvas ref={canvasRef} className="absolute inset-0" />
      {/* Modern Gradient Mask for depth */}
      <div className="absolute inset-0 bg-gradient-to-tr from-background via-background/80 to-transparent pointer-events-none" />
    </div>
  );
}
