import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Phone, Star, Navigation, MessageSquare, X, Truck } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { TiltCard } from '../components/ui/TiltCard';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface TrackingViewProps {
  onBack: () => void;
  onArrived: () => void;
}

// Predefined route for demonstration purposes
const ROUTE_POINTS: [number, number][] = [
  [37.7749, -122.4194],
  [37.7750, -122.4180],
  [37.7760, -122.4170],
  [37.7780, -122.4150],
  [37.7800, -122.4120],
  [37.7820, -122.4100],
  [37.7849, -122.4094]
];

function MapComponent({ progress }: { progress: number }) {
  const map = useMap();
  
  useEffect(() => {
    if (ROUTE_POINTS.length > 0) {
      const bounds = L.latLngBounds(ROUTE_POINTS);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [map]);

  const currentPosIndex = Math.min(
    Math.floor((progress / 100) * (ROUTE_POINTS.length - 1)), 
    Math.max(0, ROUTE_POINTS.length - 1)
  );
  const currentPos = ROUTE_POINTS.length > 0 ? ROUTE_POINTS[currentPosIndex] : ROUTE_POINTS[0];
  const destination = ROUTE_POINTS[ROUTE_POINTS.length - 1];

  const traveledPath = ROUTE_POINTS.slice(0, currentPosIndex + 1);

  const vanIcon = L.divIcon({
    className: 'bg-transparent',
    html: `
      <div class="relative w-12 h-12 flex items-center justify-center">
        <div class="absolute inset-0 bg-emerge-green/40 rounded-full animate-ping"></div>
        <div class="relative w-10 h-10 bg-white rounded-full shadow-lg border-2 border-emerge-green flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="2" y="7" width="16" height="10" rx="2" ry="2"></rect>
            <path d="M18 10h2a2 2 0 0 1 2 2v2"></path>
            <circle cx="6" cy="18" r="2"></circle>
            <circle cx="16" cy="18" r="2"></circle>
          </svg>
          <div class="absolute -top-1 -right-1 w-5 h-5 bg-emerge-green text-black rounded-full flex items-center justify-center border-2 border-white shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="currentColor" stroke="none">
               <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
            </svg>
          </div>
        </div>
      </div>
    `,
    iconSize: [48, 48],
    iconAnchor: [24, 24],
  });

  return (
    <>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Polyline positions={ROUTE_POINTS} color="rgba(255,255,255,0.2)" weight={6} />
      <Polyline positions={traveledPath} color="#4ade80" weight={6} />
      <Marker position={currentPos} icon={vanIcon} />
      <Marker position={destination} />
    </>
  );
}

export function TrackingView({ onBack, onArrived }: TrackingViewProps) {
  const [progress, setProgress] = useState(0);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<{sender: 'user' | 'tech', text: string}[]>([]);
  const [hasAlerted, setHasAlerted] = useState(false);
  const [showDistanceAlert, setShowDistanceAlert] = useState(false);

  const predefinedMessages = [
    "I am at the entrance",
    "See you soon",
    "Call me when you arrive",
    "Where are you exactly?"
  ];

  const handleSendMessage = (text: string) => {
    setChatMessages(prev => [...prev, { sender: 'user', text }]);
    // Simulate technician reply
    setTimeout(() => {
      setChatMessages(prev => [...prev, { sender: 'tech', text: "Got it! Thanks." }]);
    }, 1500);
  };

  useEffect(() => {
    if (distanceNum <= 5.0 && !hasAlerted) {
      setHasAlerted(true);
      setShowDistanceAlert(true);
    }
  }, [distanceNum, hasAlerted]);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(onArrived, 1500);
          return 100;
        }
        return p + 0.5;
      });
    }, 50);
    return () => clearInterval(interval);
  }, [onArrived]);

  const distanceNum = 10.0 * (1 - progress / 100);
  const distance = distanceNum.toFixed(1);
  const eta = Math.max(1, Math.ceil(12 * (1 - progress / 100)));

  return (
    <div className="w-full h-full flex flex-col lg:flex-row p-6 md:p-8 pt-20 lg:pt-8 gap-6 max-w-[1800px] mx-auto relative lg:mt-10 overflow-y-auto hide-scrollbar">
      <button onClick={onBack} className="lg:hidden absolute top-4 left-6 z-50 p-3 rounded-full bg-emerge-surface border border-white/10">
        <ChevronLeft className="w-6 h-6" />
      </button>

      {/* Left Panel: Map */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex-[2] relative rounded-[2.5rem] overflow-hidden bg-emerge-dark border border-white/5 shadow-2xl min-h-[400px] lg:min-h-0 order-2 lg:order-1 flex items-center justify-center"
      >
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        
        <div className="absolute inset-0 w-full h-full">
          <MapContainer
            center={[37.7749, -122.4194]}
            zoom={13}
            style={{ width: '100%', height: '100%' }}
            zoomControl={false}
          >
            <MapComponent progress={progress} />
          </MapContainer>
        </div>

        {/* Center Vehicle Status Overlay */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 bg-emerge-surface/90 backdrop-blur-xl p-5 px-10 rounded-full border border-white/10 flex items-center gap-4 shadow-2xl">
           <div className="w-4 h-4 bg-emerge-green rounded-full animate-pulse shadow-[0_0_15px_#4ade80]"></div>
           <span className="font-medium text-lg text-white tracking-wide">Vehicle in transit</span>
        </div>
      </motion.div>

      {/* Right Panel: Info */}
      <TiltCard 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex-1 flex flex-col bg-emerge-surface/80 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 p-8 lg:p-12 shadow-2xl order-1 lg:order-2 z-10 min-w-[480px]"
      >
        <button onClick={onBack} className="hidden lg:flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-12 w-fit">
          <ChevronLeft className="w-5 h-5" />
          <span>Cancel Request</span>
        </button>

        <div className="flex-1 flex flex-col">
          <div className="mb-12">
            <h2 className="font-display text-5xl font-bold mb-4 leading-tight">Technician is <br/><span className="text-emerge-green">on the way</span></h2>
            <p className="text-gray-400 text-lg">Your emergency power module has been dispatched and is navigating to your location.</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-12">
            <div className="bg-emerge-dark rounded-3xl p-8 border border-white/5">
              <p className="text-gray-400 text-sm mb-3 uppercase tracking-wider font-medium">Distance</p>
              <div className="flex items-baseline gap-2">
                <span className="font-display text-6xl font-bold">{distance}</span>
                <span className="text-gray-500 font-medium text-xl">km</span>
              </div>
            </div>
            <div className="bg-emerge-dark rounded-3xl p-8 border border-white/5">
              <p className="text-gray-400 text-sm mb-3 uppercase tracking-wider font-medium">ETA</p>
              <div className="flex items-baseline gap-2">
                <span className="font-display text-6xl font-bold text-white">{eta}</span>
                <span className="text-gray-500 font-medium text-xl">min</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerge-dark to-emerge-surface-light rounded-[2rem] p-8 border border-white/10 mb-8 mt-auto">
            <p className="text-sm text-emerge-green uppercase tracking-wider font-medium mb-6">Assigned Technician</p>
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-gray-700 rounded-full overflow-hidden flex-shrink-0 border-2 border-emerge-green/30">
                 <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="Technician" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <h4 className="font-display text-2xl font-bold mb-1">Rohit Kumar</h4>
                <div className="flex items-center gap-3 mt-1">
                  <div className="flex items-center gap-1 text-yellow-500 text-sm font-medium bg-yellow-500/10 px-2 py-0.5 rounded">
                    <Star className="w-4 h-4 fill-current" />
                    4.9
                  </div>
                  <span className="text-sm text-gray-400">Certified Tech</span>
                </div>
                <div className="flex items-center gap-2 mt-3 text-sm text-gray-300">
                  <Truck className="w-4 h-4 text-emerge-green" />
                  <span>Emerge Service Van</span>
                  <span className="bg-white/10 px-2 py-1 rounded text-xs font-mono font-bold tracking-widest border border-white/10 text-white ml-1">MH 12 AB 1234</span>
                </div>
              </div>
              <button 
                onClick={() => setShowContactModal(true)}
                className="w-16 h-16 rounded-full bg-emerge-green/10 text-emerge-green flex items-center justify-center border border-emerge-green/30 hover:bg-emerge-green hover:text-black transition-colors shadow-lg"
              >
                <Phone className="w-7 h-7" />
              </button>
            </div>
          </div>
        </div>
      </TiltCard>

      <AnimatePresence>
        {showContactModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowContactModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-emerge-dark border border-white/10 p-8 rounded-3xl w-full max-w-md shadow-2xl relative"
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={() => setShowContactModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              
              <div className="flex flex-col items-center text-center mb-8">
                <div className="w-24 h-24 bg-gray-700 rounded-full overflow-hidden mb-4 border-4 border-emerge-green/30">
                  <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="Technician" className="w-full h-full object-cover" />
                </div>
                <h3 className="text-2xl font-display font-bold text-white mb-1">Rohit Kumar</h3>
                <p className="text-gray-400">Emerge Certified Technician</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setShowContactModal(false)}
                  className="flex flex-col items-center justify-center gap-3 bg-white/5 hover:bg-white/10 p-6 rounded-2xl border border-white/10 transition-colors group"
                >
                  <div className="w-14 h-14 rounded-full bg-emerge-green/10 text-emerge-green flex items-center justify-center group-hover:bg-emerge-green group-hover:text-black transition-colors">
                    <Phone className="w-6 h-6" />
                  </div>
                  <span className="font-medium text-white">Call</span>
                </button>
                <button
                  onClick={() => {
                    setShowContactModal(false);
                    setShowChat(true);
                  }}
                  className="flex flex-col items-center justify-center gap-3 bg-white/5 hover:bg-white/10 p-6 rounded-2xl border border-white/10 transition-colors group"
                >
                  <div className="w-14 h-14 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-colors">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <span className="font-medium text-white">Message</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {showChat && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowChat(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-emerge-dark border border-white/10 p-6 rounded-3xl w-full max-w-md shadow-2xl relative flex flex-col max-h-[80vh]"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center gap-4 mb-6 border-b border-white/10 pb-4">
                <button
                  onClick={() => setShowChat(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-700 rounded-full overflow-hidden border-2 border-emerge-green/30">
                    <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="Technician" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-white">Rohit Kumar</h3>
                    <p className="text-xs text-emerge-green">Online</p>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2">
                {chatMessages.length === 0 ? (
                  <p className="text-center text-gray-500 text-sm mt-8">No messages yet. Send a quick reply below.</p>
                ) : (
                  chatMessages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`px-4 py-2 rounded-2xl max-w-[80%] ${msg.sender === 'user' ? 'bg-emerge-green text-black rounded-br-sm' : 'bg-white/10 text-white rounded-bl-sm'}`}>
                        <p className="text-sm font-medium">{msg.text}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 mt-auto pt-4 border-t border-white/10">
                {predefinedMessages.map((msg, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(msg)}
                    className="text-xs bg-white/5 hover:bg-white/10 text-gray-300 py-2 px-3 rounded-lg border border-white/5 transition-colors text-left"
                  >
                    {msg}
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}

        {showDistanceAlert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[105] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-emerge-dark border border-white/10 p-8 rounded-3xl w-full max-w-sm shadow-2xl relative text-center"
            >
              <div className="w-16 h-16 bg-emerge-green/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Truck className="w-8 h-8 text-emerge-green" />
              </div>
              <h3 className="text-2xl font-display font-bold text-white mb-2">Technician is near!</h3>
              <p className="text-gray-400 mb-8">Your technician is now within 5 miles of your location.</p>
              <Button className="w-full py-4 text-lg" onClick={() => setShowDistanceAlert(false)}>
                Got it
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
