import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, Battery, BatteryCharging, BatteryFull } from 'lucide-react';

interface SplashViewProps {
  onComplete: () => void;
}

export function SplashView({ onComplete }: SplashViewProps) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const sequence = async () => {
      // Start battery outline
      await new Promise(r => setTimeout(r, 300));
      setPhase(1);
      
      // Battery filling
      await new Promise(r => setTimeout(r, 600));
      setPhase(2);
      
      // Battery full
      await new Promise(r => setTimeout(r, 600));
      setPhase(3);

      // Burst to logo
      await new Promise(r => setTimeout(r, 400));
      setPhase(4);

      // Finish splash
      await new Promise(r => setTimeout(r, 2000));
      onComplete();
    };

    sequence();
  }, [onComplete]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-emerge-dark relative overflow-hidden">
      {/* Dynamic Background Grid */}
      <motion.div 
        className="absolute inset-0 opacity-10" 
        style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '50px 50px' }}
        animate={{ 
          backgroundPosition: phase >= 4 ? ['0px 0px', '50px 50px'] : '0px 0px',
        }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      />
      
      <div className="relative z-10 flex flex-col items-center justify-center h-64">
        <AnimatePresence mode="wait">
          {phase === 1 && (
            <motion.div
              key="battery-empty"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.2, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="text-gray-600"
            >
              <Battery className="w-24 h-24" strokeWidth={1} />
            </motion.div>
          )}

          {phase === 2 && (
            <motion.div
              key="battery-charging"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.2, opacity: 0 }}
              className="text-emerge-green"
            >
              <BatteryCharging className="w-24 h-24" strokeWidth={1.5} />
            </motion.div>
          )}

          {phase === 3 && (
            <motion.div
              key="battery-full"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1.2, opacity: 1, filter: "drop-shadow(0 0 20px #4ade80)" }}
              exit={{ scale: 2, opacity: 0, filter: "drop-shadow(0 0 50px #4ade80)" }}
              className="text-emerge-green"
            >
              <BatteryFull className="w-24 h-24" strokeWidth={2} />
            </motion.div>
          )}

          {phase >= 4 && (
            <motion.div
              key="logo"
              initial={{ scale: 0, rotate: -180, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="flex flex-col items-center"
            >
              <motion.div
                animate={{ 
                  boxShadow: ['0 0 20px rgba(74,222,128,0.2)', '0 0 80px rgba(74,222,128,0.6)', '0 0 20px rgba(74,222,128,0.2)']
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="w-32 h-32 rounded-3xl bg-gradient-to-br from-emerge-green to-emerald-700 flex items-center justify-center mb-8 relative"
              >
                <div className="absolute inset-0 bg-emerge-green/20 rounded-3xl animate-ping"></div>
                <Zap className="w-16 h-16 text-black fill-current relative z-10" />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ delay: 0.3, duration: 0.7 }}
                className="flex flex-col items-center gap-2"
              >
                <h1 className="text-5xl md:text-7xl font-display font-bold text-white tracking-tight flex items-center gap-3">
                  <motion.span
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                  >
                    Emerge
                  </motion.span>
                  <motion.span
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.7, duration: 0.5 }}
                    className="text-transparent bg-clip-text bg-gradient-to-r from-emerge-green to-emerald-400"
                  >
                    EV
                  </motion.span>
                </h1>
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2, duration: 0.5 }}
                  className="text-gray-400 tracking-widest uppercase text-sm font-medium"
                >
                  Power Anywhere
                </motion.p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
