/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { SplashScreen } from './components/SplashScreen';
import { HomeView } from './views/HomeView';
import { TileDetailView } from './views/TileDetailView';
import { WriteView } from './views/WriteView';
import { QuestionsView } from './views/QuestionsView';
import { ResultView } from './views/ResultView';
import { LibraryView } from './views/LibraryView';
import { MoodView } from './views/MoodView';
import { ProfileView } from './views/ProfileView';

import {
  BehaviorCategory,
  Perspective,
  QuestionItem,
  UserAnswer,
  AnalysisResult,
  MoodLog,
  DraftSession,
  AISettings
} from './types';
import { buildLocalAnalysis } from './services/localEngine';
import { runAIAnalysis, getStoredAISettings, saveAISettings } from './services/aiService';
import { Sparkles } from 'lucide-react';

const SESSIONS_STORAGE_KEY = 'hstyle_decode_sessions';
const MOOD_STORAGE_KEY = 'hstyle_decode_mood_logs';
const DRAFT_STORAGE_KEY = 'hstyle_decode_draft';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [currentTab, setCurrentTab] = useState<'home' | 'tile-detail' | 'write' | 'questions' | 'result' | 'library' | 'mood' | 'profile'>('home');

  // Active analysis workflow states
  const [inputText, setInputText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<BehaviorCategory>('behavior');
  const [selectedPerspective, setSelectedPerspective] = useState<Perspective>('self');
  const [activeQuestions, setActiveQuestions] = useState<QuestionItem[]>([]);
  const [currentAnswers, setCurrentAnswers] = useState<Record<string, UserAnswer>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Selected tile category for TileDetailView
  const [activeTileCategory, setActiveTileCategory] = useState<BehaviorCategory>('habit');

  // Completed result
  const [currentResult, setCurrentResult] = useState<AnalysisResult | null>(null);

  // Analyzing loading indicator
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Persistent storage states
  const [sessions, setSessions] = useState<AnalysisResult[]>(() => {
    try {
      const raw = localStorage.getItem(SESSIONS_STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.error('Error loading sessions', e);
    }
    return [];
  });

  const [moodLogs, setMoodLogs] = useState<MoodLog[]>(() => {
    try {
      const raw = localStorage.getItem(MOOD_STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.error('Error loading mood logs', e);
    }
    return [];
  });

  const [draftSession, setDraftSession] = useState<DraftSession | null>(() => {
    try {
      const raw = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.error('Error loading draft', e);
    }
    return null;
  });

  const [aiSettings, setAISettings] = useState<AISettings>(() => getStoredAISettings());

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(sessions));
    } catch (e) {
      console.error('Failed to save sessions', e);
    }
  }, [sessions]);

  useEffect(() => {
    try {
      localStorage.setItem(MOOD_STORAGE_KEY, JSON.stringify(moodLogs));
    } catch (e) {
      console.error('Failed to save mood logs', e);
    }
  }, [moodLogs]);

  useEffect(() => {
    try {
      if (draftSession) {
        localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draftSession));
      } else {
        localStorage.removeItem(DRAFT_STORAGE_KEY);
      }
    } catch (e) {
      console.error('Failed to save draft', e);
    }
  }, [draftSession]);

  // Today's mood log
  const todayStr = new Date().toISOString().slice(0, 10);
  const todayMood = moodLogs.find(m => m.date.slice(0, 10) === todayStr) || null;

  // Handlers for starting writing from Home or Quick Box
  const handleStartWriting = (text?: string, category?: BehaviorCategory, perspective?: Perspective) => {
    if (text !== undefined) setInputText(text);
    if (category) setSelectedCategory(category);
    if (perspective) setSelectedPerspective(perspective);
    setCurrentTab('write');
  };

  // Open tile detail page (12 questions)
  const handleOpenTileDetail = (cat: BehaviorCategory) => {
    setActiveTileCategory(cat);
    setCurrentTab('tile-detail');
  };

  // Select question from tile detail page
  const handleSelectQuestionFromTile = (questionText: string, category: BehaviorCategory, perspective: Perspective) => {
    setInputText(questionText);
    setSelectedCategory(category);
    setSelectedPerspective(perspective);
    setCurrentTab('write');
  };

  // Moving from writing view to questions
  const handleProceedToQuestions = (text: string, category: BehaviorCategory, perspective: Perspective) => {
    setInputText(text);
    setSelectedCategory(category);
    setSelectedPerspective(perspective);
    setActiveQuestions([]);
    setCurrentAnswers({});
    setCurrentQuestionIndex(0);
    setDraftSession(null);
    try {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
    } catch (e) {
      console.error('Failed to clear draft on fresh start', e);
    }
    setCurrentTab('questions');
  };

  // Save draft
  const handleSaveDraft = (
    answers: Record<string, UserAnswer>,
    questions: QuestionItem[],
    currentIndex: number
  ) => {
    const draft: DraftSession = {
      inputText,
      category: selectedCategory,
      perspective: selectedPerspective,
      activeQuestions: questions,
      currentQuestionIndex: currentIndex,
      answers,
      updatedAt: new Date().toISOString()
    };
    setDraftSession(draft);
    setActiveQuestions(questions);
    setCurrentAnswers(answers);
    setCurrentQuestionIndex(currentIndex);
  };

  // Resume draft
  const handleResumeDraft = () => {
    if (!draftSession) return;
    setInputText(draftSession.inputText);
    setSelectedCategory(draftSession.category);
    setSelectedPerspective(draftSession.perspective);
    setActiveQuestions(draftSession.activeQuestions);
    setCurrentAnswers(draftSession.answers);
    setCurrentQuestionIndex(Math.min(draftSession.currentQuestionIndex, draftSession.activeQuestions.length - 1));
    setCurrentTab('questions');
  };

  // Discard draft
  const handleDiscardDraft = () => {
    setDraftSession(null);
  };

  // Finish Questions & Generate Result
  const handleFinishQuestions = async (
    answers: Record<string, UserAnswer>,
    questions: QuestionItem[],
    finalPerspective?: Perspective
  ) => {
    setIsAnalyzing(true);
    setCurrentAnswers(answers);
    const targetPerspective = finalPerspective || selectedPerspective;
    if (finalPerspective && finalPerspective !== selectedPerspective) {
      setSelectedPerspective(finalPerspective);
    }

    try {
      const result = await runAIAnalysis({
        text: inputText,
        category: selectedCategory,
        perspective: targetPerspective,
        answers,
        questions,
        moodLevel: todayMood?.moodLevel,
        sleepHours: todayMood?.sleepHours
      });

      // Clear draft on successful completion
      setDraftSession(null);

      // Save into sessions
      setSessions(prev => [result, ...prev]);
      setCurrentResult(result);
      setCurrentTab('result');
    } catch (e) {
      console.error('Error generating analysis', e);
      // Fallback guaranteed
      const fallbackResult = buildLocalAnalysis({
        text: inputText,
        category: selectedCategory,
        perspective: targetPerspective,
        answers,
        questions,
        moodLevel: todayMood?.moodLevel,
        sleepHours: todayMood?.sleepHours
      });
      setDraftSession(null);
      setSessions(prev => [fallbackResult, ...prev]);
      setCurrentResult(fallbackResult);
      setCurrentTab('result');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // View specific session from history
  const handleViewSessionResult = (session: AnalysisResult) => {
    setCurrentResult(session);
    setCurrentTab('result');
  };

  // Save mood log
  const handleSaveMoodLog = (logData: Omit<MoodLog, 'id' | 'date'>) => {
    const newLog: MoodLog = {
      id: 'mood-' + Date.now(),
      date: new Date().toISOString(),
      ...logData
    };
    setMoodLogs(prev => [newLog, ...prev.filter(m => m.date.slice(0, 10) !== todayStr)]);
  };

  // Delete mood log
  const handleDeleteMoodLog = (id: string) => {
    setMoodLogs(prev => prev.filter(m => m.id !== id));
  };

  // Delete session
  const handleDeleteSession = (id: string) => {
    setSessions(prev => prev.filter(s => s.id !== id));
    if (currentResult?.id === id) {
      setCurrentResult(null);
    }
  };

  // Clear all sessions
  const handleClearAllSessions = () => {
    setSessions([]);
    setCurrentResult(null);
  };

  // Save AI Settings
  const handleSaveAISettings = (newSettings: AISettings) => {
    setAISettings(newSettings);
    saveAISettings(newSettings);
  };

  const isSubPage = currentTab !== 'home';

  const handleNavbarBack = () => {
    if (currentTab === 'tile-detail') setCurrentTab('home');
    else if (currentTab === 'write') setCurrentTab('home');
    else if (currentTab === 'questions') setCurrentTab('write');
    else if (currentTab === 'result') setCurrentTab('home');
    else setCurrentTab('home');
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-slate-900 flex flex-col font-['Tajawal',sans-serif]">
      {/* Splash Screen on startup */}
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}

      {/* Main Navbar */}
      <Navbar
        currentTab={currentTab}
        onNavigate={tab => setCurrentTab(tab as any)}
        showBack={isSubPage}
        onBack={handleNavbarBack}
        title={
          currentTab === 'tile-detail'
            ? 'أسئلة البلاطة'
            : currentTab === 'write'
            ? 'الكتابة والتشريح'
            : currentTab === 'questions'
            ? 'الأسئلة التكيفية'
            : currentTab === 'result'
            ? 'تقرير فكّ الشيفرة'
            : currentTab === 'library'
            ? 'المكتبة المرجعية'
            : currentTab === 'mood'
            ? 'المزاج والنوم'
            : currentTab === 'profile'
            ? 'ملفّي وسجل الجلسات'
            : undefined
        }
        todayMood={todayMood}
      />

      {/* Main Scrollable View Area */}
      <main className="flex-1 px-4 sm:px-6 pt-4 max-w-2xl mx-auto w-full">
        {/* Analyzing Spinner Screen */}
        {isAnalyzing ? (
          <div className="py-24 text-center flex flex-col items-center justify-center space-y-4">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-4 border-purple-500/20 animate-ping" />
              <div className="w-16 h-16 rounded-full border-4 border-purple-600 border-t-transparent animate-spin flex items-center justify-center" />
              <Sparkles className="w-6 h-6 text-purple-600 absolute inset-0 m-auto" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              جارٍ فكّ الشيفرة وتشريح الحلقة السلوكية...
            </h2>
            <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
              يقوم المحرك الآن بمطابقة إجاباتك مع النظريات العلمية الـ 25 والشيفرات الـ 20، وصياغة خطة التغيير الدقيقة.
            </p>
          </div>
        ) : (
          <>
            {currentTab === 'home' && (
              <HomeView
                onStartWriting={handleStartWriting}
                onOpenTileDetail={handleOpenTileDetail}
                onNavigate={tab => setCurrentTab(tab as any)}
                todayMood={todayMood}
                onOpenMoodModal={() => setCurrentTab('mood')}
                recentSessions={sessions}
                draftSession={draftSession}
                onResumeDraft={handleResumeDraft}
                onDiscardDraft={handleDiscardDraft}
                onViewSessionResult={handleViewSessionResult}
                aiSettings={aiSettings}
              />
            )}

            {currentTab === 'tile-detail' && (
              <TileDetailView
                category={activeTileCategory}
                onBack={() => setCurrentTab('home')}
                onSelectQuestion={handleSelectQuestionFromTile}
              />
            )}

            {currentTab === 'write' && (
              <WriteView
                initialText={inputText}
                initialCategory={selectedCategory}
                initialPerspective={selectedPerspective}
                onProceedToQuestions={handleProceedToQuestions}
              />
            )}

            {currentTab === 'questions' && (
              <QuestionsView
                inputText={inputText}
                category={selectedCategory}
                perspective={selectedPerspective}
                todayMood={todayMood}
                onFinishQuestions={handleFinishQuestions}
                onSaveDraft={handleSaveDraft}
                onBackToWriting={() => setCurrentTab('write')}
                initialAnswers={currentAnswers}
                initialQuestions={activeQuestions.length >= 3 ? activeQuestions : undefined}
                initialIndex={currentQuestionIndex}
              />
            )}

            {currentTab === 'result' && currentResult && (
              <ResultView
                result={currentResult}
                onStartNewSession={() => {
                  setInputText('');
                  setCurrentAnswers({});
                  setCurrentQuestionIndex(0);
                  setCurrentResult(null);
                  setCurrentTab('write');
                }}
              />
            )}

            {currentTab === 'library' && <LibraryView />}

            {currentTab === 'mood' && (
              <MoodView
                moodLogs={moodLogs}
                todayMood={todayMood}
                onSaveMoodLog={handleSaveMoodLog}
                onDeleteMoodLog={handleDeleteMoodLog}
              />
            )}

            {currentTab === 'profile' && (
              <ProfileView
                sessions={sessions}
                moodCount={moodLogs.length}
                draftSession={draftSession}
                onResumeDraft={handleResumeDraft}
                onDiscardDraft={handleDiscardDraft}
                onViewSessionResult={handleViewSessionResult}
                onDeleteSession={handleDeleteSession}
                onClearAllSessions={handleClearAllSessions}
                aiSettings={aiSettings}
                onSaveAISettings={handleSaveAISettings}
              />
            )}
          </>
        )}
      </main>

      {/* Floating Dark Bottom Navigation Bar */}
      <BottomNav
        currentTab={currentTab === 'tile-detail' ? 'home' : currentTab}
        onNavigate={tab => setCurrentTab(tab as any)}
        hasDraft={Boolean(draftSession)}
      />
    </div>
  );
}
