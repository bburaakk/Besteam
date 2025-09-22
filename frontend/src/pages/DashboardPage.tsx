import React, { useState, useEffect } from 'react';
import { MainLayout } from '../components/templates';
import { Heading, Button } from '../components/atoms';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motivationalService, handleApiError } from '../services';
import type { MotivationalMessageResponse } from '../services';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Motivasyonel mesaj state'leri
  const [motivationalMessage, setMotivationalMessage] = useState<MotivationalMessageResponse | null>(null);
  const [isLoadingMessage, setIsLoadingMessage] = useState(true);
  const [messageError, setMessageError] = useState<string | null>(null);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  // Motivasyonel mesajı yükle
  useEffect(() => {
    const fetchMotivationalMessage = async () => {
      try {
        setIsLoadingMessage(true);
        setMessageError(null);
        const message = await motivationalService.getMotivationalMessage();
        setMotivationalMessage(message);
      } catch (error) {
        const errorMessage = handleApiError(error);
        setMessageError(errorMessage);
      } finally {
        setIsLoadingMessage(false);
      }
    };

    fetchMotivationalMessage();
  }, []);

  // Markdown mesajlarını parse et
  const parseMessages = (message: string): string[] => {
    // Markdown listelerini parse et (* ile başlayan satırlar)
    const lines = message.split('\n');
    const messages: string[] = [];
    
    lines.forEach(line => {
      const trimmedLine = line.trim();
      // * ile başlayan satırları bul ve ** kalın yazı işaretlerini temizle
      if (trimmedLine.startsWith('*') && !trimmedLine.startsWith('**')) {
        const cleanMessage = trimmedLine
          .replace(/^\*\s*/, '') // Başlangıçtaki * işaretini kaldır
          .replace(/\*\*(.*?)\*\*/g, '$1') // **kalın yazı** işaretlerini kaldır
          .trim();
        
        if (cleanMessage) {
          messages.push(cleanMessage);
        }
      }
    });
    
    return messages.length > 0 ? messages : [message]; // Eğer parse edilemezse orijinal mesajı döndür
  };

  const parsedMessages = motivationalMessage ? parseMessages(motivationalMessage.message) : [];

  // Otomatik slider için useEffect
  useEffect(() => {
    if (parsedMessages.length > 1) {
      const interval = setInterval(() => {
        setCurrentMessageIndex(prev => (prev + 1) % parsedMessages.length);
      }, 4000); // 4 saniyede bir değiş

      return () => clearInterval(interval);
    }
  }, [parsedMessages.length]);

  const quickActions = [
    {
      title: 'CV Analizi',
      description: 'CV\'nizi yükleyip detaylı analiz alın',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      color: 'from-green-500 to-green-600',
      path: '/cv-analysis',
    },
    {
      title: 'Yol Haritası',
      description: 'Kişiselleştirilmiş kariyer yol haritası oluşturun',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      ),
      color: 'from-blue-500 to-blue-600',
      path: '/roadmap',
    },
    {
      title: 'Profil',
      description: 'Profil bilgilerinizi güncelleyin',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      color: 'from-purple-500 to-purple-600',
      path: '/profile',
    },
  ];

  const stats = [
    { label: 'CV Analizleri', value: '3', icon: '📄' },
    { label: 'Oluşturulan Roadmap\'ler', value: '2', icon: '🗺️' },
    { label: 'Tamamlanan Görevler', value: '8', icon: '✅' },
    { label: 'Aktif Günler', value: '12', icon: '🔥' },
  ];

  return (
    <MainLayout title="Dashboard">
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <Heading level={1} className="text-3xl font-bold text-gray-900 mb-2">
              Hoş geldin, {user?.first_name && user?.last_name 
                ? `${user.first_name} ${user.last_name}` 
                : user?.username || 'Kullanıcı'}! 👋
            </Heading>
            <p className="text-lg text-gray-600">
              Kariyer yolculuğunda bugün ne yapmak istiyorsun?
            </p>
          </div>

          {/* Motivational Message Slider */}
          <div className="mb-8">
            <div className="bg-gradient-to-br from-primary via-primary-600 to-purple-600 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-4 right-4 h-32 w-32 bg-secondary/30 rounded-full blur-2xl"></div>
                <div className="absolute bottom-4 left-4 h-24 w-24 bg-white/20 rounded-full blur-xl"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-40 w-40 bg-accent/10 rounded-full blur-3xl"></div>
              </div>
              
              <div className="relative z-10">
                {isLoadingMessage ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-secondary border-t-transparent"></div>
                    <span className="ml-3 text-white/80">İlham verici mesajlar yükleniyor...</span>
                  </div>
                ) : messageError ? (
                  <div className="text-center py-8">
                    <div className="flex items-center justify-center mb-4">
                      <svg className="w-8 h-8 text-white/80" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="text-white/80 text-sm">{messageError}</p>
                  </div>
                ) : parsedMessages.length > 0 ? (
                  <div className="text-center">
                    {/* Header */}
                    <div className="flex items-center justify-center mb-6">
                      <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center mr-3 backdrop-blur-sm">
                        <svg className="w-5 h-5 text-secondary" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold">Günün İlhamı</h3>
                    </div>

                    {/* Message Card */}
                    <div className="relative h-24 flex items-center justify-center">
                      <div 
                        key={currentMessageIndex}
                        className="animate-fade-in"
                      >
                        <blockquote className="text-xl md:text-2xl font-medium leading-relaxed max-w-4xl">
                          "{parsedMessages[currentMessageIndex]}"
                        </blockquote>
                      </div>
                    </div>

                    {/* Navigation Dots */}
                    {parsedMessages.length > 1 && (
                      <div className="flex items-center justify-center mt-6 space-x-2">
                        {parsedMessages.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentMessageIndex(index)}
                            className={`h-2 rounded-full transition-all duration-300 transform hover:scale-110 ${
                              index === currentMessageIndex 
                                ? 'bg-secondary w-8 shadow-lg shadow-secondary/50' 
                                : 'bg-white/50 hover:bg-white/70 w-2'
                            }`}
                          />
                        ))}
                      </div>
                    )}

                    {/* Message Counter */}
                    {parsedMessages.length > 1 && (
                      <div className="mt-4">
                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm">
                          <span className="text-secondary text-sm font-medium">
                            {currentMessageIndex + 1}
                          </span>
                          <span className="text-white/60 text-sm mx-1">/</span>
                          <span className="text-white/80 text-sm">
                            {parsedMessages.length}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Author */}
                    {motivationalMessage?.author && (
                      <cite className="text-white/80 text-sm font-medium mt-4 block">
                        — {motivationalMessage.author}
                      </cite>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-white/80">Bugün için ilham verici bir mesaj bulunamadı.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                  </div>
                  <div className="text-3xl">{stat.icon}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <Heading level={2} className="text-2xl font-semibold text-gray-900 mb-6">
              Hızlı İşlemler
            </Heading>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quickActions.map((action, index) => (
                <div
                  key={index}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer group"
                  onClick={() => navigate(action.path)}
                >
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${action.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    {action.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{action.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{action.description}</p>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full group-hover:bg-primary group-hover:text-white transition-all duration-300"
                  >
                    Başla →
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100">
            <Heading level={2} className="text-xl font-semibold text-gray-900 mb-4">
              Son Aktiviteler
            </Heading>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">CV analizi tamamlandı</p>
                  <p className="text-xs text-gray-500">2 saat önce</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Frontend Development roadmap oluşturuldu</p>
                  <p className="text-xs text-gray-500">1 gün önce</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Profil bilgileri güncellendi</p>
                  <p className="text-xs text-gray-500">3 gün önce</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default DashboardPage;
