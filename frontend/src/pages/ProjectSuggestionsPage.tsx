import React, { useState, useEffect } from 'react';
import { projectSuggestionsService, handleApiError } from '../services';
import type { ProjectSuggestion } from '../services';
import MainLayout from '../components/templates/MainLayout';

const ProjectSuggestionsPage: React.FC = () => {
  const [projects, setProjects] = useState<ProjectSuggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedProject, setExpandedProject] = useState<string | null>(null);

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await projectSuggestionsService.getProjectSuggestions();
      setProjects(response.suggestions || []);
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const toggleProject = (title: string) => {
    setExpandedProject(expandedProject === title ? null : title);
  };

  return (
    <MainLayout title="Proje Önerileri">
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              🚀 Proje Önerileri
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Becerilerinizi geliştirmek için özenle seçilmiş proje fikirleri. 
              Proje başlığına tıklayarak detaylarını görüntüleyin.
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="relative">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200"></div>
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent absolute top-0"></div>
              </div>
              <span className="ml-4 text-gray-600 font-medium">Projeler yükleniyor...</span>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-red-800 font-semibold">Bir hata oluştu</h3>
                  <p className="text-red-700 mt-1">{error}</p>
                  <button
                    onClick={fetchProjects}
                    className="mt-3 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-800 rounded-lg transition-colors"
                  >
                    Tekrar Dene
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Accordion - Project List */}
          {!loading && !error && projects.length > 0 && (
            <div className="max-w-4xl mx-auto space-y-4">
              {projects.map((project, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  {/* Accordion Header */}
                  <button
                    onClick={() => toggleProject(project.title)}
                    className="w-full p-6 text-left hover:bg-gray-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight">
                          {project.title}
                        </h3>
                        
                      </div>
                      <div className="ml-6 flex-shrink-0">
                        <svg
                          className={`w-6 h-6 text-gray-400 transition-transform duration-200 ${
                            expandedProject === project.title ? 'rotate-180' : ''
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </button>

                  {/* Accordion Content */}
                  <div
                    className={`transition-all duration-300 ease-in-out ${
                      expandedProject === project.title 
                        ? 'max-h-screen opacity-100' 
                        : 'max-h-0 opacity-0 overflow-hidden'
                    }`}
                  >
                    <div className="px-6 pb-6 pt-2 border-t border-gray-100">
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                        <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                          <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Proje Detayları
                        </h4>
                        <p className="text-gray-700 leading-relaxed text-base">
                          {project.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && projects.length === 0 && (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Henüz proje önerisi yok</h3>
              <p className="text-gray-600 mb-4">Yakında size özel proje önerileri eklenecek.</p>
              <button
                onClick={fetchProjects}
                className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
              >
                Yenile
              </button>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default ProjectSuggestionsPage;