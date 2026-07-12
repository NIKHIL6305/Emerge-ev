import { useState, useRef, useEffect } from 'react';

import { triggerHaptic } from '../utils/haptics';

export const PORTS = [
  { id: 'ccs2', name: 'CCS2', type: 'ccs2' },
  { id: 'chademo', name: 'CHAdeMO', type: 'chademo' },
  { id: 'type2', name: 'Type 2', type: 'type2' },
];

export function PortViewer3D({ onSelectPort, selectedPortId }: { onSelectPort?: (id: string) => void, selectedPortId?: string }) {
  const defaultPort = PORTS.find(p => p.id === selectedPortId) || PORTS[0];
  const [selectedPort, setSelectedPort] = useState(defaultPort);
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const currentRotation = useRef(0);

  useEffect(() => {
    if (selectedPortId) {
      const p = PORTS.find(p => p.id === selectedPortId);
      if (p) setSelectedPort(p);
    }
  }, [selectedPortId]);

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    startX.current = e.clientX;
    currentRotation.current = rotation;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - startX.current;
    setRotation(currentRotation.current + deltaX * 0.5);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const handlePortChange = (port: typeof PORTS[0]) => {
    triggerHaptic('light');
    setSelectedPort(port);
    setRotation(0);
    if (onSelectPort) onSelectPort(port.id);
  }

  const renderPins = () => {
    if (selectedPort.id === 'ccs2') {
      return (
        <div className="flex flex-col items-center justify-center gap-1">
          {/* Top part (Type 2) */}
          <div className="w-16 h-16 rounded-full border-2 border-gray-600 flex items-center justify-center relative bg-black">
            <div className="absolute top-2 w-2 h-2 rounded-full bg-gray-400"></div>
            <div className="absolute top-4 left-3 w-2 h-2 rounded-full bg-gray-400"></div>
            <div className="absolute top-4 right-3 w-2 h-2 rounded-full bg-gray-400"></div>
            <div className="absolute bottom-4 left-3 w-2 h-2 rounded-full bg-gray-400"></div>
            <div className="absolute bottom-4 right-3 w-2 h-2 rounded-full bg-gray-400"></div>
            <div className="absolute bottom-2 w-2 h-2 rounded-full bg-gray-400"></div>
            <div className="absolute w-2 h-2 rounded-full bg-gray-400"></div>
          </div>
          {/* Bottom part (DC pins) */}
          <div className="w-20 h-10 rounded-[2rem] border-2 border-gray-600 flex items-center justify-center gap-4 bg-black">
            <div className="w-4 h-4 rounded-full bg-gray-400"></div>
            <div className="w-4 h-4 rounded-full bg-gray-400"></div>
          </div>
        </div>
      );
    } else if (selectedPort.id === 'type2') {
      return (
        <div className="w-20 h-20 rounded-full border-2 border-gray-600 flex items-center justify-center relative bg-black" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 80%, 75% 100%, 25% 100%, 0 80%)' }}>
            <div className="absolute top-3 w-2.5 h-2.5 rounded-full bg-gray-400"></div>
            <div className="absolute top-6 left-4 w-2.5 h-2.5 rounded-full bg-gray-400"></div>
            <div className="absolute top-6 right-4 w-2.5 h-2.5 rounded-full bg-gray-400"></div>
            <div className="absolute bottom-6 left-4 w-2.5 h-2.5 rounded-full bg-gray-400"></div>
            <div className="absolute bottom-6 right-4 w-2.5 h-2.5 rounded-full bg-gray-400"></div>
            <div className="absolute bottom-3 w-2.5 h-2.5 rounded-full bg-gray-400"></div>
            <div className="absolute w-2.5 h-2.5 rounded-full bg-gray-400"></div>
        </div>
      );
    } else if (selectedPort.id === 'chademo') {
      return (
        <div className="w-20 h-20 rounded-full border-2 border-gray-600 flex items-center justify-center relative bg-black">
            <div className="absolute top-3 w-3 h-3 rounded-full bg-gray-400"></div>
            <div className="absolute bottom-3 w-3 h-3 rounded-full bg-gray-400"></div>
            <div className="absolute left-3 w-3 h-3 rounded-full bg-gray-400"></div>
            <div className="absolute right-3 w-3 h-3 rounded-full bg-gray-400"></div>
            <div className="grid grid-cols-2 gap-1.5">
               <div className="w-1.5 h-1.5 rounded-full bg-gray-500"></div>
               <div className="w-1.5 h-1.5 rounded-full bg-gray-500"></div>
               <div className="w-1.5 h-1.5 rounded-full bg-gray-500"></div>
               <div className="w-1.5 h-1.5 rounded-full bg-gray-500"></div>
            </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-black/30 border border-white/10 rounded-3xl p-6 mb-8 overflow-hidden select-none">
      <h3 className="text-lg font-bold text-white mb-4 flex items-center justify-between">
        <span className="flex items-center gap-2">🔌 Select Port</span>
        <span className="text-xs text-emerge-green bg-emerge-green/10 px-2 py-1 rounded-full border border-emerge-green/20">360° Drag</span>
      </h3>

      <div className="flex gap-2 mb-6">
        {PORTS.map(port => (
          <button
            key={port.id}
            onClick={() => handlePortChange(port)}
            className={`flex-1 py-2 px-3 rounded-xl text-sm font-medium transition-colors ${
              selectedPort.id === port.id 
                ? 'bg-emerge-green text-black' 
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            {port.name}
          </button>
        ))}
      </div>

      <div 
        className="relative h-48 w-full cursor-grab active:cursor-grabbing flex items-center justify-center rounded-2xl bg-emerge-surface border border-white/5 overflow-hidden"
        style={{ perspective: '1000px' }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {/* Pseudo 3D Effect */}
        <div 
          className="absolute inset-0 flex items-center justify-center transition-transform duration-75"
          style={{ transform: `rotateY(${rotation}deg)`, transformStyle: 'preserve-3d' }}
        >
          {/* Front */}
          <div className="w-32 h-32 rounded-full border-[12px] border-gray-300 bg-gray-800 flex flex-col items-center justify-center relative shadow-[inset_0_0_20px_rgba(0,0,0,1)] z-10" style={{ transform: 'translateZ(20px)' }}>
            <div className="absolute inset-0 flex items-center justify-center">
              {renderPins()}
            </div>
          </div>
          {/* Handle / Body extension */}
          <div className="absolute w-32 h-20 bg-gray-300 rounded-lg shadow-xl" style={{ transform: 'translateZ(-10px) translateY(40px) rotateX(90deg)' }}></div>
          {/* Back body */}
          <div className="absolute w-32 h-32 rounded-full border-8 border-gray-700 bg-gray-800 flex flex-col items-center justify-center" style={{ transform: 'translateZ(-20px)' }}></div>
          
          {/* Sides using multiple layered rings to fake 3D depth */}
          {[...Array(20)].map((_, i) => (
             <div key={i} className="absolute w-32 h-32 rounded-full border-[10px] border-gray-400/80" style={{ transform: `translateZ(${20 - i*2}px)` }}></div>
          ))}
          
          {/* Cable stub */}
          <div className="absolute w-8 h-40 bg-gray-900 rounded-full" style={{ transform: 'translateZ(-20px) translateY(60px) rotateX(90deg)' }}></div>
        </div>
        
        <div className="absolute bottom-2 left-0 right-0 text-center text-xs text-gray-500 font-medium">
          Drag to rotate
        </div>
      </div>
    </div>
  );
}
