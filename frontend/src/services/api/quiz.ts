import { apiClient } from './client';

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correct_answer: number;
  explanation?: string;
}

export interface Quiz {
  id: number;
  roadmap_id: number;
  title: string;
  description?: string;
  questions: QuizQuestion[];
  created_at: string;
  updated_at: string;
}

export interface QuizGenerationRequest {
  roadmap_id: number;
}

export interface QuizGenerationResponse {
  quiz: Quiz;
  message?: string;
}

// Support backend raw shape
export interface RawQuizLevelQuestion {
  question: string;
  options: string[];
  answer: string;
}

export interface RawQuizLevel {
  level: number;
  levelTitle: string;
  questions: RawQuizLevelQuestion[];
}

export interface RawQuizResponse {
  quizTitle: string;
  levels: RawQuizLevel[];
}

export interface QuizSubmissionRequest {
  quiz_id: number;
  answers: { [questionId: number]: number };
}

export interface QuizResult {
  quiz_id: number;
  score: number;
  total_questions: number;
  correct_answers: number;
  percentage: number;
  passed: boolean;
  detailed_results: {
    question_id: number;
    user_answer: number;
    correct_answer: number;
    is_correct: boolean;
    explanation?: string;
  }[];
}

export interface QuizSubmissionResponse {
  result: QuizResult;
  message?: string;
}

export const quizService = {
  /**
   * Generate a new quiz for a specific roadmap
   */
  generateQuiz: async (roadmapId: number): Promise<QuizGenerationResponse> => {
    const response = await apiClient.post<QuizGenerationResponse | RawQuizResponse>('/api/quizzes/generate', {
      roadmap_id: roadmapId
    });
    const data: any = response.data;
    if (data?.quiz) {
      return data as QuizGenerationResponse;
    }

    const raw = data as RawQuizResponse;
    const questions = (raw.levels ?? []).flatMap((lvl, levelIdx) =>
      (lvl.questions ?? []).map((q, qIdx) => {
        const idx = q.options.findIndex(opt => opt === q.answer);
        const correctIndex = idx >= 0 ? idx : 0;
        return {
          id: Number(`${roadmapId}${levelIdx + 1}${qIdx + 1}${Date.now() % 1000}`),
          question: q.question,
          options: q.options,
          correct_answer: correctIndex,
          explanation: undefined,
        } as QuizQuestion;
      })
    );

    const nowIso = new Date().toISOString();
    const mappedQuiz: Quiz = {
      id: Number(`${roadmapId}${Date.now() % 100000}`),
      roadmap_id: roadmapId,
      title: raw.quizTitle || 'Quiz',
      description: raw.levels?.length ? `${raw.levels.length} seviye içerir` : undefined,
      questions,
      created_at: nowIso,
      updated_at: nowIso,
    };

    return { quiz: mappedQuiz } as QuizGenerationResponse;
  },

  /**
   * Get a specific quiz by ID
   */
  getQuiz: async (quizId: number): Promise<Quiz> => {
    const response = await apiClient.get<Quiz>(`/api/quizzes/${quizId}`);
    return response.data;
  },

  /**
   * Get all quizzes for a specific roadmap
   */
  getQuizzesByRoadmap: async (roadmapId: number): Promise<Quiz[]> => {
    const response = await apiClient.get<Quiz[]>(`/api/quizzes/roadmap/${roadmapId}`);
    return response.data;
  },

  /**
   * Submit quiz answers and get results
   */
  submitQuiz: async (quizId: number, answers: { [questionId: number]: number }): Promise<QuizSubmissionResponse> => {
    const response = await apiClient.post<QuizSubmissionResponse>('/api/quizzes/submit', {
      quiz_id: quizId,
      answers
    });
    return response.data;
  },

  /**
   * Get quiz results by quiz ID
   */
  getQuizResults: async (quizId: number): Promise<QuizResult> => {
    const response = await apiClient.get<QuizResult>(`/api/quizzes/${quizId}/results`);
    return response.data;
  },

  /**
   * Delete a quiz (admin only)
   */
  deleteQuiz: async (quizId: number): Promise<void> => {
    await apiClient.delete(`/api/quizzes/${quizId}`);
  }
};
