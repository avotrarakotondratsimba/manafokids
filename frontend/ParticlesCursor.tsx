// src/components/ParticlesCursor.tsx
import { useEffect, useRef } from "react";

export default function ParticlesCursor() {
  const mainCursorRef = useRef<HTMLDivElement | null>(null);
  const particlesRef = useRef<HTMLDivElement[]>([]);
  const particleCount = 20;

  type Position = { x: number; y: number };
  const positionsRef = useRef<Position[]>(
    Array(particleCount).fill({ x: 0, y: 0 })
  );

  const requestRef = useRef<number | null>(null);
  const mouseX = useRef(0);
  const mouseY = useRef(0);
  const hasMoved = useRef(false);

  useEffect(() => {
    // Crée les particules dynamiquement
    particlesRef.current = Array(particleCount)
      .fill(null)
      .map(() => {
        const el = document.createElement("div");
        el.className = "cursor-particle";
        el.style.opacity = "0";
        el.style.top = "0px";
        el.style.left = "0px";
        document.body.appendChild(el);
        return el;
      });

    const animate = () => {
      positionsRef.current = positionsRef.current.map((pos, i, arr) => {
        const target =
          i === 0 ? { x: mouseX.current, y: mouseY.current } : arr[i - 1];
        return {
          x: pos.x + (target.x - pos.x) * 0.25,
          y: pos.y + (target.y - pos.y) * 0.25,
        };
      });

      particlesRef.current.forEach((el, i) => {
        const pos = positionsRef.current[i];
        el.style.left = `${pos.x}px`;
        el.style.top = `${pos.y}px`;
        el.style.transform = `translate(-50%, -50%) scale(${
          1 - (i / particleCount) * 0.3
        })`;

        if (hasMoved.current) {
          el.style.opacity = `${1 - (i / particleCount) * 0.6}`;
        }
      });

      if (mainCursorRef.current) {
        mainCursorRef.current.style.left = `${mouseX.current}px`;
        mainCursorRef.current.style.top = `${mouseY.current}px`;
      }

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    const handleMouseMove = (e: MouseEvent) => {
      if (!hasMoved.current) {
        hasMoved.current = true;
        positionsRef.current = Array(particleCount).fill({
          x: e.clientX,
          y: e.clientY,
        });
      }
      mouseX.current = e.clientX;
      mouseY.current = e.clientY;
      positionsRef.current[0] = { x: e.clientX, y: e.clientY };
    };

    const addHover = () =>
      document.body.style.setProperty("--cursor-scale", "1.6");
    const removeHover = () =>
      document.body.style.setProperty("--cursor-scale", "1");

    const targets = document.querySelectorAll<HTMLElement>(
      "button, a, .hover-target"
    );
    targets.forEach((el) => {
      el.addEventListener("mouseenter", addHover);
      el.addEventListener("mouseleave", removeHover);
    });

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      window.removeEventListener("mousemove", handleMouseMove);
      targets.forEach((el) => {
        el.removeEventListener("mouseenter", addHover);
        el.removeEventListener("mouseleave", removeHover);
      });
      particlesRef.current.forEach((el) => document.body.removeChild(el));
    };
  }, []);

  return <div className="main-cursor" ref={mainCursorRef} />;
}
