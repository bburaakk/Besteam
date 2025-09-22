import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { MainLayout } from '../components/templates';
import { Button, Alert } from '../components/atoms';
import { quizService } from '../services';
import type { Quiz } from '../services';

const QuizPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation() as { state?: { quiz?: Quiz } };
  const roadmapIdParam = searchParams.get('roadmapId');
  const roadmapId = useMemo(() => (roadmapIdParam ? Number(roadmapIdParam) : null), [roadmapIdParam]);

  const [quiz, setQuiz] = useState<Quiz | null>(() => location?.state?.quiz ?? null);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  

  useEffect(() => {
    setError(null);
  }, [roadmapId]);

  useEffect(() => {
    const autoGenerate = async () => {
      if (!quiz && roadmapId) {
        setError(null);
        try {
          const response = await quizService.generateQuiz(roadmapId);
          setQuiz(response.quiz);
        } catch (e: unknown) {
          const message = e instanceof Error ? e.message : 'Quiz oluşturulurken bir hata oluştu.';
          setError(message);
        }
      }
    };
    autoGenerate();
  }, [roadmapId, quiz]);

  // Manual generate is not used; quizzes auto-generate when roadmapId is present

  const handleSelect = (questionId: number, optionIndex: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  // Submission is currently not triggered by UI; keep for future use if needed

  return (
    <MainLayout title="Quiz">
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-fuchsia-50 py-8">
        <div className="max-w-5xl mx-auto px-2 sm:px-4 lg:px-6">

          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-100 p-6 sm:p-8">
            {error && (
              <div className="mb-6">
                <Alert variant="error" message={error} onClose={() => setError(null)} />
              </div>
            )}

            {!roadmapId && (
              <div className="text-center">
                <p className="text-gray-700 mb-6">Roadmap bilgisi bulunamadı. Lütfen önce bir roadmap oluşturun.</p>
                <a href="/roadmap" className="inline-block">
                  <Button variant="secondary">Roadmap Sayfasına Git</Button>
                </a>
              </div>
            )}

            {roadmapId && !quiz && (
              <div className="py-16 flex items-center justify-center">
                <div className="flex items-center space-x-3 text-gray-600">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-400"></div>
                  <span>Sorular yükleniyor...</span>
                </div>
              </div>
            )}

            {quiz && (
              <div>
                <div className="mb-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold text-gray-900">{quiz.title}</h2>
                    {(() => {
                      const answered = Object.keys(answers).length;
                      const correctSoFar = quiz.questions.reduce((acc, q) => acc + ((answers[q.id] === q.correct_answer) ? 1 : 0), 0);
                      return <div className="text-sm text-gray-500">{correctSoFar}/{answered} doğru • Toplam {quiz.questions.length} soru</div>
                    })()}
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-gray-200 overflow-hidden">
                    {(() => {
                      const answered = Object.keys(answers).length;
                      const pct = Math.min(100, Math.round((answered / Math.max(1, quiz.questions.length)) * 100));
                      return <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all" style={{ width: pct + '%' }} />
                    })()}
                  </div>
                </div>

                <div className="space-y-6">
                  {quiz.questions.map((q, idx) => {
                    const selectedIndex = answers[q.id];
                    const isAnswered = typeof selectedIndex === 'number';
                    return (
                      <div key={q.id} className="p-5 rounded-2xl border bg-white shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center mb-3">
                          <div className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-indigo-600 text-white text-xs font-bold mr-3">
                            {idx + 1}
                          </div>
                          <div className="text-gray-900 font-medium">{q.question}</div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {q.options.map((opt, oi) => {
                            const isCorrectOption = oi === q.correct_answer;
                            const isSelected = selectedIndex === oi;
                            const isSelectedWrong = isAnswered && isSelected && !isCorrectOption;
                            const isCorrectSelected = isAnswered && isSelected && isCorrectOption;
                            const letter = String.fromCharCode(65 + oi);
                            const base = 'group text-left p-3 rounded-xl border transition-all';
                            const state = !isAnswered
                              ? (isSelected ? ' bg-indigo-50 border-indigo-300 ring-2 ring-indigo-200' : ' hover:bg-gray-50')
                              : (isCorrectOption ? ' bg-green-50 border-green-300 ring-2 ring-green-200'
                                 : (isSelectedWrong ? ' bg-red-50 border-red-300 ring-2 ring-red-200' : ' opacity-70'));
                            return (
                              <button
                                key={oi}
                                onClick={() => !isAnswered && handleSelect(q.id, oi)}
                                disabled={isAnswered}
                                className={`${base}${state}`}
                              >
                                <div className="flex items-start space-x-3">
                                  <div className={`mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center text-xs font-semibold ${isCorrectSelected ? 'bg-green-600 text-white' : isSelectedWrong ? 'bg-red-600 text-white' : isCorrectOption && isAnswered ? 'bg-green-200 text-green-800' : 'bg-gray-200 text-gray-700 group-hover:bg-gray-300'}`}>{letter}</div>
                                  <div className="text-gray-800 text-sm leading-relaxed">{opt}</div>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>

               
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default QuizPage;


