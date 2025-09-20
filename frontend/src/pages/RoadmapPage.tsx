import React, { useState } from 'react';
import { MainLayout } from '../components/templates';
import { Heading, Button, Alert } from '../components/atoms';
import { RoadmapMindmap } from '../components/molecules';
import { roadmapService, handleApiError } from '../services';
import type { RoadmapRequest, RoadmapResponse, ChatRequest } from '../services';

const SOFTWARE_FIELDS = [
  { value: '', label: 'Alan seçiniz' },
  { value: 'Frontend Geliştirme', label: 'Frontend Geliştirme' },
  { value: 'Backend Geliştirme', label: 'Backend Geliştirme' },
  { value: 'Full Stack Geliştirme', label: 'Full Stack Geliştirme' },
  { value: 'Mobil Uygulama Geliştirme', label: 'Mobil Uygulama Geliştirme' },
  { value: 'DevOps', label: 'DevOps' },
  { value: 'Veri Bilimi', label: 'Veri Bilimi' },
  { value: 'Makine Öğrenmesi', label: 'Makine Öğrenmesi' },
  { value: 'Siber Güvenlik', label: 'Siber Güvenlik' },
  { value: 'Oyun Geliştirme', label: 'Oyun Geliştirme' },
  { value: 'UI/UX Tasarım', label: 'UI/UX Tasarım' },
  { value: 'Bulut Bilişim', label: 'Bulut Bilişim' },
  { value: 'Blockchain Geliştirme', label: 'Blockchain Geliştirme' },
  { value: 'Gömülü Sistemler', label: 'Gömülü Sistemler' },
  { value: 'Kalite Güvencesi', label: 'Kalite Güvencesi' },
  { value: 'Ürün Yönetimi', label: 'Ürün Yönetimi' },
];

const RoadmapPage: React.FC = () => {
  const [selectedField, setSelectedField] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [roadmap, setRoadmap] = useState<RoadmapResponse | null>(null);
  
  // Chat states
  const [chatQuestion, setChatQuestion] = useState<string>('');
  const [chatHistory, setChatHistory] = useState<Array<{question: string, answer: string}>>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleGenerateRoadmap = async () => {
    if (!selectedField) {
      setError('Lütfen bir alan seçiniz');
      return;
    }

    setIsLoading(true);
    setError(null);
    setRoadmap(null);

    try {
      const request: RoadmapRequest = { field: selectedField };
      const response = await roadmapService.generateRoadmap(request);
      setRoadmap(response);
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!chatQuestion.trim() || !roadmap) {
      return;
    }

    setIsChatLoading(true);
    setChatError(null);

    try {
      const request: ChatRequest = { question: chatQuestion.trim() };
      const response = await roadmapService.chatWithRoadmap(roadmap.id, request);
      
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

  const clearChatError = () => setChatError(null);

  return (
    <MainLayout title="Yazılım Roadmap Oluşturucu">
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
          {/* Header */}
          <div className="text-center mb-12">
            <Heading level={1} className="text-4xl font-bold text-gray-900 mb-4">
              Yazılım Roadmap Oluşturucu
            </Heading>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Seçtiğiniz yazılım alanı için kişiselleştirilmiş bir öğrenme yol haritası oluşturun
            </p>
          </div>

          {/* Main Content */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-100 p-8">
            {/* Error Message */}
            {error && (
              <div className="mb-6">
                <Alert
                  variant="error"
                  message={error}
                  onClose={clearError}
                />
              </div>
            )}

            {/* Field Selection */}
            <div className="space-y-6">
              <div>
                <label htmlFor="field-select" className="block text-sm font-medium text-gray-700 mb-2">
                  Yazılım Alanı Seçin
                </label>
                <select
                  id="field-select"
                  value={selectedField}
                  onChange={(e) => setSelectedField(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                >
                  {SOFTWARE_FIELDS.map((field) => (
                    <option key={field.value} value={field.value}>
                      {field.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Generate Button */}
              <Button
                onClick={handleGenerateRoadmap}
                disabled={!selectedField || isLoading}
                variant="primary"
                size="lg"
                className="w-full"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Roadmap Oluşturuluyor...
                  </div>
                ) : (
                  'Roadmap Oluştur'
                )}
              </Button>
            </div>

            {/* Roadmap Display */}
            {roadmap && (
              <div className="mt-8 pt-8 border-t border-gray-200">
                <div className="mb-6">
                  <Heading level={2} className="text-2xl font-semibold text-gray-900 mb-2">
                    {roadmap.content.diagramTitle} Roadmap
                  </Heading>
                  <div className="text-sm text-gray-500">
                    Oluşturulma Tarihi: {new Date(roadmap.created_at).toLocaleDateString('tr-TR')}
                  </div>
                </div>
                <RoadmapMindmap content={roadmap.content} roadmapId={roadmap.id} />
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Kişiselleştirilmiş</h3>
              <p className="text-gray-600">Seçtiğiniz alana özel detaylı roadmap</p>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Hızlı</h3>
              <p className="text-gray-600">Saniyeler içinde hazır roadmap</p>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Güncel</h3>
              <p className="text-gray-600">Sektörün en güncel bilgileri</p>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Chat Widget */}
      {roadmap && (
        <>
          {/* Chat Toggle Button */}
          {!isChatOpen && (
            <div className="fixed bottom-6 right-6 z-50">
              <button
                onClick={() => setIsChatOpen(true)}
                className="w-16 h-16 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center group"
              >
                <svg className="w-8 h-8 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                {/* Notification dot */}
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-bold">!</span>
                </div>
              </button>
            </div>
          )}

          {/* Chat Window */}
          {isChatOpen && (
            <div className="fixed bottom-6 right-6 w-96 max-w-[calc(100vw-3rem)] z-50">
              <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
                {/* Chat Header */}
                <div className="bg-slate-600 text-white px-4 py-3 flex items-center">
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">Roadmap Asistanı</div>
                    <div className="text-xs text-gray-300">
                      {isChatLoading ? 'yazıyor...' : 'Çevrimiçi'}
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsChatOpen(false)}
                    className="p-1.5 hover:bg-slate-700 rounded-full transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Chat Messages Container */}
                <div className="h-80 bg-gray-100 overflow-y-auto relative" 
                     style={{
                       backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f0f0f0' fill-opacity='0.2'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                     }}>
                  
                  {/* Welcome Message */}
                  {chatHistory.length === 0 && (
                    <div className="p-3">
                      <div className="bg-yellow-100 border border-yellow-200 rounded-lg p-3 text-center">
                        <div className="text-xs text-gray-700">
                          <div className="mb-1">🤖 <strong>Roadmap Asistanı</strong></div>
                          <div>Roadmap hakkında sorularınızı sorun!</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Chat Messages */}
                  <div className="p-3 space-y-3">
                    {chatHistory.map((chat, index) => (
                      <div key={index} className="space-y-2">
                        {/* User Message */}
                        <div className="flex justify-end">
                          <div className="relative">
                            <div className="bg-green-500 text-white rounded-lg px-3 py-2 max-w-xs shadow-sm">
                              <p className="text-xs leading-relaxed">{chat.question}</p>
                              <div className="text-xs text-green-100 mt-1 text-right">
                                {new Date().toLocaleTimeString('tr-TR', { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                                <svg className="w-3 h-3 inline ml-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                            </div>
                            {/* Message tail */}
                            <div className="absolute top-0 right-0 transform translate-x-1">
                              <div className="w-2 h-2 bg-green-500 transform rotate-45"></div>
                            </div>
                          </div>
                        </div>

                        {/* Assistant Message */}
                        <div className="flex justify-start">
                          <div className="flex items-start space-x-2 max-w-xs">
                            <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                              <svg className="w-3 h-3 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <div className="relative">
                              <div className="bg-white rounded-lg px-3 py-2 shadow-sm border">
                                <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-wrap">{chat.answer}</p>
                                <div className="text-xs text-gray-400 mt-1">
                                  {new Date().toLocaleTimeString('tr-TR', { 
                                    hour: '2-digit', 
                                    minute: '2-digit' 
                                  })}
                                </div>
                              </div>
                              {/* Message tail */}
                              <div className="absolute top-0 left-0 transform -translate-x-1">
                                <div className="w-2 h-2 bg-white border-l border-t transform rotate-45"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {/* Typing indicator */}
                    {isChatLoading && (
                      <div className="flex justify-start">
                        <div className="flex items-start space-x-2">
                          <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                            <svg className="w-3 h-3 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="bg-white rounded-lg px-3 py-2 shadow-sm border">
                            <div className="flex space-x-1">
                              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Chat Error */}
                {chatError && (
                  <div className="bg-red-50 border-t border-red-200 px-3 py-2">
                    <div className="flex items-center text-red-700 text-xs">
                      <svg className="w-3 h-3 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {chatError}
                      <button 
                        onClick={clearChatError}
                        className="ml-auto text-red-500 hover:text-red-700"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                )}

                {/* Chat Input */}
                <div className="bg-gray-50 border-t border-gray-200 p-3">
                  <form onSubmit={handleChatSubmit} className="flex items-center space-x-2">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={chatQuestion}
                        onChange={(e) => setChatQuestion(e.target.value)}
                        placeholder="Mesajınızı yazın..."
                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-full focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-xs"
                        disabled={isChatLoading}
                      />
                      <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                        <button type="button" className="p-1 text-gray-400 hover:text-gray-600">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.5a2.5 2.5 0 110 5H9m-4-5h1.5a2.5 2.5 0 110 5H5m6-7a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={!chatQuestion.trim() || isChatLoading}
                      className="w-8 h-8 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-full transition-colors duration-200 flex items-center justify-center flex-shrink-0"
                    >
                      {isChatLoading ? (
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </MainLayout>
  );
};

export default RoadmapPage;
