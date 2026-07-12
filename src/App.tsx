import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { AppState } from './types';
import { LandingView } from './views/LandingView';
import { RequestView } from './views/RequestView';
import { TrackingView } from './views/TrackingView';
import { ChargingView } from './views/ChargingView';
import { PaymentView } from './views/PaymentView';
import { SuccessView } from './views/SuccessView';
import { HistoryView } from './views/HistoryView';
import { AuthView } from './views/AuthView';
import { SplashView } from './views/SplashView';
import { RoleSelectionView } from './views/RoleSelectionView';
import { TechnologyView } from './views/TechnologyView';
import { HowItWorksView } from './views/HowItWorksView';
import { AccountView } from './views/AccountView';
import { AdminDashboardView } from './views/AdminDashboardView';
import { Zap, User, LogOut, History, Moon, Sun, ShieldCheck, Globe, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { TiltCard } from './components/ui/TiltCard';
import { auth, googleProvider, db } from './lib/firebase';
import { signInWithPopup, signOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from './utils/firestoreErrorHandler';

export default function App() {
  const { t, i18n } = useTranslation();
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [appState, setAppState] = useState<AppState>('SPLASH');
  const [requestedEnergy, setRequestedEnergy] = useState<number | 'auto'>('auto');
  const [selectedCarModel, setSelectedCarModel] = useState<string>('nexon');
  const [selectedPortId, setSelectedPortId] = useState<string>('ccs2');
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userRole, setUserRole] = useState<'customer' | 'admin'>('customer');
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser && appState === 'AUTH') {
        setAppState('LANDING');
      }
    });
    return () => unsubscribe();
  }, [appState]);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      setAppState('ROLE_SELECTION');
    } catch (error: any) {
      console.error("Login failed", error);
      if (error.code === 'auth/popup-closed-by-user') {
        alert("The login popup was closed. Please try again. If you're having trouble, try opening the app in a new tab.");
      } else {
        alert("Login failed: " + error.message);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setAppState('AUTH');
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const handlePaymentSuccess = async () => {
    if (user) {
      try {
        await addDoc(collection(db, 'charging_sessions'), {
          userId: user.uid,
          date: serverTimestamp(),
          location: 'San Francisco, CA', // Simulated location
          energyDelivered: requestedEnergy === 'auto' ? 21.6 : requestedEnergy
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, 'charging_sessions');
      }
    }
    setAppState('SUCCESS');
  };

  const variants = {
    initial: { opacity: 0, scale: 0.98, filter: 'blur(10px)' },
    enter: { opacity: 1, scale: 1, filter: 'blur(0px)', transition: { duration: 0.5 } },
    exit: { opacity: 0, scale: 1.02, filter: 'blur(10px)', transition: { duration: 0.4 } }
  } as any;

  return (
    <div className="min-h-[100dvh] w-full bg-emerge-dark text-white font-sans flex flex-col relative overflow-x-hidden">
      {/* Background gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-emerge-green/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-emerge-green/5 rounded-full blur-[120px]"></div>
      </div>

      <AnimatePresence mode="wait">
        <motion.header 
          key={'header-' + appState}
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -30, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="absolute top-0 left-0 w-full p-6 md:px-12 grid grid-cols-3 items-center z-50 pointer-events-none"
        >
          {/* Left Section */}
          <div className="flex justify-start items-center">
            {user && (
            <nav className="hidden md:flex gap-8 text-sm font-medium text-gray-300 pointer-events-auto bg-emerge-surface/50 backdrop-blur-md px-8 py-3 rounded-full border border-white/5 shadow-xl">
              <a href="#" onClick={(e) => { e.preventDefault(); setAppState('TECHNOLOGY'); }} className="hover:text-emerge-green transition-colors">Technology</a>
            </nav>
            )}
          </div>

          {/* Center Section - Logo */}
          <div className="flex justify-center items-center pointer-events-auto">
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setAppState('LANDING')}>
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-emerge-green/10 group-hover:bg-emerge-green/20 transition-colors flex items-center justify-center border border-emerge-green/30 backdrop-blur-md">
                <Zap className="w-5 h-5 md:w-6 md:h-6 text-emerge-green" />
              </div>
              <div className="flex flex-col">
                <h1 className="font-display font-bold text-xl md:text-2xl leading-none text-white whitespace-nowrap">Emerge EV</h1>
                <p className="hidden sm:block text-[10px] md:text-xs text-emerge-green font-medium tracking-wide mt-1 whitespace-nowrap">POWER WHEN YOU NEED IT</p>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex justify-end items-center pointer-events-auto">
            {user && (
            <div className="flex items-center gap-4">
              <div className="relative z-[60]">
                <button
                  onClick={() => setShowLangMenu(!showLangMenu)}
                  className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-300 transition-colors border border-white/5 text-sm font-medium"
                >
                  <Globe className="w-4 h-4" />
                  <span className="hidden sm:inline">{i18n.language === 'es' ? 'Español' : 'English'}</span>
                  <ChevronDown className="w-3 h-3" />
                </button>
                
                <AnimatePresence>
                  {showLangMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-40 rounded-xl bg-emerge-surface/95 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden py-1 z-[100]"
                    >
                      <button
                        onClick={() => { i18n.changeLanguage('en'); setShowLangMenu(false); }}
                        className={`w-full text-left px-4 py-2 text-sm transition-colors ${i18n.language === 'en' ? 'bg-white/10 text-white font-medium' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                      >
                        English
                      </button>
                      <button
                        onClick={() => { i18n.changeLanguage('es'); setShowLangMenu(false); }}
                        className={`w-full text-left px-4 py-2 text-sm transition-colors ${i18n.language === 'es' ? 'bg-white/10 text-white font-medium' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                      >
                        Español
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 text-gray-300 transition-colors border border-white/5"
                aria-label="Toggle Theme"
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              
              <div className="flex items-center gap-4">
                {userRole === 'admin' ? (
                  <button 
                    onClick={() => setAppState('ADMIN_DASHBOARD')}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500 text-white text-sm font-medium transition-colors border border-blue-400/50 shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span className="hidden sm:inline">Admin Panel</span>
                  </button>
                ) : null}
                <button 
                  onClick={() => setAppState('ACCOUNT')}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-300 text-sm font-medium transition-colors border border-white/5"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">Account</span>
                </button>
              </div>
            </div>
            )}
            {!user && (
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 text-gray-300 transition-colors border border-white/5"
                  aria-label="Toggle Theme"
                >
                  {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
                <div className="relative z-[60]">
                  <button
                    onClick={() => setShowLangMenu(!showLangMenu)}
                    className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-300 transition-colors border border-white/5 text-sm font-medium"
                  >
                    <Globe className="w-4 h-4" />
                    <span className="hidden sm:inline">{i18n.language === 'es' ? 'Español' : 'English'}</span>
                    <ChevronDown className="w-3 h-3" />
                  </button>
                  
                  <AnimatePresence>
                    {showLangMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-40 rounded-xl bg-emerge-surface/95 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden py-1 z-[100]"
                      >
                        <button
                          onClick={() => { i18n.changeLanguage('en'); setShowLangMenu(false); }}
                          className={`w-full text-left px-4 py-2 text-sm transition-colors ${i18n.language === 'en' ? 'bg-white/10 text-white font-medium' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                        >
                          English
                        </button>
                        <button
                          onClick={() => { i18n.changeLanguage('es'); setShowLangMenu(false); }}
                          className={`w-full text-left px-4 py-2 text-sm transition-colors ${i18n.language === 'es' ? 'bg-white/10 text-white font-medium' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                        >
                          Español
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                {appState !== 'AUTH' && (
                  <button 
                    onClick={() => setAppState('AUTH')}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerge-green text-black font-medium hover:bg-emerge-green/90 transition-colors shadow-[0_0_20px_rgba(74,222,128,0.2)]"
                  >
                    <User className="w-4 h-4" />
                    <span>Sign In</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </motion.header>
      </AnimatePresence>

      <main className="flex-1 w-full relative z-10 pt-24 flex flex-col">
        <AnimatePresence mode="wait">
          {appState === 'SPLASH' && (
            <motion.div key="splash" variants={variants} initial="initial" animate="enter" exit="exit" className="flex-1 flex flex-col z-[100] fixed inset-0 bg-emerge-dark">
              <SplashView onComplete={() => setAppState('AUTH')} />
            </motion.div>
          )}

          {appState === 'AUTH' && (
            <motion.div key="auth" variants={variants} initial="initial" animate="enter" exit="exit" className="flex-1 flex flex-col z-[90] fixed inset-0 bg-emerge-dark pt-24">
              <AuthView onBack={() => setAppState('LANDING')} onLogin={handleLogin} />
            </motion.div>
          )}

          {appState === 'ROLE_SELECTION' && (
            <motion.div key="role_selection" variants={variants} initial="initial" animate="enter" exit="exit" className="flex-1 flex flex-col z-[80] fixed inset-0 bg-emerge-dark pt-24">
              <RoleSelectionView 
                onSelectRole={(role) => {
                  setUserRole(role);
                  if (role === 'admin') {
                    setAppState('ADMIN_DASHBOARD');
                  } else {
                    setAppState('LANDING');
                  }
                }} 
                onBack={() => setAppState('AUTH')}
              />
            </motion.div>
          )}

          {appState === 'ADMIN_DASHBOARD' && (
            <motion.div key="admin_dashboard" variants={variants} initial="initial" animate="enter" exit="exit" className="flex-1 flex flex-col">
              <AdminDashboardView onBack={() => setAppState('LANDING')} />
            </motion.div>
          )}

          {appState === 'LANDING' && (
            <motion.div key="landing" variants={variants} initial="initial" animate="enter" exit="exit" className="flex-1 flex flex-col">
              <LandingView 
                onStart={() => setAppState('REQUEST')} 
                onHowItWorks={() => setAppState('HOW_IT_WORKS')} 
              />
            </motion.div>
          )}
          
          {appState === 'REQUEST' && (
            <motion.div key="request" variants={variants} initial="initial" animate="enter" exit="exit" className="flex-1 flex flex-col">
              <RequestView 
                onBack={() => setAppState('LANDING')} 
                onContinue={(energy, carId, portId) => {
                  setRequestedEnergy(energy);
                  setSelectedCarModel(carId);
                  setSelectedPortId(portId);
                  setAppState('TRACKING');
                }} 
              />
            </motion.div>
          )}

          {appState === 'TRACKING' && (
            <motion.div key="tracking" variants={variants} initial="initial" animate="enter" exit="exit" className="flex-1 flex flex-col">
              <TrackingView 
                onBack={() => setAppState('REQUEST')}
                onArrived={() => setAppState('CHARGING')}
              />
            </motion.div>
          )}

          {appState === 'CHARGING' && (
            <motion.div key="charging" variants={variants} initial="initial" animate="enter" exit="exit" className="flex-1 flex flex-col">
              <ChargingView 
                energyRequested={requestedEnergy}
                carModel={selectedCarModel}
                portId={selectedPortId}
                onComplete={() => setAppState('PAYMENT')}
                onBack={() => setAppState('TRACKING')}
              />
            </motion.div>
          )}

          {appState === 'PAYMENT' && (
            <motion.div key="payment" variants={variants} initial="initial" animate="enter" exit="exit" className="flex-1 flex items-center justify-center p-4 sm:p-6">
              <TiltCard className="w-full max-w-xl bg-emerge-surface/80 backdrop-blur-2xl rounded-[2rem] border border-white/10 shadow-2xl overflow-hidden h-[90dvh] sm:h-[85dvh] sm:max-h-[800px] flex flex-col">
                <PaymentView 
                  onPay={handlePaymentSuccess}
                  onBack={() => setAppState('CHARGING')}
                />
              </TiltCard>
            </motion.div>
          )}

          {appState === 'SUCCESS' && (
            <motion.div key="success" variants={variants} initial="initial" animate="enter" exit="exit" className="flex-1 flex items-center justify-center p-4 sm:p-6">
               <TiltCard className="w-full max-w-xl bg-emerge-surface/80 backdrop-blur-2xl rounded-[2rem] border border-white/10 shadow-2xl overflow-hidden h-[90dvh] sm:h-[85dvh] sm:max-h-[800px] flex flex-col">
                <SuccessView 
                  onHome={() => setAppState('LANDING')}
                  energyDelivered={requestedEnergy}
                />
              </TiltCard>
            </motion.div>
          )}

          {appState === 'HISTORY' && (
            <motion.div key="history" variants={variants} initial="initial" animate="enter" exit="exit" className="flex-1 flex flex-col">
              <HistoryView onBack={() => setAppState('LANDING')} />
            </motion.div>
          )}

          {appState === 'TECHNOLOGY' && (
            <motion.div key="technology" variants={variants} initial="initial" animate="enter" exit="exit" className="flex-1 flex flex-col">
              <TechnologyView onBack={() => setAppState('LANDING')} />
            </motion.div>
          )}

          {appState === 'HOW_IT_WORKS' && (
            <motion.div key="howItWorks" variants={variants} initial="initial" animate="enter" exit="exit" className="flex-1 flex flex-col">
              <HowItWorksView onBack={() => setAppState('LANDING')} />
            </motion.div>
          )}

          {appState === 'ACCOUNT' && (
            <motion.div key="account" variants={variants} initial="initial" animate="enter" exit="exit" className="flex-1 flex flex-col">
              <AccountView 
                onBack={() => setAppState('LANDING')} 
                onNavigateHistory={() => setAppState('HISTORY')}
                onLogout={handleLogout}
                user={user}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <AnimatePresence mode="wait">
        {!['SPLASH', 'AUTH', 'ROLE_SELECTION'].includes(appState) && (
          <motion.footer
            key={'footer-' + appState}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 30, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-full p-4 border-t border-white/5 bg-emerge-dark/50 backdrop-blur-md text-center pointer-events-none z-50 flex items-center justify-center text-xs text-gray-500 font-medium"
          >
            <p>&copy; 2026 Emerge EV. All rights reserved.</p>
          </motion.footer>
        )}
      </AnimatePresence>
    </div>
  );
}
