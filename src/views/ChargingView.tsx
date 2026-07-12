import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Shield, BatteryCharging, Zap, ChevronLeft } from 'lucide-react';
import { TiltCard } from '../components/ui/TiltCard';
import { EnergyChart } from '../components/ui/EnergyChart';
import { CAR_MODELS } from '../data/cars';
import { Car3DViewer } from '../components/Car3DViewer';

interface ChargingViewProps {
  energyRequested: number | 'auto';
  carModel: string;
  portId?: string;
  onComplete: () => void;
  onBack: () => void;
}

import { triggerHaptic } from '../utils/haptics';

export function ChargingView({ energyRequested, carModel, portId, onComplete, onBack }: ChargingViewProps) {
  const [progress, setProgress] = useState(0);
  const targetEnergy = energyRequested === 'auto' ? 21.6 : energyRequested;
  const selectedCarObj = CAR_MODELS.find(c => c.id === carModel) || CAR_MODELS[0];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          triggerHaptic('success');
          setTimeout(onComplete, 2000);
          return 100;
        }
        return p + 0.2;
      });
    }, 30);
    return () => clearInterval(interval);
  }, [onComplete]);

  const delivered = ((progress / 100) * targetEnergy).toFixed(1);
  const modules = [1, 2, 3, 4];

  return (
    <div className="w-full h-full flex flex-col pt-20 lg:pt-24 px-6 md:px-12 max-w-[1600px] mx-auto overflow-y-auto hide-scrollbar relative">
      <button 
        onClick={onBack}
        className="absolute top-8 left-6 w-12 h-12 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center transition-colors border border-white/5 z-50"
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>

      <div className="text-center mb-12 lg:mb-20 mt-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerge-green/10 border border-emerge-green/20 mb-6">
          <BatteryCharging className="w-8 h-8 text-emerge-green animate-pulse" />
        </div>
        <h2 className="font-display text-4xl lg:text-6xl font-bold mb-4">Charging in Progress</h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">Transferring power to your vehicle. Please do not disconnect the cable during the active session.</p>
      </div>

      <div className="flex flex-col lg:flex-row items-center justify-center gap-16 lg:gap-40 flex-1 pb-20 w-full">
        
        {/* Car Graphic */}
        <div className="relative w-full max-w-sm md:w-80 h-[400px] md:h-[500px] flex flex-col items-center justify-center flex-shrink-0 mx-auto">
          <div className="w-full h-64 mb-8 relative">
            <Car3DViewer carModel={carModel} isCharging={true} portId={portId} />
          </div>
          
          <div className="relative z-20 flex flex-col items-center">
            <span className="font-display text-6xl font-bold text-white drop-shadow-lg">
              {Math.round(progress)}%
            </span>
            <span className="text-sm font-medium text-gray-400 mt-4 tracking-widest uppercase text-center px-4">
              Charging <br/> <span className="text-white font-bold">{selectedCarObj?.name || 'Your Vehicle'}</span>
            </span>
          </div>
        </div>

        {/* Live Metrics */}
        <TiltCard className="w-full max-w-xl bg-emerge-surface/50 backdrop-blur-2xl border border-white/10 rounded-[3rem] p-12 shadow-2xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerge-green/10 text-emerge-green text-sm font-medium mb-8 border border-emerge-green/20">
               <Zap className="w-5 h-5" /> Power Delivery Active
            </div>
            <p className="text-2xl text-emerge-green">{delivered} <span className="text-gray-400 text-lg">/ {targetEnergy} kWh delivered</span></p>
          </div>

          <EnergyChart progress={progress} />

          <div className="grid grid-cols-3 gap-6 mt-8">
             <div className="bg-emerge-dark rounded-3xl p-6 text-center border border-white/5">
               <p className="text-sm text-gray-500 mb-2 uppercase tracking-wider font-medium">Voltage</p>
               <p className="font-display text-3xl font-bold text-white">350<span className="text-lg text-gray-400">V</span></p>
             </div>
             <div className="bg-emerge-dark rounded-3xl p-6 text-center border border-white/5">
               <p className="text-sm text-gray-500 mb-2 uppercase tracking-wider font-medium">Current</p>
               <p className="font-display text-3xl font-bold text-white">48<span className="text-lg text-gray-400">A</span></p>
             </div>
             <div className="bg-emerge-green/10 rounded-3xl p-6 text-center border border-emerge-green/20 shadow-[inset_0_0_30px_rgba(74,222,128,0.1)]">
               <p className="text-sm text-emerge-green/80 mb-2 uppercase tracking-wider font-medium">Power</p>
               <p className="font-display text-3xl font-bold text-emerge-green">16.8<span className="text-lg">kW</span></p>
             </div>
          </div>
        </TiltCard>

      </div>
    </div>
  );
}
