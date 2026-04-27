"use client";

import { useState } from 'react';
import { SetupScreen } from '@/components/SetupScreen';
import { InterviewScreen } from '@/components/InterviewScreen';
import { ReportScreen } from '@/components/ReportScreen';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const [view, setView] = useState<'setup' | 'interviewing' | 'report'>('setup');
  
  const [role, setRole] = useState('');
  const [level, setLevel] = useState('');
  const [topic, setTopic] = useState('');
  const [resumeText, setResumeText] = useState('');

  const [scores, setScores] = useState<number[]>([]);
  const [feedbackList, setFeedbackList] = useState<string[]>([]);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [askedQuestions, setAskedQuestions] = useState<string[]>([]);

  const MAX_QUESTIONS = 5;

  const handleStart = (r: string, l: string, t: string, cvText: string) => {
    setRole(r);
    setLevel(l);
    setTopic(t);
    setResumeText(cvText);
    setView('interviewing');
  };

  const handleCompleteQuestion = (feedback: any, questionText: string) => {
    setScores(prev => [...prev, feedback.score]);
    setFeedbackList(prev => [...prev, feedback.feedback]);
    setAskedQuestions(prev => [...prev, questionText]);
  };

  const handleRestart = () => {
    setRole('');
    setLevel('');
    setTopic('');
    setResumeText('');
    setScores([]);
    setFeedbackList([]);
    setAskedQuestions([]);
    setQuestionNumber(1);
    setView('setup');
  };

  return (
    <main className="relative min-h-screen overflow-hidden py-12 px-4 md:px-8 flex flex-col pt-16 md:pt-24 items-center max-w-7xl mx-auto">
      <div className="fixed inset-0 z-0 pointer-events-none bg-[#FAFAFA]">
        <motion.div animate={{ opacity: [0.4, 0.6, 0.4] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }} className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-100/60 blur-[120px]" />
        <motion.div animate={{ opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }} className="absolute top-[30%] -right-[20%] w-[60%] h-[60%] rounded-full bg-violet-100/60 blur-[120px]" />
      </div>

      <div className="relative z-10 w-full flex-1">
        <AnimatePresence mode="wait">
          {view === 'setup' && (
            <motion.div key="setup" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.4 }}>
              <SetupScreen onStart={handleStart} />
            </motion.div>
          )}
          
          {view === 'interviewing' && (
            <motion.div key="interviewing" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.4 }}>
              <InterviewScreen 
                role={role} level={level} topic={topic} resumeText={resumeText}
                questionNumber={questionNumber}
                maxQuestions={MAX_QUESTIONS}
                askedQuestions={askedQuestions}
                onCompleteQuestion={handleCompleteQuestion}
                onFinishInterview={() => {
                   if (questionNumber >= MAX_QUESTIONS) setView('report');
                   else setQuestionNumber(prev => prev + 1);
                }}
              />
            </motion.div>
          )}

          {view === 'report' && (
            <motion.div key="report" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.4 }}>
              <ReportScreen scores={scores} feedbackList={feedbackList} onRestart={handleRestart} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
