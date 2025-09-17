import React, { useState } from 'react';
import { MainLayout } from '../components/templates';
import { Heading, Button, Alert } from '../components/atoms';
import { roadmapService, handleApiError } from '../services';
import type { RoadmapRequest, RoadmapResponse } from '../services';

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

  return (
    <MainLayout title="Yazılım Roadmap Oluşturucu">
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
                <Heading level={2} className="text-2xl font-semibold text-gray-900 mb-4">
                  {SOFTWARE_FIELDS.find(f => f.value === roadmap.field)?.label} Roadmap
                </Heading>
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="prose max-w-none">
                    <pre className="whitespace-pre-wrap text-gray-800 font-sans">
                      {roadmap.content}
                    </pre>
                  </div>
                  <div className="mt-4 text-sm text-gray-500">
                    Oluşturulma Tarihi: {new Date(roadmap.createdAt).toLocaleDateString('tr-TR')}
                  </div>
                </div>
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
    </MainLayout>
  );
};

export default RoadmapPage;
