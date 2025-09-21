import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';
import { MainLayout } from '../components/templates';
import { Heading, Button, Alert } from '../components/atoms';
import { summaryService, roadmapService, handleApiError } from '../services';
import type { SummaryResponse, ChatRequest, ChatResponse } from '../services';

const RoadmapDetailPage: React.FC = () => {
  const { roadmapId, itemId } = useParams<{ roadmapId: string; itemId: string }>();
  const navigate = useNavigate();
  
  // Summary states
  const [summary, setSummary] = useState<SummaryResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Chat states
  const [chatQuestion, setChatQuestion] = useState<string>('');
  const [chatHistory, setChatHistory] = useState<Array<{question: string, answer: string}>>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);

  useEffect(() => {
    if (roadmapId && itemId) {
      fetchSummary();
    }
  }, [roadmapId, itemId]);

  const fetchSummary = async () => {
    if (!roadmapId || !itemId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await summaryService.getSummary(parseInt(roadmapId), itemId);
      setSummary(response);
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!chatQuestion.trim() || !roadmapId || !summary) {
      return;
    }

    setIsChatLoading(true);
    setChatError(null);

    try {
      const request: ChatRequest = { 
        question: `${summary.topic} konusu hakkında: ${chatQuestion.trim()}` 
      };
      const response = await roadmapService.chatWithRoadmap(parseInt(roadmapId), request);
      
      setChatHistory(prev => [...prev, {
        question: chatQuestion.trim(),
        answer: response.answer
      }]);
      
      setChatQuestion('');
    } catch (err) {
      const errorMessage = handleApiError(err);
      setChatError(errorMessage);
    } finally {
      setIsChatLoading(false);
    }
  };

  const clearError = () => setError(null);
  const clearChatError = () => setChatError(null);

  return (
    <MainLayout title={summary?.topic || 'Konu Detayı'}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
        <div className="max-w-4xl mx-auto px-2 sm:px-4 lg:px-6">
          {/* Back Button */}
          <div className="mb-6">
            <Button
              onClick={() => navigate('/roadmap')}
              variant="secondary"
              className="flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Roadmap'e Dön
            </Button>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center items-center py-12">
              <div className="relative">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200"></div>
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent absolute top-0"></div>
              </div>
              <span className="ml-4 text-gray-600 font-medium">Özet yükleniyor...</span>
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <div className="mb-6">
              <Alert
                variant="error"
                message={error}
                onClose={clearError}
              />
              <div className="mt-4 text-center">
                <Button onClick={fetchSummary} variant="primary">
                  Tekrar Dene
                </Button>
              </div>
            </div>
          )}

          {/* Summary Content */}
          {summary && !isLoading && (
            <div className="space-y-8">
              {/* Header */}
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-100 p-8">
                <div className="text-center mb-6">
                  <Heading level={1} className="text-3xl font-bold text-gray-900 mb-2">
                    {summary.topic}
                  </Heading>
                  <p className="text-lg text-gray-600">
                    {summary.center_node} - Detaylı Özet
                  </p>
                </div>

                {/* Summary Content */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                  <div className="flex items-start mb-4">
                    <svg className="w-6 h-6 text-blue-500 mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">
                        Konu Özeti
                      </h3>
                      <div className="text-gray-700 leading-relaxed prose prose-lg max-w-none">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          rehypePlugins={[rehypeHighlight]}
                          components={{
                            h1: ({children}) => <h1 className="text-2xl font-bold text-gray-900 mb-4 mt-6 first:mt-0 border-b border-gray-200 pb-2">{children}</h1>,
                            h2: ({children}) => <h2 className="text-xl font-bold text-gray-900 mb-3 mt-5 first:mt-0">{children}</h2>,
                            h3: ({children}) => <h3 className="text-lg font-semibold text-gray-800 mb-2 mt-4 first:mt-0">{children}</h3>,
                            p: ({children}) => <p className="text-gray-700 leading-relaxed mb-4 text-base">{children}</p>,
                            ul: ({children}) => <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1 ml-4">{children}</ul>,
                            ol: ({children}) => <ol className="list-decimal list-inside text-gray-700 mb-4 space-y-1 ml-4">{children}</ol>,
                            li: ({children}) => <li className="text-gray-700 leading-relaxed">{children}</li>,
                            blockquote: ({children}) => <blockquote className="border-l-4 border-blue-500 bg-blue-50 pl-4 py-2 mb-4 italic text-blue-900">{children}</blockquote>,
                            code: ({children, className}) => {
                              const isInline = !className;
                              return isInline ? 
                                <code className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded text-sm font-mono">{children}</code> :
                                <code className={className}>{children}</code>;
                            },
                            pre: ({children}) => <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg mb-4 overflow-x-auto text-sm">{children}</pre>,
                            strong: ({children}) => <strong className="font-semibold text-gray-900">{children}</strong>,
                            em: ({children}) => <em className="italic text-gray-700">{children}</em>,
                            a: ({children, href}) => <a href={href} className="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">{children}</a>,
                            hr: () => <hr className="my-6 border-gray-300" />,
                            table: ({children}) => <div className="overflow-x-auto mb-4"><table className="min-w-full border border-gray-300">{children}</table></div>,
                            thead: ({children}) => <thead className="bg-gray-50">{children}</thead>,
                            tbody: ({children}) => <tbody>{children}</tbody>,
                            tr: ({children}) => <tr className="border-b border-gray-200">{children}</tr>,
                            th: ({children}) => <th className="px-4 py-2 text-left font-semibold text-gray-900 border-r border-gray-300 last:border-r-0">{children}</th>,
                            td: ({children}) => <td className="px-4 py-2 text-gray-700 border-r border-gray-300 last:border-r-0">{children}</td>,
                          }}
                        >
                          {summary.summary}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Chat Section */}
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
                {/* Chat Header */}
                <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mr-4">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">Konu Asistanı</h3>
                      <p className="text-green-100 text-sm">
                        {summary.topic} hakkında sorularınızı sorun
                      </p>
                    </div>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="h-96 bg-gray-50 overflow-y-auto p-6">
                  {/* Welcome Message */}
                  {chatHistory.length === 0 && (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">
                        Merhaba! 👋
                      </h4>
                      <p className="text-gray-600 max-w-md mx-auto">
                        <strong>{summary.topic}</strong> konusu hakkında merak ettiklerinizi sorabilirsiniz. 
                        Size detaylı açıklamalar ve örnekler verebilirim.
                      </p>
                    </div>
                  )}

                  {/* Chat History */}
                  <div className="space-y-4">
                    {chatHistory.map((chat, index) => (
                      <div key={index} className="space-y-3">
                        {/* User Message */}
                        <div className="flex justify-end">
                          <div className="bg-green-500 text-white rounded-2xl rounded-tr-sm px-4 py-3 max-w-xs shadow-sm">
                            <p className="text-sm leading-relaxed">{chat.question}</p>
                            <div className="text-xs text-green-100 mt-1 text-right">
                              {new Date().toLocaleTimeString('tr-TR', { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </div>
                          </div>
                        </div>

                        {/* Assistant Message */}
                        <div className="flex justify-start">
                          <div className="flex items-start space-x-3 max-w-md">
                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                              <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border">
                              <div className="text-sm text-gray-700 leading-relaxed prose prose-sm max-w-none">
                                <ReactMarkdown
                                  remarkPlugins={[remarkGfm]}
                                  rehypePlugins={[rehypeHighlight]}
                                  components={{
                                    h1: ({children}) => <h1 className="text-lg font-bold text-gray-900 mb-2 mt-3 first:mt-0">{children}</h1>,
                                    h2: ({children}) => <h2 className="text-base font-bold text-gray-900 mb-2 mt-3 first:mt-0">{children}</h2>,
                                    h3: ({children}) => <h3 className="text-sm font-semibold text-gray-800 mb-1 mt-2 first:mt-0">{children}</h3>,
                                    p: ({children}) => <p className="text-gray-700 leading-relaxed mb-2 text-sm">{children}</p>,
                                    ul: ({children}) => <ul className="list-disc list-inside text-gray-700 mb-2 space-y-0.5 ml-2">{children}</ul>,
                                    ol: ({children}) => <ol className="list-decimal list-inside text-gray-700 mb-2 space-y-0.5 ml-2">{children}</ol>,
                                    li: ({children}) => <li className="text-gray-700 leading-relaxed text-sm">{children}</li>,
                                    blockquote: ({children}) => <blockquote className="border-l-2 border-blue-400 bg-blue-50 pl-2 py-1 mb-2 italic text-blue-800 text-sm">{children}</blockquote>,
                                    code: ({children, className}) => {
                                      const isInline = !className;
                                      return isInline ? 
                                        <code className="bg-gray-100 text-gray-800 px-1 py-0.5 rounded text-xs font-mono">{children}</code> :
                                        <code className={className}>{children}</code>;
                                    },
                                    pre: ({children}) => <pre className="bg-gray-800 text-gray-100 p-2 rounded mb-2 overflow-x-auto text-xs">{children}</pre>,
                                    strong: ({children}) => <strong className="font-semibold text-gray-900">{children}</strong>,
                                    em: ({children}) => <em className="italic text-gray-700">{children}</em>,
                                    a: ({children, href}) => <a href={href} className="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">{children}</a>,
                                  }}
                                >
                                  {chat.answer}
                                </ReactMarkdown>
                              </div>
                              <div className="text-xs text-gray-400 mt-1">
                                {new Date().toLocaleTimeString('tr-TR', { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Typing Indicator */}
                    {isChatLoading && (
                      <div className="flex justify-start">
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                            <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Chat Error */}
                {chatError && (
                  <div className="bg-red-50 border-t border-red-200 px-6 py-3">
                    <Alert
                      variant="error"
                      message={chatError}
                      onClose={clearChatError}
                    />
                  </div>
                )}

                {/* Chat Input */}
                <div className="bg-white border-t border-gray-200 px-6 py-4">
                  <form onSubmit={handleChatSubmit} className="flex items-center space-x-3">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={chatQuestion}
                        onChange={(e) => setChatQuestion(e.target.value)}
                        placeholder={`${summary.topic} hakkında soru sorun...`}
                        className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                        disabled={isChatLoading}
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={!chatQuestion.trim() || isChatLoading}
                      variant="primary"
                      className="px-6 py-3 rounded-2xl bg-green-500 hover:bg-green-600"
                    >
                      {isChatLoading ? (
                        <div className="w-5 h-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                      )}
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default RoadmapDetailPage;
