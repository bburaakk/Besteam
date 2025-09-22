import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectService, handleApiError } from '../services';
import type { ProjectLevel, Project } from '../services';
import MainLayout from '../components/templates/MainLayout';

const ProjectSuggestionsPage: React.FC = () => {
  const navigate = useNavigate();
  const [projectLevels, setProjectLevels] = useState<ProjectLevel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedProject, setExpandedProject] = useState<number | null>(null);
  const [uploadingProject, setUploadingProject] = useState<number | null>(null);
  const [completedEvaluations, setCompletedEvaluations] = useState<Set<number>>(new Set());
  const fileInputRefs = useRef<Record<number, HTMLInputElement | null>>({});
  
  // Filtreleme state'leri
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [filteredProjects, setFilteredProjects] = useState<Array<{ project: Project; levelName: string; levelIndex: number }>>([]);

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await projectService.getProjectLevels();
      setProjectLevels(response.project_levels || []);
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
    loadCompletedEvaluations();
  }, []);

  // Tamamlanan değerlendirmeleri localStorage'dan yükle
  const loadCompletedEvaluations = () => {
    try {
      const storedEvaluations = localStorage.getItem('projectEvaluations');
      if (storedEvaluations) {
        const evaluations = JSON.parse(storedEvaluations);
        const completedProjectIds = new Set<number>();
        
        // Tüm değerlendirme ID'lerinden proje ID'lerini çıkar
        Object.keys(evaluations).forEach(evaluationId => {
          const match = evaluationId.match(/^eval_(\d+)_/);
          if (match) {
            const projectId = parseInt(match[1]);
            completedProjectIds.add(projectId);
          }
        });
        
        setCompletedEvaluations(completedProjectIds);
      }
    } catch (error) {
      console.error('Tamamlanan değerlendirmeler yüklenirken hata:', error);
    }
  };

  // Projeleri filtrele
  useEffect(() => {
    if (!projectLevels.length) {
      setFilteredProjects([]);
      return;
    }

    const allProjects: Array<{ project: Project; levelName: string; levelIndex: number }> = [];
    
    // Tüm projeleri tek bir diziye topla
    projectLevels.forEach((level, levelIndex) => {
      level.projects.forEach(project => {
        allProjects.push({
          project,
          levelName: level.level_name,
          levelIndex
        });
      });
    });

    // Filtreleme uygula
    let filtered = allProjects;

    // Seviye filtresi
    if (selectedLevel !== 'all') {
      filtered = filtered.filter(item => item.levelName === selectedLevel);
    }

    // Arama filtresi
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(item => 
        item.project.title.toLowerCase().includes(searchLower) ||
        item.project.description.toLowerCase().includes(searchLower)
      );
    }

    setFilteredProjects(filtered);
  }, [projectLevels, searchTerm, selectedLevel]);

  const toggleProject = (projectId: number) => {
    setExpandedProject(expandedProject === projectId ? null : projectId);
  };

  const handleFileSelect = async (projectId: number, file: File | null) => {
    if (!file) return;

    // Desteklenen kod dosya türleri
    const supportedTypes = [
      'text/javascript',
      'text/typescript',
      'application/javascript',
      'text/x-python',
      'text/x-java',
      'text/x-c',
      'text/x-c++',
      'text/html',
      'text/css',
      'application/json',
      'text/xml',
      'text/plain'
    ];

    // Dosya uzantısı kontrolü (type detection bazen yetersiz olabiliyor)
    const fileExtension = file.name.toLowerCase().split('.').pop();
    const supportedExtensions = ['js', 'ts', 'jsx', 'tsx', 'py', 'java', 'c', 'cpp', 'html', 'css', 'json', 'xml', 'txt', 'php', 'rb', 'go', 'rs', 'swift', 'kt', 'scala'];

    if (!supportedTypes.includes(file.type) && !supportedExtensions.includes(fileExtension || '')) {
      alert('Sadece kod dosyaları kabul edilir: .js, .ts, .jsx, .tsx, .py, .java, .c, .cpp, .html, .css, .json, .xml, .txt, .php, .rb, .go, .rs, .swift, .kt, .scala');
      return;
    }

    try {
      setUploadingProject(projectId);
      const result = await projectService.evaluateProject(projectId, file);
      
      // Değerlendirme sonucunu localStorage'a kaydet
      const evaluationId = `eval_${projectId}_${Date.now()}`;
      const storedEvaluations = localStorage.getItem('projectEvaluations') || '{}';
      const evaluations = JSON.parse(storedEvaluations);
      evaluations[evaluationId] = result;
      localStorage.setItem('projectEvaluations', JSON.stringify(evaluations));
      
      // Tamamlanan değerlendirmeleri işaretle
      setCompletedEvaluations(prev => new Set(prev).add(projectId));
      
      // Yeni sayfaya yönlendir
      navigate(`/project-evaluation/${evaluationId}`);
      
    } catch (err) {
      const errorMessage = handleApiError(err);
      alert(`Değerlendirme hatası: ${errorMessage}`);
    } finally {
      setUploadingProject(null);
      // Input'u temizle
      if (fileInputRefs.current[projectId]) {
        fileInputRefs.current[projectId]!.value = '';
      }
    }
  };

  const triggerFileInput = (projectId: number) => {
    fileInputRefs.current[projectId]?.click();
  };

  return (
    <MainLayout title="Proje Önerileri">
      <div className="min-h-screen bg-gradient-to-br from-accent via-white to-primary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary to-primary-600 rounded-2xl mb-6">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
              </svg>
            </div>
            <h1 className="text-5xl font-black bg-gradient-to-r from-gray-900 via-primary to-primary-600 bg-clip-text text-transparent mb-4">
              Proje Önerileri
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Becerilerinizi geliştirmek için özenle seçilmiş proje fikirleri. 
              AI ile projelerinizi değerlendirin ve gelişiminizi takip edin.
            </p>
          </div>

          {/* Filters */}
          {!loading && !error && projectLevels.length > 0 && (
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-100 p-6 mb-8">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Search */}
                <div className="flex-1">
                  <label htmlFor="search" className="block text-sm font-semibold text-gray-700 mb-2">
                    Proje Ara
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <input
                      id="search"
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Proje başlığı veya açıklama ara..."
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Level Filter */}
                <div className="lg:w-80">
                  <label htmlFor="level" className="block text-sm font-semibold text-gray-700 mb-2">
                    Seviye Filtresi
                  </label>
                  <select
                    id="level"
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                  >
                    <option value="all">Tüm Seviyeler</option>
                    {projectLevels.map((level, index) => (
                      <option key={index} value={level.level_name}>
                        {level.level_name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Results Count */}
                <div className="flex items-end">
                  <div className="bg-primary/10 px-4 py-3 rounded-xl">
                    <span className="text-sm font-semibold text-primary">
                      {filteredProjects.length} proje bulundu
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

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

          {/* Projects List */}
          {!loading && !error && filteredProjects.length > 0 && (
            <div className="space-y-4">
              {filteredProjects.map((item) => (
                <div key={item.project.id} className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      {/* Left Side - Project Info */}
                      <div className="flex-1 mr-6">
                        <div className="flex items-start space-x-4">
                          {/* Project Icon */}
                          <div className="flex-shrink-0">
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center ${
                              item.levelIndex === 0 ? 'from-emerald-400 to-emerald-600' :
                              item.levelIndex === 1 ? 'from-blue-400 to-blue-600' :
                              item.levelIndex === 2 ? 'from-purple-400 to-purple-600' :
                              item.levelIndex === 3 ? 'from-orange-400 to-orange-600' :
                              'from-pink-400 to-pink-600'
                            }`}>
                              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                              </svg>
                            </div>
                          </div>

                          {/* Project Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-xl font-bold text-gray-900 truncate">
                                {item.project.title}
                              </h3>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                item.levelIndex === 0 ? 'bg-emerald-100 text-emerald-800' :
                                item.levelIndex === 1 ? 'bg-blue-100 text-blue-800' :
                                item.levelIndex === 2 ? 'bg-purple-100 text-purple-800' :
                                item.levelIndex === 3 ? 'bg-orange-100 text-orange-800' :
                                'bg-pink-100 text-pink-800'
                              }`}>
                                Seviye {item.levelIndex + 1}
                              </span>
                            </div>

                            {/* Description Toggle */}
                            <div className="mb-4">
                  <button
                                onClick={() => toggleProject(item.project.id)}
                                className="text-sm text-gray-600 hover:text-primary font-medium flex items-center transition-colors group"
                              >
                                <span className="group-hover:underline">
                                  {expandedProject === item.project.id ? 'Açıklamayı Gizle' : 'Açıklamayı Göster'}
                                </span>
                                <svg
                                  className={`w-4 h-4 ml-1 transition-transform duration-200 ${
                                    expandedProject === item.project.id ? 'rotate-180' : ''
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                  </button>

                              {/* Description Content */}
                  <div
                    className={`transition-all duration-300 ease-in-out ${
                                  expandedProject === item.project.id 
                                    ? 'max-h-96 opacity-100 mt-4' 
                        : 'max-h-0 opacity-0 overflow-hidden'
                    }`}
                  >
                                <div className="bg-gray-50 rounded-xl p-4 border-l-4 border-primary">
                                  <p className="text-gray-700 text-sm leading-relaxed">
                                    {item.project.description}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right Side - AI Evaluation */}
                      <div className="flex-shrink-0 w-64">
                        <div className="space-y-3">
                          {/* File Input (Hidden) */}
                          <input
                            ref={el => {
                              fileInputRefs.current[item.project.id] = el;
                            }}
                            type="file"
                            accept=".js,.ts,.jsx,.tsx,.py,.java,.c,.cpp,.html,.css,.json,.xml,.txt,.php,.rb,.go,.rs,.swift,.kt,.scala"
                            onChange={(e) => handleFileSelect(item.project.id, e.target.files?.[0] || null)}
                            className="hidden"
                          />

                          {/* Upload Button */}
                          <button
                            onClick={() => triggerFileInput(item.project.id)}
                            disabled={uploadingProject === item.project.id}
                            className="w-full bg-gradient-to-r from-secondary to-secondary-600 hover:from-secondary-600 hover:to-secondary-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:scale-105 transform"
                          >
                            {uploadingProject === item.project.id ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                                Değerlendiriliyor...
                              </>
                            ) : (
                              <>
                                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                </svg>
                                AI Değerlendirmesine Gönder
                              </>
                            )}
                          </button>

                          {/* File Format Info */}
                          <div className="text-xs text-gray-500 text-center">
                            Sadece kod dosyaları kabul edilir
                          </div>

                          {/* Success Message */}
                          {completedEvaluations.has(item.project.id) && (
                            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
                              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-3">
                                <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                              <h4 className="text-sm font-semibold text-emerald-800 mb-2">
                                Değerlendirme Raporu Mevcut! ✅
                              </h4>
                              <p className="text-emerald-700 text-sm mb-4">
                                Bu proje için değerlendirme raporu bulunuyor. Raporu görüntüleyebilir veya yeni bir değerlendirme yapabilirsiniz.
                              </p>
                              <div className="flex flex-col space-y-2">
                                <button
                                  onClick={() => {
                                    // Son değerlendirme ID'sini bul
                                    const storedEvaluations = localStorage.getItem('projectEvaluations') || '{}';
                                    const evaluations = JSON.parse(storedEvaluations);
                                    const evaluationIds = Object.keys(evaluations)
                                      .filter(id => id.startsWith(`eval_${item.project.id}_`))
                                      .sort((a, b) => {
                                        // Timestamp'e göre sırala (en yeni en sonda)
                                        const timestampA = parseInt(a.split('_')[2]);
                                        const timestampB = parseInt(b.split('_')[2]);
                                        return timestampA - timestampB;
                                      });
                                    const latestEvaluationId = evaluationIds[evaluationIds.length - 1];
                                    if (latestEvaluationId) {
                                      navigate(`/project-evaluation/${latestEvaluationId}`);
                                    }
                                  }}
                                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-4 py-2 rounded-lg transition-colors text-sm"
                                >
                                  📊 Mevcut Raporu Görüntüle
                                </button>
                                <button
                                  onClick={() => triggerFileInput(item.project.id)}
                                  disabled={uploadingProject === item.project.id}
                                  className="bg-primary hover:bg-primary-600 text-white font-medium px-4 py-2 rounded-lg transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  {uploadingProject === item.project.id ? (
                                    <>
                                      <div className="inline-block animate-spin rounded-full h-3 w-3 border border-white border-t-transparent mr-2"></div>
                                      Değerlendiriliyor...
                                    </>
                                  ) : (
                                    <>
                                      🔄 Yeniden Değerlendir
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* No Results */}
          {!loading && !error && projectLevels.length > 0 && filteredProjects.length === 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Proje bulunamadı</h3>
              <p className="text-gray-600 mb-6">
                Arama kriterlerinize uygun proje bulunmadı. Filtreleri değiştirmeyi deneyin.
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedLevel('all');
                }}
                className="bg-primary hover:bg-primary-600 text-white font-medium px-6 py-3 rounded-xl transition-colors"
              >
                Filtreleri Temizle
              </button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && projectLevels.length === 0 && (
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