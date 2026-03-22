import { useState } from 'react';
import { CheckCircle, PlayCircle, Lock, Clock, Star, Users } from 'lucide-react';

export default function ContestDetail() {
    const [activeModule, setActiveModule] = useState(null);
    
    // Mock ma'lumotlar
    const courseData = {
        title: "React.js Full Course 2024",
        description: "React.js ni noldan professional darajagacha o'rganing. Hooks, Context, Redux va zamonaviy React patternlari.",
        price: "499,000 UZS",
        discountPrice: "299,000 UZS",
        discountPercent: 40,
        image: "/api/placeholder/400/250",
        progress: 65,
        totalLessons: 48,
        completedLessons: 31,
        rating: 4.8,
        students: 15420,
        instructor: "John Doe",
        modules: [
            {
                id: 1,
                title: "Kirish va asoslar",
                duration: "2 soat 30 daqiqa",
                lessons: [
                    { id: 1, title: "Kurs haqida ma'lumot", duration: "10:15", isCompleted: true, isLocked: false },
                    { id: 2, title: "React nima va nima uchun kerak?", duration: "25:30", isCompleted: true, isLocked: false },
                    { id: 3, title: "Development environment sozlash", duration: "35:20", isCompleted: false, isLocked: false },
                    { id: 4, title: "Birinchi React app", duration: "40:15", isCompleted: false, isLocked: false }
                ]
            },
            {
                id: 2,
                title: "React Komponentlari",
                duration: "3 soat 45 daqiqa",
                lessons: [
                    { id: 5, title: "Functional vs Class components", duration: "30:20", isCompleted: false, isLocked: false },
                    { id: 6, title: "Props va State", duration: "45:15", isCompleted: false, isLocked: false },
                    { id: 7, title: "Event handling", duration: "35:10", isCompleted: false, isLocked: true },
                    { id: 8, title: "Conditional rendering", duration: "40:25", isCompleted: false, isLocked: true }
                ]
            },
            {
                id: 3,
                title: "Hooks bilan tanishuv",
                duration: "4 soat 20 daqiqa",
                lessons: [
                    { id: 9, title: "useState hook", duration: "50:30", isCompleted: false, isLocked: true },
                    { id: 10, title: "useEffect hook", duration: "55:20", isCompleted: false, isLocked: true },
                    { id: 11, title: "Custom hooks", duration: "60:15", isCompleted: false, isLocked: true }
                ]
            }
        ]
    };

    const toggleModule = (moduleId) => {
        setActiveModule(activeModule === moduleId ? null : moduleId);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <h1 className="text-2xl font-bold text-gray-900">{courseData.title}</h1>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Course Info */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden sticky top-4">
                            {/* Course Image */}
                            <img 
                                src={courseData.image} 
                                alt={courseData.title}
                                className="w-full h-48 object-cover"
                            />
                            
                            <div className="p-6">
                                {/* Price */}
                                <div className="mb-6">
                                    <div className="flex items-center gap-3">
                                        <span className="text-3xl font-bold text-gray-900">{courseData.price}</span>
                                        {courseData.discountPrice && (
                                            <>
                                                <span className="text-lg text-gray-400 line-through">{courseData.discountPrice}</span>
                                                <span className="bg-red-100 text-red-600 px-2 py-1 rounded-lg text-sm font-semibold">
                                                    -{courseData.discountPercent}%
                                                </span>
                                            </>
                                        )}
                                    </div>
                                    <button className="w-full mt-4 bg-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-indigo-700 transition-colors">
                                        Kursni sotib olish
                                    </button>
                                </div>

                                {/* Progress */}
                                <div className="mb-6">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm font-medium text-gray-600">Umumiy progress</span>
                                        <span className="text-sm font-semibold text-gray-900">{courseData.progress}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                        <div 
                                            className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300"
                                            style={{ width: `${courseData.progress}%` }}
                                        ></div>
                                    </div>
                                    <div className="flex items-center gap-2 mt-3 text-sm text-gray-600">
                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                        <span>{courseData.completedLessons}/{courseData.totalLessons} dars bajarilgan</span>
                                    </div>
                                </div>

                                {/* Course Description */}
                                <div className="mb-6">
                                    <h3 className="font-semibold text-gray-900 mb-2">Kurs haqida</h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        {courseData.description}
                                    </p>
                                </div>

                                {/* Course Stats */}
                                <div className="grid grid-cols-2 gap-4 py-4 border-t border-gray-100">
                                    <div className="flex items-center gap-2">
                                        <Star className="w-4 h-4 text-yellow-400" />
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900">{courseData.rating}</p>
                                            <p className="text-xs text-gray-500">Reyting</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Users className="w-4 h-4 text-gray-400" />
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900">{courseData.students.toLocaleString()}</p>
                                            <p className="text-xs text-gray-500">O'quvchilar</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Instructor */}
                                <div className="border-t border-gray-100 pt-4">
                                    <p className="text-sm text-gray-500 mb-1">Kurs muallifi</p>
                                    <p className="font-semibold text-gray-900">{courseData.instructor}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Modules and Lessons */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Kurs tarkibi</h2>
                            
                            <div className="space-y-4">
                                {courseData.modules.map((module) => (
                                    <div key={module.id} className="border border-gray-200 rounded-lg overflow-hidden">
                                        {/* Module Header */}
                                        <button
                                            onClick={() => toggleModule(module.id)}
                                            className="w-full px-6 py-4 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`transform transition-transform ${activeModule === module.id ? 'rotate-90' : ''}`}>
                                                    ▶
                                                </div>
                                                <div className="text-left">
                                                    <h3 className="font-semibold text-gray-900">{module.title}</h3>
                                                    <p className="text-sm text-gray-500">{module.duration} • {module.lessons.length} ta dars</p>
                                                </div>
                                            </div>
                                        </button>

                                        {/* Lessons List */}
                                        {activeModule === module.id && (
                                            <div className="divide-y divide-gray-100">
                                                {module.lessons.map((lesson) => (
                                                    <div 
                                                        key={lesson.id}
                                                        className={`px-6 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors ${
                                                            lesson.isLocked ? 'opacity-50' : ''
                                                        }`}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            {lesson.isCompleted ? (
                                                                <CheckCircle className="w-5 h-5 text-green-500" />
                                                            ) : lesson.isLocked ? (
                                                                <Lock className="w-5 h-5 text-gray-300" />
                                                            ) : (
                                                                <PlayCircle className="w-5 h-5 text-indigo-600" />
                                                            )}
                                                            <span className={`text-sm ${
                                                                lesson.isLocked ? 'text-gray-400' : 'text-gray-700'
                                                            }`}>
                                                                {lesson.title}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Clock className="w-4 h-4 text-gray-400" />
                                                            <span className="text-xs text-gray-500">{lesson.duration}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}