import { motion } from 'motion/react';
import { User, ShieldCheck, ChevronLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';

interface RoleSelectionViewProps {
  onSelectRole: (role: 'customer' | 'admin') => void;
  onBack: () => void;
}

export function RoleSelectionView({ onSelectRole, onBack }: RoleSelectionViewProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] w-full max-w-md mx-auto p-4 sm:p-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full bg-emerge-surface/50 backdrop-blur-md border border-white/10 rounded-3xl p-8 sm:p-12 flex flex-col items-center text-center shadow-2xl relative"
      >
        <button 
          onClick={onBack}
          className="absolute top-6 left-6 w-10 h-10 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center transition-colors border border-white/5"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
        <h2 className="text-3xl font-display font-bold text-white mb-4 mt-4">Choose your role</h2>
        <p className="text-gray-400 mb-10 text-lg">Select how you want to use the application.</p>
        
        <div className="w-full flex flex-col gap-4">
          <Button 
            variant="primary" 
            className="w-full py-6 rounded-2xl flex items-center justify-center gap-3 text-lg font-medium shadow-[0_0_20px_rgba(74,222,128,0.2)]"
            onClick={() => onSelectRole('customer')}
          >
            <User className="w-6 h-6" />
            Customer
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full py-6 rounded-2xl flex items-center justify-center gap-3 text-lg font-medium text-white hover:bg-white/5 border-white/20"
            onClick={() => onSelectRole('admin')}
          >
            <ShieldCheck className="w-6 h-6" />
            Admin
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
