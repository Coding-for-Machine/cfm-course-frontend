// 6. src/pages/ProblemDetail.tsx - MAIN PAGE
// ============================================
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Split from 'react-split';
import { get_problem_detail } from '../api/problems/get_problem_detail';
import { ProblemHeader } from '../components/problem/ProblemHeader';
import { LeftPanel } from '../components/problem/LeftPanel';
import { CodeEditor } from '../components/problem/CodeEditor';
import { TestPanel, type TestResult } from '../components/problem/TestPanel';

const ProblemDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  // State
  const [language, setLanguage] = useState<string>('python');
  const [code, setCode] = useState<string>('');
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'testlar' | 'natijalar'>('testlar');

  // Fetch problem data
  const { data: problem, isLoading, error } = useQuery({
    queryKey: ['problem', slug],
    queryFn: () => get_problem_detail(slug!),
    enabled: !!slug,
  });

  // Initialize code when problem loads
  React.useEffect(() => {
    if (problem?.start_function && problem.start_function.length > 0) {
      const langTemplate = problem.start_function.find(
        (sf) => sf.language_name.toLowerCase() === language
      );
      if (langTemplate) {
        setCode(langTemplate.template);
      }
    }
  }, [problem, language]);

  // Handlers
  const handleRunCode = async () => {
    setIsRunning(true);
    setActiveTab('natijalar');
    await new Promise((res) => setTimeout(res, 1000));

    // Mock results - real implementation should call backend
    const results: TestResult[] = problem?.examples?.map((example, idx) => ({
      testNumber: idx + 1,
      input: example.input_txt,
      expected: example.output_txt,
      output: example.output_txt, // Mock: same as expected
      passed: true,
    })) || [];

    setTestResults(results);
    setIsRunning(false);
  };

  const handleSubmit = async () => {
    console.log('Submitting code...', language, code, slug);
    // TODO: Implement submit logic
  };

  const handleReset = () => {
    const langTemplate = problem?.start_function?.find(
      (sf) => sf.language_name.toLowerCase() === language
    );
    if (langTemplate) {
      setCode(langTemplate.template);
    }
  };

  const handleRandom = () => {
    // TODO: Navigate to random problem
    console.log('Random problem');
  };

  const handlePrevious = () => {
    // TODO: Navigate to previous problem
    console.log('Previous problem');
  };

  const handleNext = () => {
    // TODO: Navigate to next problem
    console.log('Next problem');
  };

  // Loading & Error States
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-teal-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  if (error || !problem) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 text-lg">Masala topilmadi</p>
          <button
            onClick={() => navigate('/problems')}
            className="mt-4 px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
          >
            Masalalar sahifasiga qaytish
          </button>
        </div>
      </div>
    );
  }

  const testCases = problem.examples?.map((ex) => ({
    input: ex.input_txt,
    expected: ex.output_txt,
  })) || [];

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Header */}
      <ProblemHeader
        currentIndex={0}
        totalProblems={1}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onRandom={handleRandom}
        onRun={handleRunCode}
        onSubmit={handleSubmit}
        isRunning={isRunning}
      />

      {/* Main Split */}
      <Split sizes={[40, 60]} minSize={300} gutterSize={8} className="flex-1 flex">
        {/* Left Panel */}
        <LeftPanel problem={problem} />

        {/* Right Panel - Vertical Split */}
        <Split
          sizes={[70, 30]}
          minSize={100}
          direction="vertical"
          gutterSize={6}
          className="flex-1 flex flex-col"
        >
          {/* Code Editor */}
          <CodeEditor
            language={language}
            code={code}
            availableLanguages={problem.start_function ?? []}
            onLanguageChange={setLanguage}
            onCodeChange={setCode}
            onReset={handleReset}
          />

          {/* Test Panel */}
          <TestPanel
            activeTab={activeTab}
            testCases={testCases}
            testResults={testResults}
            isRunning={isRunning}
            onTabChange={setActiveTab}
          />
        </Split>
      </Split>
    </div>
  );
};

export default ProblemDetail;