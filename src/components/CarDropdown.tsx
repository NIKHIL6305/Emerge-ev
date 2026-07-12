import { useState, useRef, useEffect } from 'react';
import { useCarModels } from '../hooks/useCarModels';
import { Car, Search, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CarDropdownProps {
  value: string;
  onChange: (id: string) => void;
}

export function CarDropdown({ value, onChange }: CarDropdownProps) {
  const carModels = useCarModels();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedCar = carModels.find((c) => c.id === value) || carModels[0];

  const filteredCars = carModels.filter((car) =>
    car.name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-emerge-dark border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerge-green transition-colors flex items-center justify-between"
      >
        <span className="flex items-center gap-2 truncate">
          {selectedCar.name} <span className="text-gray-500 text-sm">({selectedCar.capacity} kWh)</span>
        </span>
        <Car className="w-4 h-4 text-gray-400" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 top-full left-0 right-0 mt-2 bg-emerge-dark border border-white/10 rounded-xl shadow-2xl overflow-hidden flex flex-col"
            style={{ maxHeight: '250px' }}
          >
            <div className="p-2 border-b border-white/5 flex items-center gap-2 bg-white/5">
              <Search className="w-4 h-4 text-gray-400 ml-2" />
              <input
                type="text"
                placeholder="Search car model..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent border-none outline-none text-white text-sm py-1"
                autoFocus
              />
            </div>
            <div className="overflow-y-auto flex-1 p-1 custom-scrollbar">
              {filteredCars.length > 0 ? (
                filteredCars.map((car) => (
                  <button
                    key={car.id}
                    onClick={() => {
                      onChange(car.id);
                      setIsOpen(false);
                      setSearch('');
                    }}
                    className={`w-full text-left px-3 py-2.5 rounded-lg text-sm flex items-center justify-between transition-colors ${
                      value === car.id ? 'bg-emerge-green/10 text-emerge-green font-bold' : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span>
                      {car.name} <span className="text-gray-500">({car.capacity} kWh)</span>
                    </span>
                    {value === car.id && <Check className="w-4 h-4 text-emerge-green" />}
                  </button>
                ))
              ) : (
                <div className="px-3 py-4 text-center text-sm text-gray-500">No cars found.</div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
