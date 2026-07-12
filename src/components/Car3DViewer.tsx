
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { triggerHaptic } from '../utils/haptics';
import { useCarModels } from '../hooks/useCarModels';

interface Car3DViewerProps {
  carModel: string;
  isCharging?: boolean;
  portId?: string;
}

export function Car3DViewer({ carModel, isCharging = false, portId = 'ccs2' }: Car3DViewerProps) {
  const carModels = useCarModels();
  const [pluggedIn, setPluggedIn] = useState(false);
  const carData = carModels.find(c => c.id === carModel) || carModels[0];

  useEffect(() => {
    if (isCharging) {
      const timer = setTimeout(() => {
        setPluggedIn(true);
        triggerHaptic('medium');
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setPluggedIn(false);
    }
  }, [isCharging]);

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-transparent rounded-2xl p-4">
      {/* Glow background */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full blur-[100px] transition-colors duration-1000 ${isCharging ? 'bg-emerge-green/30' : 'bg-transparent'}`}></div>

      {/* 2D Container */}
      <div className="relative w-full h-full flex items-center justify-center z-10 max-w-sm rounded-xl overflow-hidden shadow-2xl border-2 border-white/10">
        <img 
          src={carData.image} 
          alt={carData.name} 
          className="w-full h-full object-cover" 
          referrerPolicy="no-referrer"
        />
        
        {/* Animated Charger Plug */}
        {isCharging && (
          <motion.div 
            initial={{ x: 150, y: 0, opacity: 0 }}
            animate={{ 
              x: pluggedIn ? 60 : 150, 
              y: 0,
              opacity: 1
            }}
            transition={{ type: "spring", stiffness: 50, damping: 10 }}
            className="absolute top-1/2 right-0 w-12 h-8 rounded-l-xl bg-gray-800 border-2 border-gray-600 flex items-center justify-start pl-2 shadow-2xl -mt-4 z-20"
          >
            {/* Charger tip (simplified) */}
            <div className="w-3 h-4 bg-gray-400 rounded-sm"></div>
            
            {/* Cable */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-32 h-2 bg-gray-900 origin-left transform translate-x-full"></div>
            
            {/* Port label */}
            <div className="absolute -top-6 left-0 text-[8px] text-emerge-green font-bold bg-black/80 px-1 py-0.5 rounded uppercase border border-emerge-green/30 whitespace-nowrap">
              {portId} CONNECTED
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
