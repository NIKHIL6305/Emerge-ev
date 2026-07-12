import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, MapPin, Zap, Navigation, Crosshair, Car, Battery, Clock, DollarSign, BatteryCharging } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { TiltCard } from '../components/ui/TiltCard';
import { EnergyOption } from '../types';
import { MapView } from '../components/MapView';
import { PortViewer3D, PORTS } from '../components/PortViewer3D';
import { useCarModels } from '../hooks/useCarModels';
import { CarDropdown } from '../components/CarDropdown';
import { Car3DViewer } from '../components/Car3DViewer';

import { triggerHaptic } from '../utils/haptics';

interface RequestViewProps {
  onBack: () => void;
  onContinue: (energy: number | 'auto', carModel: string, portId: string) => void;
}

const energyOptionsKWh: EnergyOption[] = [
  { id: '20', label: '20', value: 20, unit: 'kWh' },
  { id: '30', label: '30', value: 30, unit: 'kWh' },
  { id: '50', label: '50', value: 50, unit: 'kWh' },
  { id: 'full', label: 'Full', value: 'auto', unit: 'Charge' },
];

const energyOptionsPercent = [
  { id: '50', label: '50', value: 50, unit: '%' },
  { id: '80', label: '80', value: 80, unit: '%' },
  { id: '100', label: '100', value: 100, unit: '%' },
  { id: 'manual', label: 'Custom', value: 0, unit: '%' },
];

const COST_PER_KWH = 0.50; // $0.50 per kWh
const CHARGING_SPEED_KW = 50; // 50kW fast charger

export function RequestView({ onBack, onContinue }: RequestViewProps) {
  const [requestMode, setRequestMode] = useState<'kwh' | 'percent'>('kwh');
  const [selectedEnergyKwh, setSelectedEnergyKwh] = useState<string>('30');
  const [selectedPercent, setSelectedPercent] = useState<string>('80');
  const [customPercent, setCustomPercent] = useState<number>(60);
  const [customKwh, setCustomKwh] = useState<number>(40);
  
  const carModels = useCarModels();
  const [carModel, setCarModel] = useState<string>(carModels[0].id);
  const [batteryPercent, setBatteryPercent] = useState<number>(20);
  const [selectedPortId, setSelectedPortId] = useState<string>(PORTS[0].id);

  const estimatorData = useMemo(() => {
    const car = carModels.find(c => c.id === carModel) || carModels[0];
    let targetPercent = 80;
    let targetKwh = 0;

    if (requestMode === 'percent') {
      targetPercent = selectedPercent === 'manual' ? customPercent : parseInt(selectedPercent);
    } else {
      if (selectedEnergyKwh === 'full') {
        targetPercent = 100;
      } else {
        targetKwh = parseInt(selectedEnergyKwh);
      }
    }

    let kwhNeeded = 0;
    if (requestMode === 'percent' || selectedEnergyKwh === 'full') {
       if (batteryPercent >= targetPercent) return { cost: 0, timeMins: 0, kwhNeeded: 0 };
       const percentNeeded = targetPercent - batteryPercent;
       kwhNeeded = (car.capacity * percentNeeded) / 100;
    } else {
       kwhNeeded = targetKwh;
       // cap at 100% capacity
       const currentKwh = (car.capacity * batteryPercent) / 100;
       if (currentKwh + kwhNeeded > car.capacity) {
         kwhNeeded = car.capacity - currentKwh;
       }
    }

    const cost = kwhNeeded * COST_PER_KWH;
    const timeHours = kwhNeeded / CHARGING_SPEED_KW;
    const timeMins = Math.round(timeHours * 60);
    return { cost, timeMins, kwhNeeded };
  }, [carModel, batteryPercent, requestMode, selectedPercent, customPercent, selectedEnergyKwh]);

  const USER_BUDGET_LIMIT = 30; // Pre-defined budget limit in dollars

  const handleContinue = () => {
    if (estimatorData.cost > USER_BUDGET_LIMIT) {
      const proceed = window.confirm(`Warning: The estimated cost of ${estimatorData.cost.toFixed(2)} exceeds your pre-defined budget of ${USER_BUDGET_LIMIT}. Do you want to proceed?`);
      if (!proceed) return;
    }

    if (requestMode === 'kwh') {
      onContinue(selectedEnergyKwh === 'full' ? 'auto' : parseInt(selectedEnergyKwh), carModel, selectedPortId);
    } else {
      // In a real app, passing percentage implies calculating needed energy
      onContinue('auto', carModel, selectedPortId); 
    }
  };

  return (
    <div className="w-full h-full flex flex-col lg:flex-row p-6 md:p-8 pt-20 lg:pt-8 gap-6 max-w-[1800px] mx-auto relative lg:mt-10 overflow-y-auto hide-scrollbar">
      <button onClick={onBack} className="lg:hidden absolute top-4 left-6 z-50 p-3 rounded-full bg-emerge-surface border border-white/10">
        <ChevronLeft className="w-6 h-6" />
      </button>

      {/* Left Panel: Map & Location (Visual) */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex-[2] relative rounded-[2.5rem] overflow-hidden bg-emerge-surface border border-white/5 shadow-2xl min-h-[400px] lg:min-h-0 order-2 lg:order-1 z-0"
      >
        <MapView />

        {/* Map UI Elements Overlay */}
        <div className="absolute top-4 left-8 flex items-center gap-4 bg-emerge-dark/80 backdrop-blur-xl p-5 rounded-3xl border border-white/10 shadow-2xl hidden md:flex z-10 pointer-events-none">
          <div className="w-12 h-12 rounded-full bg-emerge-green/20 flex items-center justify-center flex-shrink-0 relative">
            <div className="absolute inset-0 bg-emerge-green/20 rounded-full blur-md animate-ping"></div>
            <Navigation className="w-6 h-6 text-emerge-green transform rotate-45" />
          </div>
          <div>
            <p className="text-xs text-emerge-green font-medium mb-1 uppercase tracking-wider">Current Location</p>
            <p className="text-xl font-medium text-white">Live Tracking Active</p>
          </div>
        </div>

        <button className="absolute bottom-8 right-8 p-5 rounded-full bg-emerge-dark/80 backdrop-blur-xl border border-white/10 hover:bg-emerge-surface transition-colors shadow-2xl hidden md:block z-10">
          <Crosshair className="w-6 h-6 text-emerge-green" />
        </button>
      </motion.div>

      {/* Right Panel: Controls */}
      <TiltCard 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex-1 flex flex-col bg-emerge-surface/80 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 p-6 lg:p-10 shadow-2xl order-1 lg:order-2 z-10 min-w-[320px] lg:min-w-[480px] overflow-y-auto hide-scrollbar"
      >
        <button onClick={onBack} className="hidden lg:flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 w-fit">
          <ChevronLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <div className="flex-1">
          <div className="flex items-start justify-between mb-8">
             <div>
                <h2 className="font-display text-4xl lg:text-5xl font-bold mb-3 leading-tight">Request <br/>Charging</h2>
                <p className="text-gray-400 text-base">Select required capacity or target battery percentage.</p>
             </div>
          </div>
          
          {/* Toggle Mode */}
          <div className="flex bg-black/40 p-1.5 rounded-2xl mb-8 border border-white/5">
             <button 
                onClick={() => setRequestMode('kwh')}
                className={`flex-1 py-3 rounded-xl font-medium text-sm transition-colors flex items-center justify-center gap-2 ${requestMode === 'kwh' ? 'bg-emerge-green text-black' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
             >
                <Zap className="w-4 h-4" /> Energy (kWh)
             </button>
             <button 
                onClick={() => setRequestMode('percent')}
                className={`flex-1 py-3 rounded-xl font-medium text-sm transition-colors flex items-center justify-center gap-2 ${requestMode === 'percent' ? 'bg-emerge-green text-black' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
             >
                <BatteryCharging className="w-4 h-4" /> Battery (%)
             </button>
          </div>
          
          {/* Selection Grid */}
          <div className="grid grid-cols-2 gap-3 lg:gap-4 mb-8">
            <AnimatePresence mode="wait">
               {requestMode === 'kwh' ? (
                  <motion.div key="kwh" initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-10}} className="col-span-2 grid grid-cols-2 gap-3 lg:gap-4">
                     {energyOptionsKWh.map((opt) => (
                        <button
                           key={opt.id}
                           onClick={() => {
                              triggerHaptic('light');
                              setSelectedEnergyKwh(opt.id);
                           }}
                           className={`relative overflow-hidden flex flex-col items-start p-5 lg:p-6 rounded-3xl border-2 transition-all duration-300 ${
                              selectedEnergyKwh === opt.id 
                              ? 'bg-emerge-green/10 border-emerge-green shadow-[0_0_30px_rgba(74,222,128,0.15)] scale-[1.02]' 
                              : 'bg-emerge-dark border-white/5 hover:border-white/20 hover:bg-white/5'
                           }`}
                        >
                           {selectedEnergyKwh === opt.id && <div className="absolute top-0 right-0 w-24 h-24 bg-emerge-green/20 blur-3xl rounded-full"></div>}
                           {opt.id === 'full' ? (
                              <>
                                 <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-emerge-green/20 flex items-center justify-center mb-4 lg:mb-6">
                                    <Zap className="w-5 h-5 lg:w-6 lg:h-6 text-emerge-green" />
                                 </div>
                                 <span className="text-lg lg:text-xl font-bold font-display text-left leading-tight">Smart<br/>Suggest</span>
                              </>
                           ) : (
                              <>
                                 <div className="w-10 h-10 lg:w-12 lg:h-12 mb-4 lg:mb-6"></div>
                                 <div className="flex items-baseline gap-1">
                                 <span className="text-4xl lg:text-5xl font-bold font-display">{opt.label}</span>
                                 <span className="text-gray-400 text-base lg:text-lg">{opt.unit}</span>
                                 </div>
                              </>
                           )}
                        </button>
                     ))}
                     
                     <div className="col-span-2 mt-2">
                        <label className="text-sm text-gray-400 mb-2 block">Manual Entry (kWh)</label>
                        <input 
                           type="number" min="1" max="150"
                           value={customKwh}
                           onChange={(e) => {
                              setCustomKwh(Number(e.target.value));
                              setSelectedEnergyKwh('manual');
                           }}
                           onClick={() => setSelectedEnergyKwh('manual')}
                           className={`w-full bg-emerge-dark border-2 rounded-2xl p-4 text-white font-display text-xl outline-none transition-colors ${selectedEnergyKwh === 'manual' ? 'border-emerge-green bg-emerge-green/5' : 'border-white/10 focus:border-white/30'}`}
                           placeholder="Enter custom kWh"
                        />
                     </div>
                  </motion.div>
               ) : (
                  <motion.div key="percent" initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-10}} className="col-span-2 grid grid-cols-2 gap-3 lg:gap-4">
                     {energyOptionsPercent.map((opt) => (
                        <button
                           key={opt.id}
                           onClick={() => {
                              triggerHaptic('light');
                              setSelectedPercent(opt.id);
                           }}
                           className={`relative overflow-hidden flex flex-col items-start p-5 lg:p-6 rounded-3xl border-2 transition-all duration-300 ${
                              selectedPercent === opt.id 
                              ? 'bg-emerge-green/10 border-emerge-green shadow-[0_0_30px_rgba(74,222,128,0.15)] scale-[1.02]' 
                              : 'bg-emerge-dark border-white/5 hover:border-white/20 hover:bg-white/5'
                           }`}
                        >
                           {selectedPercent === opt.id && <div className="absolute top-0 right-0 w-24 h-24 bg-emerge-green/20 blur-3xl rounded-full"></div>}
                           <div className="w-10 h-10 lg:w-12 lg:h-12 mb-4 lg:mb-6"></div>
                           <div className="flex items-baseline gap-1">
                              <span className="text-4xl lg:text-5xl font-bold font-display">{opt.label}</span>
                              <span className="text-gray-400 text-base lg:text-lg">{opt.unit}</span>
                           </div>
                        </button>
                     ))}
                     
                     {selectedPercent === 'manual' && (
                        <motion.div initial={{opacity:0, height:0}} animate={{opacity:1, height:'auto'}} className="col-span-2 mt-2">
                           <div className="flex justify-between text-sm text-gray-400 mb-2">
                              <span>Target Battery</span>
                              <span className="text-emerge-green font-bold">{customPercent}%</span>
                           </div>
                           <input 
                              type="range" min="10" max="100" step="5"
                              value={customPercent}
                              onChange={(e) => setCustomPercent(Number(e.target.value))}
                              className="w-full accent-emerge-green h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                           />
                        </motion.div>
                     )}
                  </motion.div>
               )}
            </AnimatePresence>
          </div>

          <PortViewer3D selectedPortId={selectedPortId} onSelectPort={setSelectedPortId} />

          {/* Energy Cost Estimator */}
          <div className="bg-black/30 border border-white/10 rounded-3xl p-6 mb-8">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
               <Zap className="w-5 h-5 text-emerge-green" />
               Charge Estimator
            </h3>
            
            <div className="space-y-4 mb-6">
               <div className="flex flex-col">
                  <label className="text-sm text-gray-400 mb-1 flex items-center gap-1">
                     <Car className="w-4 h-4" /> Car Model
                  </label>
                  <CarDropdown 
                    value={carModel}
                    onChange={(val) => setCarModel(val)}
                  />
               </div>
               
               <div className="h-48 my-6">
                 <Car3DViewer carModel={carModel} />
               </div>
               
               <div className="flex flex-col">
                  <label className="text-sm text-gray-400 mb-1 flex items-center gap-1">
                     <Battery className="w-4 h-4" /> Current Battery: {batteryPercent}%
                  </label>
                  <input 
                     type="range" 
                     min="0" max="100" step="5"
                     value={batteryPercent}
                     onChange={(e) => setBatteryPercent(Number(e.target.value))}
                     className="w-full accent-emerge-green mt-2 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4 bg-emerge-dark/50 rounded-2xl p-4 border border-white/5">
               <div className="flex flex-col">
                  <span className="text-sm text-gray-400 flex items-center gap-1 mb-1">
                     <Clock className="w-4 h-4" /> Est. Time
                  </span>
                  <span className="text-2xl font-display font-bold text-white">
                     {estimatorData.timeMins > 0 ? `~${estimatorData.timeMins}m` : '--'}
                  </span>
               </div>
               <div className="flex flex-col">
                  <span className="text-sm text-gray-400 flex items-center gap-1 mb-1">
                     <DollarSign className="w-4 h-4" /> Est. Cost
                  </span>
                  <span className="text-2xl font-display font-bold text-emerge-green">
                     {estimatorData.cost > 0 ? `$${estimatorData.cost.toFixed(2)}` : '--'}
                  </span>
               </div>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-white/10 mt-auto">
          <Button 
            fullWidth 
            haptic="heavy"
            className="py-5 text-lg lg:text-xl shadow-lg shadow-emerge-green/20"
            onClick={handleContinue}
          >
            Dispatch Technician
          </Button>
        </div>
      </TiltCard>
    </div>
  );
}

