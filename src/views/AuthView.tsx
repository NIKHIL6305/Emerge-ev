import { motion } from 'motion/react';
import { ChevronLeft, Zap, LogIn, BatteryCharging } from 'lucide-react';
import { Button } from '../components/ui/Button';

interface AuthViewProps {
  onBack: () => void;
  onLogin: () => void;
}

export function AuthView({ onBack, onLogin }: AuthViewProps) {
  return (
    <div className="flex flex-col lg:flex-row items-center justify-center min-h-full w-full max-w-[1200px] mx-auto p-4 sm:p-8 gap-12 overflow-y-auto hide-scrollbar">
      
      {/* Graphic side to fill the space */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="hidden lg:flex flex-col justify-center flex-1 max-w-lg"
      >
        <div className="w-20 h-20 rounded-3xl bg-emerge-green/10 flex items-center justify-center mb-8 border border-emerge-green/30">
          <BatteryCharging className="w-10 h-10 text-emerge-green" />
        </div>
        <h1 className="text-5xl font-display font-bold text-white mb-6 leading-tight">
          Powering the <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerge-green to-emerald-400">Next Generation</span>
        </h1>
        <p className="text-xl text-gray-400 leading-relaxed font-light">
          Join the Emerge EV network to experience seamless, mobile electric vehicle charging. 
          Monitor your sessions, manage your vehicles, and stay fully charged wherever you go.
        </p>
      </motion.div>

      {/* Login Card */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-full max-w-md bg-emerge-surface/50 backdrop-blur-md border border-white/10 rounded-3xl p-8 sm:p-12 flex flex-col items-center text-center shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerge-green/10 blur-[80px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none"></div>
        
        <div className="w-16 h-16 rounded-full bg-emerge-green/10 flex items-center justify-center mb-6 border border-emerge-green/30 relative z-10">
          <Zap className="w-8 h-8 text-emerge-green" />
        </div>
        
        <h2 className="text-3xl font-display font-bold text-white mb-3 relative z-10">Welcome to Emerge</h2>
        <p className="text-gray-400 mb-10 text-base relative z-10 leading-relaxed">Sign in with your Google account to start tracking your charging sessions.</p>
        
        <Button 
          variant="primary" 
          className="w-full py-4 rounded-2xl flex items-center justify-center gap-3 text-lg font-medium group relative overflow-hidden bg-white text-black hover:bg-gray-100 border-none z-10 shadow-lg transition-transform active:scale-95"
          onClick={onLogin}
        >
          <img src="https://www.google.com/favicon.ico" alt="Google Logo" className="w-5 h-5" />
          Continue with Google
        </Button>
      </motion.div>
    </div>
  );
}
