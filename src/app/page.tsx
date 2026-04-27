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
    <main className="relative min-h-screen overflow-hidden py-12 px-4 md:px-8 flex flex-col pt-16 md:pt-24 items-center max-w-7xl mx-auto selection:bg-purple-200">
      
      {/* ULTRA PREMIUM ANIMATED MESH BACKGROUND (Light Mode) */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-slate-50">
        {/* Soft Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080801a_1px,transparent_1px),linear-gradient(to_bottom,#8080801a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
        
        {/* Glowing Orbs */}
        <motion.div 
          animate={{ x: [0, 50, 0], y: [0, -50, 0], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-indigo-300/40 blur-[140px]" 
        />
        <motion.div 
          animate={{ x: [0, -60, 0], y: [0, 60, 0], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-[20%] -right-[15%] w-[60%] h-[60%] rounded-full bg-purple-300/40 blur-[150px]" 
        />
        <motion.div 
          animate={{ x: [0, 40, 0], y: [0, 40, 0], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute -bottom-[20%] left-[20%] w-[60%] h-[60%] rounded-full bg-cyan-200/40 blur-[150px]" 
        />
        
        {/* Glass noise overlay */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.035] mix-blend-overlay" />
      </div>

      {/* Main Container Layer */}
      <div className="relative z-10 w-full flex-1 flex flex-col justify-center perspective-[2000px]">
        <AnimatePresence mode="wait">
          {view === 'setup' && (
            <motion.div key="setup" initial={{ opacity: 0, y: 30, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
              <SetupScreen onStart={handleStart} />
            </motion.div>
          )}
          
          {view === 'interviewing' && (
            <motion.div key="interviewing" initial={{ opacity: 0, y: 30, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
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
            <motion.div key="report" initial={{ opacity: 0, y: 30, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
              <ReportScreen scores={scores} feedbackList={feedbackList} onRestart={handleRestart} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
