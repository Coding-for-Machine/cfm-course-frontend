// src/components/problem/CodeEditor.tsx
import React from 'react';
import type { StartFunction } from '../../types/problems';

interface CodeEditorProps {
  language: string;
  code: string;
  availableLanguages: StartFunction[];
  onLanguageChange: (lang: string) => void;
  onCodeChange: (code: string) => void;
  onReset: () => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  language,
  code,
  availableLanguages,
  onLanguageChange,
  onCodeChange,
  onReset,
}) => {
  return (
    <div className="flex flex-col flex-1 overflow-hidden border-b border-gray-200">
      {/* Toolbar */}
      <div className="flex items-center gap-3 p-3 bg-white border-b border-gray-200">
        <select
          value={language}
          onChange={(e) => onLanguageChange(e.target.value)}
          className="border px-3 py-1.5 rounded hover:bg-gray-50 transition"
        >
          {availableLanguages.map((lang) => (
            <option key={lang.language_id} value={lang.language_name.toLowerCase()}>
              {lang.language_name}
            </option>
          ))}
        </select>
        <button
          onClick={onReset}
          className="px-3 py-1.5 border rounded hover:bg-gray-50 transition"
        >
          Reset
        </button>
      </div>

      {/* Editor */}
      <textarea
        value={code}
        onChange={(e) => onCodeChange(e.target.value)}
        className="flex-1 w-full p-4 font-mono text-sm resize-none outline-none bg-white"
        spellCheck={false}
      />
    </div>
  );
};
