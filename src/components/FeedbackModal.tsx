import { motion, AnimatePresence } from 'motion/react';
import { Star, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/Button';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

export function FeedbackModal({ isOpen, onClose, onSubmit }: FeedbackModalProps) {
  const [techRating, setTechRating] = useState(0);
  const [speedRating, setSpeedRating] = useState(0);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative bg-emerge-surface border border-white/10 p-8 rounded-3xl w-full max-w-md shadow-2xl z-10"
        >
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4 text-gray-400 hover:text-white" />
          </button>

          <h3 className="text-2xl font-display font-bold text-white mb-2">How was your experience?</h3>
          <p className="text-gray-400 mb-8">Your feedback helps us improve our service.</p>

          <div className="space-y-8">
            <div>
              <p className="text-sm font-medium text-gray-300 mb-4 uppercase tracking-wider">Rate the Technician</p>
              <div className="flex justify-between px-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button 
                    key={s} 
                    onClick={() => setTechRating(s)}
                    className="hover:scale-110 transition-transform"
                  >
                    <Star className={`w-10 h-10 ${s <= techRating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-600'}`} />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-300 mb-4 uppercase tracking-wider">Rate the Charging Speed</p>
              <div className="flex justify-between px-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button 
                    key={s} 
                    onClick={() => setSpeedRating(s)}
                    className="hover:scale-110 transition-transform"
                  >
                    <Star className={`w-10 h-10 ${s <= speedRating ? 'text-emerge-green fill-emerge-green' : 'text-gray-600'}`} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <Button 
            className="w-full mt-10 py-4 text-lg"
            onClick={onSubmit}
            disabled={!techRating || !speedRating}
          >
            Submit Feedback
          </Button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
