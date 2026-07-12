import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, History, BatteryCharging, MapPin, Calendar, Activity } from 'lucide-react';
import { db, auth } from '../lib/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../utils/firestoreErrorHandler';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useTranslation } from 'react-i18next';

interface HistoryViewProps {
  onBack: () => void;
}

interface Session {
  id: string;
  date: any;
  location: string;
  energyDelivered: number;
}

export function HistoryView({ onBack }: HistoryViewProps) {
  const { t } = useTranslation();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      if (!auth.currentUser) {
        setLoading(false);
        return;
      }
      
      const cacheKey = `charging_history_${auth.currentUser.uid}`;
      
      // Try to load from cache first for fast display and offline support
      const cachedData = localStorage.getItem(cacheKey);
      if (cachedData) {
        try {
          const parsedCache = JSON.parse(cachedData);
          setSessions(parsedCache);
        } catch (e) {
          console.error("Failed to parse cached history:", e);
        }
      }

      // If we are online, try to fetch fresh data
      if (navigator.onLine) {
        try {
          const q = query(
            collection(db, 'charging_sessions'),
            where('userId', '==', auth.currentUser.uid),
            orderBy('date', 'desc')
          );
          const snapshot = await getDocs(q);
          const data = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            // Ensure date is serializable for cache
            date: doc.data().date?.toDate ? doc.data().date.toDate().toISOString() : doc.data().date
          })) as Session[];
          
          setSessions(data);
          // Update cache
          localStorage.setItem(cacheKey, JSON.stringify(data));
        } catch (error) {
          console.error("Error fetching sessions:", error);
        }
      }
      
      setLoading(false);
    };
    
    fetchSessions();
  }, []);

  const chartData = [...sessions]
    .slice(0, 5)
    .reverse()
    .map((session, index) => {
      let name = `S${index + 1}`;
      if (session.date?.toDate) {
        name = session.date.toDate().toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      } else if (session.date) {
        name = new Date(session.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      }
      return {
        name,
        energy: session.energyDelivered || 0,
      };
    });

  return (
    <div className="flex flex-col items-center justify-start min-h-[calc(100vh-80px)] w-full max-w-4xl mx-auto p-4 sm:p-8">
      <div className="w-full flex items-center justify-between mb-8">
        <button 
          onClick={onBack}
          className="w-12 h-12 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-white"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-display font-bold text-white flex items-center gap-3">
          <History className="w-6 h-6 text-emerge-green" />
          {t('chargingHistory')}
        </h2>
        <div className="w-12" /> {/* Spacer */}
      </div>

      <div className="w-full space-y-6">
        {loading ? (
          <div className="text-center text-gray-400 py-12">Loading history...</div>
        ) : !auth.currentUser ? (
          <div className="text-center text-gray-400 py-12">Please sign in to view your history.</div>
        ) : sessions.length === 0 ? (
          <div className="text-center text-gray-400 py-12 flex flex-col items-center justify-center space-y-4">
            <History className="w-12 h-12 text-gray-600" />
            <p>No charging sessions found.</p>
          </div>
        ) : (
          <>
            {chartData.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-emerge-surface/50 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-xl mb-6 w-full"
              >
                <div className="flex items-center gap-2 mb-6 text-white">
                  <Activity className="w-5 h-5 text-emerge-green" />
                  <h3 className="font-display font-medium text-lg">Recent Energy Delivered (Last 5 Sessions)</h3>
                </div>
                <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <XAxis 
                        dataKey="name" 
                        stroke="#9CA3AF" 
                        fontSize={12} 
                        tickLine={false} 
                        axisLine={false} 
                      />
                      <Tooltip 
                        cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                        contentStyle={{ 
                          backgroundColor: '#1E1E1E', 
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '0.75rem',
                          color: '#fff'
                        }}
                        itemStyle={{ color: '#4ade80' }}
                      />
                      <Bar dataKey="energy" radius={[4, 4, 0, 0]}>
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index === chartData.length - 1 ? '#4ade80' : '#4ade8080'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            )}
            <div className="space-y-4">
              {sessions.map((session) => (
                <motion.div 
                  key={session.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-emerge-surface/50 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-300">
                  <Calendar className="w-4 h-4 text-emerge-green" />
                  <span className="text-sm">
                    {session.date?.toDate 
                      ? session.date.toDate().toLocaleDateString() 
                      : session.date 
                        ? new Date(session.date).toLocaleDateString() 
                        : 'Unknown Date'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <MapPin className="w-4 h-4 text-emerge-green" />
                  <span className="text-sm font-medium">{session.location || 'Unknown Location'}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white/5 px-4 py-3 rounded-xl border border-white/5">
                <div className="w-10 h-10 rounded-full bg-emerge-green/10 flex items-center justify-center text-emerge-green">
                  <BatteryCharging className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-0.5">Energy</p>
                  <p className="font-display font-bold text-white">{session.energyDelivered || 0} <span className="text-sm font-normal text-gray-400 lowercase">kWh</span></p>
                </div>
              </div>
            </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
