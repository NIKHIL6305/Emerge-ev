import { motion } from 'motion/react';
import { Shield, Users, BatteryCharging, ChevronLeft, MapPin, Image as ImageIcon, Upload, DollarSign, Activity } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useState, useRef } from 'react';
import { useCarModels, updateCustomCarImage } from '../hooks/useCarModels';
import { CarDropdown } from '../components/CarDropdown';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

interface AdminDashboardViewProps {
  onBack: () => void;
}

export function AdminDashboardView({ onBack }: AdminDashboardViewProps) {
  const carModels = useCarModels();
  const [selectedCar, setSelectedCar] = useState(carModels[0].id);
  const [imageUrl, setImageUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const dailyEarningsData = [
    { day: 'Mon', revenue: 450 },
    { day: 'Tue', revenue: 520 },
    { day: 'Wed', revenue: 610 },
    { day: 'Thu', revenue: 490 },
    { day: 'Fri', revenue: 750 },
    { day: 'Sat', revenue: 980 },
    { day: 'Sun', revenue: 840 },
  ];

  const stationRevenueData = [
    { name: 'Pier 39', revenue: 2400 },
    { name: 'Golden Gate', revenue: 1850 },
    { name: 'Union Sq', revenue: 3100 },
    { name: 'Wharf', revenue: 1500 },
  ];

  const activeRequests = [
    { id: '1', user: 'Sarah J.', location: 'Pier 39, San Francisco', energy: '30 kWh', status: 'Technician En Route' },
    { id: '2', user: 'Mike T.', location: 'Golden Gate Park', energy: '50 kWh', status: 'Charging' },
  ];

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64String = reader.result as string;
            try {
              updateCustomCarImage(selectedCar, base64String);
              alert('Image updated successfully via paste!');
            } catch (err) {
              alert('Error saving image. The file might be too large for local storage.');
            }
          };
          reader.readAsDataURL(file);
        }
        break; // Only process the first image
      }
    }
  };

  const handleUpdateUrl = () => {
    if (imageUrl.trim()) {
      updateCustomCarImage(selectedCar, imageUrl.trim());
      setImageUrl('');
      alert('Image updated successfully via URL!');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        try {
          updateCustomCarImage(selectedCar, base64String);
          alert('Image updated successfully via upload!');
        } catch (err) {
          alert('Error saving image. The file might be too large for local storage.');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full h-full flex flex-col p-6 md:p-8 pt-24 lg:pt-24 max-w-[1200px] mx-auto overflow-y-auto custom-scrollbar">
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={onBack}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-white"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="text-3xl font-display font-bold text-white flex items-center gap-3">
          <Shield className="w-8 h-8 text-emerge-green" />
          Admin Dashboard
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-emerge-surface border border-white/10 rounded-3xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-gray-400 font-medium">Total Users</h3>
          </div>
          <p className="text-4xl font-display font-bold text-white">1,248</p>
        </div>
        
        <div className="bg-emerge-surface border border-white/10 rounded-3xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-emerge-green/20 flex items-center justify-center text-emerge-green">
              <BatteryCharging className="w-5 h-5" />
            </div>
            <h3 className="text-gray-400 font-medium">Active Sessions</h3>
          </div>
          <p className="text-4xl font-display font-bold text-white">12</p>
        </div>

        <div className="bg-emerge-surface border border-white/10 rounded-3xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="text-gray-400 font-medium">Fleet Vans</h3>
          </div>
          <p className="text-4xl font-display font-bold text-white">8 / 15</p>
          <p className="text-sm text-gray-500 mt-2">Currently Deployed</p>
        </div>
      </div>

      {/* ANALYTICS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        <div className="bg-emerge-surface border border-white/10 rounded-3xl p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerge-green" />
              Daily Earnings
            </h3>
            <p className="text-2xl font-bold text-white">$4,640 <span className="text-sm font-normal text-gray-400">/ week</span></p>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyEarningsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                <XAxis dataKey="day" stroke="rgba(255,255,255,0.5)" tick={{fill: 'rgba(255,255,255,0.5)'}} axisLine={false} tickLine={false} />
                <YAxis stroke="rgba(255,255,255,0.5)" tick={{fill: 'rgba(255,255,255,0.5)'}} axisLine={false} tickLine={false} tickFormatter={(val) => '$' + val} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1C1C1C', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ color: '#00FF66' }}
                />
                <Line type="monotone" dataKey="revenue" stroke="#00FF66" strokeWidth={3} dot={{ r: 4, fill: '#00FF66' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-emerge-surface border border-white/10 rounded-3xl p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerge-green" />
              Station Wise Revenue
            </h3>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stationRevenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" tick={{fill: 'rgba(255,255,255,0.5)'}} axisLine={false} tickLine={false} />
                <YAxis stroke="rgba(255,255,255,0.5)" tick={{fill: 'rgba(255,255,255,0.5)'}} axisLine={false} tickLine={false} tickFormatter={(val) => '$' + (val/1000) + 'k'} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1C1C1C', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  cursor={{fill: 'rgba(255,255,255,0.05)'}}
                />
                <Bar dataKey="revenue" fill="#00FF66" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ASSET MANAGEMENT SECTION */}
      <div className="bg-emerge-surface border border-white/10 rounded-3xl p-6 md:p-8 mb-10">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <ImageIcon className="w-6 h-6 text-emerge-green" />
          Asset Management (Car Images)
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Select Car Model</label>
              <CarDropdown 
                value={selectedCar}
                onChange={(val) => setSelectedCar(val)}
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Update via Image URL</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/car.jpg"
                  className="flex-1 bg-emerge-dark border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-emerge-green text-sm"
                />
                <Button onClick={handleUpdateUrl} className="whitespace-nowrap">Save URL</Button>
              </div>
            </div>

            <div className="flex items-center gap-4 my-2">
              <div className="h-px bg-white/10 flex-1"></div>
              <span className="text-xs text-gray-500 uppercase font-bold">OR</span>
              <div className="h-px bg-white/10 flex-1"></div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Upload Image File</label>
              <input 
                type="file" 
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button 
                variant="outline" 
                className="w-full flex items-center justify-center gap-2"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-4 h-4" />
                Select File to Upload
              </Button>
            </div>
          </div>

          <div 
            className="bg-emerge-dark/50 border-2 border-white/10 border-dashed hover:border-emerge-green/50 focus:border-emerge-green rounded-2xl p-4 flex flex-col items-center justify-center min-h-[250px] outline-none cursor-pointer transition-colors"
            tabIndex={0}
            onPaste={handlePaste}
            title="Click to focus, then Ctrl+V / Cmd+V to paste an image"
          >
            <p className="text-sm text-gray-400 mb-4 w-full text-left">Current Preview <span className="text-xs text-emerge-green ml-2">(Click here and paste image)</span></p>
            <div className="w-full h-full flex items-center justify-center relative flex-1">
              {carModels.find(c => c.id === selectedCar)?.image ? (
                <img 
                  src={carModels.find(c => c.id === selectedCar)?.image} 
                  alt="Car Preview" 
                  className="max-w-full max-h-[200px] object-contain drop-shadow-2xl" 
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="text-gray-500 flex flex-col items-center">
                  <ImageIcon className="w-10 h-10 mb-2 opacity-50" />
                  <p>No image available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-emerge-surface border border-white/10 rounded-3xl p-6 md:p-8">
        <h3 className="text-xl font-bold text-white mb-6">Active Charging Requests</h3>
        <div className="space-y-4">
          {activeRequests.map(req => (
            <div key={req.id} className="bg-emerge-dark/50 border border-white/5 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-white font-bold text-lg">{req.user}</p>
                <p className="text-gray-400 text-sm flex items-center gap-1 mt-1">
                  <MapPin className="w-4 h-4" /> {req.location}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-emerge-green font-bold">{req.energy}</p>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">{req.status}</p>
                </div>
                <Button variant="outline" className="text-sm px-4 py-2">Details</Button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 flex justify-end">
          <Button onClick={onBack} className="px-8">Done</Button>
        </div>
      </div>
    </div>
  );
}
