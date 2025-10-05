'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { QuizQuestion } from '@/types/quiz';

interface QuizResult {
  email: string;
  questions: QuizQuestion[];
  userAnswers: Record<number, string>;
}

export default function ResultsPage() {
  const router = useRouter();
  const [result, setResult] = useState<QuizResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedResult = sessionStorage.getItem('quizResult');

    if (!storedResult) {
      router.push('/');
      return;
    }

    setResult(JSON.parse(storedResult));
    setIsLoading(false);
  }, [router]);

  const decodeHtml = (html: string) => {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  };

  const handleRetakeQuiz = () => {
    // Clear all quiz-related data
    sessionStorage.removeItem('quizEmail');
    sessionStorage.removeItem('quizQuestions');
    sessionStorage.removeItem('quizStartTime');
    sessionStorage.removeItem('quizResult');
    sessionStorage.removeItem('quizAnswers');
    sessionStorage.removeItem('quizVisited');
    sessionStorage.removeItem('quizCurrentIndex');

    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-purple-200">Loading results...</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return null;
  }

  const { questions, userAnswers, email } = result;
  const score = questions.reduce((acc, question, index) => {
    return userAnswers[index] === question.correct_answer ? acc + 1 : acc;
  }, 0);
  const percentage = Math.round((score / questions.length) * 100);

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="glass-card glass-card-hover rounded-2xl p-8 mb-8 text-center">
          <div className="mb-6">
            {percentage >= 70 ? (
              <div className="inline-block p-4 bg-green-500/30 rounded-full backdrop-blur-sm border border-green-400/50">
                <svg className="w-16 h-16 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            ) : percentage >= 40 ? (
              <div className="inline-block p-4 bg-yellow-500/30 rounded-full backdrop-blur-sm border border-yellow-400/50">
                <svg className="w-16 h-16 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            ) : (
              <div className="inline-block p-4 bg-red-500/30 rounded-full backdrop-blur-sm border border-red-400/50">
                <svg className="w-16 h-16 text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            )}
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 drop-shadow-lg">Quiz Completed!</h1>
          <p className="text-purple-200 mb-6">{email}</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-purple-500/20 backdrop-blur-sm rounded-lg p-4 border border-purple-400/30">
              <p className="text-sm text-purple-200 mb-1">Score</p>
              <p className="text-3xl font-bold text-purple-300">
                {score}/{questions.length}
              </p>
            </div>
            <div className="bg-pink-500/20 backdrop-blur-sm rounded-lg p-4 border border-pink-400/30">
              <p className="text-sm text-pink-200 mb-1">Percentage</p>
              <p className="text-3xl font-bold text-pink-300">{percentage}%</p>
            </div>
            <div className="bg-green-500/20 backdrop-blur-sm rounded-lg p-4 border border-green-400/30">
              <p className="text-sm text-green-200 mb-1">Correct Answers</p>
              <p className="text-3xl font-bold text-green-300">{score}</p>
            </div>
          </div>

          <button
            onClick={handleRetakeQuiz}
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200 transform hover:scale-105 shadow-md border border-purple-400/50"
          >
            Retake Quiz
          </button>
        </div>

        {/* Detailed Results */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white mb-4 drop-shadow-lg">Detailed Results</h2>

          {questions.map((question, index) => {
            const userAnswer = userAnswers[index];
            const isCorrect = userAnswer === question.correct_answer;
            const wasAnswered = userAnswer !== undefined;

            return (
              <div
                key={index}
                className={`glass-card rounded-lg p-6 transition-all duration-300 transform hover:scale-102 border-l-4 ${
                  isCorrect
                    ? 'border-green-400'
                    : wasAnswered
                    ? 'border-red-400'
                    : 'border-purple-400'
                }`}
              >
                {/* Question Header */}
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-3 py-1 bg-purple-500/30 text-purple-200 rounded-full text-sm font-medium backdrop-blur-sm border border-purple-400/30">
                        Question {index + 1}
                      </span>
                      <span className="px-3 py-1 bg-pink-500/30 text-pink-200 rounded-full text-sm backdrop-blur-sm border border-pink-400/30">
                        {question.category}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-sm backdrop-blur-sm ${
                          question.difficulty === 'easy'
                            ? 'bg-green-500/30 text-green-200 border border-green-400/30'
                            : question.difficulty === 'medium'
                            ? 'bg-yellow-500/30 text-yellow-200 border border-yellow-400/30'
                            : 'bg-red-500/30 text-red-200 border border-red-400/30'
                        }`}
                      >
                        {question.difficulty}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-white">
                      {decodeHtml(question.question)}
                    </h3>
                  </div>
                  <div>
                    {isCorrect ? (
                      <div className="flex items-center text-green-300 font-semibold">
                        <svg className="w-6 h-6 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Correct
                      </div>
                    ) : wasAnswered ? (
                      <div className="flex items-center text-red-300 font-semibold">
                        <svg className="w-6 h-6 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Incorrect
                      </div>
                    ) : (
                      <div className="flex items-center text-purple-300 font-semibold">
                        <svg className="w-6 h-6 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Not Answered
                      </div>
                    )}
                  </div>
                </div>

                {/* Answer Comparison */}
                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  {/* User's Answer */}
                  <div className={`p-4 rounded-lg border-2 backdrop-blur-sm ${
                    wasAnswered
                      ? isCorrect
                        ? 'border-green-400 bg-green-500/20'
                        : 'border-red-400 bg-red-500/20'
                      : 'border-purple-400/30 bg-purple-500/10'
                  }`}>
                    <p className="text-sm font-semibold text-purple-200 mb-2">Your Answer:</p>
                    <p className={`${
                      wasAnswered
                        ? isCorrect
                          ? 'text-green-300'
                          : 'text-red-300'
                        : 'text-purple-300'
                    } font-medium`}>
                      {wasAnswered ? decodeHtml(userAnswer) : 'Not answered'}
                    </p>
                  </div>

                  {/* Correct Answer */}
                  <div className="p-4 rounded-lg border-2 border-green-400 bg-green-500/20 backdrop-blur-sm">
                    <p className="text-sm font-semibold text-purple-200 mb-2">Correct Answer:</p>
                    <p className="text-green-300 font-medium">
                      {decodeHtml(question.correct_answer)}
                    </p>
                  </div>
                </div>

                {/* All Choices */}
                <div className="mt-4 pt-4 border-t border-purple-400/30">
                  <p className="text-sm font-semibold text-purple-200 mb-2">All Options:</p>
                  <div className="grid gap-2">
                    {question.choices.map((choice, choiceIndex) => {
                      const isUserChoice = choice === userAnswer;
                      const isCorrectChoice = choice === question.correct_answer;

                      return (
                        <div
                          key={choiceIndex}
                          className={`p-3 rounded-lg text-sm backdrop-blur-sm border ${
                            isCorrectChoice
                              ? 'bg-green-500/20 text-green-300 font-medium border-green-400/30'
                              : isUserChoice
                              ? 'bg-red-500/20 text-red-300 border-red-400/30'
                              : 'bg-white/5 text-purple-200 border-purple-400/20'
                          }`}
                        >
                          <div className="flex items-center">
                            {isCorrectChoice && (
                              <svg className="w-4 h-4 mr-2 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                            {isUserChoice && !isCorrectChoice && (
                              <svg className="w-4 h-4 mr-2 text-red-300" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                            {decodeHtml(choice)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-8 text-center">
          <button
            onClick={handleRetakeQuiz}
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200 transform hover:scale-105 shadow-md border border-purple-400/50"
          >
            Take Another Quiz
          </button>
        </div>
      </div>
    </div>
  );
}
