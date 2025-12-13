// 5. src/components/problem/TestPanel.tsx
// ============================================
import React from 'react';
import { Check, XCircle } from 'lucide-react';

export interface TestResult {
  testNumber: number;
  input: string;
  expected: string;
  output: string;
  passed: boolean;
}

interface TestPanelProps {
  activeTab: 'testlar' | 'natijalar';
  testCases: Array<{ input: string; expected: string }>;
  testResults: TestResult[];
  isRunning: boolean;
  onTabChange: (tab: 'testlar' | 'natijalar') => void;
}

export const TestPanel: React.FC<TestPanelProps> = ({
  activeTab,
  testCases,
  testResults,
  isRunning,
  onTabChange,
}) => {
  return (
    <div className="flex flex-col bg-gray-50 p-3 overflow-auto">
      {/* Tabs */}
      <div className="flex gap-2 mb-2">
        <button
          onClick={() => onTabChange('testlar')}
          className={`px-3 py-1 rounded-t transition ${
            activeTab === 'testlar' ? 'bg-white border border-b-0' : 'bg-gray-200 hover:bg-gray-300'
          }`}
        >
          Testlar
        </button>
        <button
          onClick={() => onTabChange('natijalar')}
          className={`px-3 py-1 rounded-t transition ${
            activeTab === 'natijalar' ? 'bg-white border border-b-0' : 'bg-gray-200 hover:bg-gray-300'
          }`}
        >
          Natijalar
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {activeTab === 'testlar' && (
          <ul className="space-y-2">
            {testCases.map((test, idx) => (
              <li key={idx} className="bg-white p-3 rounded border hover:border-gray-400 transition">
                <strong>Test {idx + 1}:</strong>
                <div className="mt-1 text-sm text-gray-600">
                  <div>Input: {test.input}</div>
                  <div>Expected: {test.expected}</div>
                </div>
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
              {testResults.map((res) => (
                <li
                  key={res.testNumber}
                  className={`p-3 rounded border ${
                    res.passed ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {res.passed ? (
                      <Check className="text-green-600" size={16} />
                    ) : (
                      <XCircle className="text-red-600" size={16} />
                    )}
                    <span className="font-medium">Test {res.testNumber}</span>
                  </div>
                  <div className="text-sm ml-6 mt-1 space-y-1">
                    <div>Input: {res.input}</div>
                    <div>Expected: {res.expected}</div>
                    <div>Output: {res.output}</div>
                  </div>
                </li>
              ))}
            </ul>
          )
        )}
      </div>
    </div>
  );
}