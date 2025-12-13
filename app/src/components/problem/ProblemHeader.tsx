// src/components/problem/ProblemHeader.tsx
import React from 'react';
import { Shuffle, Play, CloudUpload } from 'lucide-react';

interface ProblemHeaderProps {
  currentIndex: number;
  totalProblems: number;
  onPrevious: () => void;
  onNext: () => void;
  onRandom: () => void;
  onRun: () => void;
  onSubmit: () => void;
  isRunning?: boolean;
}

export const ProblemHeader: React.FC<ProblemHeaderProps> = ({
  currentIndex,
  totalProblems,
  onPrevious,
  onNext,
  onRandom,
  onRun,
  onSubmit,
  isRunning = false,
}) => {
  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-sm">
      <div className="text-xl font-bold text-gray-800">
        <button
          onClick={onRandom}
          className="px-4 py-1 border rounded flex items-center gap-1 hover:bg-gray-50 transition"
        >
          <Shuffle size={20} />
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-2">
        <button
          onClick={onRun}
          disabled={isRunning}
          className="px-4 py-1 border rounded flex items-center gap-1 hover:bg-gray-50 transition disabled:opacity-50"
        >
          <Play size={20} />
        </button>
        <button
          onClick={onSubmit}
          disabled={isRunning}
          className="px-4 py-1 bg-teal-600 text-white rounded flex items-center gap-1 hover:bg-teal-700 transition disabled:opacity-50"
        >
          <CloudUpload size={20} />
        </button>
      </div>

      {/* Navigation */}
      <div className="flex gap-2">
        <button
          onClick={onPrevious}
          disabled={currentIndex === 0}
          className="px-3 py-1 border rounded disabled:opacity-30 hover:bg-gray-50 transition"
        >
          ← Oldingi
        </button>
        <span className="px-3 py-1 text-gray-600">
          {currentIndex + 1} / {totalProblems}
        </span>
        <button
          onClick={onNext}
          disabled={currentIndex === totalProblems - 1}
          className="px-3 py-1 border rounded disabled:opacity-30 hover:bg-gray-50 transition"
        >
          Keyingi →
        </button>
      </div>
    </header>
  );
};