// src/pages/Profile.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  User, 
  Edit, 
  Save, 
  X, 
  Trophy, 
  Code, 
  Clock, 
  TrendingUp, 
  Award, 
  Calendar,
  Mail,
  Phone,
  Globe,
  Shield,
  LogOut,
  Settings,
  Bell,
  Key,
  CreditCard,
  HelpCircle,
  Star,
  Target,
  Zap,
  BarChart3,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { useAuth } from "../components/AuthContext";

interface UserStat {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  progress?: number;
}

interface Problem {
  id: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  solvedDate: string;
  language: string;
}

interface Contest {
  id: string;
  name: string;
  rank: number;
  date: string;
  score: number;
}

const Profile: React.FC = () => {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    bio: "IOI musobaqalari uchun tayyorgarlik ko'rayotgan dasturchi",
  });
  
  const [activeTab, setActiveTab] = useState<'overview' | 'solutions' | 'contests' | 'settings'>('overview');
  const [isLoading, setIsLoading] = useState(false);

  // Mock statistics
  const userStats: UserStat[] = [
    { label: "Yechilgan Masalalar", value: user?.solvedProblems || 42, icon: <Code size={20} />, color: "text-green-400", progress: 65 },
    { label: "Umumiy Ball", value: user?.totalScore || 1250, icon: <Trophy size={20} />, color: "text-yellow-400", progress: 80 },
    { label: "Reyting", value: user?.rank || 15, icon: <TrendingUp size={20} />, color: "text-blue-400", progress: 90 },
    { label: "Ketgan Vaqt", value: 256, icon: <Clock size={20} />, color: "text-purple-400", progress: 45 },
  ];

  // Mock solved problems
  const solvedProblems: Problem[] = [
    { id: "1", title: "Ikkilik daraxt", difficulty: "medium", solvedDate: "2024-02-01", language: "Python" },
    { id: "2", title: "Dijkstra algoritmi", difficulty: "hard", solvedDate: "2024-02-03", language: "C++" },
    { id: "3", title: "Fibonacci ketma-ketligi", difficulty: "easy", solvedDate: "2024-01-28", language: "JavaScript" },
    { id: "4", title: "Qidiruv algoritmlari", difficulty: "medium", solvedDate: "2024-01-25", language: "Python" },
    { id: "5", title: "Sortirovka algoritmlari", difficulty: "medium", solvedDate: "2024-01-20", language: "Java" },
  ];

  // Mock contests
  const contests: Contest[] = [
    { id: "1", name: "IOI Bosqich 1", rank: 5, date: "2024-01-15", score: 950 },
    { id: "2", name: "Dasturlash Kubogi", rank: 12, date: "2024-01-10", score: 850 },
    { id: "3", name: "Algorithm Challenge", rank: 8, date: "2024-01-05", score: 900 },
  ];

  // Mock activity
  const recentActivity = [
    { id: 1, action: "Masala yechdi", details: "Ikkilik daraxt", time: "2 soat oldin" },
    { id: 2, action: "Reyting oshirdi", details: "+25 ball", time: "Kecha" },
    { id: 3, action: "Kursni tugatdi", details: "Ma'lumotlar tuzilmasi", time: "2 kun oldin" },
    { id: 4, action: "Olimpiadada qatnashdi", details: "IOI Bosqich 1", time: "1 hafta oldin" },
  ];

  useEffect(() => {
    if (user) {
      setEditedUser({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        bio: "IOI musobaqalari uchun tayyorgarlik ko'rayotgan dasturchi",
      });
    }
  }, [user]);

  const handleSave = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      updateUser({
        name: editedUser.name,
        email: editedUser.email,
        phone: editedUser.phone,
      });
      
      setIsEditing(false);
      setIsLoading(false);
      
      // Show success message
      alert("Profil muvaffaqiyatli yangilandi!");
    }, 1000);
  };

  const handleCancel = () => {
    setEditedUser({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      bio: "IOI musobaqalari uchun tayyorgarlik ko'rayotgan dasturchi",
    });
    setIsEditing(false);
  };

  const handleLogout = () => {
    if (window.confirm("Hisobdan chiqishni xohlaysizmi?")) {
      logout();
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500/20 text-green-400';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400';
      case 'hard': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'Oson';
      case 'medium': return "O'rtacha";
      case 'hard': return 'Qiyin';
      default: return difficulty;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-8 mb-8 border border-gray-700">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              <img
                src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=6366f1&color=fff&size=128`}
                alt={user.name}
                className="w-32 h-32 rounded-full border-4 border-yellow-500 shadow-lg"
              />
              {isEditing && (
                <button className="absolute bottom-2 right-2 p-2 bg-yellow-500 rounded-full hover:bg-yellow-600 transition">
                  <Edit size={16} className="text-gray-900" />
                </button>
              )}
            </div>
            
            <div>
              {isEditing ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={editedUser.name}
                    onChange={(e) => setEditedUser({...editedUser, name: e.target.value})}
                    className="text-2xl font-bold bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yellow-500"
                    placeholder="Ism"
                  />
                  <input
                    type="email"
                    value={editedUser.email}
                    onChange={(e) => setEditedUser({...editedUser, email: e.target.value})}
                    className="text-gray-300 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yellow-500 w-full"
                    placeholder="Email"
                  />
                </div>
              ) : (
                <div>
                  <h1 className="text-3xl font-bold text-white">{user.name}</h1>
                  <p className="text-gray-400 flex items-center gap-2 mt-1">
                    <Mail size={16} /> {user.email || "Email kiritilmagan"}
                  </p>
                  <p className="text-gray-400 flex items-center gap-2 mt-1">
                    <Phone size={16} /> {user.phone || "Telefon kiritilmagan"}
                  </p>
                </div>
              )}
              
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-2 bg-gray-700/50 px-3 py-1 rounded-full">
                  <Trophy size={16} className="text-yellow-400" />
                  <span className="text-sm font-medium">#{user.rank || "Reyting yo'q"}</span>
                </div>
                <div className="flex items-center gap-2 bg-gray-700/50 px-3 py-1 rounded-full">
                  <Code size={16} className="text-green-400" />
                  <span className="text-sm font-medium">{user.solvedProblems || 0} masala</span>
                </div>
                <div className="flex items-center gap-2 bg-gray-700/50 px-3 py-1 rounded-full">
                  <Star size={16} className="text-blue-400" />
                  <span className="text-sm font-medium">{user.totalScore || 0} ball</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white font-medium px-6 py-3 rounded-lg hover:from-green-600 hover:to-green-700 transition disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Save size={18} />
                  )}
                  Saqlash
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 bg-gray-700 text-white font-medium px-6 py-3 rounded-lg hover:bg-gray-600 transition"
                >
                  <X size={18} />
                  Bekor qilish
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 font-medium px-6 py-3 rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition"
                >
                  <Edit size={18} />
                  Tahrirlash
                </button>
                <button
                  onClick={() => navigate("/settings")}
                  className="flex items-center gap-2 bg-gray-700 text-white font-medium px-6 py-3 rounded-lg hover:bg-gray-600 transition"
                >
                  <Settings size={18} />
                  Sozlamalar
                </button>
              </>
            )}
          </div>
        </div>
        
        {isEditing ? (
          <div className="mt-6">
            <label className="block text-gray-300 mb-2">Bio</label>
            <textarea
              value={editedUser.bio}
              onChange={(e) => setEditedUser({...editedUser, bio: e.target.value})}
              className="w-full h-32 bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-yellow-500 resize-none"
              placeholder="O'zingiz haqingizda qisqacha ma'lumot..."
            />
          </div>
        ) : (
          <p className="mt-6 text-gray-300">{editedUser.bio}</p>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {userStats.map((stat, index) => (
          <div key={index} className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.color.replace('text-', 'bg-')}/20`}>
                {stat.icon}
              </div>
              <span className="text-2xl font-bold text-white">{stat.value}</span>
            </div>
            <h3 className="text-gray-400 text-sm mb-2">{stat.label}</h3>
            {stat.progress && (
              <div className="mt-3">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Progress</span>
                  <span>{stat.progress}%</span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${stat.color.replace('text-', 'bg-')} transition-all`}
                    style={{ width: `${stat.progress}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-gray-700 mb-8">
        <div className="flex space-x-8">
          {[
            { id: 'overview', label: 'Umumiy koʻrinish', icon: <User size={18} /> },
            { id: 'solutions', label: 'Yechimlar', icon: <Code size={18} /> },
            { id: 'contests', label: 'Olimpiadalar', icon: <Trophy size={18} /> },
            { id: 'settings', label: 'Sozlamalar', icon: <Settings size={18} /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 pb-3 text-sm font-medium border-b-2 transition ${
                activeTab === tab.id
                  ? 'border-yellow-500 text-yellow-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Overview & Activity */}
        <div className="lg:col-span-2 space-y-8">
          {activeTab === 'overview' && (
            <>
              {/* Recent Activity */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Zap size={20} className="text-yellow-400" />
                    So'nggi Faoliyat
                  </h2>
                  <button className="text-sm text-gray-400 hover:text-white">
                    Barchasini ko'rish
                  </button>
                </div>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center gap-4 p-4 bg-gray-700/30 rounded-lg border border-gray-700/50">
                      <div className="p-2 bg-blue-500/20 rounded-lg">
                        <CheckCircle size={18} className="text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-white">{activity.action}</div>
                        <div className="text-sm text-gray-400">{activity.details}</div>
                      </div>
                      <div className="text-sm text-gray-500">{activity.time}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Achievements */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Award size={20} className="text-yellow-400" />
                  Yutuqlar
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { title: "Boshlovchi", desc: "Birinchi masala", icon: "🎯", earned: true },
                    { title: "10 Masala", desc: "10 ta masala yechish", icon: "🔥", earned: true },
                    { title: "Olimpiadachi", desc: "Olimpiadada qatnashish", icon: "🏆", earned: true },
                    { title: "Tezkor", desc: "5 daqiqada yechish", icon: "⚡", earned: false },
                    { title: "Qattiq Ish", desc: "100 soat ishlash", icon: "💪", earned: false },
                    { title: "Professional", desc: "50 ta masala", icon: "👨‍💻", earned: true },
                    { title: "Jamoachi", desc: "5 do'st taklif qilish", icon: "🤝", earned: false },
                    { title: "Ayyor", desc: "Barcha xatolarni topish", icon: "🦊", earned: false },
                  ].map((ach, idx) => (
                    <div key={idx} className={`text-center p-4 rounded-lg border ${ach.earned ? 'bg-yellow-500/10 border-yellow-500/30' : 'bg-gray-700/30 border-gray-700/50 opacity-50'}`}>
                      <div className="text-2xl mb-2">{ach.icon}</div>
                      <div className="font-medium text-white">{ach.title}</div>
                      <div className="text-xs text-gray-400 mt-1">{ach.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeTab === 'solutions' && (
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Code size={20} className="text-green-400" />
                  Yechilgan Masalalar
                </h2>
                <div className="flex gap-2">
                  <select className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-1.5 text-sm text-white">
                    <option>Barchasi</option>
                    <option>Python</option>
                    <option>JavaScript</option>
                    <option>C++</option>
                    <option>Java</option>
                  </select>
                  <select className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-1.5 text-sm text-white">
                    <option>Murakkablik</option>
                    <option>Oson</option>
                    <option>O'rtacha</option>
                    <option>Qiyin</option>
                  </select>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left p-3 text-gray-400 font-medium">Masala</th>
                      <th className="text-left p-3 text-gray-400 font-medium">Murakkablik</th>
                      <th className="text-left p-3 text-gray-400 font-medium">Til</th>
                      <th className="text-left p-3 text-gray-400 font-medium">Sana</th>
                      <th className="text-left p-3 text-gray-400 font-medium"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {solvedProblems.map((problem) => (
                      <tr key={problem.id} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                        <td className="p-3">
                          <div className="font-medium hover:text-yellow-400 cursor-pointer">
                            {problem.title}
                          </div>
                        </td>
                        <td className="p-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(problem.difficulty)}`}>
                            {getDifficultyText(problem.difficulty)}
                          </span>
                        </td>
                        <td className="p-3 text-gray-300">{problem.language}</td>
                        <td className="p-3 text-gray-400">{problem.solvedDate}</td>
                        <td className="p-3">
                          <button className="text-blue-400 hover:text-blue-300 text-sm">
                            Ko'rish
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'contests' && (
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Trophy size={20} className="text-yellow-400" />
                Olimpiada Natijalari
              </h2>
              <div className="space-y-4">
                {contests.map((contest) => (
                  <div key={contest.id} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg border border-gray-700/50">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 rounded-lg">
                        <Trophy size={20} className="text-yellow-400" />
                      </div>
                      <div>
                        <div className="font-medium text-white">{contest.name}</div>
                        <div className="text-sm text-gray-400 flex items-center gap-2 mt-1">
                          <Calendar size={14} />
                          {contest.date}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-white">{contest.score} ball</div>
                      <div className="text-sm text-gray-400">O'rin: #{contest.rank}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
              <h2 className="text-xl font-bold text-white mb-6">Sozlamalar</h2>
              <div className="space-y-6">
                {/* Account Settings */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <User size={18} />
                    Hisob Sozlamalari
                  </h3>
                  <div className="grid gap-4">
                    <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Bell size={18} className="text-gray-400" />
                        <div>
                          <div className="font-medium text-white">Bildirishnomalar</div>
                          <div className="text-sm text-gray-400">Email va push bildirishnomalar</div>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Key size={18} className="text-gray-400" />
                        <div>
                          <div className="font-medium text-white">Parolni o'zgartirish</div>
                          <div className="text-sm text-gray-400">Hisob parolini yangilash</div>
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg text-sm transition">
                        O'zgartirish
                      </button>
                    </div>
                  </div>
                </div>

                {/* Security */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Shield size={18} />
                    Xavfsizlik
                  </h3>
                  <div className="p-4 bg-gray-700/30 rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <div className="font-medium text-white">Faol sessiyalar</div>
                    </div>
                    <div className="text-sm text-gray-400">
                      Joriy qurilma • Chrome • Windows • Toshkent
                    </div>
                    <button className="mt-3 text-red-400 hover:text-red-300 text-sm">
                      Barcha sessiyalarni tugatish
                    </button>
                  </div>
                </div>

                {/* Danger Zone */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <AlertCircle size={18} className="text-red-400" />
                    Xavfli Sozlamalar
                  </h3>
                  <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <div className="font-medium text-white mb-2">Hisobni o'chirish</div>
                    <div className="text-sm text-gray-300 mb-3">
                      Hisobingiz butunlay o'chiriladi. Bu amalni ortga qaytarib bo'lmaydi.
                    </div>
                    <button className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-white text-sm transition">
                      Hisobni o'chirish
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-8">
          {/* Progress Chart */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">Haftalik Progress</h3>
            <div className="space-y-3">
              {[
                { day: "Du", problems: 12 },
                { day: "Se", problems: 8 },
                { day: "Ch", problems: 15 },
                { day: "Pa", problems: 10 },
                { day: "Ju", problems: 18 },
                { day: "Sh", problems: 5 },
                { day: "Ya", problems: 14 },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-8 text-gray-400 text-sm">{item.day}</div>
                  <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-yellow-500 to-yellow-600"
                      style={{ width: `${(item.problems / 20) * 100}%` }}
                    ></div>
                  </div>
                  <div className="w-8 text-right text-sm text-gray-300">{item.problems}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Goals */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Target size={18} className="text-yellow-400" />
              Maqsadlar
            </h3>
            <div className="space-y-4">
              {[
                { goal: "100 ta masala yechish", current: 42, total: 100, color: "bg-yellow-500" },
                { goal: "Top 10 reytingga chiqish", current: 15, total: 10, color: "bg-blue-500" },
                { goal: "5 ta olimpiadada qatnashish", current: 3, total: 5, color: "bg-green-500" },
              ].map((item, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-300">{item.goal}</span>
                    <span className="text-gray-400">{item.current}/{item.total}</span>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${item.color} transition-all`}
                      style={{ width: `${(item.current / item.total) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">Tezkor Amallar</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-3 bg-gray-700/50 hover:bg-gray-700 rounded-lg transition">
                <div className="flex items-center gap-3">
                  <BarChart3 size={18} className="text-blue-400" />
                  <span className="text-white">Statistikani ko'rish</span>
                </div>
                <span className="text-gray-400">→</span>
              </button>
              
              <button className="w-full flex items-center justify-between p-3 bg-gray-700/50 hover:bg-gray-700 rounded-lg transition">
                <div className="flex items-center gap-3">
                  <CreditCard size={18} className="text-green-400" />
                  <span className="text-white">Obuna holati</span>
                </div>
                <span className="text-gray-400">→</span>
              </button>
              
              <button className="w-full flex items-center justify-between p-3 bg-gray-700/50 hover:bg-gray-700 rounded-lg transition">
                <div className="flex items-center gap-3">
                  <HelpCircle size={18} className="text-purple-400" />
                  <span className="text-white">Yordam markazi</span>
                </div>
                <span className="text-gray-400">→</span>
              </button>
              
              <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-between p-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-lg transition"
              >
                <div className="flex items-center gap-3">
                  <LogOut size={18} className="text-red-400" />
                  <span className="text-white">Chiqish</span>
                </div>
                <span className="text-red-400">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;