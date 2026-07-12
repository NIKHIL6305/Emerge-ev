import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, User, Camera, Globe, History, LogOut, Zap, Car, CheckCircle, Plus, Bell, Calendar, Info, Battery, Activity } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { User as FirebaseUser } from 'firebase/auth';
import { useTranslation } from 'react-i18next';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface AccountViewProps {
  onBack: () => void;
  onNavigateHistory: () => void;
  onLogout: () => void;
  user: FirebaseUser | null;
}

const LANGUAGES = [
  { id: 'en', name: 'English' },
  { id: 'es', name: 'Español' },
  { id: 'fr', name: 'Français' },
  { id: 'hi', name: 'हिन्दी (Hindi)' },
  { id: 'zh', name: '中文 (Chinese)' },
  { id: 'te', name: 'తెలుగు (Telugu)' },
  { id: 'ta', name: 'தமிழ் (Tamil)' },
  { id: 'mr', name: 'मराठी (Marathi)' },
  { id: 'bn', name: 'বাংলা (Bengali)' },
];

const mockBatteryData = [
  { month: 'Jan', health: 99.8, frequency: 12 },
  { month: 'Feb', health: 99.5, frequency: 15 },
  { month: 'Mar', health: 99.2, frequency: 18 },
  { month: 'Apr', health: 98.9, frequency: 20 },
  { month: 'May', health: 98.7, frequency: 22 },
  { month: 'Jun', health: 98.5, frequency: 14 },
];

const mockChartData = [
  { date: '1', energy: 12 },
  { date: '5', energy: 15 },
  { date: '10', energy: 10 },
  { date: '15', energy: 22 },
  { date: '20', energy: 18 },
  { date: '25', energy: 30 },
  { date: '30', energy: 25 },
];

const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    title: 'Technician Arriving Soon',
    message: 'Your Emerge EV van is approximately 5 minutes away.',
    time: 'Just now',
    icon: Car,
    iconColor: 'text-blue-400',
    iconBg: 'bg-blue-400/20'
  },
  {
    id: 2,
    title: 'Scheduled Charge Confirmed',
    message: 'Your session for tomorrow at 10:00 AM at Pier 39 is confirmed.',
    time: '2 hours ago',
    icon: Calendar,
    iconColor: 'text-emerge-green',
    iconBg: 'bg-emerge-green/20'
  },
  {
    id: 3,
    title: 'Weekend Promo',
    message: 'Get 20% off your next fast charge this weekend! Use code WEEKEND20.',
    time: '1 day ago',
    icon: Zap,
    iconColor: 'text-orange-400',
    iconBg: 'bg-orange-400/20'
  }
];

export function AccountView({ onBack, onNavigateHistory, onLogout, user }: AccountViewProps) {
  const { t, i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language || 'en');
  const [profilePic, setProfilePic] = useState<string | null>(user?.photoURL || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    i18n.changeLanguage(selectedLanguage);
  }, [selectedLanguage, i18n]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result as string);
        // Here you would normally upload the image to Firebase Storage and update the user profile
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full h-full flex flex-col p-6 md:px-12 xl:px-24 max-w-[1200px] mx-auto overflow-y-auto hide-scrollbar">
      <div className="flex items-center gap-4 mb-12">
        <button 
          onClick={onBack}
          className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors border border-white/10"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <h2 className="font-display text-3xl font-bold text-white">{t('accountSettings')}</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="col-span-1"
        >
          <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8 flex flex-col items-center text-center">
            <div className="relative group mb-6">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-emerge-green/30 bg-emerge-surface flex items-center justify-center relative">
                {profilePic ? (
                  <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-12 h-12 text-gray-400" />
                )}
                <div 
                  className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer backdrop-blur-sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Camera className="w-8 h-8 text-white" />
                </div>
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                className="hidden" 
              />
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-2">{user?.displayName || t('evUser')}</h3>
            <p className="text-gray-400 mb-6">{user?.email || t('noEmail')}</p>
            
            <Button 
              variant="outline" 
              className="w-full rounded-xl"
              onClick={() => fileInputRef.current?.click()}
            >
              {t('updateProfilePic')}
            </Button>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="col-span-1 lg:col-span-2 flex flex-col gap-6"
        >
          {/* Notification Center */}
          <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-3">
                <Bell className="w-6 h-6 text-emerge-green" />
                Notifications
              </h3>
              <span className="bg-emerge-green/20 text-emerge-green px-3 py-1 rounded-full text-xs font-bold">
                {MOCK_NOTIFICATIONS.length} New
              </span>
            </div>
            
            <div className="space-y-4">
              {MOCK_NOTIFICATIONS.map((notif) => {
                const Icon = notif.icon;
                return (
                  <div key={notif.id} className="bg-emerge-dark/50 border border-white/5 rounded-xl p-4 flex gap-4 transition-colors hover:bg-white/5">
                    <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center ${notif.iconBg}`}>
                      <Icon className={`w-5 h-5 ${notif.iconColor}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-white font-bold text-sm mb-1">{notif.title}</h4>
                        <span className="text-xs text-gray-500 flex-shrink-0 whitespace-nowrap">{notif.time}</span>
                      </div>
                      <p className="text-sm text-gray-400">{notif.message}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          
          {/* Battery Health Analytics */}
          <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
              <Activity className="w-6 h-6 text-emerge-green" />
              Battery Health Analytics
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-emerge-dark/50 border border-white/5 rounded-xl p-4">
                <div className="flex items-center gap-2 text-gray-400 mb-2">
                  <Battery className="w-4 h-4 text-emerge-green" />
                  <span className="text-sm font-medium">Estimated Health</span>
                </div>
                <p className="text-3xl font-display font-bold text-white">98.5%</p>
                <p className="text-xs text-emerge-green mt-1">Excellent Condition</p>
              </div>
              <div className="bg-emerge-dark/50 border border-white/5 rounded-xl p-4">
                <div className="flex items-center gap-2 text-gray-400 mb-2">
                  <Zap className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-medium">Avg Charge Duration</span>
                </div>
                <p className="text-3xl font-display font-bold text-white">42<span className="text-lg text-gray-500 ml-1">min</span></p>
                <p className="text-xs text-gray-500 mt-1">Optimal for longevity</p>
              </div>
              <div className="bg-emerge-dark/50 border border-white/5 rounded-xl p-4">
                <div className="flex items-center gap-2 text-gray-400 mb-2">
                  <History className="w-4 h-4 text-orange-400" />
                  <span className="text-sm font-medium">Fast Charges (30d)</span>
                </div>
                <p className="text-3xl font-display font-bold text-white">14</p>
                <p className="text-xs text-orange-400/80 mt-1">Slightly above average</p>
              </div>
            </div>

            <h4 className="text-sm font-medium text-gray-400 mb-4 uppercase tracking-wider">Health Degradation Trend</h4>
            <div className="h-64 w-full mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockBatteryData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <defs>
                    <linearGradient id="colorHealth" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4ade80" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#4ade80" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#333" strokeDasharray="5 5" vertical={false} />
                  <XAxis dataKey="month" stroke="#666" tick={{ fill: '#999' }} tickLine={false} axisLine={false} />
                  <YAxis domain={['dataMin - 1', 100]} stroke="#666" tick={{ fill: '#999' }} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }}
                    itemStyle={{ color: '#4ade80' }}
                  />
                  <Area type="monotone" dataKey="health" stroke="#4ade80" strokeWidth={3} fillOpacity={1} fill="url(#colorHealth)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex gap-4">
              <Info className="w-6 h-6 text-blue-400 flex-shrink-0" />
              <p className="text-sm text-gray-300">
                Your charging habits are generally healthy. To further optimize battery lifespan, try to keep charges between 20% and 80% and reduce the frequency of rapid DC fast charging when possible.
              </p>
            </div>
          </div>

          {/* Energy Consumption Trend */}
          <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
              <Zap className="w-6 h-6 text-emerge-green" />
              Energy Consumption (Last 30 Days)
            </h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockChartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <Line type="monotone" dataKey="energy" stroke="#4ade80" strokeWidth={3} dot={{ r: 4, fill: '#4ade80' }} />
                  <CartesianGrid stroke="#333" strokeDasharray="5 5" vertical={false} />
                  <XAxis dataKey="date" stroke="#666" tick={{ fill: '#999' }} tickLine={false} axisLine={false} />
                  <YAxis stroke="#666" tick={{ fill: '#999' }} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }}
                    itemStyle={{ color: '#4ade80' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Vehicle Management Section */}
          <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
              <Car className="w-6 h-6 text-emerge-green" />
              Vehicle Management
            </h3>
            
            <div className="space-y-4 mb-6">
              <div className="bg-emerge-dark/50 border border-white/10 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <h4 className="text-white font-bold">Tata Nexon EV</h4>
                  <p className="text-sm text-gray-400">Capacity: 30 kWh • Standard: CCS2</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-emerge-green/20 flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-emerge-green" />
                </div>
              </div>

              <div className="bg-emerge-dark/50 border border-white/10 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <h4 className="text-white font-bold">MG ZS EV</h4>
                  <p className="text-sm text-gray-400">Capacity: 50 kWh • Standard: CCS2</p>
                </div>
              </div>
            </div>

            <Button variant="outline" className="w-full flex items-center justify-center gap-2 rounded-xl">
              <Plus className="w-4 h-4" /> Add Vehicle
            </Button>
          </div>

          {/* Settings Section */}
          <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
              <Globe className="w-6 h-6 text-emerge-green" />
              {t('languageRegion')}
            </h3>
            
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-400 mb-2">{t('selectLanguage')}</label>
              <div className="relative">
                <select 
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-emerge-green/50 focus:border-emerge-green"
                >
                  {LANGUAGES.map(lang => (
                    <option key={lang.id} value={lang.id} >
                      {lang.name}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                  <ChevronLeft className="w-5 h-5 text-gray-400 -rotate-90" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">{t('moreLanguagesInfo')}</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8">
            <h3 className="text-xl font-bold text-white mb-6">{t('quickActions')}</h3>
            
            <div className="space-y-4">
              <button 
                onClick={onNavigateHistory}
                className="w-full flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-emerge-green/10 flex items-center justify-center">
                    <History className="w-5 h-5 text-emerge-green" />
                  </div>
                  <div className="text-left">
                    <p className="text-white font-medium">{t('chargingHistory')}</p>
                    <p className="text-sm text-gray-400">{t('viewSessions')}</p>
                  </div>
                </div>
                <ChevronLeft className="w-5 h-5 text-gray-400 rotate-180 group-hover:text-white transition-colors" />
              </button>

              <button 
                onClick={onLogout}
                className="w-full flex items-center justify-between p-4 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                    <LogOut className="w-5 h-5 text-red-500" />
                  </div>
                  <div className="text-left">
                    <p className="text-white font-medium text-red-500">{t('signOut')}</p>
                    <p className="text-sm text-red-500/70">{t('disconnectAccount')}</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
          
          {/* EV Charging Tip of the Day */}
          <div className="bg-gradient-to-r from-emerge-green/20 to-blue-500/20 border border-emerge-green/30 rounded-[2rem] p-8 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-20 pointer-events-none">
                <Zap className="w-24 h-24 text-emerge-green" />
             </div>
             <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
               <span className="text-2xl">💡</span> Tip of the Day
             </h3>
             <p className="text-gray-300 leading-relaxed max-w-md relative z-10">
               For optimal battery health, try to keep your charge level between <strong className="text-white">20% and 80%</strong> during daily use. Only charge to 100% when you need the maximum range for a long trip.
             </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
