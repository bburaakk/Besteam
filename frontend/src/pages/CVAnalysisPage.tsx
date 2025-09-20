import React, { useState, useRef } from 'react';
import { MainLayout } from '../components/templates';
import { Heading, Button, Alert } from '../components/atoms';
import { cvService, handleApiError } from '../services';
import type { CVAnalysisResponse } from '../services';

const CVAnalysisPage: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<CVAnalysisResponse | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const ACCEPTED_FILE_TYPES = [
    'application/pdf',
    'image/png',
    'image/jpeg',
    'image/jpg',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

  const validateFile = (file: File): string | null => {
    if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
      return 'Desteklenmeyen dosya türü. PDF, PNG, JPG, DOC veya DOCX dosyası seçiniz.';
    }
    
    if (file.size > MAX_FILE_SIZE) {
      return 'Dosya boyutu 10MB\'dan küçük olmalıdır.';
    }
    
    return null;
  };

  const handleFileSelect = (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }
    
    setSelectedFile(file);
    setError(null);
    setAnalysis(null);
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragActive(false);
    
    const file = event.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragActive(false);
  };

  const handleAnalyzeCV = async () => {
    if (!selectedFile) {
      setError('Lütfen bir dosya seçiniz');
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const response = await cvService.analyzeCV(selectedFile);
      setAnalysis(response);
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setAnalysis(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const clearError = () => setError(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <MainLayout title="CV Analizi">
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <Heading level={1} className="text-4xl font-bold text-gray-900 mb-4">
              CV Analizi
            </Heading>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              CV'nizi yükleyin ve detaylı analiz ile öneriler alın
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

            {/* File Upload Section */}
            <div className="space-y-6">
              {/* Drag & Drop Area */}
              <div
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                  dragActive
                    ? 'border-blue-500 bg-blue-50'
                    : selectedFile
                    ? 'border-green-300 bg-green-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                {selectedFile ? (
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-lg font-medium text-gray-900">{selectedFile.name}</p>
                      <p className="text-sm text-gray-500">{formatFileSize(selectedFile.size)}</p>
                    </div>
                    <Button
                      onClick={handleRemoveFile}
                      variant="secondary"
                      size="sm"
                    >
                      Dosyayı Kaldır
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-lg font-medium text-gray-900">
                        Dosyayı buraya sürükleyin veya seçin
                      </p>
                      <p className="text-sm text-gray-500">
                        PDF, PNG, JPG, DOC, DOCX (Maks. 10MB)
                      </p>
                    </div>
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      variant="secondary"
                    >
                      Dosya Seç
                    </Button>
                  </div>
                )}
                
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                  onChange={handleFileInputChange}
                />
              </div>

              {/* Analyze Button */}
              <Button
                onClick={handleAnalyzeCV}
                disabled={!selectedFile || isLoading}
                variant="primary"
                size="lg"
                className="w-full"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    CV Analiz Ediliyor...
                  </div>
                ) : (
                  'CV\'yi Analiz Et'
                )}
              </Button>
            </div>

            {/* Analysis Results */}
            {analysis && (
              <div className="mt-8 pt-8 border-t border-gray-200">
                <Heading level={2} className="text-2xl font-semibold text-gray-900 mb-6">
                  CV Analiz Sonuçları
                </Heading>
                
                <div className="space-y-6">
                  {/* File Info */}
                  <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Analiz Edilen Dosya</h3>
                        <p className="text-gray-600">{analysis.file_name}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center">
                          <svg className="w-8 h-8 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-green-600 font-semibold">Başarılı</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Final Score */}
                  <div className="flex justify-center">
                    <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-2xl p-8 text-center max-w-sm">
                      <h4 className="text-2xl font-bold text-gray-800 mb-4">CV Puanınız</h4>
                      <div className="text-6xl font-bold text-green-600 mb-2">{analysis.final_score.toFixed(1)}</div>
                      <div className="text-gray-600 text-lg">/ 100</div>
                      <div className="mt-4 text-sm text-gray-500">
                        {analysis.final_score >= 80 ? '🎉 Mükemmel!' : 
                         analysis.final_score >= 60 ? '👍 İyi!' : 
                         analysis.final_score >= 40 ? '⚡ Geliştirilmeli' : 
                         '🚀 Büyük Potansiyel'}
                      </div>
                    </div>
                  </div>

                  {/* Keywords Analysis */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Found Keywords */}
                    <div className="bg-green-50 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Bulunan Anahtar Kelimeler ({analysis.found_keywords.length})
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {analysis.found_keywords.map((keyword, index) => (
                          <span 
                            key={index}
                            className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Missing Keywords */}
                    <div className="bg-orange-50 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <svg className="w-5 h-5 text-orange-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        Eksik Anahtar Kelimeler ({analysis.missing_keywords.length})
                      </h3>
                      {analysis.missing_keywords.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {analysis.missing_keywords.map((keyword, index) => (
                            <span 
                              key={index}
                              className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium"
                            >
                              {keyword}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-600 italic">Tüm önemli anahtar kelimeler CV'nizde mevcut!</p>
                      )}
                    </div>
                  </div>

                  {/* Tips Section */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-yellow-800 mb-4 flex items-center">
                      <svg className="w-5 h-5 text-yellow-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      İyileştirme Önerileri ({analysis.tips.length})
                    </h3>
                    <ul className="space-y-2">
                      {analysis.tips.map((tip, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-yellow-600 mr-3 mt-1">•</span>
                          <span className="text-yellow-800 text-sm leading-relaxed">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Detailed Feedback */}
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <svg className="w-5 h-5 text-gray-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z" clipRule="evenodd" />
                      </svg>
                      Detaylı Geri Bildirim
                    </h3>
                    <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                      {analysis.feedback}
                    </div>
                  </div>

                  <div className="text-sm text-gray-500 text-center">
                    Analiz Tarihi: {new Date(analysis.created_at).toLocaleDateString('tr-TR')}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Detaylı Analiz</h3>
              <p className="text-gray-600">CV'nizin güçlü ve zayıf yönleri</p>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Hızlı Sonuç</h3>
              <p className="text-gray-600">Saniyeler içinde analiz raporu</p>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Öneriler</h3>
              <p className="text-gray-600">Gelişim için pratik öneriler</p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CVAnalysisPage;
