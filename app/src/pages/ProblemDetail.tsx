import React, { useState } from 'react';
import Split from 'react-split';
import { Play, Check, XCircle, CloudUpload, Shuffle} from 'lucide-react';

// Types
type TestCase = {
  input: string;
  expected: string;
};

type Problem = {
  id: number;
  title: string;
  description: string;
  example: string;
  starterCode: Record<string, string>; // python, javascript, etc.
  testCases: TestCase[];
};

type TestResult = {
  testNumber: number;
  input: string;
  expected: string;
  output: string;
  passed: boolean;
};

// Mock problems data
const problems: Problem[] = [
  {
    id: 1,
    title: "Nollarni orqaga surish",
    description: "Berilgan sonlar ro'yxatidagi nollarni ro'yxat oxiriga o'tkazing, lekin boshqa elementlar ketma-ketligi buzilmasin.",
    example: "Misol 1:\nKiruvchi qiymat: nums = [0,1,0,3,12]\nChiquvchi qiymat: [1,3,12,0,0]",
    starterCode: {
      python: `def moveZeroes(nums: list) -> list:\n    k = 0\n    for i in range(len(nums)):\n        if nums[i]!=0:\n            nums[k]=nums[i]\n            k+=1\n    return nums`,
      javascript: `function moveZeroes(nums) {\n    let k = 0;\n    for (let i = 0; i < nums.length; i++) {\n        if (nums[i] !== 0) {\n            nums[k] = nums[i];\n            k++;\n        }\n    }\n    for (let i = k; i < nums.length; i++) {\n        nums[i] = 0;\n    }\n    return nums;\n}`
    },
    testCases: [
      { input: "[0,1,0,3,12]", expected: "[1,3,12,0,0]" },
      { input: "[0]", expected: "[0]" },
      { input: "[1,2,3]", expected: "[1,2,3]" }
    ]
  }
];

const ProblemDetail: React.FC = () => {
  const [currentProblem, setCurrentProblem] = useState<number>(0);
  const [language, setLanguage] = useState<string>('python');
  const [code, setCode] = useState<string>(problems[0].starterCode.python);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'testlar' | 'natijalar'>('testlar');

  const problem = problems[currentProblem];
  const randomProblem = async ()=> {
    console.log("random")
  }
  const runCode = async () => {
    setIsRunning(true);
    setActiveTab('natijalar');
    await new Promise(res => setTimeout(res, 1000));

    const results: TestResult[] = problem.testCases.map((test, idx) => ({
      testNumber: idx + 1,
      input: test.input,
      expected: test.expected,
      output: test.expected,
      passed: true
    }));

    setTestResults(results);
    setIsRunning(false);
  };

  const resetCode = () => {
    setCode(problem.starterCode[language]);
  };

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="text-xl font-bold text-gray-800">
          <button onClick={randomProblem} className="px-4 py-1 border rounded flex items-center gap-1">
            <Shuffle size={20} />
          </button>
        </div>
            {/* Buttons */}
            <div className="flex justify-end gap-2 mt-2">
              <button onClick={runCode} className="px-4 py-1 border rounded flex items-center gap-1">
                <Play size={20}/>
              </button>
              <button className="px-4 py-1 bg-teal-600 text-white rounded flex items-center gap-1">
                <CloudUpload size={20}/>
              </button>
            </div>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentProblem(Math.max(0, currentProblem - 1))}
            disabled={currentProblem === 0}
            className="px-3 py-1 border rounded disabled:opacity-30"
          >
            &#8592; Oldingi
          </button>
          <button
            onClick={() => setCurrentProblem(Math.min(problems.length - 1, currentProblem + 1))}
            disabled={currentProblem === problems.length - 1}
            className="px-3 py-1 border rounded disabled:opacity-30"
          >
            Keyingi &#8594;
          </button>
        </div>
      </header>

      {/* Main Split */}
      <Split
        sizes={[40, 60]}
        minSize={300}
        gutterSize={8}
        className="flex-1 flex"
      >
        {/* Left Panel */}
        <div className="overflow-auto p-6 bg-gray-50">
          <h2 className="text-2xl font-bold mb-4">{problem.title}</h2>
          <p className="mb-4">{problem.description}</p>
          <div className="bg-white p-4 rounded border mb-4">
            <pre className="whitespace-pre-wrap text-sm">{problem.example}</pre>
          </div>
        </div>

        {/* Right Panel - vertical split */}
        <Split
          sizes={[70, 30]}
          minSize={100}
          direction="vertical"
          gutterSize={6}
          className="flex-1 flex flex-col"
        >
          {/* Code Editor */}
          <div className="flex flex-col flex-1 overflow-hidden border-b border-gray-200">
            <div className="flex items-center gap-3 p-3 bg-white border-b border-gray-200">
              <select
                value={language}
                onChange={e => setLanguage(e.target.value)}
                className="border px-2 py-1 rounded"
              >
                <option value="python">Python</option>
                <option value="javascript">JavaScript</option>
              </select>
              <button onClick={resetCode} className="px-2 py-1 border rounded">Reset</button>
            </div>
            <textarea
              value={code}
              onChange={e => setCode(e.target.value)}
              className="flex-1 w-full p-4 font-mono text-sm resize-none outline-none bg-white"
            />
          </div>

          {/* Test Results Panel */}
          <div className="flex flex-col bg-gray-50 p-3 overflow-auto">
            {/* Tabs */}
            <div className="flex gap-2 mb-2">
              <button
                onClick={() => setActiveTab('testlar')}
                className={`px-3 py-1 rounded-t ${
                  activeTab === 'testlar' ? 'bg-white border border-b-0' : 'bg-gray-200'
                }`}
              >
                Testlar
              </button>
              <button
                onClick={() => setActiveTab('natijalar')}
                className={`px-3 py-1 rounded-t ${
                  activeTab === 'natijalar' ? 'bg-white border border-b-0' : 'bg-gray-200'
                }`}
              >
                Natijalar
              </button>
              
            </div>

            <div className="flex-1 overflow-auto">
              
              {activeTab === 'testlar' && (
                <ul className="space-y-2">
                  {problem.testCases.map((test, idx) => (
                    <li key={idx} className="bg-white p-2 rounded border">
                      <strong>Test {idx + 1}:</strong> {test.input} → {test.expected}
                    </li>
                  ))}
                </ul>
              )}
              {activeTab === 'natijalar' && (
                isRunning ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin h-6 w-6 border-4 border-teal-500 border-t-transparent rounded-full"></div>
                  </div>
                ) : (
                  <ul className="space-y-2">
                    {testResults.map(res => (
                      <li key={res.testNumber} className={`p-2 rounded border ${res.passed ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'}`}>
                        <div className="flex items-center gap-2">
                          {res.passed ? <Check className="text-green-600" size={16}/> : <XCircle className="text-red-600" size={16}/>}
                          <span>Test {res.testNumber}</span>
                        </div>
                        <div className="text-sm ml-6">
                          Input: {res.input} | Expected: {res.expected} | Output: {res.output}
                        </div>
                      </li>
                    ))}
                  </ul>
                )
              )}
            </div>

            
          </div>
        </Split>
      </Split>
    </div>
  );
};

export default ProblemDetail;
