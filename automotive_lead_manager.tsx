import React, { useState, useEffect } from 'react';
import { 
  Users, UserPlus, Car, Target, CheckCircle2, AlertTriangle, Clock, 
  Settings, LogOut, Search, Filter, Plus, Edit, Trash2, Calendar, 
  Phone, Mail, DollarSign, TrendingUp, PieChart, ShieldCheck, Check,
  ChevronRight, RefreshCw, Eye, EyeOff, Layout, Palette, Image, Upload,
  Cloud, CloudOff
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart as RePieChart, Pie, Cell, Legend 
} from 'recharts';

// Firebase Imports
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInAnonymously, 
  signInWithCustomToken, 
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  collection, 
  onSnapshot 
} from 'firebase/firestore';

// Initialize Firebase App & Services Safely
const firebaseConfig = typeof __firebase_config !== 'undefined' 
  ? JSON.parse(__firebase_config) 
  : { apiKey: "AIzaSyAYQ4a6h9AreihW_f0eGpopRK2Htk5h7c0", authDomain: "autobase-preventivi.firebaseapp.com", projectId: "autobase-preventivi" };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'automotive-lead-manager';

// Initial Mock Data
const INITIAL_USERS = [
  {
    id: 'U-101',
    name: 'Marco Rossi (Admin)',
    email: 'admin@concessionaria.it',
    username: 'admin',
    password: 'admin123',
    role: 'Admin',
    phone: '+39 02 1234567',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    assignedBrands: ['HYUNDAI', 'MAZDA', 'EMC', 'HONGQI', 'FOTON', 'ALTRE MARCHE']
  },
  {
    id: 'U-102',
    name: 'Mario Bianchi',
    email: 'm.bianchi@concessionaria.it',
    username: 'm.bianchi',
    password: 'venditore123',
    role: 'Venditore',
    phone: '+39 333 1122334',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    assignedBrands: ['HYUNDAI', 'MAZDA']
  },
  {
    id: 'U-103',
    name: 'Laura Verde',
    email: 'l.verde@concessionaria.it',
    username: 'l.verde',
    password: 'venditore123',
    role: 'Venditore',
    phone: '+39 340 5566778',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    assignedBrands: ['EMC', 'HONGQI', 'FOTON', 'ALTRE MARCHE']
  }
];

const BRANDS = ['HYUNDAI', 'MAZDA', 'EMC', 'HONGQI', 'FOTON', 'ALTRE MARCHE'];
const PAYMENT_TYPES = ['Cash', 'Finanziamento Casa Madre', 'Full Drive', 'Da Definire'];
const LEAD_STATUSES = ['Nuovo', 'Contattato', 'Preventivo', 'In Trattativa', 'Contratto', 'Perso'];

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80'
];

const INITIAL_TARGETS = {
  'U-102': {
    HYUNDAI: 5,
    MAZDA: 3,
    EMC: 0,
    HONGQI: 0,
    FOTON: 0,
    'ALTRE MARCHE': 0,
    fullDrive: 4
  },
  'U-103': {
    HYUNDAI: 0,
    MAZDA: 0,
    EMC: 4,
    HONGQI: 2,
    FOTON: 1,
    'ALTRE MARCHE': 2,
    fullDrive: 3
  }
};

const INITIAL_LEADS = [
  {
    id: 'L-1001',
    name: 'Giuseppe Verdi',
    email: 'g.verdi@gmail.com',
    phone: '+39 320 9876543',
    carBrand: 'HYUNDAI',
    carModel: 'Tucson Hybrid',
    status: 'Contratto',
    paymentType: 'Full Drive',
    assigneeId: 'U-102',
    createdAt: new Date().toISOString().split('T')[0],
    lastContactDate: new Date().toISOString().split('T')[0],
    recalls: [{ id: 1, date: new Date().toISOString().split('T')[0], note: 'Sottoscritto contratto Full Drive', completed: true }]
  },
  {
    id: 'L-1002',
    name: 'Anna Neri',
    email: 'anna.neri@outlook.it',
    phone: '+39 347 1122334',
    carBrand: 'MAZDA',
    carModel: 'CX-5',
    status: 'Preventivo',
    paymentType: 'Finanziamento Casa Madre',
    assigneeId: 'U-102',
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    lastContactDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    recalls: []
  },
  {
    id: 'L-1003',
    name: 'Roberto Gialli',
    email: 'r.gialli@libero.it',
    phone: '+39 338 9988776',
    carBrand: 'EMC',
    carModel: 'Wave 3',
    status: 'In Trattativa',
    paymentType: 'Cash',
    assigneeId: 'U-103',
    createdAt: new Date().toISOString().split('T')[0],
    lastContactDate: new Date().toISOString().split('T')[0],
    recalls: [{ id: 1, date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], note: 'Test drive concordato', completed: false }]
  }
];

export default function App() {
  // Firebase Auth user state
  const [fbUser, setFbUser] = useState(null);

  // Application Data States
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState(INITIAL_USERS);
  const [leads, setLeads] = useState(INITIAL_LEADS);
  const [targets, setTargets] = useState(INITIAL_TARGETS);
  const [brandSettings, setBrandSettings] = useState({
    dealershipName: 'Concessionaria Top Drive',
    logoUrl: '',
    themeColor: 'blue',
    bgColor: 'slate',
    layoutMode: 'standard'
  });

  // Navigation & UI States
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Modals & Forms
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [leadFormData, setLeadFormData] = useState({
    name: '', email: '', phone: '', carBrand: 'HYUNDAI', carModel: '',
    status: 'Preventivo', paymentType: 'Da Definire', assigneeId: '', recalls: []
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [brandFilter, setBrandFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [paymentFilter, setPaymentFilter] = useState('ALL');

  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userFormData, setUserFormData] = useState({
    name: '', email: '', username: '', password: '', role: 'Venditore', phone: '', avatar: '', assignedBrands: ['HYUNDAI']
  });

  const [importText, setImportText] = useState('');
  const [importAssignee, setImportAssignee] = useState('');
  const [importSuccess, setImportSuccess] = useState('');

  // 1. Firebase Auth Initialisation
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (err) {
        console.error("Firebase auth error:", err);
      }
    };

    initAuth();
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setFbUser(u);
    });

    return () => unsubscribe();
  }, []);

  // 2. Realtime Data Sync from Firestore
  useEffect(() => {
    if (!fbUser) return;

    // Listen to Leads collection
    const leadsRef = collection(db, 'artifacts', appId, 'public', 'data', 'leads');
    const unsubLeads = onSnapshot(leadsRef, 
      (snapshot) => {
        if (!snapshot.empty) {
          const loadedLeads = snapshot.docs.map(doc => doc.data());
          setLeads(loadedLeads);
        } else {
          // Initialize default leads in Firestore if empty
          INITIAL_LEADS.forEach(lead => {
            setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'leads', lead.id), lead);
          });
        }
      },
      (error) => console.error("Firestore leads sync error:", error)
    );

    // Listen to Users collection
    const usersRef = collection(db, 'artifacts', appId, 'public', 'data', 'users');
    const unsubUsers = onSnapshot(usersRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const loadedUsers = snapshot.docs.map(doc => doc.data());
          setUsers(loadedUsers);
        } else {
          INITIAL_USERS.forEach(user => {
            setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'users', user.id), user);
          });
        }
      },
      (error) => console.error("Firestore users sync error:", error)
    );

    // Listen to Targets doc
    const targetDocRef = doc(db, 'artifacts', appId, 'public', 'data', 'settings', 'targets');
    const unsubTargets = onSnapshot(targetDocRef,
      (docSnap) => {
        if (docSnap.exists()) {
          setTargets(docSnap.data());
        } else {
          setDoc(targetDocRef, INITIAL_TARGETS);
        }
      },
      (error) => console.error("Firestore targets sync error:", error)
    );

    // Listen to Brand Settings doc
    const brandDocRef = doc(db, 'artifacts', appId, 'public', 'data', 'settings', 'brand');
    const unsubBrand = onSnapshot(brandDocRef,
      (docSnap) => {
        if (docSnap.exists()) {
          setBrandSettings(docSnap.data());
        } else {
          setDoc(brandDocRef, {
            dealershipName: 'Concessionaria Top Drive',
            logoUrl: '',
            themeColor: 'blue',
            bgColor: 'slate',
            layoutMode: 'standard'
          });
        }
      },
      (error) => console.error("Firestore brand sync error:", error)
    );

    return () => {
      unsubLeads();
      unsubUsers();
      unsubTargets();
      unsubBrand();
    };
  }, [fbUser]);

  // Auth Handler
  const handleLogin = (e) => {
    e.preventDefault();
    const user = users.find(u => u.username.toLowerCase() === loginUsername.trim().toLowerCase() && u.password === loginPassword);
    if (user) {
      setCurrentUser(user);
      setLoginError('');
      setLoginUsername('');
      setLoginPassword('');
    } else {
      setLoginError('Credenziali non valide. Riprova.');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  // Lead Actions with Firestore
  const handleSaveLead = async (e) => {
    e.preventDefault();
    if (!leadFormData.name || !leadFormData.carBrand) {
      return;
    }

    const assignedVendor = leadFormData.assigneeId || (currentUser.role === 'Venditore' ? currentUser.id : users.find(u => u.role === 'Venditore')?.id || users[0].id);

    const targetId = editingLead ? editingLead.id : 'L-' + (Math.floor(Math.random() * 8999) + 1000);
    const updatedLead = {
      id: targetId,
      ...leadFormData,
      assigneeId: assignedVendor,
      createdAt: editingLead ? editingLead.createdAt : new Date().toISOString().split('T')[0],
      lastContactDate: new Date().toISOString().split('T')[0],
      recalls: leadFormData.recalls || []
    };

    if (fbUser) {
      await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'leads', targetId), updatedLead);
    }

    setIsLeadModalOpen(false);
    setEditingLead(null);
    setLeadFormData({ name: '', email: '', phone: '', carBrand: 'HYUNDAI', carModel: '', status: 'Preventivo', paymentType: 'Da Definire', assigneeId: '', recalls: [] });
  };

  const handleDeleteLead = async (id) => {
    if (fbUser) {
      await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'leads', id), { ...leads.find(l => l.id === id), _deleted: true });
      // Filter visually
      setLeads(leads.filter(l => l.id !== id));
    }
  };

  // User Actions with Firestore
  const handleSaveUser = async (e) => {
    e.preventDefault();
    if (!userFormData.name || !userFormData.username || !userFormData.password) {
      return;
    }

    const targetId = editingUser ? editingUser.id : 'U-' + (Math.floor(Math.random() * 899) + 100);
    const newUser = {
      id: targetId,
      ...userFormData,
      avatar: userFormData.avatar || PRESET_AVATARS[0]
    };

    if (fbUser) {
      await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'users', targetId), newUser);
    }

    if (currentUser && currentUser.id === targetId) {
      setCurrentUser(newUser);
    }

    setIsUserModalOpen(false);
    setEditingUser(null);
    setUserFormData({ name: '', email: '', username: '', password: '', role: 'Venditore', phone: '', avatar: '', assignedBrands: ['HYUNDAI'] });
  };

  const handleDeleteUser = async (id) => {
    if (id === currentUser?.id) return;

    if (fbUser) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  // Target Actions with Firestore
  const handleTargetChange = async (vendorId, key, value) => {
    const num = Math.max(0, parseInt(value) || 0);
    const updatedTargets = {
      ...targets,
      [vendorId]: {
        ...(targets[vendorId] || { HYUNDAI: 0, MAZDA: 0, EMC: 0, HONGQI: 0, FOTON: 0, 'ALTRE MARCHE': 0, fullDrive: 0 }),
        [key]: num
      }
    };
    setTargets(updatedTargets);

    if (fbUser) {
      await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'settings', 'targets'), updatedTargets);
    }
  };

  // Update Brand Settings
  const handleBrandSettingsChange = async (newSettings) => {
    setBrandSettings(newSettings);
    if (fbUser) {
      await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'settings', 'brand'), newSettings);
    }
  };

  // CSV Import
  const handleImportCSV = async (e) => {
    e.preventDefault();
    if (!importText.trim()) return;

    const lines = importText.trim().split('\n');
    const newLeads = [];
    
    lines.forEach(line => {
      const parts = line.split(',').map(p => p.trim());
      if (parts.length >= 1) {
        const leadObj = {
          id: 'L-' + (Math.floor(Math.random() * 8999) + 1000),
          name: parts[0] || 'Cliente Importato',
          phone: parts[1] || '',
          email: parts[2] || '',
          carBrand: (parts[3] && BRANDS.includes(parts[3].toUpperCase())) ? parts[3].toUpperCase() : 'HYUNDAI',
          carModel: parts[4] || 'Da specificare',
          status: 'Nuovo',
          paymentType: 'Da Definire',
          assigneeId: importAssignee || (currentUser.role === 'Venditore' ? currentUser.id : users[0].id),
          createdAt: new Date().toISOString().split('T')[0],
          lastContactDate: new Date().toISOString().split('T')[0],
          recalls: []
        };
        newLeads.push(leadObj);

        if (fbUser) {
          setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'leads', leadObj.id), leadObj);
        }
      }
    });

    if (newLeads.length > 0) {
      setImportSuccess(`Importati con successo ${newLeads.length} lead nel Cloud!`);
      setImportText('');
      setTimeout(() => setImportSuccess(''), 4000);
    }
  };

  // Filter Leads by Role
  const visibleLeads = leads
    .filter(l => !l._deleted)
    .filter(l => {
      if (currentUser?.role === 'Venditore') {
        return l.assigneeId === currentUser.id;
      }
      return true;
    }).filter(l => {
      const matchesSearch = l.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            l.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            l.phone.includes(searchTerm);
      const matchesBrand = brandFilter === 'ALL' || l.carBrand === brandFilter;
      const matchesStatus = statusFilter === 'ALL' || l.status === statusFilter;
      const matchesPayment = paymentFilter === 'ALL' || l.paymentType === paymentFilter;
      return matchesSearch && matchesBrand && matchesStatus && matchesPayment;
    });

  // Calculate Days Inactive
  const getInactiveDays = (lastContactDate) => {
    const diff = new Date() - new Date(lastContactDate);
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  };

  // Theme Helpers
  const getThemeBtnClass = () => {
    switch (brandSettings.themeColor) {
      case 'emerald': return 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20';
      case 'purple': return 'bg-purple-600 hover:bg-purple-500 shadow-purple-500/20';
      case 'red': return 'bg-red-600 hover:bg-red-500 shadow-red-500/20';
      case 'amber': return 'bg-amber-600 hover:bg-amber-500 shadow-amber-500/20';
      default: return 'bg-blue-600 hover:bg-blue-500 shadow-blue-500/20';
    }
  };

  const getThemeTextClass = () => {
    switch (brandSettings.themeColor) {
      case 'emerald': return 'text-emerald-400';
      case 'purple': return 'text-purple-400';
      case 'red': return 'text-red-400';
      case 'amber': return 'text-amber-400';
      default: return 'text-blue-400';
    }
  };

  const getThemeBgBarClass = () => {
    switch (brandSettings.themeColor) {
      case 'emerald': return 'bg-emerald-500';
      case 'purple': return 'bg-purple-500';
      case 'red': return 'bg-red-500';
      case 'amber': return 'bg-amber-500';
      default: return 'bg-blue-500';
    }
  };

  const getBgClasses = () => {
    switch (brandSettings.bgColor) {
      case 'neutral': return { bg: 'bg-neutral-950', card: 'bg-neutral-900', border: 'border-neutral-800', inner: 'bg-neutral-950' };
      case 'zinc': return { bg: 'bg-zinc-950', card: 'bg-zinc-900', border: 'border-zinc-800', inner: 'bg-zinc-950' };
      case 'gray': return { bg: 'bg-gray-950', card: 'bg-gray-900', border: 'border-gray-800', inner: 'bg-gray-950' };
      case 'midnight': return { bg: 'bg-black', card: 'bg-zinc-900/90', border: 'border-zinc-800', inner: 'bg-black' };
      default: return { bg: 'bg-slate-950', card: 'bg-slate-900', border: 'border-slate-800', inner: 'bg-slate-950' };
    }
  };

  const themeTheme = getBgClasses();

  // Unauthenticated Screen
  if (!currentUser) {
    return (
      <div className={`min-h-screen ${themeTheme.bg} text-slate-100 flex items-center justify-center p-4 font-sans relative`}>
        <div className={`w-full max-w-md ${themeTheme.card} border ${themeTheme.border} rounded-3xl p-8 shadow-2xl relative overflow-hidden`}>
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
          
          <div className="text-center mb-8">
            {brandSettings.logoUrl ? (
              <img src={brandSettings.logoUrl} alt="Logo" className="h-16 mx-auto mb-4 object-contain" />
            ) : (
              <div className={`w-16 h-16 ${getThemeBgBarClass()}/20 ${getThemeTextClass()} border border-blue-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                <Car className="w-8 h-8" />
              </div>
            )}
            <h1 className="text-2xl font-bold text-white tracking-wide">{brandSettings.dealershipName}</h1>
            <p className="text-xs text-slate-400 mt-1">Accedi con le tue credenziali per proseguire</p>
          </div>

          {loginError && (
            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Nome Utente / Email</label>
              <input
                type="text"
                required
                value={loginUsername}
                onChange={e => setLoginUsername(e.target.value)}
                placeholder="Es. admin o m.bianchi"
                className={`w-full ${themeTheme.inner} border ${themeTheme.border} rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors`}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Password</label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={e => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full ${themeTheme.inner} border ${themeTheme.border} rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors`}
              />
            </div>

            <button
              type="submit"
              className={`w-full py-3.5 ${getThemeBtnClass()} text-white font-medium text-sm rounded-xl transition-all shadow-lg mt-2`}
            >
              Accedi al Gestionale
            </button>
          </form>

          {/* Cloud Connection Badge */}
          <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-center gap-2 text-[11px] text-slate-500">
            {fbUser ? (
              <>
                <Cloud className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-medium">Sincronizzato con Cloud Firebase</span>
              </>
            ) : (
              <>
                <CloudOff className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-amber-400 font-medium">Connessione Cloud in corso...</span>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Active user vendor calculations
  const userVendorBrands = currentUser.role === 'Venditore' ? (currentUser.assignedBrands || BRANDS) : BRANDS;
  const userVendorTargets = targets[currentUser.id] || { HYUNDAI: 0, MAZDA: 0, EMC: 0, HONGQI: 0, FOTON: 0, 'ALTRE MARCHE': 0, fullDrive: 0 };
  
  const userVendorContracts = visibleLeads.filter(l => l.status === 'Contratto');
  const userVendorFDContracts = userVendorContracts.filter(l => l.paymentType === 'Full Drive').length;

  return (
    <div className={`min-h-screen ${themeTheme.bg} text-slate-100 flex flex-col font-sans transition-colors duration-300`}>
      {/* Top Navbar */}
      <header className={`${themeTheme.card} border-b ${themeTheme.border} sticky top-0 z-30`}>
        <div className={`mx-auto px-4 sm:px-6 h-16 flex items-center justify-between ${brandSettings.layoutMode === 'full' ? 'w-full' : 'max-w-7xl'}`}>
          <div className="flex items-center gap-3">
            {brandSettings.logoUrl ? (
              <img src={brandSettings.logoUrl} alt="Logo" className="h-8 object-contain" />
            ) : (
              <div className={`p-2 ${getThemeBgBarClass()}/20 ${getThemeTextClass()} border border-blue-500/30 rounded-xl`}>
                <Car className="w-5 h-5" />
              </div>
            )}
            <div>
              <span className="font-bold text-white text-sm sm:text-base leading-none block">{brandSettings.dealershipName}</span>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest block mt-0.5 flex items-center gap-1.5">
                Automotive Lead Manager
                <span className="inline-flex items-center gap-1 text-[9px] text-emerald-400 lowercase font-mono bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">
                  <Cloud className="w-2.5 h-2.5" /> cloud live
                </span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 ${themeTheme.inner} border ${themeTheme.border} rounded-xl px-3 py-1.5`}>
              <img src={currentUser.avatar} alt="Avatar" className="w-7 h-7 rounded-lg object-cover" />
              <div className="hidden sm:block text-left">
                <p className="text-xs font-semibold text-white leading-tight">{currentUser.name}</p>
                <p className={`text-[10px] ${getThemeTextClass()} leading-none`}>{currentUser.role}</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className={`p-2 ${themeTheme.inner} hover:bg-red-500/20 hover:text-red-400 text-slate-400 rounded-xl transition-colors`}
              title="Disconnetti"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className={`flex-1 mx-auto w-full p-4 sm:p-6 space-y-6 ${brandSettings.layoutMode === 'full' ? 'w-full' : 'max-w-7xl'}`}>
        
        {/* Navigation Bar */}
        <div className={`flex items-center gap-2 overflow-x-auto pb-2 border-b ${themeTheme.border}`}>
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === 'dashboard' ? `${getThemeBtnClass()} text-white shadow-lg` : `${themeTheme.card} text-slate-400 hover:bg-slate-800`
            }`}
          >
            <PieChart className="w-4 h-4" />
            Dashboard & KPI
          </button>

          <button
            onClick={() => setActiveTab('leads')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === 'leads' ? `${getThemeBtnClass()} text-white shadow-lg` : `${themeTheme.card} text-slate-400 hover:bg-slate-800`
            }`}
          >
            <Users className="w-4 h-4" />
            Gestione Lead ({visibleLeads.length})
          </button>

          <button
            onClick={() => setActiveTab('import')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === 'import' ? `${getThemeBtnClass()} text-white shadow-lg` : `${themeTheme.card} text-slate-400 hover:bg-slate-800`
            }`}
          >
            <Upload className="w-4 h-4" />
            Importa CSV
          </button>

          {currentUser.role === 'Admin' && (
            <>
              <button
                onClick={() => setActiveTab('targets')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                  activeTab === 'targets' ? `${getThemeBtnClass()} text-white shadow-lg` : `${themeTheme.card} text-slate-400 hover:bg-slate-800`
                }`}
              >
                <Target className="w-4 h-4" />
                Obiettivi Mensili
              </button>

              <button
                onClick={() => setActiveTab('users')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                  activeTab === 'users' ? `${getThemeBtnClass()} text-white shadow-lg` : `${themeTheme.card} text-slate-400 hover:bg-slate-800`
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                Gestione Utenti
              </button>

              <button
                onClick={() => setActiveTab('brand')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                  activeTab === 'brand' ? `${getThemeBtnClass()} text-white shadow-lg` : `${themeTheme.card} text-slate-400 hover:bg-slate-800`
                }`}
              >
                <Palette className="w-4 h-4" />
                Brand & Layout
              </button>
            </>
          )}
        </div>

        {/* TAB 1: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {currentUser.role === 'Venditore' && (
              <div className={`${themeTheme.card} border ${themeTheme.border} rounded-2xl p-5 space-y-4`}>
                <div className={`flex items-center justify-between border-b ${themeTheme.border} pb-3`}>
                  <div>
                    <h2 className="text-base font-bold text-white flex items-center gap-2">
                      <Target className={`w-5 h-5 ${getThemeTextClass()}`} />
                      Miei Obiettivi Mensili
                    </h2>
                    <p className="text-xs text-slate-400">Avanzamento vendite e contratti del mese in corso</p>
                  </div>
                  <span className={`text-xs ${getThemeBgBarClass()}/10 ${getThemeTextClass()} border border-blue-500/20 px-3 py-1 rounded-full font-medium`}>
                    Pannello Venditore
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {userVendorBrands.map(brand => {
                    const target = userVendorTargets[brand] || 0;
                    const achieved = userVendorContracts.filter(l => l.carBrand === brand).length;
                    const pct = target > 0 ? Math.min(100, Math.round((achieved / target) * 100)) : 0;

                    return (
                      <div key={brand} className={`${themeTheme.inner} border ${themeTheme.border} rounded-xl p-4 space-y-2`}>
                        <div className="flex justify-between items-center text-xs font-semibold text-slate-300">
                          <span>{brand}</span>
                          <span className={getThemeTextClass()}>{achieved} / {target}</span>
                        </div>
                        <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                          <div 
                            className={`${getThemeBgBarClass()} h-full rounded-full transition-all duration-500`} 
                            style={{ width: `${pct}%` }} 
                          />
                        </div>
                        <p className="text-[10px] text-slate-500 text-right">{pct}% completato</p>
                      </div>
                    );
                  })}

                  <div className={`bg-gradient-to-br from-indigo-950/40 to-slate-950 border border-indigo-500/30 rounded-xl p-4 space-y-2`}>
                    <div className="flex justify-between items-center text-xs font-semibold text-indigo-300">
                      <span>FULL DRIVE</span>
                      <span className="text-indigo-400">{userVendorFDContracts} / {userVendorTargets.fullDrive || 0}</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-indigo-500 h-full rounded-full transition-all duration-500" 
                        style={{ width: `${(userVendorTargets.fullDrive || 0) > 0 ? Math.min(100, Math.round((userVendorFDContracts / userVendorTargets.fullDrive) * 100)) : 0}%` }} 
                      />
                    </div>
                    <p className="text-[10px] text-indigo-400/80 text-right">
                      {(userVendorTargets.fullDrive || 0) > 0 ? Math.min(100, Math.round((userVendorFDContracts / userVendorTargets.fullDrive) * 100)) : 0}% completato
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className={`${themeTheme.card} border ${themeTheme.border} rounded-2xl p-4 flex items-center gap-4`}>
                <div className={`p-3 ${getThemeBgBarClass()}/10 ${getThemeTextClass()} rounded-xl border border-blue-500/20`}>
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Totale Lead Gestiti</p>
                  <p className="text-xl font-bold text-white">{visibleLeads.length}</p>
                </div>
              </div>

              <div className={`${themeTheme.card} border ${themeTheme.border} rounded-2xl p-4 flex items-center gap-4`}>
                <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Contratti Chiusi</p>
                  <p className="text-xl font-bold text-emerald-400">
                    {visibleLeads.filter(l => l.status === 'Contratto').length}
                  </p>
                </div>
              </div>

              <div className={`${themeTheme.card} border ${themeTheme.border} rounded-2xl p-4 flex items-center gap-4`}>
                <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
                  <Car className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Pacchetti Full Drive</p>
                  <p className="text-xl font-bold text-indigo-400">
                    {visibleLeads.filter(l => l.paymentType === 'Full Drive').length}
                  </p>
                </div>
              </div>

              <div className={`${themeTheme.card} border ${themeTheme.border} rounded-2xl p-4 flex items-center gap-4`}>
                <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Inattivi (&gt; 5 giorni)</p>
                  <p className="text-xl font-bold text-amber-400">
                    {visibleLeads.filter(l => getInactiveDays(l.lastContactDate) > 5).length}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className={`${themeTheme.card} border ${themeTheme.border} rounded-2xl p-5 space-y-4`}>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <PieChart className={`w-4 h-4 ${getThemeTextClass()}`} />
                  Distribuzione Tipologie Pagamento
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RePieChart>
                      <Pie
                        data={PAYMENT_TYPES.map(type => ({
                          name: type,
                          value: visibleLeads.filter(l => l.paymentType === type).length
                        }))}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {PAYMENT_TYPES.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={['#3b82f6', '#10b981', '#8b5cf6', '#64748b'][index % 4]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }} />
                      <Legend />
                    </RePieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className={`${themeTheme.card} border ${themeTheme.border} rounded-2xl p-5 space-y-4`}>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <BarChart className="w-4 h-4 text-emerald-400" />
                  Stato Lead in Pipeline
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={LEAD_STATUSES.map(st => ({
                      status: st,
                      count: visibleLeads.filter(l => l.status === st).length
                    }))}>
                      <XAxis dataKey="status" stroke="#64748b" fontSize={11} />
                      <YAxis stroke="#64748b" fontSize={11} />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }} />
                      <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MANAGEMENT LEADS */}
        {activeTab === 'leads' && (
          <div className="space-y-4">
            <div className={`flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between ${themeTheme.card} border ${themeTheme.border} rounded-2xl p-4`}>
              <div className="flex flex-wrap items-center gap-2 flex-1">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    placeholder="Cerca per nome, email o telefono..."
                    className={`w-full ${themeTheme.inner} border ${themeTheme.border} rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500`}
                  />
                </div>

                <select
                  value={brandFilter}
                  onChange={e => setBrandFilter(e.target.value)}
                  className={`${themeTheme.inner} border ${themeTheme.border} rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none`}
                >
                  <option value="ALL">Tutti i Brand</option>
                  {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
                </select>

                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  className={`${themeTheme.inner} border ${themeTheme.border} rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none`}
                >
                  <option value="ALL">Tutti gli Stati</option>
                  {LEAD_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>

                <select
                  value={paymentFilter}
                  onChange={e => setPaymentFilter(e.target.value)}
                  className={`${themeTheme.inner} border ${themeTheme.border} rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none`}
                >
                  <option value="ALL">Tutti i Pagamenti</option>
                  {PAYMENT_TYPES.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>

              <button
                onClick={() => {
                  setEditingLead(null);
                  setLeadFormData({ name: '', email: '', phone: '', carBrand: 'HYUNDAI', carModel: '', status: 'Preventivo', paymentType: 'Da Definire', assigneeId: currentUser.id, recalls: [] });
                  setIsLeadModalOpen(true);
                }}
                className={`flex items-center justify-center gap-2 px-4 py-2 ${getThemeBtnClass()} text-white rounded-xl text-xs font-semibold shadow-lg transition-all shrink-0`}
              >
                <Plus className="w-4 h-4" />
                Nuovo Lead
              </button>
            </div>

            <div className={`${themeTheme.card} border ${themeTheme.border} rounded-2xl overflow-hidden`}>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className={`bg-slate-950/50 border-b ${themeTheme.border} text-[11px] font-semibold text-slate-400 uppercase tracking-wider`}>
                      <th className="p-4">Cliente / Contatto</th>
                      <th className="p-4">Brand & Modello</th>
                      <th className="p-4">Stato Lead</th>
                      <th className="p-4">Pagamento</th>
                      <th className="p-4">Assegnato a</th>
                      <th className="p-4">Ultimo Contatto</th>
                      <th className="p-4 text-right">Azioni</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${themeTheme.border} text-xs`}>
                    {visibleLeads.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-slate-500">
                          Nessun lead trovato.
                        </td>
                      </tr>
                    ) : (
                      visibleLeads.map(lead => {
                        const vendor = users.find(u => u.id === lead.assigneeId);
                        const isInactive = getInactiveDays(lead.lastContactDate) > 5;

                        return (
                          <tr key={lead.id} className="hover:bg-slate-800/50 transition-colors">
                            <td className="p-4">
                              <p className="font-semibold text-white">{lead.name}</p>
                              <div className="flex flex-col text-[11px] text-slate-400 mt-0.5">
                                {lead.email && <span>{lead.email}</span>}
                                {lead.phone && <span>{lead.phone}</span>}
                              </div>
                            </td>

                            <td className="p-4">
                              <span className={`font-medium ${getThemeTextClass()} ${getThemeBgBarClass()}/10 border border-blue-500/20 px-2 py-0.5 rounded text-[10px] uppercase`}>
                                {lead.carBrand}
                              </span>
                              <p className="text-slate-300 text-xs mt-1">{lead.carModel || '—'}</p>
                            </td>

                            <td className="p-4">
                              <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-semibold ${
                                lead.status === 'Contratto' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                lead.status === 'Perso' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                                'bg-slate-800 text-slate-300'
                              }`}>
                                {lead.status}
                              </span>
                            </td>

                            <td className="p-4">
                              <span className={`inline-block px-2.5 py-1 rounded-lg text-[10px] font-semibold ${
                                lead.paymentType === 'Full Drive' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' :
                                lead.paymentType === 'Finanziamento Casa Madre' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                                'bg-slate-800 text-slate-300'
                              }`}>
                                {lead.paymentType}
                              </span>
                            </td>

                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <img src={vendor?.avatar || PRESET_AVATARS[0]} alt="" className="w-5 h-5 rounded-full object-cover" />
                                <span className="text-slate-300 text-xs">{vendor?.name || 'Non assegnato'}</span>
                              </div>
                            </td>

                            <td className="p-4">
                              <div className="flex items-center gap-1.5">
                                <span className="text-slate-300">{lead.lastContactDate}</span>
                                {isInactive && (
                                  <span className="p-1 bg-amber-500/10 text-amber-400 rounded" title="Inattivo da più di 5 giorni">
                                    <AlertTriangle className="w-3.5 h-3.5" />
                                  </span>
                                )}
                              </div>
                            </td>

                            <td className="p-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => {
                                    setEditingLead(lead);
                                    setLeadFormData(lead);
                                    setIsLeadModalOpen(true);
                                  }}
                                  className={`p-1.5 ${themeTheme.inner} hover:bg-slate-700 text-slate-300 rounded-lg transition-colors`}
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteLead(lead.id)}
                                  className={`p-1.5 ${themeTheme.inner} hover:bg-red-500/20 text-slate-300 hover:text-red-400 rounded-lg transition-colors`}
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: IMPORT CSV */}
        {activeTab === 'import' && (
          <div className={`max-w-2xl mx-auto ${themeTheme.card} border ${themeTheme.border} rounded-2xl p-6 space-y-4`}>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Upload className={`w-5 h-5 ${getThemeTextClass()}`} />
              Importazione Massiva Lead (CSV / Testo)
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Incolla il testo nel formato: <code className={getThemeTextClass()}>Nome, Telefono, Email, Brand, Modello</code> (un lead per riga).
            </p>

            {importSuccess && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>{importSuccess}</span>
              </div>
            )}

            <form onSubmit={handleImportCSV} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Assegna Lead a</label>
                <select
                  value={importAssignee}
                  onChange={e => setImportAssignee(e.target.value)}
                  className={`w-full ${themeTheme.inner} border ${themeTheme.border} rounded-xl p-3 text-xs text-slate-200 focus:outline-none`}
                >
                  <option value="">Seleziona Venditore...</option>
                  {users.filter(u => u.role === 'Venditore').map(u => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Dati Lead</label>
                <textarea
                  rows={6}
                  value={importText}
                  onChange={e => setImportText(e.target.value)}
                  placeholder="Mario Rossi, +393331234567, mario@example.com, HYUNDAI, Tucson&#10;Luigi Verdi, +393409876543, luigi@example.com, MAZDA, CX-5"
                  className={`w-full ${themeTheme.inner} border ${themeTheme.border} rounded-xl p-3 text-xs text-white focus:outline-none font-mono`}
                />
              </div>

              <button
                type="submit"
                className={`w-full py-3 ${getThemeBtnClass()} text-white font-semibold text-xs rounded-xl shadow-lg transition-all`}
              >
                Elabora ed Importa Lead nel Cloud
              </button>
            </form>
          </div>
        )}

        {/* TAB 4: TARGETS (Admin Only) */}
        {activeTab === 'targets' && currentUser.role === 'Admin' && (
          <div className={`${themeTheme.card} border ${themeTheme.border} rounded-2xl p-6 space-y-6`}>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Target className={`w-5 h-5 ${getThemeTextClass()}`} />
                Impostazione Obiettivi Mensili Venditori
              </h2>
              <p className="text-xs text-slate-400 mt-1">Definisci i target di vendita e pacchetti Full Drive per ciascun venditore</p>
            </div>

            <div className="space-y-6">
              {users.filter(u => u.role === 'Venditore').map(vendor => {
                const vendorTarget = targets[vendor.id] || { HYUNDAI: 0, MAZDA: 0, EMC: 0, HONGQI: 0, FOTON: 0, 'ALTRE MARCHE': 0, fullDrive: 0 };
                const assignedBrands = vendor.assignedBrands || BRANDS;

                return (
                  <div key={vendor.id} className={`${themeTheme.inner} border ${themeTheme.border} rounded-xl p-5 space-y-4`}>
                    <div className="flex items-center gap-3">
                      <img src={vendor.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                      <div>
                        <h3 className="text-sm font-bold text-white">{vendor.name}</h3>
                        <p className="text-[10px] text-slate-400">{assignedBrands.join(', ')}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                      {assignedBrands.map(brand => (
                        <div key={brand}>
                          <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">{brand}</label>
                          <input
                            type="number"
                            min="0"
                            value={vendorTarget[brand] || 0}
                            onChange={e => handleTargetChange(vendor.id, brand, e.target.value)}
                            className={`w-full ${themeTheme.card} border ${themeTheme.border} rounded-lg p-2 text-xs text-white text-center focus:outline-none focus:border-blue-500`}
                          />
                        </div>
                      ))}

                      <div>
                        <label className="block text-[10px] font-semibold text-indigo-400 uppercase mb-1">Full Drive</label>
                        <input
                          type="number"
                          min="0"
                          value={vendorTarget.fullDrive || 0}
                          onChange={e => handleTargetChange(vendor.id, 'fullDrive', e.target.value)}
                          className="w-full bg-indigo-950/40 border border-indigo-500/30 rounded-lg p-2 text-xs text-indigo-300 text-center focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 5: USER MANAGEMENT (Admin Only) */}
        {activeTab === 'users' && currentUser.role === 'Admin' && (
          <div className="space-y-4">
            <div className={`flex items-center justify-between ${themeTheme.card} border ${themeTheme.border} rounded-2xl p-4`}>
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <ShieldCheck className={`w-5 h-5 ${getThemeTextClass()}`} />
                  Gestione Utenti e Licenze
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">Crea e gestisci gli account della concessionaria</p>
              </div>

              <button
                onClick={() => {
                  setEditingUser(null);
                  setUserFormData({ name: '', email: '', username: '', password: '', role: 'Venditore', phone: '', avatar: PRESET_AVATARS[0], assignedBrands: ['HYUNDAI'] });
                  setIsUserModalOpen(true);
                }}
                className={`flex items-center gap-2 px-4 py-2 ${getThemeBtnClass()} text-white rounded-xl text-xs font-semibold shadow-lg transition-all`}
              >
                <UserPlus className="w-4 h-4" />
                Nuovo Utente
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {users.map(u => (
                <div key={u.id} className={`${themeTheme.card} border ${themeTheme.border} rounded-2xl p-5 space-y-4 flex flex-col justify-between`}>
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <img src={u.avatar} alt="" className="w-10 h-10 rounded-xl object-cover" />
                        <div>
                          <h3 className="text-sm font-bold text-white">{u.name}</h3>
                          <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded ${
                            u.role === 'Admin' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : `${getThemeBgBarClass()}/10 ${getThemeTextClass()} border border-blue-500/20`
                          }`}>
                            {u.role}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className={`text-xs space-y-1 text-slate-400 pt-2 border-t ${themeTheme.border}`}>
                      <p><strong className="text-slate-300">Username:</strong> {u.username}</p>
                      <p><strong className="text-slate-300">Email:</strong> {u.email || '—'}</p>
                      <p><strong className="text-slate-300">Brand Assegnati:</strong> {(u.assignedBrands || []).join(', ')}</p>
                    </div>
                  </div>

                  <div className={`flex items-center justify-end gap-2 pt-3 border-t ${themeTheme.border}`}>
                    <button
                      onClick={() => {
                        setEditingUser(u);
                        setUserFormData(u);
                        setIsUserModalOpen(true);
                      }}
                      className={`p-2 ${themeTheme.inner} hover:bg-slate-700 text-slate-300 rounded-lg text-xs flex items-center gap-1`}
                    >
                      <Edit className="w-3.5 h-3.5" /> Modifica
                    </button>
                    {u.id !== currentUser.id && (
                      <button
                        onClick={() => handleDeleteUser(u.id)}
                        className={`p-2 ${themeTheme.inner} hover:bg-red-500/20 text-slate-300 hover:text-red-400 rounded-lg text-xs`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: BRAND & LAYOUT (Admin Only) */}
        {activeTab === 'brand' && currentUser.role === 'Admin' && (
          <div className={`max-w-2xl mx-auto ${themeTheme.card} border ${themeTheme.border} rounded-2xl p-6 space-y-6`}>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Palette className={`w-5 h-5 ${getThemeTextClass()}`} />
                Personalizzazione Brand & Layout
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Modifica l'aspetto visivo, i colori del layout ed il nome dell'applicazione</p>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Nome Concessionaria</label>
                <input
                  type="text"
                  value={brandSettings.dealershipName}
                  onChange={e => handleBrandSettingsChange({ ...brandSettings, dealershipName: e.target.value })}
                  className={`w-full ${themeTheme.inner} border ${themeTheme.border} rounded-xl p-3 text-xs text-white focus:outline-none focus:border-blue-500`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">URL Logo Personalizzato (Opzionale)</label>
                <input
                  type="text"
                  value={brandSettings.logoUrl}
                  onChange={e => handleBrandSettingsChange({ ...brandSettings, logoUrl: e.target.value })}
                  placeholder="https://example.com/logo.png"
                  className={`w-full ${themeTheme.inner} border ${themeTheme.border} rounded-xl p-3 text-xs text-white focus:outline-none focus:border-blue-500`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Colore di Accento (Pulsanti & Grafici)</label>
                <div className="grid grid-cols-5 gap-3">
                  {[
                    { id: 'blue', label: 'Blu', color: 'bg-blue-600' },
                    { id: 'emerald', label: 'Verde', color: 'bg-emerald-600' },
                    { id: 'purple', label: 'Viola', color: 'bg-purple-600' },
                    { id: 'red', label: 'Rosso', color: 'bg-red-600' },
                    { id: 'amber', label: 'Arancio', color: 'bg-amber-600' }
                  ].map(c => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => handleBrandSettingsChange({ ...brandSettings, themeColor: c.id })}
                      className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                        brandSettings.themeColor === c.id ? 'border-white bg-slate-800' : `${themeTheme.inner} border-slate-800`
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-full ${c.color}`} />
                      <span className="text-[10px] text-slate-300 font-medium">{c.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Tonalità di Sfondo del Layout</label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {[
                    { id: 'slate', label: 'Slate Dark', bgBg: 'bg-slate-950' },
                    { id: 'zinc', label: 'Zinc Dark', bgBg: 'bg-zinc-950' },
                    { id: 'neutral', label: 'Neutral Dark', bgBg: 'bg-neutral-950' },
                    { id: 'gray', label: 'Gray Dark', bgBg: 'bg-gray-950' },
                    { id: 'midnight', label: 'Midnight Black', bgBg: 'bg-black' }
                  ].map(bg => (
                    <button
                      key={bg.id}
                      type="button"
                      onClick={() => handleBrandSettingsChange({ ...brandSettings, bgColor: bg.id })}
                      className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                        (brandSettings.bgColor || 'slate') === bg.id ? 'border-white bg-slate-800' : `${themeTheme.inner} border-slate-800`
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-lg ${bg.bgBg} border border-slate-700`} />
                      <span className="text-[10px] text-slate-300 font-medium">{bg.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Modalità Layout Larghezza</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleBrandSettingsChange({ ...brandSettings, layoutMode: 'standard' })}
                    className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 ${
                      brandSettings.layoutMode === 'standard' ? `${getThemeBgBarClass()}/20 border-blue-500 ${getThemeTextClass()}` : `${themeTheme.inner} border-slate-800 text-slate-400`
                    }`}
                  >
                    <Layout className="w-4 h-4" /> Larghezza Standard
                  </button>
                  <button
                    type="button"
                    onClick={() => handleBrandSettingsChange({ ...brandSettings, layoutMode: 'full' })}
                    className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 ${
                      brandSettings.layoutMode === 'full' ? `${getThemeBgBarClass()}/20 border-blue-500 ${getThemeTextClass()}` : `${themeTheme.inner} border-slate-800 text-slate-400`
                    }`}
                  >
                    <Layout className="w-4 h-4" /> Schermo Intero
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* LEAD MODAL */}
      {isLeadModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`${themeTheme.card} border ${themeTheme.border} rounded-3xl w-full max-w-lg p-6 space-y-4 max-h-[90vh] overflow-y-auto`}>
            <h3 className="text-base font-bold text-white">
              {editingLead ? 'Modifica Lead' : 'Nuovo Lead Cliente'}
            </h3>

            <form onSubmit={handleSaveLead} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Nome Cliente *</label>
                <input
                  type="text"
                  required
                  value={leadFormData.name}
                  onChange={e => setLeadFormData({ ...leadFormData, name: e.target.value })}
                  placeholder="Es. Mario Rossi"
                  className={`w-full ${themeTheme.inner} border ${themeTheme.border} rounded-xl p-2.5 text-xs text-white focus:outline-none`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Telefono (Opzionale)</label>
                  <input
                    type="text"
                    value={leadFormData.phone}
                    onChange={e => setLeadFormData({ ...leadFormData, phone: e.target.value })}
                    placeholder="+39 333 1234567"
                    className={`w-full ${themeTheme.inner} border ${themeTheme.border} rounded-xl p-2.5 text-xs text-white focus:outline-none`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Email</label>
                  <input
                    type="email"
                    value={leadFormData.email}
                    onChange={e => setLeadFormData({ ...leadFormData, email: e.target.value })}
                    placeholder="mario@example.com"
                    className={`w-full ${themeTheme.inner} border ${themeTheme.border} rounded-xl p-2.5 text-xs text-white focus:outline-none`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Brand *</label>
                  <select
                    value={leadFormData.carBrand}
                    onChange={e => setLeadFormData({ ...leadFormData, carBrand: e.target.value })}
                    className={`w-full ${themeTheme.inner} border ${themeTheme.border} rounded-xl p-2.5 text-xs text-white focus:outline-none`}
                  >
                    {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Modello Auto</label>
                  <input
                    type="text"
                    value={leadFormData.carModel}
                    onChange={e => setLeadFormData({ ...leadFormData, carModel: e.target.value })}
                    placeholder="Es. Tucson"
                    className={`w-full ${themeTheme.inner} border ${themeTheme.border} rounded-xl p-2.5 text-xs text-white focus:outline-none`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Stato Lead</label>
                  <select
                    value={leadFormData.status}
                    onChange={e => setLeadFormData({ ...leadFormData, status: e.target.value })}
                    className={`w-full ${themeTheme.inner} border ${themeTheme.border} rounded-xl p-2.5 text-xs text-white focus:outline-none`}
                  >
                    {LEAD_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Tipologia Pagamento</label>
                  <select
                    value={leadFormData.paymentType}
                    onChange={e => setLeadFormData({ ...leadFormData, paymentType: e.target.value })}
                    className={`w-full ${themeTheme.inner} border ${themeTheme.border} rounded-xl p-2.5 text-xs text-white focus:outline-none`}
                  >
                    {PAYMENT_TYPES.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>

              {currentUser.role === 'Admin' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Assegna a Venditore</label>
                  <select
                    value={leadFormData.assigneeId}
                    onChange={e => setLeadFormData({ ...leadFormData, assigneeId: e.target.value })}
                    className={`w-full ${themeTheme.inner} border ${themeTheme.border} rounded-xl p-2.5 text-xs text-white focus:outline-none`}
                  >
                    {users.filter(u => u.role === 'Venditore').map(u => (
                      <option key={u.id} value={u.id}>{u.name}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setIsLeadModalOpen(false)}
                  className={`px-4 py-2 ${themeTheme.inner} text-slate-300 rounded-xl text-xs font-semibold`}
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 ${getThemeBtnClass()} text-white rounded-xl text-xs font-semibold`}
                >
                  Salva Lead nel Cloud
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* USER MODAL */}
      {isUserModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`${themeTheme.card} border ${themeTheme.border} rounded-3xl w-full max-w-lg p-6 space-y-4 max-h-[90vh] overflow-y-auto`}>
            <h3 className="text-base font-bold text-white">
              {editingUser ? 'Modifica Utente' : 'Nuovo Utente'}
            </h3>

            <form onSubmit={handleSaveUser} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Nome Completo *</label>
                <input
                  type="text"
                  required
                  value={userFormData.name}
                  onChange={e => setUserFormData({ ...userFormData, name: e.target.value })}
                  placeholder="Es. Mario Rossi"
                  className={`w-full ${themeTheme.inner} border ${themeTheme.border} rounded-xl p-2.5 text-xs text-white focus:outline-none`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Username *</label>
                  <input
                    type="text"
                    required
                    value={userFormData.username}
                    onChange={e => setUserFormData({ ...userFormData, username: e.target.value })}
                    placeholder="m.rossi"
                    className={`w-full ${themeTheme.inner} border ${themeTheme.border} rounded-xl p-2.5 text-xs text-white focus:outline-none`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Password *</label>
                  <input
                    type="password"
                    required
                    value={userFormData.password}
                    onChange={e => setUserFormData({ ...userFormData, password: e.target.value })}
                    placeholder="••••••••"
                    className={`w-full ${themeTheme.inner} border ${themeTheme.border} rounded-xl p-2.5 text-xs text-white focus:outline-none`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Ruolo</label>
                  <select
                    value={userFormData.role}
                    onChange={e => setUserFormData({ ...userFormData, role: e.target.value })}
                    className={`w-full ${themeTheme.inner} border ${themeTheme.border} rounded-xl p-2.5 text-xs text-white focus:outline-none`}
                  >
                    <option value="Venditore">Venditore</option>
                    <option value="Admin">Amministratore</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Email</label>
                  <input
                    type="email"
                    value={userFormData.email}
                    onChange={e => setUserFormData({ ...userFormData, email: e.target.value })}
                    placeholder="email@concessionaria.it"
                    className={`w-full ${themeTheme.inner} border ${themeTheme.border} rounded-xl p-2.5 text-xs text-white focus:outline-none`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Avatar Utente</label>
                <div className="flex items-center gap-2 mb-2 overflow-x-auto pb-1">
                  {PRESET_AVATARS.map((imgUrl, idx) => (
                    <img
                      key={idx}
                      src={imgUrl}
                      alt=""
                      onClick={() => setUserFormData({ ...userFormData, avatar: imgUrl })}
                      className={`w-9 h-9 rounded-xl object-cover cursor-pointer border-2 transition-all shrink-0 ${
                        userFormData.avatar === imgUrl ? 'border-blue-500 scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    />
                  ))}
                </div>
                <input
                  type="text"
                  value={userFormData.avatar}
                  onChange={e => setUserFormData({ ...userFormData, avatar: e.target.value })}
                  placeholder="Incolla URL immagine avatar..."
                  className={`w-full ${themeTheme.inner} border ${themeTheme.border} rounded-xl p-2 text-xs text-slate-300 focus:outline-none`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Brand Assegnati</label>
                <div className={`grid grid-cols-2 gap-2 ${themeTheme.inner} border ${themeTheme.border} rounded-xl p-3`}>
                  {BRANDS.map(brand => {
                    const isChecked = (userFormData.assignedBrands || []).includes(brand);
                    return (
                      <label key={brand} className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={e => {
                            const current = userFormData.assignedBrands || [];
                            if (e.target.checked) {
                              setUserFormData({ ...userFormData, assignedBrands: [...current, brand] });
                            } else {
                              setUserFormData({ ...userFormData, assignedBrands: current.filter(b => b !== brand) });
                            }
                          }}
                          className="rounded border-slate-800 text-blue-600 focus:ring-0"
                        />
                        <span>{brand}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setIsUserModalOpen(false)}
                  className={`px-4 py-2 ${themeTheme.inner} text-slate-300 rounded-xl text-xs font-semibold`}
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 ${getThemeBtnClass()} text-white rounded-xl text-xs font-semibold`}
                >
                  Salva Utente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}