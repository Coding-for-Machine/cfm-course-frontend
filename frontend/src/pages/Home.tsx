// src/pages/Home.tsx
import React from "react";
import { Link } from "react-router-dom";
import { 
  Code, 
  Trophy, 
  BookOpen, 
  TrendingUp, 
  Users, 
  CheckCircle,
  ArrowRight,
  Star,
  Calendar
} from "lucide-react";

const Home: React.FC = () => {
  const stats = [
    { label: "Faol foydalanuvchilar", value: "1,234", icon: Users },
    { label: "Yechilgan masalalar", value: "45,678", icon: CheckCircle },
    { label: "O'tkazilgan olimpiadalar", value: "156", icon: Trophy },
    { label: "O'rtacha reyting", value: "4.8", icon: Star },
  ];

  const featuredProblems = [
    { id: 1, title: "Ikkilik daraxt", difficulty: "easy", solved: 1234 },
    { id: 2, title: "Dijkstra algoritmi", difficulty: "medium", solved: 856 },
    { id: 3, title: "Dinamik dasturlash", difficulty: "hard", solved: 342 },
  ];

  const upcomingContests = [
    { id: 1, title: "IOI bosqich 1", date: "2024-03-15", participants: 500 },
    { id: 2, title: "Dasturlash kubogi", date: "2024-03-20", participants: 300 },
    { id: 3, title: "Algorithm Challenge", date: "2024-03-25", participants: 200 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center py-12">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 bg-clip-text text-transparent">
          IOI Platformaga Xush Kelibsiz
        </h1>
        <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
          Xalqaro Informatika Olimpiadasi uchun tayyorgarlik. Masalalar yeching, 
          bilimingizni oshiring va olimpiadalar g'olibiga aylaning.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/problems"
            className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 font-semibold px-8 py-3 rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Code size={20} />
            Masalalarni Boshlash
            <ArrowRight size={18} />
          </Link>
          <Link
            to="/contests"
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold px-8 py-3 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Trophy size={20} />
            Olimpiadalarda Qatnashish
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 text-center border border-gray-700"
            >
              <Icon className="w-10 h-10 text-yellow-400 mx-auto mb-3" />
              <div className="text-3xl font-bold text-white">{stat.value}</div>
              <div className="text-gray-400 text-sm mt-1">{stat.label}</div>
            </div>
          );
        })}
      </section>

      {/* Featured Problems */}
      <section className="py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Code className="text-yellow-400" />
            Mashhur Masalalar
          </h2>
          <Link
            to="/problems"
            className="text-yellow-400 hover:text-yellow-300 flex items-center gap-1"
          >
            Barchasi <ArrowRight size={16} />
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {featuredProblems.map((problem) => (
            <Link
              key={problem.id}
              to={`/problem/${problem.id}`}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-yellow-500 transition-all duration-300 group"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold group-hover:text-yellow-400">
                  {problem.title}
                </h3>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  problem.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' :
                  problem.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {problem.difficulty}
                </span>
              </div>
              <div className="text-sm text-gray-400">
                {problem.solved.toLocaleString()} kishi yechdi
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Upcoming Contests */}
      <section className="py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Trophy className="text-yellow-400" />
            Kelgusi Olimpiadalar
          </h2>
          <Link
            to="/contests"
            className="text-yellow-400 hover:text-yellow-300 flex items-center gap-1"
          >
            Barchasi <ArrowRight size={16} />
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {upcomingContests.map((contest) => (
            <div
              key={contest.id}
              className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold">{contest.title}</h3>
                <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs">
                  Yangi
                </span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Calendar size={16} />
                  {contest.date}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Users size={16} />
                  {contest.participants} ishtirokchi
                </div>
              </div>
              <Link
                to={`/contest/${contest.id}`}
                className="mt-6 block w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white text-center py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition"
              >
                Qatnashish
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 text-center">
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700">
          <h2 className="text-2xl font-bold mb-4">O'z bilimingizni sinab ko'ring</h2>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            1000+ masala, 50+ olimpiada va interaktiv kurslar bilan 
            dasturlash bilimingizni rivojlantiring.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 font-semibold px-8 py-3 rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition"
            >
              Ro'yxatdan O'tish
            </Link>
            <Link
              to="/courses"
              className="bg-gray-700 text-white font-semibold px-8 py-3 rounded-lg hover:bg-gray-600 transition"
            >
              Kurslarni Ko'rish
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;