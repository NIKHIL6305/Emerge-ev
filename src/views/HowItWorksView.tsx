import { motion } from 'motion/react';
import { ChevronLeft, Play, Zap, MapPin, BatteryCharging, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';

interface HowItWorksViewProps {
  onBack: () => void;
}

export function HowItWorksView({ onBack }: HowItWorksViewProps) {
  const steps = [
    {
      icon: MapPin,
      title: "1. Request a Charge",
      description: "Pinpoint your exact location using our mobile app. Whether you're at home, work, or stranded on the road, we come to you."
    },
    {
      icon: Zap,
      title: "2. Dispatch",
      description: "Our intelligent dispatch system routes the nearest mobile charging unit to your location, providing real-time ETA updates."
    },
    {
      icon: BatteryCharging,
      title: "3. Arrive & Charge",
      description: "Our specialized technicians arrive and connect your EV to our high-speed mobile chargers safely and efficiently."
    },
    {
      icon: CheckCircle,
      title: "4. Complete",
      description: "Once your desired charge level is reached, payment is processed automatically. You're ready to hit the road."
    }
  ];

  return (
    <div className="min-h-screen bg-black overflow-y-auto">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerge-green/10 via-black to-black pointer-events-none" />
      
      <div className="max-w-6xl mx-auto px-6 py-12 relative z-10">
        <div className="flex items-center gap-4 mb-12">
          <button 
            onClick={onBack}
            className="w-12 h-12 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center transition-colors border border-white/5"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <h2 className="font-display text-3xl font-bold text-white">How it Works</h2>
        </div>

        <div className="mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative w-full aspect-video rounded-3xl overflow-hidden bg-white/5 border border-white/10 group cursor-pointer"
          >
            {/* Placeholder for Video */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition-colors z-10">
              <div className="w-20 h-20 rounded-full bg-emerge-green text-black flex items-center justify-center shadow-[0_0_40px_rgba(74,222,128,0.4)] group-hover:scale-110 transition-transform">
                <Play className="w-8 h-8 ml-1" />
              </div>
            </div>
            {/* Standard dummy poster image or abstract background */}
            <img 
              src="https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&q=80&w=2000" 
              alt="EV Charging Demonstration" 
              className="w-full h-full object-cover opacity-60"
            />
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors"
              >
                <div className="w-12 h-12 rounded-2xl bg-emerge-green/20 flex items-center justify-center mb-6">
                  <Icon className="w-6 h-6 text-emerge-green" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{step.title}</h3>
                <p className="text-gray-400 leading-relaxed text-sm">
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <Button onClick={onBack} className="px-8 py-4">
            Get Started Now
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
