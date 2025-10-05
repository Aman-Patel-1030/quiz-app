'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { QuizQuestion } from '@/types/quiz';

const QUIZ_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds

export default function QuizPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [visitedQuestions, setVisitedQuestions] = useState<Set<number>>(new Set([0]));
  const [timeRemaining, setTimeRemaining] = useState(QUIZ_DURATION);
  const [isLoading, setIsLoading] = useState(true);
  const [showNav, setShowNav] = useState(false);

  // Load quiz data from sessionStorage
  useEffect(() => {
    const storedQuestions = sessionStorage.getItem('quizQuestions');
    const startTime = sessionStorage.getItem('quizStartTime');
    const storedAnswers = sessionStorage.getItem('quizAnswers');
    const storedVisited = sessionStorage.getItem('quizVisited');
    const storedCurrentIndex = sessionStorage.getItem('quizCurrentIndex');

    if (!storedQuestions || !startTime) {
      router.push('/');
      return;
    }

    const parsedQuestions = JSON.parse(storedQuestions);
    setQuestions(parsedQuestions);

    // Restore previous state if exists
    if (storedAnswers) {
      setAnswers(JSON.parse(storedAnswers));
    }
    if (storedVisited) {
      setVisitedQuestions(new Set(JSON.parse(storedVisited)));
    }
    if (storedCurrentIndex) {
      setCurrentQuestionIndex(parseInt(storedCurrentIndex));
    }

    // Calculate remaining time
    const elapsed = Date.now() - parseInt(startTime);
    const remaining = Math.max(0, QUIZ_DURATION - elapsed);
    setTimeRemaining(remaining);

    setIsLoading(false);
  }, [router]);

  // Submit quiz handler
  const handleSubmitQuiz = useCallback(() => {
    const email = sessionStorage.getItem('quizEmail');
    const quizResult = {
      email,
      questions,
      userAnswers: answers,
    };

    sessionStorage.setItem('quizResult', JSON.stringify(quizResult));
    sessionStorage.removeItem('quizAnswers');
    sessionStorage.removeItem('quizVisited');
    sessionStorage.removeItem('quizCurrentIndex');

    router.push('/results');
  }, [questions, answers, router]);

  // Save state to sessionStorage whenever it changes
  useEffect(() => {
    if (questions.length > 0) {
      sessionStorage.setItem('quizAnswers', JSON.stringify(answers));
      sessionStorage.setItem('quizVisited', JSON.stringify(Array.from(visitedQuestions)));
      sessionStorage.setItem('quizCurrentIndex', currentQuestionIndex.toString());
    }
  }, [answers, visitedQuestions, currentQuestionIndex, questions]);

  // Timer countdown
  useEffect(() => {
    if (timeRemaining <= 0) {
      handleSubmitQuiz();
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        const newTime = prev - 1000;
        if (newTime <= 0) {
          clearInterval(timer);
          return 0;
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, handleSubmitQuiz]);

  const handleAnswerSelect = (answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: answer,
    }));
  };

  const navigateToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
    setVisitedQuestions((prev) => new Set([...prev, index]));
    setShowNav(false);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      navigateToQuestion(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      navigateToQuestion(currentQuestionIndex - 1);
    }
  };

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const decodeHtml = (html: string) => {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-purple-200">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return null;
  }

  const currentQuestion = questions[currentQuestionIndex];
  const answeredCount = Object.keys(answers).length;
  const isTimeRunningOut = timeRemaining < 5 * 60 * 1000; // Less than 5 minutes

  return (
    <div className="min-h-screen">
      {/* Header with Timer */}
      <header className="glass-card sticky top-0 z-40 border-b border-purple-400/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl md:text-2xl font-bold text-white">Quiz Challenge</h1>
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-mono text-lg font-semibold transition-colors duration-300 backdrop-blur-sm ${
              isTimeRunningOut ? 'bg-red-500/30 text-red-300 animate-pulse border border-red-400/50' : 'bg-purple-500/30 text-purple-200 border border-purple-400/50'
            }`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{formatTime(timeRemaining)}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Navigation Panel - Desktop */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="glass-card rounded-lg p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-white mb-4">Questions</h2>
              <div className="space-y-1 max-h-[calc(100vh-200px)] overflow-y-auto">
                {questions.map((_, index) => {
                  const isVisited = visitedQuestions.has(index);
                  const isAnswered = answers.hasOwnProperty(index);
                  const isCurrent = index === currentQuestionIndex;

                  return (
                    <button
                      key={index}
                      onClick={() => navigateToQuestion(index)}
                      className={`w-full px-4 py-2 rounded-lg text-left font-medium transition-all duration-200 transform hover:scale-105 backdrop-blur-sm ${
                        isCurrent
                          ? 'bg-purple-600 text-white shadow-md border border-purple-400/50'
                          : isAnswered
                          ? 'bg-green-500/30 text-green-300 hover:bg-green-500/40 border border-green-400/30'
                          : isVisited
                          ? 'bg-yellow-500/30 text-yellow-300 hover:bg-yellow-500/40 border border-yellow-400/30'
                          : 'bg-white/10 text-purple-200 hover:bg-white/20 border border-purple-400/20'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>Question {index + 1}</span>
                        {isAnswered && (
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
              <div className="mt-6 pt-4 border-t border-purple-400/30">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-purple-200">Answered:</span>
                    <span className="font-semibold text-white">{answeredCount}/{questions.length}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                    <span className="text-purple-200 text-xs">Answered</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                    <span className="text-purple-200 text-xs">Visited</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-purple-300 rounded"></div>
                    <span className="text-purple-200 text-xs">Not Visited</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Navigation Toggle */}
          <div className="lg:hidden fixed bottom-4 right-4 z-50">
            <button
              onClick={() => setShowNav(!showNav)}
              className="bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* Mobile Navigation Panel */}
          {showNav && (
            <div className="lg:hidden fixed inset-0 bg-black/70 backdrop-blur-sm z-40" onClick={() => setShowNav(false)}>
              <div className="absolute right-0 top-0 bottom-0 w-80 glass-card shadow-xl p-6 overflow-y-auto border-l border-purple-400/30" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-white">Questions</h2>
                  <button onClick={() => setShowNav(false)} className="text-purple-200 hover:text-white">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="space-y-2">
                  {questions.map((_, index) => {
                    const isVisited = visitedQuestions.has(index);
                    const isAnswered = answers.hasOwnProperty(index);
                    const isCurrent = index === currentQuestionIndex;

                    return (
                      <button
                        key={index}
                        onClick={() => navigateToQuestion(index)}
                        className={`w-full px-4 py-2 rounded-lg text-left font-medium transition-all backdrop-blur-sm ${
                          isCurrent
                            ? 'bg-purple-600 text-white border border-purple-400/50'
                            : isAnswered
                            ? 'bg-green-500/30 text-green-300 border border-green-400/30'
                            : isVisited
                            ? 'bg-yellow-500/30 text-yellow-300 border border-yellow-400/30'
                            : 'bg-white/10 text-purple-200 border border-purple-400/20'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>Question {index + 1}</span>
                          {isAnswered && (
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
                <div className="mt-4 pt-4 border-t border-purple-400/30 text-sm text-purple-200">
                  Answered: {answeredCount}/{questions.length}
                </div>
              </div>
            </div>
          )}

          {/* Question Content */}
          <div className="lg:col-span-3">
            <div className="glass-card glass-card-hover rounded-lg p-6 md:p-8">
              {/* Question Header */}
              <div className="mb-6">
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className="px-3 py-1 bg-purple-500/30 text-purple-200 rounded-full text-sm font-medium backdrop-blur-sm border border-purple-400/30">
                    Question {currentQuestionIndex + 1} of {questions.length}
                  </span>
                  <span className="px-3 py-1 bg-pink-500/30 text-pink-200 rounded-full text-sm font-medium backdrop-blur-sm border border-pink-400/30">
                    {currentQuestion.category}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm ${
                    currentQuestion.difficulty === 'easy' ? 'bg-green-500/30 text-green-200 border border-green-400/30' :
                    currentQuestion.difficulty === 'medium' ? 'bg-yellow-500/30 text-yellow-200 border border-yellow-400/30' :
                    'bg-red-500/30 text-red-200 border border-red-400/30'
                  }`}>
                    {currentQuestion.difficulty.charAt(0).toUpperCase() + currentQuestion.difficulty.slice(1)}
                  </span>
                </div>
                <h2 className="text-xl md:text-2xl font-semibold text-white">
                  {decodeHtml(currentQuestion.question)}
                </h2>
              </div>

              {/* Answer Choices */}
              <div className="space-y-3 mb-8">
                {currentQuestion.choices.map((choice, index) => {
                  const isSelected = answers[currentQuestionIndex] === choice;
                  return (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(choice)}
                      className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 transform hover:scale-102 backdrop-blur-sm ${
                        isSelected
                          ? 'border-purple-500 bg-purple-500/20 shadow-md'
                          : 'border-purple-400/30 hover:border-purple-400/50 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-start">
                        <div className={`flex-shrink-0 w-6 h-6 rounded-full border-2 mr-3 mt-0.5 flex items-center justify-center ${
                          isSelected ? 'border-purple-500 bg-purple-500' : 'border-purple-300/50'
                        }`}>
                          {isSelected && (
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                        <span className={`flex-1 ${isSelected ? 'text-white font-medium' : 'text-purple-100'}`}>
                          {decodeHtml(choice)}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between pt-6 border-t border-purple-400/30">
                <button
                  onClick={handlePrevious}
                  disabled={currentQuestionIndex === 0}
                  className="px-6 py-3 bg-white/10 text-purple-200 rounded-lg font-semibold hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 backdrop-blur-sm border border-purple-400/30"
                >
                  ← Previous
                </button>

                {currentQuestionIndex === questions.length - 1 ? (
                  <button
                    onClick={handleSubmitQuiz}
                    className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-200 transform hover:scale-105 shadow-md border border-green-400/50"
                  >
                    Submit Quiz →
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200 transform hover:scale-105 border border-purple-400/50"
                  >
                    Next →
                  </button>
                )}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-6 glass-card rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-purple-200">Overall Progress</span>
                <span className="text-sm font-semibold text-white">{Math.round((answeredCount / questions.length) * 100)}%</span>
              </div>
              <div className="w-full bg-purple-900/30 rounded-full h-3 overflow-hidden border border-purple-400/30">
                <div
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-full transition-all duration-500 ease-out"
                  style={{ width: `${(answeredCount / questions.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
