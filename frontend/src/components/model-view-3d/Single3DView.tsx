import React, { Suspense, useState, useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment } from "@react-three/drei";

interface ModelProps {
  modelPath: string;
  scale: number;
}

type ModelPaths = {
  [key: string]: {
    path: string;
    defaultScale: number;
  };
};

function Model({ modelPath, scale }: ModelProps) {
  const { scene } = useGLTF(modelPath);
  return <primitive object={scene} scale={scale} />;
}

interface Single3DViewProps {
  id: string;
  onClose: () => void;
}

export default function Single3DView({ id, onClose }: Single3DViewProps) {
  const [scale, setScale] = useState(1);
  const controlsRef = useRef<any>(null);
  const [autoRotate, setAutoRotate] = useState(true);

  const modelPaths: ModelPaths = {
    "1": { path: "/models/ordi.glb", defaultScale: 2 },
    "2": { path: "/models/cpu.glb", defaultScale: 2 },
    "3": { path: "/models/microscope1.glb", defaultScale: 0.5 },
    "4": { path: "/models/clavier.glb", defaultScale: 1 },
    "5": { path: "/models/object5.glb", defaultScale: 1 },
    "6": { path: "/models/object6.glb", defaultScale: 1 },
  };

  const currentModel = id ? modelPaths[id] : null;
  const modelPath = currentModel?.path;
  const defaultScale = currentModel?.defaultScale || 1;

  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
    setScale(defaultScale);
  }, [id, defaultScale]);

  if (!modelPath) {
    return (
      <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
        <div className="bg-[var(--bg-user-modal)] p-6 rounded-lg shadow-xl border border-[var(--border)] max-w-md">
          <h1 className="text-xl font-bold text-[var(--text-color)] mb-3">
            Modèle non trouvé
          </h1>
          <button
            onClick={onClose}
            className="bg-[var(--accent)] text-white font-medium py-1.5 px-3 rounded-lg text-sm"
          >
            Fermer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
      <div className="relative bg-[var(--bg-user-modal)] rounded-lg overflow-hidden shadow-xl border border-[var(--border)] w-full max-w-4xl">
        {/* Bouton fermer */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-50 text-[var(--text-color)] hover:text-[var(--accent)] transition-colors"
          aria-label="Fermer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Vue 3D */}
        <div className="h-[60vh] w-full">
          <Canvas camera={{ position: [2, 2, 2], fov: 50 }}>
            <ambientLight intensity={0.7} />
            <spotLight position={[5, 5, 5]} intensity={0.8} />
            <Environment preset="city" />

            <Suspense fallback={null}>
              <Model modelPath={modelPath} scale={scale} />
            </Suspense>

            <OrbitControls
              ref={controlsRef}
              autoRotate={autoRotate}
              autoRotateSpeed={1.5}
              enableZoom={true}
              enableRotate={true}
            />
          </Canvas>
        </div>

        {/* Contrôles */}
        <div className="bg-[var(--bg-user-modal)] p-3 border-t border-[var(--border)]">
          <div className="flex flex-col space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm text-[var(--text-color)]">
                Taille: {scale.toFixed(1)}
              </label>
              <input
                type="range"
                min="0.1"
                max="3"
                step="0.1"
                value={scale}
                onChange={(e) => setScale(parseFloat(e.target.value))}
                className="w-32 h-1.5 bg-[var(--border)] rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="autoRotate"
                  checked={autoRotate}
                  onChange={() => setAutoRotate(!autoRotate)}
                  className="w-4 h-4 text-[var(--accent)] bg-[var(--bg-user-modal)] border-[var(--border)] rounded"
                />
                <label
                  htmlFor="autoRotate"
                  className="ml-2 text-sm text-[var(--text-color)]"
                >
                  Rotation auto
                </label>
              </div>

              <button
                onClick={() => setScale(defaultScale)}
                className="text-xs bg-[var(--accent)] hover:opacity-90 text-white py-1.5 px-3 rounded transition-opacity"
              >
                Taille défaut
              </button>

              <button
                onClick={() => controlsRef.current?.reset()}
                className="text-xs bg-[var(--accent)] hover:opacity-90 text-white py-1.5 px-3 rounded transition-opacity"
              >
                Réinitialiser
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
