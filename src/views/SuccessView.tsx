import { motion } from 'motion/react';
import { CheckCircle2, Star, Download, ChevronLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useState } from 'react';
import { FeedbackModal } from '../components/FeedbackModal';

interface SuccessViewProps {
  onHome: () => void;
  energyDelivered: number | 'auto';
}

export function SuccessView({ onHome, energyDelivered }: SuccessViewProps) {
  const delivered = energyDelivered === 'auto' ? 21.6 : energyDelivered;
  const [showFeedback, setShowFeedback] = useState(false);

  const handleDownloadReceipt = () => {
    const receiptContent = `Emerge EV Charging Receipt
-----------------------------
Date: ${new Date().toLocaleDateString()}
Time: ${new Date().toLocaleTimeString()}
Location: San Francisco, CA

Energy Delivered: ${delivered} kWh

Thank you for choosing Emerge!`;

    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Emerge_Receipt_${new Date().getTime()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full bg-emerge-surface/80 items-center justify-center p-12 text-center overflow-y-auto hide-scrollbar relative">
      <button 
        onClick={onHome}
        className="absolute top-8 left-6 w-10 h-10 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center transition-colors border border-white/5 z-50"
      >
        <ChevronLeft className="w-5 h-5 text-white" />
      </button>

      <motion.div 
        initial={{ scale: 0, rotate: -45 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', damping: 12, duration: 0.6 }}
        className="w-40 h-40 bg-emerge-green/10 rounded-full flex items-center justify-center mb-10 relative"
      >
        <div className="absolute inset-0 bg-emerge-green/20 rounded-full blur-2xl animate-pulse"></div>
        <CheckCircle2 className="w-20 h-20 text-emerge-green relative z-10" />
      </motion.div>

      <h3 className="font-display text-5xl font-bold text-white mb-4">
        Charging Successful
      </h3>
      <p className="text-xl text-gray-400 mb-12">Your vehicle is fully powered and ready to go.</p>

      <div className="bg-emerge-dark border border-white/10 rounded-[2.5rem] p-10 w-full max-w-md mb-12 shadow-2xl">
        <p className="font-display font-bold text-3xl text-white mb-2">{delivered} kWh Delivered</p>
        <p className="text-gray-400 mb-10 text-lg">Invoice has been sent to your email</p>
        
        <div className="h-px w-full bg-white/10 mb-10"></div>
        
        <p className="text-sm font-medium text-gray-400 mb-6 uppercase tracking-wider">Rate Your Technician</p>
        <div className="flex justify-center gap-4">
            {[1, 2, 3, 4, 5].map((s) => (
              <button key={s} className="hover:scale-125 hover:-translate-y-2 transition-all">
                <Star className={`w-10 h-10 ${s === 5 ? 'text-gray-600' : 'text-yellow-500 fill-yellow-500'}`} />
              </button>
            ))}
        </div>
      </div>

      <div className="flex gap-4 w-full max-w-md">
        <Button variant="outline" className="flex-1 py-6 border-2" onClick={handleDownloadReceipt}>
          <Download className="w-6 h-6" />
        </Button>
        <Button className="flex-[3] py-6 text-xl" onClick={() => setShowFeedback(true)}>
          Back to Home
        </Button>
      </div>
      <FeedbackModal 
        isOpen={showFeedback} 
        onClose={() => setShowFeedback(false)} 
        onSubmit={onHome} 
      />
    </div>
  );
}
