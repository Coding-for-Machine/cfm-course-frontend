import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { 
  Search, 
  Filter, 
  Code, 
  ChevronDown, 
  BarChart3,
  Tag,
  Grid,
  List,
  X,
  RefreshCw,
  AlertCircle,
  BookOpen,
  Loader2
} from "lucide-react";
import type { 
  ProblemList, 
  Category, 
  Tag as TagType,
  Difficulty,
  ProblemType,
  ProblemStats,
  ProblemQueryParams
} from "../types/problems";
import { problemService } from "../api/problems";

// ==================== DIFFICULTY MAP ====================
const difficultyMap: Record<Difficulty, { text: string; color: string; bgColor: string }> = {
  easy: { text: "Oson", color: "text-green-400", bgColor: "bg-green-500/20" },
  medium: { text: "O'rtacha", color: "text-yellow-400", bgColor: "bg-yellow-500/20" },
  hard: { text: "Qiyin", color: "text-red-400", bgColor: "bg-red-500/20" },
};

// ==================== PROBLEM TYPE MAP ====================
const problemTypeMap: Record<ProblemType, string> = {
  darslik: "Darslik",
  test: "Test",
  probelm: "Masala",
};

// ==================== DIFFICULTY OPTIONS ====================
const difficultyOptions = [
  { value: "easy", label: "Oson" },
  { value: "medium", label: "O'rtacha" },
  { value: "hard", label: "Qiyin" },
];

// ==================== PROBLEM TYPE OPTIONS ====================
const problemTypeOptions = [
  { value: "darslik", label: "Darslik" },
  { value: "test", label: "Test" },
  { value: "probelm", label: "Masala" },
];

const Problems: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // ==================== STATE ====================
  const [problems, setProblems] = useState<ProblemList[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<TagType[]>([]);
  const [stats, setStats] = useState<ProblemStats | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState<number>(0);
  
  // ==================== INFINITE SCROLL STATE ====================
  const [offset, setOffset] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const observerTarget = useRef<HTMLDivElement>(null);
  const limit = 20;
  
  // ==================== FILTERS ====================
  const [searchTerm, setSearchTerm] = useState<string>(searchParams.get("search") || "");
  const [debouncedSearch, setDebouncedSearch] = useState<string>(searchTerm);
  const [difficultyFilter, setDifficultyFilter] = useState<Difficulty | undefined>(
    searchParams.get("difficulty") as Difficulty || undefined
  );
  const [categoryFilter, setCategoryFilter] = useState<number | undefined>(
    searchParams.get("category_id") ? parseInt(searchParams.get("category_id")!) : undefined
  );
  const [tagFilter, setTagFilter] = useState<number | undefined>(
    searchParams.get("tag_id") ? parseInt(searchParams.get("tag_id")!) : undefined
  );
  const [problemTypeFilter, setProblemTypeFilter] = useState<ProblemType | undefined>(
    searchParams.get("problem_type") as ProblemType || undefined
  );
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // ==================== DEBOUNCE SEARCH ====================
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // ==================== FETCH INITIAL DATA ====================
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [categoriesData, tagsData, statsData] = await Promise.all([
          problemService.getCategories(),
          problemService.getTags(),
          problemService.getStats()
        ]);
        
        setCategories(categoriesData);
        setTags(tagsData);
        setStats(statsData);
      } catch (err) {
        console.error("Error fetching initial data:", err);
      }
    };
    
    fetchInitialData();
  }, []);

  // ==================== FETCH PROBLEMS WITH INFINITE SCROLL ====================
  // Problems.tsx - fetchData funksiyasi
const fetchData = useCallback(async (isInitial = false) => {
  if (loading || (!hasMore && !isInitial)) return;
  
  setLoading(true);
  setError(null);
  
  try {
    // Build params for API
    const params: any = {
      limit,
      offset: isInitial ? 0 : offset,
    };
    
    if (difficultyFilter) params.difficulty = difficultyFilter;
    if (categoryFilter) params.category_id = categoryFilter;
    if (tagFilter) params.tag_id = tagFilter;
    if (problemTypeFilter) params.problem_type = problemTypeFilter;
    if (debouncedSearch) params.search = debouncedSearch;

    console.log('📤 Sending params:', params);
    
    const response = await problemService.getProblems(params);
    
    console.log('📥 Response:', response);
    
    // Response dan items va count ni olish
    const newProblems = response.items || [];
    const total = response.count || 0;
    
    setTotalCount(total);

    // Check if we have more data
    if (newProblems.length < limit) {
      setHasMore(false);
    } else {
      setHasMore(true);
    }

    // Update state
    if (isInitial) {
      setProblems(newProblems);
      setOffset(limit);
    } else {
      setProblems(prev => [...prev, ...newProblems]);
      setOffset(prev => prev + limit);
    }
    
    // Update URL params
    const newParams = new URLSearchParams();
    if (difficultyFilter) newParams.set("difficulty", difficultyFilter);
    if (categoryFilter) newParams.set("category_id", categoryFilter.toString());
    if (tagFilter) newParams.set("tag_id", tagFilter.toString());
    if (problemTypeFilter) newParams.set("problem_type", problemTypeFilter);
    if (debouncedSearch) newParams.set("search", debouncedSearch);
    
    setSearchParams(newParams);
    
  } catch (err: any) {
    console.error('❌ Fetch error:', err);
    console.error('❌ Error message:', err.message);
    console.error('❌ Error stack:', err.stack);
    setError(err.message || "Ma'lumotlarni yuklashda xato");
  } finally {
    setLoading(false);
    setInitialLoading(false);
  }
}, [
  loading, 
  hasMore, 
  offset, 
  difficultyFilter, 
  categoryFilter, 
  tagFilter, 
  problemTypeFilter, 
  debouncedSearch,
  setSearchParams
]);

  // ==================== INTERSECTION OBSERVER FOR INFINITE SCROLL ====================
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loading && !initialLoading) {
          fetchData(false);
        }
      },
      { 
        threshold: 0.1,
        rootMargin: '100px'
      }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [fetchData, hasMore, loading, initialLoading]);

  // ==================== RESET ON FILTER CHANGE ====================
  useEffect(() => {
    setProblems([]);
    setOffset(0);
    setHasMore(true);
    setInitialLoading(true);
    fetchData(true);
  }, [difficultyFilter, categoryFilter, tagFilter, problemTypeFilter, debouncedSearch]);

  // ==================== FILTER HANDLERS ====================
  const handleFilterChange = (filterType: string, value: any) => {
    switch (filterType) {
      case 'search':
        setSearchTerm(value);
        break;
      case 'difficulty':
        setDifficultyFilter(value === difficultyFilter ? undefined : value as Difficulty);
        break;
      case 'category':
        setCategoryFilter(value === categoryFilter ? undefined : value);
        break;
      case 'tag':
        setTagFilter(value === tagFilter ? undefined : value);
        break;
      case 'problem_type':
        setProblemTypeFilter(value === problemTypeFilter ? undefined : value as ProblemType);
        break;
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setDebouncedSearch("");
    setDifficultyFilter(undefined);
    setCategoryFilter(undefined);
    setTagFilter(undefined);
    setProblemTypeFilter(undefined);
  };

  // Refresh data
  const refreshData = () => {
    setProblems([]);
    setOffset(0);
    setHasMore(true);
    setInitialLoading(true);
    fetchData(true);
  };

  // Get active filters count
  const activeFiltersCount = [
    debouncedSearch,
    difficultyFilter,
    categoryFilter,
    tagFilter,
    problemTypeFilter,
  ].filter(Boolean).length;

  // ==================== RENDER PROBLEM CARD ====================
  const renderProblemCard = (problem: ProblemList, index: number) => {
    const difficulty = problem.difficulty as Difficulty;
    
    return (
      <Link
        key={`${problem.slug}-${index}`}
        to={`/problem/${problem.slug}`}
        className={`block ${
          viewMode === 'grid' 
            ? 'bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-blue-500 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10'
            : 'border-b border-gray-700/50 hover:bg-gray-800/30 transition p-4'
        } group`}
      >
        <div className={viewMode === 'grid' ? '' : 'flex items-center justify-between'}>
          <div className={viewMode === 'grid' ? 'mb-4' : 'flex-1'}>
            <div className="flex justify-between items-start mb-2">
              <h3 className={`font-semibold group-hover:text-blue-400 transition ${
                viewMode === 'grid' ? 'text-lg' : 'text-base'
              }`}>
                {problem.title}
                {problem.problem_type && (
                  <span className="ml-2 text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded-full">
                    {problemTypeMap[problem.problem_type]}
                  </span>
                )}
                {problem.is_solved && (
                  <span className="ml-2 text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
                    ✓ Yechilgan
                  </span>
                )}
              </h3>
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                difficultyMap[difficulty]?.bgColor
              } ${difficultyMap[difficulty]?.color} border-current/30`}>
                {difficultyMap[difficulty]?.text}
              </span>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-3">
              {problem.category && (
                <span className="px-2 py-1 bg-gray-700/50 text-gray-300 rounded-full text-xs border border-gray-600">
                  {problem.category.name}
                </span>
              )}
              {problem.tags?.slice(0, 3).map((tag) => (
                <span
                  key={tag.id}
                  className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded-full text-xs border border-blue-500/30"
                >
                  #{tag.name}
                </span>
              ))}
              {problem.tags && problem.tags.length > 3 && (
                <span className="px-2 py-1 bg-gray-700/50 text-gray-400 rounded-full text-xs">
                  +{problem.tags.length - 3}
                </span>
              )}
            </div>

            {viewMode === 'list' && problem.solved_count !== undefined && (
              <div className="text-xs text-gray-500 mt-1">
                ✓ {problem.solved_count} marta yechilgan
              </div>
            )}
          </div>
          
          <div className={`flex items-center gap-4 ${
            viewMode === 'grid' ? 'justify-between' : ''
          }`}>
            <div className="flex items-center gap-4 text-sm">
              <div className="text-center">
                <div className="text-white font-semibold">{problem.points}</div>
                <div className="text-gray-500 text-xs">Ball</div>
              </div>
              {viewMode === 'grid' && problem.solved_count !== undefined && (
                <div className="text-center">
                  <div className="text-green-400 font-semibold text-xs">{problem.solved_count}</div>
                  <div className="text-gray-500 text-xs">Yechilgan</div>
                </div>
              )}
            </div>
            
            <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-lg transition text-sm shadow-lg shadow-blue-500/20">
              Yechish
            </button>
          </div>
        </div>
      </Link>
    );
  };

  // ==================== LOADING SKELETON ====================
  const renderSkeleton = () => (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <div className="flex justify-between items-start mb-4">
              <div className="space-y-2 flex-1">
                <div className="h-6 bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-700 rounded w-1/2"></div>
              </div>
              <div className="h-8 bg-gray-700 rounded-full w-20"></div>
            </div>
            <div className="flex gap-2 mb-4">
              <div className="h-6 bg-gray-700 rounded w-16"></div>
              <div className="h-6 bg-gray-700 rounded w-20"></div>
            </div>
            <div className="flex justify-between items-center">
              <div className="h-8 bg-gray-700 rounded w-16"></div>
              <div className="h-10 bg-gray-700 rounded-lg w-24"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 text-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header with Stats */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
                <Code className="text-blue-400" />
                Masalalar
              </h1>
              <p className="text-gray-400">
                {stats ? (
                  <>Jami <span className="text-white font-semibold">{stats.total_problems}</span> ta masala mavjud</>
                ) : (
                  `${problems.length} ta masala`
                )}
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="p-2 bg-gray-800/50 hover:bg-gray-700 rounded-lg transition border border-gray-700"
                title={viewMode === 'grid' ? "Ro'yxat ko'rinishi" : "Grid ko'rinishi"}
              >
                {viewMode === 'grid' ? <List size={20} /> : <Grid size={20} />}
              </button>
              <button
                onClick={refreshData}
                disabled={initialLoading}
                className="p-2 bg-gray-800/50 hover:bg-gray-700 rounded-lg transition disabled:opacity-50 border border-gray-700"
                title="Yangilash"
              >
                <RefreshCw size={20} className={initialLoading ? "animate-spin" : ""} />
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-800/30 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50">
                <div className="text-2xl font-bold text-blue-400">{stats.total_problems}</div>
                <div className="text-sm text-gray-400">Jami masalalar</div>
              </div>
              <div className="bg-gray-800/30 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50">
                <div className="text-2xl font-bold text-green-400">{stats.difficulty_distribution.easy}</div>
                <div className="text-sm text-gray-400">Oson</div>
              </div>
              <div className="bg-gray-800/30 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50">
                <div className="text-2xl font-bold text-yellow-400">{stats.difficulty_distribution.medium}</div>
                <div className="text-sm text-gray-400">O'rtacha</div>
              </div>
              <div className="bg-gray-800/30 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50">
                <div className="text-2xl font-bold text-red-400">{stats.difficulty_distribution.hard}</div>
                <div className="text-sm text-gray-400">Qiyin</div>
              </div>
            </div>
          )}

          {/* Search and Filters */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 mb-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
              {/* Search */}
              <div className="relative lg:col-span-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  placeholder="Masala nomi bo'yicha qidirish..."
                  className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                />
                {searchTerm && searchTerm !== debouncedSearch && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <Loader2 className="animate-spin text-blue-400" size={16} />
                  </div>
                )}
              </div>

              {/* Difficulty Filter */}
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <BarChart3 size={20} />
                </div>
                <select
                  value={difficultyFilter || ""}
                  onChange={(e) => handleFilterChange('difficulty', e.target.value || undefined)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white appearance-none focus:outline-none focus:border-blue-500"
                >
                  <option value="">Barcha murakkablik</option>
                  {difficultyOptions.map((option) => (
                    <option key={option.value} value={option.value} className="bg-gray-800">
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              </div>

              {/* Category Filter - ID bilan ishlaydi */}
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <Filter size={20} />
                </div>
                <select
                  value={categoryFilter || ""}
                  onChange={(e) => handleFilterChange('category', e.target.value ? parseInt(e.target.value) : undefined)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white appearance-none focus:outline-none focus:border-blue-500"
                >
                  <option value="">Barcha kategoriyalar</option>
                  {categories.map((category, index) => (
                    <option key={category.slug} value={index + 1}>  {/* ID o'rniga index+1 ishlatilyapti - bu xato! */}
                      {category.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              </div>

              {/* Problem Type Filter */}
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <BookOpen size={20} />
                </div>
                <select
                  value={problemTypeFilter || ""}
                  onChange={(e) => handleFilterChange('problem_type', e.target.value || undefined)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white appearance-none focus:outline-none focus:border-blue-500"
                >
                  <option value="">Barcha turlar</option>
                  {problemTypeOptions.map((option) => (
                    <option key={option.value} value={option.value} className="bg-gray-800">
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              </div>
            </div>

            {/* Active Filters */}
            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                <button
                  onClick={clearFilters}
                  className="px-3 py-1.5 bg-red-500/20 text-red-400 rounded-full text-sm border border-red-500/30 hover:bg-red-500/30 transition flex items-center gap-1"
                >
                  <X size={14} />
                  Barcha filtrlarni tozalash
                </button>
                
                {debouncedSearch && (
                  <div className="px-3 py-1.5 bg-blue-500/20 text-blue-400 rounded-full text-sm border border-blue-500/30 flex items-center gap-2">
                    <Search size={12} />
                    "{debouncedSearch}"
                    <button onClick={() => { setSearchTerm(""); setDebouncedSearch(""); }}>
                      <X size={12} className="hover:text-blue-300" />
                    </button>
                  </div>
                )}
                
                {difficultyFilter && (
                  <div className="px-3 py-1.5 bg-green-500/20 text-green-400 rounded-full text-sm border border-green-500/30 flex items-center gap-2">
                    <BarChart3 size={12} />
                    {difficultyMap[difficultyFilter]?.text}
                    <button onClick={() => setDifficultyFilter(undefined)}>
                      <X size={12} className="hover:text-green-300" />
                    </button>
                  </div>
                )}
                
                {categoryFilter && (
                  <div className="px-3 py-1.5 bg-purple-500/20 text-purple-400 rounded-full text-sm border border-purple-500/30 flex items-center gap-2">
                    <Filter size={12} />
                    {categories[categoryFilter - 1]?.name || "Kategoriya"}  {/* Bu xato! */}
                    <button onClick={() => setCategoryFilter(undefined)}>
                      <X size={12} className="hover:text-purple-300" />
                    </button>
                  </div>
                )}
                
                {tagFilter && (
                  <div className="px-3 py-1.5 bg-yellow-500/20 text-yellow-400 rounded-full text-sm border border-yellow-500/30 flex items-center gap-2">
                    <Tag size={12} />
                    {tags.find(t => t.id === tagFilter)?.name || "Tag"}
                    <button onClick={() => setTagFilter(undefined)}>
                      <X size={12} className="hover:text-yellow-300" />
                    </button>
                  </div>
                )}

                {problemTypeFilter && (
                  <div className="px-3 py-1.5 bg-indigo-500/20 text-indigo-400 rounded-full text-sm border border-indigo-500/30 flex items-center gap-2">
                    <BookOpen size={12} />
                    {problemTypeMap[problemTypeFilter]}
                    <button onClick={() => setProblemTypeFilter(undefined)}>
                      <X size={12} className="hover:text-indigo-300" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Tags Cloud */}
            {tags.length > 0 && !tagFilter && (
              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-gray-400 mr-2 flex items-center">
                  <Tag size={14} className="mr-1" />
                  Mashhur taglar:
                </span>
                {tags.slice(0, 10).map((tag) => (
                  <button
                    key={tag.id}
                    onClick={() => handleFilterChange('tag', tag.id)}
                    className="px-3 py-1 bg-gray-700/50 text-gray-300 hover:bg-gray-600 rounded-full text-xs border border-gray-600 transition"
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
              <div className="flex items-center gap-3">
                <AlertCircle size={20} className="text-red-400" />
                <span className="text-red-300">{error}</span>
                <button
                  onClick={refreshData}
                  className="ml-auto text-sm text-red-400 hover:text-red-300"
                >
                  Qayta urinish
                </button>
              </div>
            </div>
          )}

          {/* Problems Display */}
          {initialLoading ? (
            renderSkeleton()
          ) : problems.length === 0 ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-800/50 rounded-full mb-4">
                <Search size={32} className="text-gray-500" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Masalalar topilmadi
              </h3>
              <p className="text-gray-400 mb-6">
                Hozirgi filtrlarga mos keladigan masalalar mavjud emas.
              </p>
              <button
                onClick={clearFilters}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-blue-700 transition shadow-lg shadow-blue-500/20"
              >
                Barcha filtrlarni tozalash
              </button>
            </div>
          ) : (
            <>
              <div className="mb-4 text-sm text-gray-400">
                Jami {totalCount} ta masaladan {problems.length} tasi ko'rsatilmoqda
              </div>
              
              {viewMode === 'grid' ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {problems.map((problem, index) => renderProblemCard(problem, index))}
                </div>
              ) : (
                <div className="space-y-2">
                  {problems.map((problem, index) => renderProblemCard(problem, index))}
                </div>
              )}

              {/* Intersection Observer Target */}
              <div ref={observerTarget} className="h-20 flex items-center justify-center">
                {loading && (
                  <div className="flex items-center gap-3 text-blue-400">
                    <Loader2 className="animate-spin" size={24} />
                    <span className="text-sm">Yuklanmoqda...</span>
                  </div>
                )}
                {!hasMore && problems.length > 0 && (
                  <div className="text-center py-8">
                    <div className="inline-block px-6 py-3 bg-gray-800/50 rounded-lg border border-gray-700">
                      <p className="text-gray-400 text-sm">
                        Barcha masalalar yuklandi ({problems.length} / {totalCount})
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Problems;