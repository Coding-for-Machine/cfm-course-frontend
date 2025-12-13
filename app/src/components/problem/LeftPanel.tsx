// 3. src/components/problem/LeftPanel.tsx
import React, { useState } from 'react';
import HLSVideoPlayer from '../video/HLSVideoPlayer';
import QuestionApp from '../quiz/Question';
import type { ProblemDetail } from '../../types/problems';
import Description from './Discription';

interface LeftPanelProps {
  problem: ProblemDetail;
}

type TabType = 'description' | 'video' | 'quiz' | 'results';

export const LeftPanel: React.FC<LeftPanelProps> = ({ problem }) => {
  const [activeTab, setActiveTab] = useState<TabType>('description');

  const tabs = [
    { id: 'description' as TabType, label: 'Tafsif' },
    { id: 'video' as TabType, label: 'Video' },
    { id: 'quiz' as TabType, label: 'Quiz' },
    { id: 'results' as TabType, label: 'Natija' },
  ];

  return (
    <div className="overflow-auto p-6 bg-gray-50">
      {/* Tabs */}
      <div className="w-full max-w-4xl mx-auto mb-4">
        <div className="flex space-x-2 bg-gray-200 rounded-xl p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition ${
                activeTab === tab.id
                  ? "bg-white shadow font-semibold text-gray-900"
                  : "text-gray-500 hover:bg-white/50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="w-full max-w-4xl mx-auto">
        {activeTab === 'description' && (
          <Description
            title={problem.title}
            difficulty={problem.difficulty}
            description={problem.description}
            constraints={problem.constraints}
            examples={problem.examples}
            hints={problem.hints}
          />
        )}

        {activeTab === 'video' && problem.videos && problem.videos.length > 0 && (
          <div className="mt-4">
            <HLSVideoPlayer
              src={problem.videos[0].hls_url}
              poster={problem.videos[0].thumbnail_url}
              autoPlay={false}
              muted={false}
              loop={false}
              controls={true}
              className="shadow-2xl rounded-lg overflow-hidden"
              onError={(error) => console.error('Video error:', error)}
              onPlay={() => console.log('Video started')}
              onPause={() => console.log('Video paused')}
              onTimeUpdate={(time) => console.log('Current time:', time)}
            />
            <div className="mt-4 p-4 bg-white rounded-lg border">
              <h3 className="font-semibold text-lg mb-2">{problem.videos[0].title}</h3>
              <p className="text-gray-600 text-sm">{problem.videos[0].description}</p>
            </div>
          </div>
        )}

        {activeTab === 'quiz' && problem.questions && (
          <QuestionApp
            questions={problem.questions}
          />
        )}

        {activeTab === 'results' && (
          <div className="p-8 text-center text-gray-500">
            <p>Natijalar bu yerda ko'rinadi</p>
          </div>
        )}
      </div>
    </div>
  );
};