import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2, CheckCircle2, AlertCircle, ArrowRight, Mic, MicOff, AlertTriangle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export function InterviewScreen({ 
  role, level, topic, resumeText, askedQuestions,
  onCompleteQuestion,
  onFinishInterview,
  questionNumber,
  maxQuestions
}: any) {
  const [questionData, setQuestionData] = useState<any>(null);
  const [answer, setAnswer] = useState('');
  const [feedbackData, setFeedbackData] = useState<any>(null);
  
  const [isLoadingQuestion, setIsLoadingQuestion] = useState(true);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [activeTab, setActiveTab] = useState<'feedback'|'strengths'>('feedback');

  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null);

  const fetchQuestion = async (isFollowUp = false, weaknesses = []) => {
    setIsLoadingQuestion(true);
    setQuestionData(null);
    setFeedbackData(null);
    setAnswer('');
    setActiveTab('feedback');
    setIsRecording(false);
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    try {
      let res;
      if (isFollowUp) {
        res = await fetch('/api/generate-followup', {
          method: 'POST',
          body: JSON.stringify({ question: questionData?.question, answer, weaknesses })
        });
        const data = await res.json();
        setQuestionData({
          question: data.follow_up_question,
          difficulty: 'Follow-up',
          expected_topics: [] 
        });
      } else {
        res = await fetch('/api/generate-question', {
          method: 'POST',
          body: JSON.stringify({ role, level, topic, resumeText, askedQuestions })
        });
        const data = await res.json();
        setQuestionData(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingQuestion(false);
    }
  };

  useEffect(() => {
    fetchQuestion();
    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
    };
  }, [questionNumber]);

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser does not support the Web Speech API. Please try Google Chrome.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      let currentTranscript = "";
      for (let i = 0; i < event.results.length; i++) {
        currentTranscript += event.results[i][0].transcript;
      }
      setAnswer(currentTranscript);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsRecording(true);
  };

  const submitAnswer = async () => {
    if (!answer.trim()) return;
    setIsEvaluating(true);
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    }

    try {
      const res = await fetch('/api/evaluate-answer', {
        method: 'POST',
        body: JSON.stringify({
          question: questionData.question,
          answer,
          expectedTopics: questionData.expected_topics || []
        })
      });
      const feedback = await res.json();
      setFeedbackData(feedback);
      onCompleteQuestion(feedback, questionData.question);
    } catch (e) {
      console.error(e);
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="max-w-4xl w-full mx-auto bg-white border border-slate-200/60 rounded-3xl p-6 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 pb-4 border-b border-slate-100">
        <div>
          <span className="text-sm font-bold text-indigo-600 uppercase tracking-widest mb-2 block">
            Question {questionNumber} of {maxQuestions}
          </span>
          <p className="text-slate-500 font-medium">{role} • {topic}</p>
        </div>
        
        {!isLoadingQuestion && questionData && (
          <div className="px-4 py-1.5 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
            <span className="text-xs font-bold text-slate-600 tracking-widest uppercase">
              {questionData.difficulty}
            </span>
          </div>
        )}
      </div>

      {isLoadingQuestion ? (
        <div className="flex flex-col items-center justify-center py-20 text-indigo-500">
          <Loader2 strokeWidth={3} className="animate-spin mb-4" size={48} />
          <p className="font-semibold text-slate-600">Generating your question...</p>
        </div>
      ) : (
        <div className="space-y-8">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
             <h2 className="text-2xl md:text-3xl font-black text-slate-900 leading-snug whitespace-pre-wrap tracking-tight">
              {questionData?.question}
             </h2>
          </motion.div>

          <AnimatePresence mode="wait">
            {!feedbackData ? (
              <motion.div key="answer-box" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pt-4">
                <div className="relative">
                  <textarea
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Type your response here or use the microphone to speak..."
                    className="w-full h-56 bg-slate-50 border border-slate-200 rounded-2xl p-5 text-slate-800 text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors resize-none shadow-sm leading-relaxed pb-16"
                  />
                  
                  {/* Voice Control Button inside Textarea */}
                  <div className="absolute bottom-4 left-4">
                    <button 
                      onClick={toggleRecording}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm transition-all shadow-sm ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'}`}
                    >
                      {isRecording ? <MicOff size={16} /> : <Mic size={16} />}
                      {isRecording ? 'Recording...' : 'Voice Answer'}
                    </button>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row justify-end items-center mt-4 gap-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={submitAnswer}
                    disabled={isEvaluating || !answer.trim()}
                    className="px-8 py-3.5 bg-[#4F46E5] hover:bg-[#4338CA] disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_4px_14px_0_rgba(79,70,229,0.39)] sm:w-auto w-full text-lg"
                  >
                    {isEvaluating ? (
                      <><Loader2 className="animate-spin" size={18}/> Evaluating...</>
                    ) : (
                      <>Get Feedback <Send size={18} /></>
                    )}
                  </motion.button>
                </div>
              </motion.div>
            ) : (
              <motion.div key="feedback" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8 bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden">
                <div className="flex border-b border-slate-200 bg-white">
                  <button 
                    onClick={() => setActiveTab('feedback')}
                    className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider transition-colors ${activeTab === 'feedback' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-slate-50' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    AI Feedback
                  </button>
                  <button 
                    onClick={() => setActiveTab('strengths')}
                    className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider transition-colors ${activeTab === 'strengths' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-slate-50' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    Breakdown
                  </button>
                </div>

                <div className="p-6 md:p-8">
                  {activeTab === 'feedback' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                      <div className="flex flex-wrap items-center gap-3 mb-6">
                        <div className="bg-white rounded-full px-5 py-2 border border-slate-200 shadow-sm flex items-center gap-2">
                          <span className="text-sm font-semibold text-slate-500 uppercase tracking-widest">Score</span>
                          <span className="text-xl font-black text-indigo-600">{feedbackData.score}/10</span>
                        </div>
                        <div className={`px-4 py-2 rounded-full font-bold text-sm uppercase tracking-widest ${
                          feedbackData.verdict === 'Poor' ? 'bg-red-100 text-red-700' :
                          feedbackData.verdict === 'Average' ? 'bg-amber-100 text-amber-700' :
                          feedbackData.verdict === 'Good' ? 'bg-blue-100 text-blue-700' :
                          'bg-emerald-100 text-emerald-700'
                        }`}>
                          {feedbackData.verdict}
                        </div>
                      </div>

                      <div className="prose prose-slate max-w-none text-slate-700">
                        <ReactMarkdown>{feedbackData.feedback}</ReactMarkdown>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'strengths' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h4 className="flex items-center gap-2 text-sm font-bold tracking-widest uppercase text-emerald-600 mb-4">
                          <CheckCircle2 size={18} /> Strengths
                        </h4>
                        <ul className="space-y-3">
                          {feedbackData.strengths?.map((s: string, i: number) => (
                            <li key={i} className="flex items-start gap-3 bg-emerald-50 rounded-xl p-3 text-emerald-900 border border-emerald-100 font-medium">
                              <span className="text-emerald-500 mt-0.5">•</span> <span>{s}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="flex items-center gap-2 text-sm font-bold tracking-widest uppercase text-red-600 mb-4">
                          <AlertCircle size={18} /> Areas to Improve
                        </h4>
                        <ul className="space-y-3">
                          {feedbackData.weaknesses?.map((s: string, i: number) => (
                            <li key={i} className="flex items-start gap-3 bg-red-50 rounded-xl p-3 text-red-900 border border-red-100 font-medium">
                              <span className="text-red-500 mt-0.5">•</span> <span>{s}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </div>

                <div className="bg-slate-100/50 p-6 border-t border-slate-200 flex flex-col sm:flex-row justify-end gap-4">
                  {feedbackData.weaknesses?.length > 0 && questionNumber < maxQuestions && (
                    <button
                      onClick={() => fetchQuestion(true, feedbackData.weaknesses)}
                      className="px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-xl transition-all border border-slate-300 shadow-sm sm:w-auto w-full"
                    >
                      Attempt Follow-up
                    </button>
                  )}
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onFinishInterview}
                    className="px-8 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 sm:w-auto w-full text-lg"
                  >
                    {questionNumber >= maxQuestions ? 'View Final Report' : 'Next Question'}
                    <ArrowRight size={18} />
                  </motion.button>
                </div>

              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
