import { useState } from 'react';
import { Shield, CreditCard, Smartphone, ChevronLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { triggerHaptic } from '../utils/haptics';

interface PaymentViewProps {
  onPay: () => void;
  onBack: () => void;
}

export function PaymentView({ onPay, onBack }: PaymentViewProps) {
  const [method, setMethod] = useState('upi');

  const handlePay = () => {
    onPay();
  };

  return (
    <div className="flex flex-col h-full bg-emerge-surface/80 relative">
      <button 
        onClick={onBack}
        className="absolute top-8 left-6 w-10 h-10 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center transition-colors border border-white/5 z-50"
      >
        <ChevronLeft className="w-5 h-5 text-white" />
      </button>

      <div className="p-10 text-center border-b border-white/5 pt-12">
        <h2 className="font-display font-semibold text-3xl">Complete Payment</h2>
        <p className="text-gray-400 mt-2 text-lg">Secure checkout via Emerge EV</p>
      </div>

      <div className="flex-1 p-10 overflow-y-auto hide-scrollbar">
         <div className="text-center mb-12">
            <p className="text-gray-400 text-sm mb-4 uppercase tracking-wider font-medium">Total Amount Due</p>
            <h3 className="font-display text-7xl font-bold mb-4 text-white">₹1,642</h3>
            <div className="flex items-center justify-center gap-2 text-sm text-emerge-green font-medium bg-emerge-green/10 w-fit mx-auto px-4 py-1.5 rounded-full border border-emerge-green/20">
              <Shield className="w-4 h-4" /> 256-bit Secure Encrypted
            </div>
         </div>

         <div className="bg-emerge-dark rounded-3xl p-8 border border-white/10 mb-12">
            <div className="space-y-6 text-lg">
               <div className="flex justify-between text-gray-300">
                  <span>Emergency Service Fee</span>
                  <span className="font-medium text-white">₹499</span>
               </div>
               <div className="flex justify-between text-gray-300">
                  <span>Energy Delivered (21.6 kWh)</span>
                  <span className="font-medium text-white">₹973</span>
               </div>
               <div className="flex justify-between text-gray-300">
                  <span>Distance Fee (12 km)</span>
                  <span className="font-medium text-white">₹120</span>
               </div>
               <div className="h-px bg-white/10 my-4"></div>
               <div className="flex justify-between text-gray-400 text-base">
                  <span>Taxes & Levies</span>
                  <span>₹50</span>
               </div>
            </div>
         </div>

         <div>
            <p className="text-sm font-medium text-gray-400 mb-6 uppercase tracking-wider">Select Payment Method</p>
            <div className="grid grid-cols-2 gap-6">
               {[
                 { id: 'upi', label: 'UPI / QR', icon: Smartphone },
                 { id: 'card', label: 'Card', icon: CreditCard }
               ].map((m) => {
                 const Icon = m.icon;
                 return (
                 <button
                   key={m.id}
                   onClick={() => setMethod(m.id)}
                   className={`flex flex-col items-center justify-center p-8 rounded-3xl border-2 transition-all ${
                     method === m.id 
                     ? 'bg-emerge-green/10 border-emerge-green text-emerge-green shadow-[0_0_20px_rgba(74,222,128,0.1)]' 
                     : 'bg-emerge-dark border-white/5 hover:border-white/20 text-gray-400 hover:bg-white/5'
                   }`}
                 >
                   <Icon className="w-10 h-10 mb-4" />
                   <span className="font-medium text-lg">{m.label}</span>
                 </button>
               )})}
            </div>
         </div>
      </div>

      <div className="p-10 bg-emerge-dark/50 border-t border-white/5">
        <Button fullWidth haptic="success" className="py-6 text-xl shadow-lg shadow-emerge-green/20" onClick={handlePay}>
          Pay ₹1,642 Securely
        </Button>
      </div>
    </div>
  );
}
