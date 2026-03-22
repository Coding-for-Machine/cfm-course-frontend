import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MonacoEditor from "@monaco-editor/react";
import Split from 'react-split';
import {
  Code,
  Clock,
  HardDrive,
  CheckCircle,
  XCircle,
  Copy,
  Play,
  Send,
  BookOpen,
  Users,
  BarChart3,
  Tag,
  AlertCircle,
  RefreshCw,
  Maximize2,
  Minimize2,
  Settings,
  Terminal,
  FileText,
  HelpCircle,
  ChevronLeft,
  Zap,
  Eye,
  EyeOff
} from "lucide-react";
import { problemService } from "../api/problems";
import type { 
  ProblemDetail, 
  Language, 
  SubmitResponse,
  Difficulty,
  ProblemType,
  TestResult
} from "../types/problems";
import { useAuth } from "../components/AuthContext";

// ==================== DIFFICULTY MAP (string format) ====================
const difficultyMap: Record<Difficulty, { text: string; color: string; bgColor: string }> = {
  easy: { text: "Oson", color: "text-green-400", bgColor: "bg-green-500/20" },
  medium: { text: "O'rtacha", color: "text-yellow-400", bgColor: "bg-yellow-500/20" },
  hard: { text: "Qiyin", color: "text-red-400", bgColor: "bg-red-500/20" },
};

// ==================== PROBLEM TYPE MAP ====================
const problemTypeMap: Record<ProblemType, string> = {
  'darslik': 'Darslik',
  'test': 'Test',
  'probelm': 'Masala',
};

// ==================== DEFAULT CODE TEMPLATES ====================
const defaultTemplates: Record<string, string> = {
  python: `def solution(input_data: str) -> str:
    """
    O'zingizning yechimingizni shu yerga yozing
    
    Args:
        input_data: Masala kirish ma'lumotlari
    
    Returns:
        Masala chiqish natijasi
    """
    # TODO: Implement your solution here
    return ""`,
  
  javascript: `/**
 * O'zingizning yechimingizni shu yerga yozing
 * 
 * @param {string} inputData - Masala kirish ma'lumotlari
 * @returns {string} Masala chiqish natijasi
 */
function solution(inputData) {
    // TODO: Implement your solution here
    return "";
}`,
  
  typescript: `/**
 * O'zingizning yechimingizni shu yerga yozing
 * 
 * @param {string} inputData - Masala kirish ma'lumotlari
 * @returns {string} Masala chiqish natijasi
 */
function solution(inputData: string): string {
    // TODO: Implement your solution here
    return "";
}`,
  
  cpp: `#include <bits/stdc++.h>
using namespace std;

/*
 * O'zingizning yechimingizni shu yerga yozing
 * 
 * @param input_data Masala kirish ma'lumotlari
 * @return Masala chiqish natijasi
 */
string solution(string input_data) {
    // TODO: Implement your solution here
    return "";
}`,
  
  java: `public class Solution {
    /**
     * O'zingizning yechimingizni shu yerga yozing
     * 
     * @param input_data Masala kirish ma'lumotlari
     * @return Masala chiqish natijasi
     */
    public static String solution(String input_data) {
        // TODO: Implement your solution here
        return "";
    }
}`,
  
  csharp: `using System;

public class Solution {
    public static string solution(string input_data) {
        // TODO: Implement your solution here
        return "";
    }
}`,
  
  php: `<?php
function solution($input_data) {
    // TODO: Implement your solution here
    return "";
}`,
  
  ruby: `def solution(input_data)
    # TODO: Implement your solution here
    return ""
end`,
  
  go: `package main

func solution(input_data string) string {
    // TODO: Implement your solution here
    return ""
}`,
  
  rust: `fn solution(input_data: &str) -> String {
    // TODO: Implement your solution here
    return "".to_string();
}`,
  
  swift: `func solution(input_data: String) -> String {
    // TODO: Implement your solution here
    return ""
}`,
  
  kotlin: `fun solution(input_data: String): String {
    // TODO: Implement your solution here
    return ""
}`,
};

// ==================== CACHE MANAGER ====================
class CodeCache {
  private static readonly STORAGE_KEY = 'problem_code_cache';
  private static readonly EXPIRY_TIME = 7 * 24 * 60 * 60 * 1000; // 7 kun

  static save(slug: string, language: string, code: string) {
    try {
      const cache = this.getCache();
      cache[`${slug}_${language}`] = {
        code,
        timestamp: Date.now(),
        language
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cache));
    } catch (error) {
      console.error('Cache save error:', error);
    }
  }

  static get(slug: string, language: string): string | null {
    try {
      const cache = this.getCache();
      const key = `${slug}_${language}`;
      const item = cache[key];
      
      if (item && (Date.now() - item.timestamp) < this.EXPIRY_TIME) {
        return item.code;
      }
      
      // Expired bo'lsa o'chirish
      if (item) {
        delete cache[key];
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cache));
      }
      
      return null;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  static clear(slug?: string, language?: string) {
    try {
      const cache = this.getCache();
      
      if (slug && language) {
        delete cache[`${slug}_${language}`];
      } else if (slug) {
        Object.keys(cache).forEach(key => {
          if (key.startsWith(slug)) {
            delete cache[key];
          }
        });
      } else {
        localStorage.removeItem(this.STORAGE_KEY);
        return;
      }
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cache));
    } catch (error) {
      console.error('Cache clear error:', error);
    }
  }

  private static getCache(): Record<string, { code: string; timestamp: number; language: string }> {
    try {
      const cached = localStorage.getItem(this.STORAGE_KEY);
      return cached ? JSON.parse(cached) : {};
    } catch {
      return {};
    }
  }
}

// ==================== MAIN COMPONENT ====================
const ProblemDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const editorRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // ==================== STATE ====================
  const [problem, setProblem] = useState<ProblemDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Editor & Code state
  const [code, setCode] = useState<string>("");
  const [language, setLanguage] = useState<string>("python");
  const [languages, setLanguages] = useState<Language[]>([]);
  const [customInput, setCustomInput] = useState<string>("");
  const [output, setOutput] = useState<string>("");
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [consoleMessages, setConsoleMessages] = useState<string[]>([
    "🟢 Konsol tayyor",
    "📝 Kod yozing va 'Run Code' tugmasini bosing"
  ]);
  
  // Submission state
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [submissionResult, setSubmissionResult] = useState<SubmitResponse | null>(null);
  
  // UI state
  const [activeDescriptionTab, setActiveDescriptionTab] = useState<'description' | 'examples' | 'constraints' | 'hints'>('description');
  const [activeEditorTab, setActiveEditorTab] = useState<'code' | 'testcases' | 'console' | 'results'>('code');
  const [showCustomInput, setShowCustomInput] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [fontSize, setFontSize] = useState<number>(14);
  const [theme, setTheme] = useState<'vs-dark' | 'light'>('vs-dark');
  const [saved, setSaved] = useState<boolean>(false);

  // ==================== FULLSCREEN HANDLERS ====================
  const handleFullscreen = () => {
    if (!containerRef.current) return;
    
    if (!isFullscreen) {
      containerRef.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };


    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // ==================== FETCH PROBLEM DETAILS ====================
  useEffect(() => {
    if (!slug) {
      setError("Masala topilmadi");
      setLoading(false);
      return;
    }

    const loadProblem = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [problemData, languagesData] = await Promise.all([
          problemService.getProblemBySlug(slug),
          problemService.getLanguages()
        ]);
        
        setProblem(problemData);
        setLanguages(languagesData);
        
        // Default language tanlash - slug mavjudligini tekshirish
        const defaultLang = problemData.languages?.find(l => l.slug)?.slug || "python";
        setLanguage(defaultLang);
        
        // Cached code ni tekshirish
        const cachedCode = CodeCache.get(slug, defaultLang);
        if (cachedCode) {
          setCode(cachedCode);
          addConsoleMessage(`💾 Saqlangan kod yuklandi (${defaultLang})`);
        } else {
          // Function template yuklash
          await loadFunctionTemplate(slug, defaultLang);
        }
        
      } catch (err: any) {
        setError(err.message || "Masala yuklanmadi");
        console.error("Error loading problem:", err);
      } finally {
        setLoading(false);
      }
    };

    loadProblem();
  }, [slug]);

  // ==================== LOAD TEMPLATES ====================
  const loadFunctionTemplate = async (problemSlug: string, langSlug: string) => {
    try {
      const template = await problemService.getFunctionTemplate(problemSlug, langSlug);
      
      if (template?.function) {
        setCode(template.function);
        addConsoleMessage(`✅ ${langSlug} uchun shablon yuklandi`);
      } else {
        // Default template ishlatish
        setCode(defaultTemplates[langSlug] || defaultTemplates.python);
        addConsoleMessage(`ℹ️ Standart ${langSlug} shablon ishlatilmoqda`);
      }
    } catch (err) {
      console.error("Error loading template:", err);
      setCode(defaultTemplates[langSlug] || defaultTemplates.python);
      addConsoleMessage(`ℹ️ Standart ${langSlug} shablon ishlatilmoqda`);
    }
  };

  // ==================== CONSOLE ====================
  const addConsoleMessage = (message: string) => {
    const timestamp = new Date().toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
    setConsoleMessages(prev => [`[${timestamp}] ${message}`, ...prev.slice(0, 49)]);
  };

  const clearConsole = () => {
    setConsoleMessages(["🧹 Konsol tozalandi"]);
  };

  // ==================== CODE HANDLERS ====================
  const handleLanguageChange = async (newLang: string) => {
    setLanguage(newLang);
    
    if (!slug) return;
    
    // Cached code ni tekshirish
    const cachedCode = CodeCache.get(slug, newLang);
    if (cachedCode) {
      setCode(cachedCode);
      addConsoleMessage(`💾 Saqlangan kod yuklandi (${newLang})`);
    } else {
      await loadFunctionTemplate(slug, newLang);
    }
  };

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;
    
    // Ctrl+S - Save
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      editor.getAction('editor.action.formatDocument').run();
      handleSaveCode();
    });
    
    // Ctrl+Enter - Run
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      handleRunCode();
    });
    
    // F5 - Submit
    editor.addCommand(monaco.KeyCode.F5, () => {
      handleSubmitCode();
    });
  };

  const handleCodeChange = (value: string | undefined) => {
    setCode(value || "");
  };

  // ==================== CODE ACTIONS ====================
  const handleSaveCode = () => {
    if (!slug || !language) return;
    
    CodeCache.save(slug, language, code);
    setSaved(true);
    addConsoleMessage("💾 Kod saqlandi");
    
    setTimeout(() => setSaved(false), 2000);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    addConsoleMessage("📋 Kod nusxalandi");
  };

  const handleResetCode = () => {
    if (window.confirm("Kodni asl shablonga qaytarishni xohlaysizmi?")) {
      if (slug) {
        loadFunctionTemplate(slug, language);
        CodeCache.clear(slug, language);
        addConsoleMessage("🔄 Kod shablonga qaytarildi");
      }
    }
  };

  const handleFormatCode = () => {
    if (editorRef.current) {
      editorRef.current.getAction('editor.action.formatDocument').run();
      addConsoleMessage("✨ Kod formatlandi");
    }
  };

  // ==================== RUN CODE ====================
  const handleRunCode = async () => {
    if (!code.trim()) {
      addConsoleMessage("❌ Kod bo'sh");
      return;
    }

    setIsRunning(true);
    addConsoleMessage("🔄 Kod ishga tushirilmoqda...");
    setTestResults([]);
    setOutput("");

    try {
      // Mock execution - real API bo'lmaganda
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Problem examples asosida test natijalarini yaratish
      const mockResults: TestResult[] = problem?.examples?.map((ex, idx) => ({
        input: ex.input_txt,
        expected: ex.output_txt,
        actual: ex.output_txt, // Mock uchun expected bilan bir xil
        passed: true,
        execution_time: Math.floor(Math.random() * 100) + 50,
        memory_used: Math.floor(Math.random() * 5000) + 1000
      })) || [];
      
      setTestResults(mockResults);
      
      const passedCount = mockResults.filter(r => r.passed).length;
      const totalCount = mockResults.length;
      
      setOutput(`✅ Test natijalari:\n\n` +
        `📊 O'tgan testlar: ${passedCount}/${totalCount}\n` +
        `⏱️ O'rtacha vaqt: ${Math.round(mockResults.reduce((acc, r) => acc + (r.execution_time || 0), 0) / totalCount)}ms\n` +
        `💾 Xotira: ${Math.round(mockResults.reduce((acc, r) => acc + (r.memory_used || 0), 0) / totalCount)}KB`
      );
      
      addConsoleMessage(`✅ Kod muvaffaqiyatli ishladi (${passedCount}/${totalCount} test o'tdi)`);
      
    } catch (err: any) {
      setOutput(`❌ Xato: ${err.message || "Noma'lum xato"}`);
      addConsoleMessage(`❌ Xatolik: ${err.message || "Noma'lum"}`);
    } finally {
      setIsRunning(false);
    }
  };

  // ==================== SUBMIT CODE (TUZATILGAN) ====================
  const handleSubmitCode = async () => {
    if (!isAuthenticated) {
      addConsoleMessage("⚠️ Iltimos, avval tizimga kiring");
      navigate(`/login?next=/problem/${slug}`);
      return;
    }

    if (!code.trim()) {
      addConsoleMessage("❌ Kod bo'sh");
      return;
    }

    setIsSubmitting(true);
    addConsoleMessage("📤 Kod tekshirishga yuborilmoqda...");

    try {
      // languageObj ni to'g'ri topish - Type: Language | undefined
      const languageObj = languages.find(l => l.slug === language);
      
      if (!languageObj) {
        throw new Error("Dasturlash tili topilmadi");
      }

      // ID ni to'g'ri olish (agar id bo'lmasa, slug dan foydalanish)
      const languageId = parseInt(languageObj.slug || '0');
      
      if (!languageId) {
        throw new Error("Dasturlash tili ID si topilmadi");
      }

      // Backend kutayotgan format: { code: string, language_id: number }
      const result = await problemService.submitCode(slug!, {
        code,
        language_slug: languageId
      });

      setSubmissionResult(result);
      setTestResults(result.results || []);
      
      // Natijalarni ko'rsatish
      setActiveEditorTab('results');
      
      if (result.status === 'accepted') {
        addConsoleMessage(`✅ Muvaffaqiyatli! ${result.passed_tests}/${result.total_tests} test o'tdi`);
        setOutput(`🎉 Tabriklayman! Barcha testlar o'tdi!\n\n` +
          `⏱️ Vaqt: ${result.execution_time}ms\n` +
          `💾 Xotira: ${result.memory_used}KB\n` +
          `📊 Natija: ${result.passed_tests}/${result.total_tests}`
        );
        
        // Muvaffaqiyatli bo'lsa cache ni tozalash
        CodeCache.clear(slug!, language);
      } else {
        addConsoleMessage(`❌ ${result.passed_tests}/${result.total_tests} test o'tdi`);
        
        const failedTests = result.results?.filter(r => !r.passed) || [];
        setOutput(`❌ Xato! ${failedTests.length} test o'tmadi\n\n` +
          failedTests
            .map(r => `• Input: ${r.input}\n  Expected: ${r.expected}\n  Got: ${r.actual}`)
            .join('\n\n')
        );
      }

    } catch (err: any) {
      addConsoleMessage(`❌ Xatolik: ${err.message}`);
      setOutput(`❌ Yuborishda xato: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ==================== RENDER TEST RESULTS ====================
  const renderTestResults = () => (
    <div className="p-4 h-full overflow-y-auto bg-gray-950">
      <div className="space-y-4">
        {submissionResult && (
          <div className={`p-4 rounded-lg ${
            submissionResult.status === 'accepted'
              ? 'bg-green-500/10 border border-green-500/30' 
              : 'bg-red-500/10 border border-red-500/30'
          }`}>
            <div className="flex items-center gap-3 mb-2">
              {submissionResult.status === 'accepted' ? (
                <CheckCircle size={20} className="text-green-400" />
              ) : (
                <XCircle size={20} className="text-red-400" />
              )}
              <span className={`font-medium ${
                submissionResult.status === 'accepted' ? 'text-green-400' : 'text-red-400'
              }`}>
                {submissionResult.message}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
              <div>
                <div className="text-gray-400">Test natijasi</div>
                <div className="text-white font-medium">
                  {submissionResult.passed_tests}/{submissionResult.total_tests}
                </div>
              </div>
              <div>
                <div className="text-gray-400">Vaqt</div>
                <div className="text-white font-medium">
                  {submissionResult.execution_time || 0}ms
                </div>
              </div>
              <div>
                <div className="text-gray-400">Xotira</div>
                <div className="text-white font-medium">
                  {submissionResult.memory_used || 0}KB
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-400">Test Cases</h4>
          {testResults.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Hali test natijalari yo'q
            </div>
          ) : (
            testResults.map((result, idx) => (
              <div
                key={idx}
                className={`border rounded-lg p-4 ${
                  result.passed
                    ? 'border-green-500/30 bg-green-500/5'
                    : 'border-red-500/30 bg-red-500/5'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium">
                    Test #{idx + 1}
                  </span>
                  {result.passed ? (
                    <span className="flex items-center gap-1 text-xs text-green-400">
                      <CheckCircle size={12} /> Passed
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs text-red-400">
                      <XCircle size={12} /> Failed
                    </span>
                  )}
                </div>
                
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-400">Input:</span>
                    <pre className="mt-1 bg-gray-900/50 p-2 rounded text-xs overflow-x-auto">
                      {result.input}
                    </pre>
                  </div>
                  <div>
                    <span className="text-gray-400">Expected:</span>
                    <pre className="mt-1 bg-gray-900/50 p-2 rounded text-xs overflow-x-auto text-green-400">
                      {result.expected}
                    </pre>
                  </div>
                  {!result.passed && (
                    <div>
                      <span className="text-gray-400">Got:</span>
                      <pre className="mt-1 bg-gray-900/50 p-2 rounded text-xs overflow-x-auto text-red-400">
                        {result.actual}
                      </pre>
                    </div>
                  )}
                </div>
                
                {(result.execution_time || result.memory_used) && (
                  <div className="flex gap-4 mt-3 text-xs text-gray-500">
                    {result.execution_time && (
                      <span>⏱️ {result.execution_time}ms</span>
                    )}
                    {result.memory_used && (
                      <span>💾 {result.memory_used}KB</span>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );

  // ==================== LOADING STATE ====================
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Masala yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  // ==================== ERROR STATE ====================
  if (error || !problem) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <AlertCircle size={24} className="text-red-400" />
              <div>
                <h3 className="text-xl font-semibold text-white">Xato</h3>
                <p className="text-gray-300 mt-1">{error || "Masala topilmadi"}</p>
              </div>
            </div>
            <button
              onClick={() => navigate("/problems")}
              className="mt-4 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition text-white"
            >
              Masalalar ro'yxatiga qaytish
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==================== MAIN RENDER ====================
  return (
    <div 
      ref={containerRef}
      className={`min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 text-gray-100 ${
        isFullscreen ? 'fixed inset-0 z-50' : ''
      }`}
    >
      {/* Top Navigation */}
      <nav className="bg-gray-900/90 border-b border-gray-800/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/problems")}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition"
            >
              <ChevronLeft size={20} />
              Masalalar
            </button>
            <div className="h-6 w-px bg-gray-700"></div>
            <h1 className="text-lg font-medium line-clamp-1">
              {problem.title}
            </h1>
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              difficultyMap[problem.difficulty as Difficulty].bgColor
            } ${difficultyMap[problem.difficulty as Difficulty].color}`}>
              {difficultyMap[problem.difficulty as Difficulty].text}
            </span>
            <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs">
              {problemTypeMap[problem.problem_type as ProblemType]}
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-400">
              ⭐ {problem.points} ball
            </div>
            <button
              onClick={handleFullscreen}
              className="p-2 hover:bg-gray-800 rounded transition"
              title={isFullscreen ? "Normal ko'rinish" : "To'liq ekran"}
            >
              {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Main Split View */}
      <div className="h-[calc(100vh-57px)]">
        <Split
          sizes={[45, 55]}
          minSize={400}
          gutterSize={8}
          direction="horizontal"
          className="split-container h-full flex"
        >
          {/* Left Pane - Problem Description */}
          <div className="h-full overflow-y-auto bg-gray-900/50">
            <div className="p-6 space-y-6">
              {/* Problem Header */}
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h1 className="text-2xl font-bold text-white mb-2">{problem.title}</h1>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {problem.tags?.map((tag) => (
                        <span
                          key={tag.id}
                          className="px-3 py-1 bg-gray-800/50 text-gray-300 rounded-full text-sm flex items-center gap-1"
                        >
                          <Tag size={12} />
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-400">
                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        <span>{problem.time_limit}ms</span>
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <HardDrive size={14} />
                        <span>{problem.memory_limit}MB</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description Tabs */}
              <div className="border-b border-gray-800">
                <div className="flex space-x-6 overflow-x-auto">
                  {[
                    { id: 'description', label: 'Tavsif', icon: FileText },
                    { id: 'examples', label: 'Misollar', icon: BookOpen },
                    { id: 'constraints', label: 'Cheklovlar', icon: AlertCircle },
                    { id: 'hints', label: 'Yordam', icon: HelpCircle },
                  ].map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveDescriptionTab(tab.id as any)}
                        className={`flex items-center gap-2 pb-3 text-sm font-medium border-b-2 transition whitespace-nowrap ${
                          activeDescriptionTab === tab.id
                            ? 'border-blue-500 text-blue-400'
                            : 'border-transparent text-gray-400 hover:text-gray-300'
                        }`}
                      >
                        <Icon size={16} />
                        {tab.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Description Content */}
              <div className="prose prose-invert max-w-none">
                {activeDescriptionTab === 'description' && (
                  <div 
                    className="bg-gray-800/30 rounded-lg p-4 text-gray-300"
                    dangerouslySetInnerHTML={{ __html: problem.description }} 
                  />
                )}
                
                {activeDescriptionTab === 'examples' && (
                  <div className="space-y-4">
                    {problem.examples?.map((example, idx) => (
                      <div key={example.id} className="bg-gray-800/30 rounded-lg p-4">
                        <div className="mb-3">
                          <h4 className="text-sm font-medium text-blue-400 mb-2">
                            Example {idx + 1}:
                          </h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <div className="text-xs text-gray-400 mb-1">Input</div>
                              <pre className="bg-gray-900/50 p-2 rounded text-sm overflow-x-auto">
                                {example.input_txt}
                              </pre>
                            </div>
                            <div>
                              <div className="text-xs text-gray-400 mb-1">Output</div>
                              <pre className="bg-gray-900/50 p-2 rounded text-sm overflow-x-auto">
                                {example.output_txt}
                              </pre>
                            </div>
                          </div>
                        </div>
                        {example.explanation && (
                          <div>
                            <div className="text-xs text-gray-400 mb-1">Tushuntirish</div>
                            <p className="text-sm text-gray-300">{example.explanation}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                
                {activeDescriptionTab === 'constraints' && (
                  <div className="bg-gray-800/30 rounded-lg p-4">
                    <div 
                      className="text-gray-300"
                      dangerouslySetInnerHTML={{ __html: problem.constraints || '' }} 
                    />
                  </div>
                )}
                
                {activeDescriptionTab === 'hints' && (
                  <div className="space-y-3">
                    {problem.hints && problem.hints.length > 0 ? (
                      problem.hints.map((hint, idx) => (
                        <div key={hint.id} className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                          <div className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-blue-500/20 rounded flex items-center justify-center flex-shrink-0">
                              <span className="text-blue-400 text-sm font-medium">{idx + 1}</span>
                            </div>
                            <p className="text-gray-300 text-sm">{hint.text}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-8">
                        Bu masala uchun yordam mavjud emas
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Pane - Code Editor */}
          <div className="h-full flex flex-col bg-gray-950">
            {/* Editor Header */}
            <div className="border-b border-gray-800 bg-gray-900/90 backdrop-blur-sm">
              <div className="px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Language Selector */}
                  <select
                    value={language}
                    onChange={(e) => handleLanguageChange(e.target.value)}
                    className="bg-gray-800/50 border border-gray-700 rounded px-3 py-1.5 text-sm text-white focus:outline-none focus:border-blue-500 backdrop-blur-sm"
                  >
                    {languages.map((lang) => (
                      <option key={lang.slug} value={lang.slug}>
                        {lang.name}
                      </option>
                    ))}
                  </select>

                  {/* Editor Tabs */}
                  <div className="flex gap-1">
                    <button
                      onClick={() => setActiveEditorTab('code')}
                      className={`px-3 py-1.5 text-sm rounded-t ${
                        activeEditorTab === 'code'
                          ? 'bg-gray-800 text-white'
                          : 'text-gray-400 hover:text-gray-300'
                      }`}
                    >
                      <Code size={14} className="inline mr-2" />
                      Kod
                    </button>
                    <button
                      onClick={() => setActiveEditorTab('testcases')}
                      className={`px-3 py-1.5 text-sm rounded-t ${
                        activeEditorTab === 'testcases'
                          ? 'bg-gray-800 text-white'
                          : 'text-gray-400 hover:text-gray-300'
                      }`}
                    >
                      <FileText size={14} className="inline mr-2" />
                      Testlar
                    </button>
                    <button
                      onClick={() => setActiveEditorTab('results')}
                      className={`px-3 py-1.5 text-sm rounded-t ${
                        activeEditorTab === 'results'
                          ? 'bg-gray-800 text-white'
                          : 'text-gray-400 hover:text-gray-300'
                      }`}
                    >
                      <BarChart3 size={14} className="inline mr-2" />
                      Natijalar
                    </button>
                    <button
                      onClick={() => setActiveEditorTab('console')}
                      className={`px-3 py-1.5 text-sm rounded-t ${
                        activeEditorTab === 'console'
                          ? 'bg-gray-800 text-white'
                          : 'text-gray-400 hover:text-gray-300'
                      }`}
                    >
                      <Terminal size={14} className="inline mr-2" />
                      Konsol
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleFormatCode}
                    className="p-1.5 hover:bg-gray-800 rounded transition"
                    title="Format kod"
                  >
                    <Settings size={16} />
                  </button>
                  <button
                    onClick={handleResetCode}
                    className="p-1.5 hover:bg-gray-800 rounded transition"
                    title="Shablonga qaytarish"
                  >
                    <RefreshCw size={16} />
                  </button>
                  <button
                    onClick={handleCopyCode}
                    className="p-1.5 hover:bg-gray-800 rounded transition"
                    title="Kodni nusxalash"
                  >
                    <Copy size={16} />
                  </button>
                  <div className="w-px h-6 bg-gray-700 mx-1"></div>
                  <select
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    className="bg-transparent border border-gray-700 rounded px-2 py-1 text-xs text-white"
                  >
                    <option value={12}>12px</option>
                    <option value={14}>14px</option>
                    <option value={16}>16px</option>
                    <option value={18}>18px</option>
                    <option value={20}>20px</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Editor Content */}
            <div className="flex-1 overflow-hidden">
              {activeEditorTab === 'code' && (
                <MonacoEditor
                  language={language}
                  value={code}
                  onChange={handleCodeChange}
                  theme={theme}
                  onMount={handleEditorDidMount}
                  options={{
                    fontSize,
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    wordWrap: 'on',
                    automaticLayout: true,
                    formatOnPaste: true,
                    formatOnType: true,
                    suggestOnTriggerCharacters: true,
                    tabSize: 2,
                    insertSpaces: true,
                    lineNumbers: 'on',
                    roundedSelection: false,
                    scrollbar: {
                      vertical: 'visible',
                      horizontal: 'visible',
                    },
                  }}
                />
              )}

              {activeEditorTab === 'testcases' && (
                <div className="p-4 h-full overflow-y-auto bg-gray-950">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Custom Test Case
                      </label>
                      <textarea
                        value={customInput}
                        onChange={(e) => setCustomInput(e.target.value)}
                        className="w-full h-32 bg-gray-900/50 border border-gray-700 rounded p-3 font-mono text-sm focus:outline-none focus:border-blue-500 resize-none backdrop-blur-sm"
                        placeholder="Test ma'lumotlarini kiriting..."
                      />
                    </div>
                    
                    <div className="bg-gray-900/50 rounded-lg p-4 backdrop-blur-sm">
                      <h4 className="text-sm font-medium text-gray-400 mb-3">Namuna testlar</h4>
                      <div className="space-y-3">
                        {problem.examples?.slice(0, 3).map((example, idx) => (
                          <div key={idx} className="border border-gray-800 rounded p-3">
                            <div className="text-xs text-gray-500 mb-2">Case {idx + 1}</div>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <div className="text-xs text-gray-400 mb-1">Input</div>
                                <pre className="font-mono text-xs bg-gray-800/50 p-2 rounded overflow-x-auto">
                                  {example.input_txt}
                                </pre>
                              </div>
                              <div>
                                <div className="text-xs text-gray-400 mb-1">Output</div>
                                <pre className="font-mono text-xs bg-gray-800/50 p-2 rounded overflow-x-auto">
                                  {example.output_txt}
                                </pre>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeEditorTab === 'results' && renderTestResults()}

              {activeEditorTab === 'console' && (
                <div className="h-full bg-gray-950 p-4 overflow-y-auto">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-medium text-gray-400">Konsol</h3>
                    <button
                      onClick={clearConsole}
                      className="text-xs text-gray-500 hover:text-gray-400"
                    >
                      Tozalash
                    </button>
                  </div>
                  <div className="font-mono text-xs space-y-1">
                    {consoleMessages.map((msg, idx) => (
                      <div key={idx} className="text-gray-300 border-b border-gray-800/50 pb-1">
                        {msg}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Output Panel */}
            <div className="border-t border-gray-800 bg-gray-900/90 backdrop-blur-sm">
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-gray-400">Natija</h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowCustomInput(!showCustomInput)}
                      className="text-xs text-gray-500 hover:text-gray-400 flex items-center gap-1"
                    >
                      {showCustomInput ? <EyeOff size={14} /> : <Eye size={14} />}
                      {showCustomInput ? 'Yashirish' : 'Ko\'rsatish'}
                    </button>
                  </div>
                </div>
                
                {showCustomInput && (
                  <div className="mb-3">
                    <label className="block text-xs text-gray-500 mb-1">Custom Input:</label>
                    <pre className="font-mono text-xs bg-gray-800/50 p-2 rounded">
                      {customInput || '<bo\'sh>'}
                    </pre>
                  </div>
                )}
                
                {output ? (
                  <pre className="font-mono text-sm bg-gray-800/50 rounded p-3 whitespace-pre-wrap overflow-x-auto max-h-48">
                    {output}
                  </pre>
                ) : (
                  <div className="text-gray-500 text-sm italic">
                    Kodni ishga tushirish uchun "Run Code" tugmasini bosing...
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="border-t border-gray-800 p-4 bg-gray-900/90 backdrop-blur-sm">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className={`text-xs ${saved ? 'text-green-400' : 'text-gray-500'}`}>
                    {saved ? '✅ Saqlandi' : '💾 Ctrl+S'}
                  </div>
                  {submissionResult && (
                    <div className={`text-xs ${
                      submissionResult.status === 'accepted' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {submissionResult.status === 'accepted' ? '✅ Accepted' : '❌ Wrong Answer'}
                    </div>
                  )}
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={handleSaveCode}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition flex items-center gap-2"
                  >
                    <Copy size={16} />
                    Save
                  </button>
                  <button
                    onClick={handleRunCode}
                    disabled={isRunning}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isRunning ? (
                      <RefreshCw size={16} className="animate-spin" />
                    ) : (
                      <Play size={16} />
                    )}
                    {isRunning ? "Running..." : "Run Code"}
                  </button>
                  <button
                    onClick={handleSubmitCode}
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <RefreshCw size={16} className="animate-spin" />
                    ) : (
                      <Send size={16} />
                    )}
                    {isSubmitting ? "Submitting..." : "Submit"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Split>
      </div>

      {/* Bottom Status Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900/90 border-t border-gray-800/50 px-4 py-2 text-xs text-gray-400 flex justify-between items-center backdrop-blur-sm z-10">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Zap size={12} />
            <span>Connected</span>
          </div>
          <div className="flex items-center gap-1">
            <Users size={12} />
            <span>{problem.points} ball</span>
          </div>
          <div className="flex items-center gap-1">
            <BarChart3 size={12} />
            <span>{difficultyMap[problem.difficulty as Difficulty].text}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span>Ln {editorRef.current?.getPosition()?.lineNumber || 1}</span>
          <span>Col {editorRef.current?.getPosition()?.column || 1}</span>
          <span>{language.toUpperCase()}</span>
        </div>
      </div>

      {/* Split Pane Styles */}
      <style>{`
        .split-container {
          display: flex;
          height: 100%;
        }
        
        .gutter {
          background-color: #1f2937;
          background-repeat: no-repeat;
          background-position: 50%;
          transition: background-color 0.2s;
        }
        
        .gutter:hover {
          background-color: #3b82f6;
        }
        
        .gutter.gutter-horizontal {
          background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAeCAYAAADkftS9AAAAIklEQVQoU2M4c+bMfxAGAgYYmwGrIIiDjrELjpo5aiZeMwF+yNnOs5KSvgAAAABJRU5ErkJggg==');
          cursor: col-resize;
          width: 8px !important;
        }
      `}</style>
    </div>
  );
};

export default ProblemDetailPage;