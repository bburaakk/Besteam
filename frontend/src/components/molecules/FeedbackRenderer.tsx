import React from 'react';

interface FeedbackRendererProps {
  feedback: string;
}

const FeedbackRenderer: React.FC<FeedbackRendererProps> = ({ feedback }) => {
  return (
    <div className="bg-gray-50 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Detaylı Geri Bildirim</h3>
      <div className="bg-white rounded-lg p-4 border">
        <pre className="text-gray-800 font-sans text-sm leading-relaxed whitespace-pre-wrap break-words">
          {feedback}
        </pre>
      </div>
    </div>
  );
};

export default FeedbackRenderer;
