import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '../components/templates/MainLayout';
import type { ProjectEvaluationResponse } from '../services';

const ProjectEvaluationPage: React.FC = () => {
  const { evaluationId } = useParams<{ evaluationId: string }>();
  const navigate = useNavigate();
  const [evaluation, setEvaluation] = useState<ProjectEvaluationResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Değerlendirme verilerini localStorage'dan al
    const storedEvaluations = localStorage.getItem('projectEvaluations');
    if (storedEvaluations && evaluationId) {
      try {
        const evaluations = JSON.parse(storedEvaluations);
        const currentEvaluation = evaluations[evaluationId];
        if (currentEvaluation) {
          setEvaluation(currentEvaluation);
        }
      } catch (error) {
        console.error('Değerlendirme verisi yüklenirken hata:', error);
      }
    }
    setLoading(false);
  }, [evaluationId]);

  if (loading) {
    return (
      <MainLayout title="Değerlendirme Raporu">
        <div className="min-h-screen bg-gradient-to-br from-accent via-white to-primary/5 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-600">Değerlendirme raporu yükleniyor...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!evaluation) {
    return (
      <MainLayout title="Değerlendirme Raporu">
        <div className="min-h-screen bg-gradient-to-br from-accent via-white to-primary/5 flex items-center justify-center">
          <div className="text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Değerlendirme bulunamadı</h3>
            <p className="text-gray-600 mb-6">Bu değerlendirme raporu mevcut değil veya silinmiş olabilir.</p>
            <button
              onClick={() => navigate('/project-suggestions')}
              className="bg-primary hover:bg-primary-600 text-white font-medium px-6 py-3 rounded-xl transition-colors"
            >
              Proje Önerilerine Dön
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Değerlendirme Raporu">
      <div className="min-h-screen bg-gradient-to-br from-accent via-white to-primary/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate('/project-suggestions')}
              className="inline-flex items-center text-primary hover:text-primary-600 font-medium mb-4 transition-colors group"
            >
              <svg className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Proje Önerilerine Dön
            </button>
            
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-primary to-primary-600 rounded-2xl flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-black bg-gradient-to-r from-gray-900 via-primary to-primary-600 bg-clip-text text-transparent">
                  AI Değerlendirme Raporu
                </h1>
                <p className="text-gray-600 mt-1">Projeniz için detaylı analiz ve öneriler</p>
              </div>
              {evaluation.score && (
                <div className="ml-auto">
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">{evaluation.score}/100</div>
                    <div className="text-sm text-gray-500">Genel Skor</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Evaluation Content */}
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="p-8">
              <div className="space-y-8">
                {/* Proje Amacı */}
                {evaluation.projeAmaci && (
                  <div>
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center mr-4">
                        <span className="text-xl">📋</span>
                      </div>
                      <h2 className="text-xl font-bold text-gray-900">Proje Amacı</h2>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-6 border-l-4 border-gray-300">
                      <p className="text-gray-700 leading-relaxed">{evaluation.projeAmaci}</p>
                    </div>
                  </div>
                )}

                {/* Genel Değerlendirme */}
                {evaluation.genelDegerlendirme && (
                  <div>
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                        <span className="text-xl">🔍</span>
                      </div>
                      <h2 className="text-xl font-bold text-gray-900">Genel Değerlendirme</h2>
                    </div>
                    <div className="bg-blue-50 rounded-xl p-6 border-l-4 border-blue-300">
                      <p className="text-blue-900 leading-relaxed">{evaluation.genelDegerlendirme}</p>
                    </div>
                  </div>
                )}

                {/* Olumlu Yönler */}
                {evaluation.olumluYonler && evaluation.olumluYonler.length > 0 && (
                  <div>
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center mr-4">
                        <span className="text-xl">✅</span>
                      </div>
                      <h2 className="text-xl font-bold text-gray-900">Olumlu Yönler</h2>
                    </div>
                    <div className="space-y-4">
                      {evaluation.olumluYonler.map((item, index) => (
                        <div key={index} className="bg-emerald-50 rounded-xl p-6 border-l-4 border-emerald-300">
                          <div className="flex items-start space-x-4">
                            <div className="w-6 h-6 rounded-full bg-emerald-200 flex items-center justify-center mt-1 flex-shrink-0">
                              <div className="w-3 h-3 bg-emerald-600 rounded-full"></div>
                            </div>
                            <p className="text-emerald-900 leading-relaxed">{item}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Geliştirilebilecek Yönler */}
                {evaluation.gelistirilebilecekYonler && evaluation.gelistirilebilecekYonler.length > 0 && (
                  <div>
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center mr-4">
                        <span className="text-xl">🔧</span>
                      </div>
                      <h2 className="text-xl font-bold text-gray-900">Geliştirilebilecek Yönler</h2>
                    </div>
                    <div className="space-y-4">
                      {evaluation.gelistirilebilecekYonler.map((item, index) => (
                        <div key={index} className="bg-orange-50 rounded-xl p-6 border-l-4 border-orange-300">
                          <div className="flex items-start space-x-4">
                            <div className="w-6 h-6 rounded-full bg-orange-200 flex items-center justify-center mt-1 flex-shrink-0">
                              <div className="w-3 h-3 bg-orange-600 rounded-full"></div>
                            </div>
                            <p className="text-orange-900 leading-relaxed">{item}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Öğrenme Tavsiyesi */}
                {evaluation.ogrenmeTavsiyesi && (
                  <div>
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center mr-4">
                        <span className="text-xl">💡</span>
                      </div>
                      <h2 className="text-xl font-bold text-gray-900">Öğrenme Tavsiyesi</h2>
                    </div>
                    <div className="bg-purple-50 rounded-xl p-6 border-l-4 border-purple-300">
                      <p className="text-purple-900 leading-relaxed">{evaluation.ogrenmeTavsiyesi}</p>
                    </div>
                  </div>
                )}

                {/* Fallback message */}
                {evaluation.message && !evaluation.genelDegerlendirme && (
                  <div>
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center mr-4">
                        <span className="text-xl">📄</span>
                      </div>
                      <h2 className="text-xl font-bold text-gray-900">Değerlendirme</h2>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-6 border-l-4 border-gray-300">
                      <p className="text-gray-700 leading-relaxed">{evaluation.message}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-8 py-6 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-500">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  Değerlendirme tarihi: {new Date().toLocaleDateString('tr-TR')}
                </div>
                <button
                  onClick={() => navigate('/project-suggestions')}
                  className="bg-primary hover:bg-primary-600 text-white font-medium px-6 py-2 rounded-lg transition-colors"
                >
                  Proje Önerilerine Dön
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProjectEvaluationPage;
