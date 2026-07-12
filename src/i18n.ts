import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// English translations
const en = {
  translation: {
    // Navigation & Common
    back: "Back",
    continue: "Continue",
    
    // Landing View
    heroTitle: "Charging the Future of EV",
    heroSubtitle: "Power your journey with the fastest, most reliable electric vehicle charging network in the world.",
    startCharging: "Start Charging",
    howItWorks: "How it Works",
    
    // Account View
    accountSettings: "Account Settings",
    updateProfilePic: "Update Profile Picture",
    evUser: "EV User",
    noEmail: "No email associated",
    languageRegion: "Language & Region",
    selectLanguage: "Select Application Language",
    moreLanguagesInfo: "More regional languages will be added based on demand.",
    quickActions: "Quick Actions",
    chargingHistory: "Charging History",
    viewSessions: "View previous sessions and invoices",
    signOut: "Sign Out",
    disconnectAccount: "Disconnect from your account",
    
    // Other simple fallbacks for now
    supportedModels: "Supported EV Models",
    exploreShowroom: "Interact with our simulated 3D showroom to explore the vehicles we power daily across the network."
  }
};

// Spanish
const es = {
  translation: {
    back: "Atrás",
    continue: "Continuar",
    heroTitle: "Cargando el futuro de los vehículos eléctricos",
    heroSubtitle: "Impulsa tu viaje con la red de carga de vehículos eléctricos más rápida y confiable del mundo.",
    startCharging: "Comenzar carga",
    howItWorks: "Cómo funciona",
    accountSettings: "Configuración de la cuenta",
    updateProfilePic: "Actualizar foto de perfil",
    evUser: "Usuario de VE",
    noEmail: "Sin correo asociado",
    languageRegion: "Idioma y Región",
    selectLanguage: "Seleccione el idioma de la aplicación",
    moreLanguagesInfo: "Se agregarán más idiomas regionales según la demanda.",
    quickActions: "Acciones Rápidas",
    chargingHistory: "Historial de Carga",
    viewSessions: "Ver sesiones y facturas anteriores",
    signOut: "Cerrar sesión",
    disconnectAccount: "Desconectar su cuenta",
    supportedModels: "Modelos de VE Compatibles",
    exploreShowroom: "Interactúe con nuestra sala de exposición 3D simulada para explorar los vehículos que impulsamos a diario."
  }
};

// Hindi
const hi = {
  translation: {
    back: "पीछे",
    continue: "जारी रखें",
    heroTitle: "भविष्य के ईवी को चार्ज करना",
    heroSubtitle: "दुनिया के सबसे तेज़ और विश्वसनीय इलेक्ट्रिक वाहन चार्जिंग नेटवर्क के साथ अपनी यात्रा को सशक्त बनाएं।",
    startCharging: "चार्जिंग शुरू करें",
    howItWorks: "यह कैसे काम करता है",
    accountSettings: "खाता सेटिंग",
    updateProfilePic: "प्रोफ़ाइल चित्र अपडेट करें",
    evUser: "ईवी उपयोगकर्ता",
    noEmail: "कोई ईमेल जुड़ा नहीं है",
    languageRegion: "भाषा और क्षेत्र",
    selectLanguage: "एप्लिकेशन भाषा चुनें",
    moreLanguagesInfo: "मांग के आधार पर अधिक क्षेत्रीय भाषाएं जोड़ी जाएंगी।",
    quickActions: "त्वरित कार्य",
    chargingHistory: "चार्जिंग इतिहास",
    viewSessions: "पिछला सत्र और इनवॉइस देखें",
    signOut: "साइन आउट करें",
    disconnectAccount: "अपने खाते से डिस्कनेक्ट करें",
    supportedModels: "समर्थित ईवी मॉडल",
    exploreShowroom: "नेटवर्क पर हम रोज़ाना जिन वाहनों को शक्ति देते हैं, उनका अन्वेषण करने के लिए हमारे 3D शोरूम के साथ बातचीत करें।"
  }
};

// Telugu
const te = {
  translation: {
    back: "వెనుకకు",
    continue: "కొనసాగించండి",
    heroTitle: "EV భవిష్యత్తును ఛార్జ్ చేయడం",
    heroSubtitle: "ప్రపంచంలో అత్యంత వేగవంతమైన, నమ్మదగిన ఎలక్ట్రిక్ వాహన ఛార్జింగ్ నెట్‌వర్క్‌తో మీ ప్రయాణాన్ని శక్తివంతం చేయండి.",
    startCharging: "ఛార్జింగ్ ప్రారంభించండి",
    howItWorks: "ఇది ఎలా పనిచేస్తుంది",
    accountSettings: "ఖాతా సెట్టింగ్‌లు",
    updateProfilePic: "ప్రొఫైల్ చిత్రాన్ని నవీకరించండి",
    evUser: "EV వినియోగదారు",
    noEmail: "ఇమెయిల్ లింక్ చేయబడలేదు",
    languageRegion: "భాష & ప్రాంతం",
    selectLanguage: "అప్లికేషన్ భాషను ఎంచుకోండి",
    moreLanguagesInfo: "డిమాండ్ ఆధారంగా మరిన్ని ప్రాంతీయ భాషలు జోడించబడతాయి.",
    quickActions: "శీఘ్ర చర్యలు",
    chargingHistory: "ఛార్జింగ్ చరిత్ర",
    viewSessions: "మునుపటి సెషన్‌లు మరియు ఇన్‌వాయిస్‌లను వీక్షించండి",
    signOut: "సైన్ అవుట్ చేయండి",
    disconnectAccount: "మీ ఖాతా నుండి డిస్‌కనెక్ట్ చేయండి",
    supportedModels: "మద్దతు ఉన్న EV మోడల్‌లు",
    exploreShowroom: "మేము నెట్‌వర్క్ అంతటా ప్రతిరోజూ శక్తినిచ్చే వాహనాలను అన్వేషించడానికి మా అనుకరణ 3D షోరూమ్‌తో ఇంటరాక్ట్ అవ్వండి."
  }
};

// Tamil
const ta = {
  translation: {
    back: "பின்செல்",
    continue: "தொடரவும்",
    heroTitle: "EV இன் எதிர்காலத்தை சார்ஜ் செய்கிறது",
    heroSubtitle: "உலகின் வேகமான, நம்பகமான மின்சார வாகன சார்ஜிங் நெட்வொர்க்குடன் உங்கள் பயணத்தை ஆற்றவும்.",
    startCharging: "சார்ஜிங்கைத் தொடங்கு",
    howItWorks: "எப்படி செயல்படுகிறது",
    accountSettings: "கணக்கு அமைப்புகள்",
    updateProfilePic: "சுயவிவரப் படத்தைப் புதுப்பிக்கவும்",
    evUser: "EV பயனர்",
    noEmail: "மின்னஞ்சல் இணைக்கப்படவில்லை",
    languageRegion: "மொழி & பிராந்தியம்",
    selectLanguage: "பயன்பாட்டு மொழியைத் தேர்ந்தெடுக்கவும்",
    moreLanguagesInfo: "தேவையின் அடிப்படையில் அதிக பிராந்திய மொழிகள் சேர்க்கப்படும்.",
    quickActions: "விரைவான செயல்கள்",
    chargingHistory: "சார்ஜிங் வரலாறு",
    viewSessions: "முந்தைய அமர்வுகள் மற்றும் விலைப்பட்டியல்களைக் காண்க",
    signOut: "வெளியேறு",
    disconnectAccount: "உங்கள் கணக்கிலிருந்து துண்டிக்கவும்",
    supportedModels: "ஆதரிக்கப்படும் EV மாதிரிகள்",
    exploreShowroom: "நெட்வொர்க் முழுவதும் நாங்கள் தினமும் இயக்கும் வாகனங்களை ஆராய எங்கள் 3D ஷோரூமுடன் தொடர்பு கொள்ளுங்கள்."
  }
};

// French
const fr = {
  translation: {
    back: "Retour",
    continue: "Continuer",
    heroTitle: "Recharger l'avenir du VE",
    heroSubtitle: "Alimentez votre trajet avec le réseau de recharge pour véhicules électriques le plus rapide et le plus fiable au monde.",
    startCharging: "Démarrer la charge",
    howItWorks: "Comment ça marche",
    accountSettings: "Paramètres du compte",
    updateProfilePic: "Mettre à jour la photo de profil",
    evUser: "Utilisateur VE",
    noEmail: "Aucun e-mail associé",
    languageRegion: "Langue et région",
    selectLanguage: "Sélectionnez la langue de l'application",
    moreLanguagesInfo: "D'autres langues régionales seront ajoutées en fonction de la demande.",
    quickActions: "Actions rapides",
    chargingHistory: "Historique de charge",
    viewSessions: "Voir les sessions et factures précédentes",
    signOut: "Se déconnecter",
    disconnectAccount: "Déconnecter votre compte",
    supportedModels: "Modèles VE pris en charge",
    exploreShowroom: "Interagissez avec notre salle d'exposition 3D simulée pour explorer les véhicules que nous alimentons au quotidien."
  }
};

// Chinese
const zh = {
  translation: {
    back: "返回",
    continue: "继续",
    heroTitle: "为电动汽车的未来充电",
    heroSubtitle: "使用全球最快、最可靠的电动汽车充电网络为您的旅程提供动力。",
    startCharging: "开始充电",
    howItWorks: "工作原理",
    accountSettings: "账户设置",
    updateProfilePic: "更新个人资料图片",
    evUser: "电动汽车用户",
    noEmail: "未关联电子邮件",
    languageRegion: "语言和地区",
    selectLanguage: "选择应用程序语言",
    moreLanguagesInfo: "将根据需求添加更多区域语言。",
    quickActions: "快速操作",
    chargingHistory: "充电历史记录",
    viewSessions: "查看以前的会话和发票",
    signOut: "退出登录",
    disconnectAccount: "断开您的账户",
    supportedModels: "支持的电动汽车型号",
    exploreShowroom: "与我们模拟的 3D 展厅互动，探索我们每天在网络中提供动力的车辆。"
  }
};

// Marathi
const mr = {
  translation: {
    back: "मागे",
    continue: "सुरू ठेवा",
    heroTitle: "EV च्या भविष्याला चार्ज करत आहे",
    heroSubtitle: "जगातील सर्वात जलद, विश्वसनीय इलेक्ट्रिक वाहन चार्जिंग नेटवर्कसह आपल्या प्रवासाला ऊर्जा द्या.",
    startCharging: "चार्जिंग सुरू करा",
    howItWorks: "हे कसे कार्य करते",
    accountSettings: "खाते सेटिंग्ज",
    updateProfilePic: "प्रोफाइल चित्र अपडेट करा",
    evUser: "EV वापरकर्ता",
    noEmail: "कोणताही ईमेल जोडलेला नाही",
    languageRegion: "भाषा आणि प्रदेश",
    selectLanguage: "अॅप भाषा निवडा",
    moreLanguagesInfo: "मागणीनुसार अधिक प्रादेशिक भाषा जोडल्या जातील.",
    quickActions: "त्वरित कृती",
    chargingHistory: "चार्जिंग इतिहास",
    viewSessions: "मागील सत्रे आणि इनव्हॉइस पहा",
    signOut: "साइन आउट करा",
    disconnectAccount: "आपल्या खात्यातून डिस्कनेक्ट करा",
    supportedModels: "समर्थित EV मॉडेल्स",
    exploreShowroom: "आम्ही नेटवर्कवर दररोज ऊर्जा देणारी वाहने एक्सप्लोर करण्यासाठी आमच्या 3D शोरूमसह संवाद साधा."
  }
};

// Bengali
const bn = {
  translation: {
    back: "ফিরে যান",
    continue: "চালিয়ে যান",
    heroTitle: "ইভির ভবিষ্যৎ চার্জ করা হচ্ছে",
    heroSubtitle: "বিশ্বের সবচেয়ে দ্রুতগামী, নির্ভরযোগ্য বৈদ্যুতিক যান চার্জিং নেটওয়ার্কের সাথে আপনার যাত্রাকে শক্তিশালী করুন।",
    startCharging: "চার্জিং শুরু করুন",
    howItWorks: "কিভাবে কাজ করে",
    accountSettings: "অ্যাকাউন্ট সেটিংস",
    updateProfilePic: "প্রোফাইল ছবি আপডেট করুন",
    evUser: "ইভি ব্যবহারকারী",
    noEmail: "কোনো ইমেল যুক্ত নেই",
    languageRegion: "ভাষা ও অঞ্চল",
    selectLanguage: "অ্যাপ্লিকেশন ভাষা নির্বাচন করুন",
    moreLanguagesInfo: "চাহিদার ভিত্তিতে আরও আঞ্চলিক ভাষা যোগ করা হবে।",
    quickActions: "দ্রুত পদক্ষেপ",
    chargingHistory: "চার্জিং ইতিহাস",
    viewSessions: "পূর্ববর্তী সেশন এবং ইনভয়েস দেখুন",
    signOut: "সাইন আউট করুন",
    disconnectAccount: "আপনার অ্যাকাউন্ট থেকে সংযোগ বিচ্ছিন্ন করুন",
    supportedModels: "সমর্থিত ইভি মডেল",
    exploreShowroom: "নেটওয়ার্ক জুড়ে প্রতিদিন আমরা যে গাড়িগুলিকে শক্তি দিই তা অন্বেষণ করতে আমাদের 3D শোরুমের সাথে ইন্টারঅ্যাক্ট করুন।"
  }
};


i18n
  .use(initReactI18next)
  .init({
    resources: {
      en, es, fr, hi, zh, te, ta, mr, bn
    },
    lng: "en", // default language
    fallbackLng: "en",
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;
