import { motion } from 'motion/react';
import { Zap, Play, Battery, Shield, Clock, ChevronRight, X, Navigation, Info } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { TiltCard } from '../components/ui/TiltCard';
import { useTranslation } from 'react-i18next';

interface LandingViewProps {
  onStart: () => void;
  onHowItWorks?: () => void;
}

const features = [
  { icon: Battery, label: 'Modular', desc: '2.5 kWh stackable modules' },
  { icon: Shield, label: 'Safe', desc: 'Advanced BMS system' },
  { icon: Clock, label: 'Fast', desc: 'AI-powered dispatch' },
];

export function LandingView({ onStart, onHowItWorks }: LandingViewProps) {
  const { t } = useTranslation();


  return (
    <div className="w-full h-full overflow-y-auto overflow-x-hidden hide-scrollbar scroll-smooth">
      {/* Hero Section */}
      <div className="w-full min-h-[100dvh] flex flex-col lg:flex-row items-center justify-center px-6 md:px-12 xl:px-24 max-w-[1800px] mx-auto gap-12 lg:gap-24">
        {/* Left Content */}
        <div className="flex-1 flex flex-col justify-center z-10 w-full mt-24 lg:mt-0 max-w-2xl">

        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerge-green/10 border border-emerge-green/20 text-emerge-green text-sm font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-emerge-green animate-pulse"></span>
            Available in San Francisco, New York, London
          </div>

                    <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-[1.1] tracking-tight mb-6">
            {t('heroTitle').split(' ').map((word, i, arr) => 
              i === arr.length - 1 ? <span key={i} className="text-transparent bg-clip-text bg-gradient-to-r from-emerge-green to-emerald-400">{word}</span> : word + ' '
            )}
          </h1>
          <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-xl leading-relaxed font-light">
            {t('heroSubtitle')}
          </p>
          <TiltCard className="flex items-center gap-5 bg-emerge-surface/80 backdrop-blur-xl border border-white/10 rounded-[1.5rem] p-5 w-max mb-12 shadow-2xl cursor-default">
             <div className="bg-emerge-green/10 w-14 h-14 rounded-2xl flex items-center justify-center border border-emerge-green/20 shadow-inner">
               <Battery className="w-7 h-7 text-emerge-green" />
             </div>
             <div className="pr-4">
               <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Core Specification</p>
               <p className="font-display font-bold text-2xl text-white">2.5 kWh <span className="text-sm text-gray-500 font-normal lowercase tracking-normal">/ module</span></p>
             </div>
          </TiltCard>

          <div className="flex flex-col sm:flex-row gap-4 mb-16">
            <Button className="px-8 py-5 text-lg shadow-[0_0_40px_rgba(74,222,128,0.2)] hover:shadow-[0_0_60px_rgba(74,222,128,0.3)] transition-all" onClick={onStart}>
              {t('startCharging')}
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
            <Button variant="secondary" className="px-8 py-5 text-lg" onClick={onHowItWorks}>
              {t('howItWorks')}
              <Play className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 border-t border-white/10 pt-8"
        >
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div key={i} className="flex flex-col items-start">
                <div className="w-10 h-10 rounded-xl bg-emerge-surface-light border border-white/10 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-emerge-green" />
                </div>
                <h3 className="font-semibold text-white mb-1">{feature.label}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{feature.desc}</p>
              </div>
            );
          })}
        </motion.div>
      </div>

      {/* Right 3D Visual */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="flex-1 w-full relative min-h-[500px] lg:min-h-[700px] flex items-center justify-center perspective-1000 hidden md:flex"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerge-green/10 via-transparent to-transparent blur-3xl"></div>
        
        {/* Large 3D Battery Stack Illustration */}
        <div className="relative w-72 h-[400px] flex flex-col-reverse items-center justify-start" style={{ transformStyle: 'preserve-3d', transform: 'rotateX(15deg) rotateY(-25deg)' }}>
          {[1,2,3,4].map((m, i) => (
            <motion.div
              key={m}
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              whileHover={{ y: -15, scale: 1.05, x: -10 }}
              transition={{ delay: i * 0.15 + 0.5, type: 'spring', damping: 15 }}
              className="w-80 h-28 relative -mt-8 group cursor-pointer"
              style={{ zIndex: 10 - i }}
            >
              {/* Top face */}
              <div className="absolute top-0 left-0 w-full h-12 bg-emerge-surface-light border border-white/20 rounded-xl transform -skew-x-[20deg] translate-x-2 -translate-y-3 flex items-center justify-center transition-all duration-300 group-hover:bg-emerge-green/20 group-hover:border-emerge-green/40">
                 <div className="w-16 h-4 border border-white/10 rounded-full flex gap-1 items-center px-1">
                    <div className="w-2 h-2 bg-emerge-green rounded-full shadow-[0_0_10px_#4ade80] group-hover:animate-pulse group-hover:shadow-[0_0_20px_#4ade80] group-hover:bg-white"></div>
                    <div className="w-2 h-2 bg-emerge-green rounded-full shadow-[0_0_10px_#4ade80] group-hover:animate-pulse group-hover:shadow-[0_0_20px_#4ade80] group-hover:bg-white" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-emerge-green rounded-full shadow-[0_0_10px_#4ade80] group-hover:animate-pulse group-hover:shadow-[0_0_20px_#4ade80] group-hover:bg-white" style={{ animationDelay: '300ms' }}></div>
                 </div>
              </div>
              {/* Front face */}
              <div className="absolute top-3 left-0 w-full h-24 bg-emerge-surface border border-white/20 rounded-xl flex items-center justify-between px-8 shadow-2xl overflow-hidden backdrop-blur-sm transition-all duration-300 group-hover:border-emerge-green/50 group-hover:shadow-[0_0_30px_rgba(74,222,128,0.2)]">
                 <div className="absolute inset-0 bg-gradient-to-r from-emerge-green/5 to-transparent transition-all duration-300 group-hover:from-emerge-green/20 group-hover:to-emerge-green/5"></div>
                 <div className="flex items-center gap-3 z-10">
                   <Shield className="w-6 h-6 text-emerge-green/80 transition-colors duration-300 group-hover:text-emerge-green group-hover:drop-shadow-[0_0_8px_rgba(74,222,128,0.8)]" />
                   <span className="text-base font-bold text-emerge-green/80 tracking-wider transition-colors duration-300 group-hover:text-emerge-green group-hover:drop-shadow-[0_0_8px_rgba(74,222,128,0.5)]">E-MODULE</span>
                 </div>
                 <span className="text-3xl font-display font-bold text-white/90 z-10 transition-colors duration-300 group-hover:text-white">2.5<span className="text-sm text-gray-500 ml-1 transition-colors duration-300 group-hover:text-gray-300">kWh</span></span>
              </div>
              {/* Right face */}
              <div className="absolute top-[-3px] right-[-17px] w-8 h-24 bg-black/60 border border-white/10 rounded-r-xl transform skew-y-[20deg] translate-y-6 transition-all duration-300 group-hover:bg-black/40 group-hover:border-emerge-green/30"></div>
            </motion.div>
          ))}
          
          {/* Base shadow */}
          <div className="absolute -bottom-16 w-[400px] h-24 bg-black/80 blur-2xl rounded-full" style={{ transform: 'rotateX(60deg)' }}></div>
        </div>
      </motion.div>
      </div>

      {/* Supported Fleet Section */}
          </div>
  );
}