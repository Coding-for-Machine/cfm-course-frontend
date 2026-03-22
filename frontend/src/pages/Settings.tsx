// src/pages/Settings.tsx
import React, { useState } from "react";
import { 
  Bell, 
  Shield, 
  Globe, 
  Moon, 
  Eye, 
  EyeOff,
  Save,
  ArrowLeft
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";

const Settings: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [settings, setSettings] = useState({
    notifications: true,
    emailNotifications: true,
    sound: false,
    darkMode: true,
    language: 'uz',
    showSolvedProblems: true,
    showRanking: true,
  });

  const [password, setPassword] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const handleSave = () => {
    // Settings save logic
    alert("Sozlamalar saqlandi!");
  };

  const handlePasswordChange = () => {
    if (password.new !== password.confirm) {
      alert("Yangi parollar mos kelmadi!");
      return;
    }
    
    // Password change logic
    alert("Parol muvaffaqiyatli o'zgartirildi!");
    setPassword({ current: '', new: '', confirm: '' });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-4"
        >
          <ArrowLeft size={18} />
          Orqaga
        </button>
        <h1 className="text-3xl font-bold text-white">Sozlamalar</h1>
        <p className="text-gray-400">Hisobingiz va platforma sozlamalari</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Left Column - Navigation */}
        <div className="md:col-span-1">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
            <nav className="space-y-2">
              {[
                { id: 'notifications', label: 'Bildirishnomalar', icon: Bell },
                { id: 'privacy', label: 'Maxfiylik', icon: Shield },
                { id: 'appearance', label: 'Koʻrinish', icon: Moon },
                { id: 'language', label: 'Til', icon: Globe },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700 transition text-left"
                  >
                    <Icon size={18} className="text-gray-400" />
                    <span className="text-white">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Right Column - Settings Content */}
        <div className="md:col-span-2 space-y-8">
          {/* Notifications */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Bell size={20} className="text-yellow-400" />
              Bildirishnomalar
            </h2>
            
            <div className="space-y-4">
              {[
                { label: 'Push bildirishnomalar', key: 'notifications' },
                { label: 'Email bildirishnomalar', key: 'emailNotifications' },
                { label: 'Tovush', key: 'sound' },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-white">{item.label}</div>
                    <div className="text-sm text-gray-400">
                      {item.key === 'notifications' && 'Brauzer bildirishnomalari'}
                      {item.key === 'emailNotifications' && 'Email orqali yangiliklar'}
                      {item.key === 'sound' && 'Tovush effektlari'}
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings[item.key as keyof typeof settings] as boolean}
                      onChange={(e) => setSettings({...settings, [item.key]: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Password Change */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Shield size={20} className="text-green-400" />
              Parolni o'zgartirish
            </h2>
            
            <div className="space-y-4">
              {[
                { label: 'Joriy parol', key: 'current' },
                { label: 'Yangi parol', key: 'new' },
                { label: 'Yangi parol (tasdiqlash)', key: 'confirm' },
              ].map((item) => (
                <div key={item.key}>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {item.label}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword[item.key as keyof typeof showPassword] ? "text" : "password"}
                      value={password[item.key as keyof typeof password]}
                      onChange={(e) => setPassword({...password, [item.key]: e.target.value})}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-yellow-500 pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword({...showPassword, [item.key]: !showPassword[item.key as keyof typeof showPassword]})}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showPassword[item.key as keyof typeof showPassword] ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
              ))}
              
              <button
                onClick={handlePasswordChange}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-green-600 hover:to-green-700 transition"
              >
                Parolni o'zgartirish
              </button>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 font-semibold px-8 py-3 rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition"
            >
              <Save size={18} />
              Barcha o'zgarishlarni saqlash
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;