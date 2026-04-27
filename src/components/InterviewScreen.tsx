import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2, CheckCircle2, AlertCircle, ArrowRight, Mic, MicOff } from 'lucide-react';
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
    if (recognitionRef.current) recognitionRef.current.stop();

    try {
      let res;
      if (isFollowUp) {
        res = await fetch('/api/generate-followup', {
          method: 'POST',
          body: JSON.stringify({ question: questionData?.question, answer, weaknesses })
        });
        const data = await res.json();
        setQuestionData({ question: data.follow_up_question, difficulty: 'Follow-up', expected_topics: [] });
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
    return () => { if (recognitionRef.current) recognitionRef.current.stop(); };
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
    recognition.onerror = () => setIsRecording(false);
    recognition.onend = () => setIsRecording(false);
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
    <div className="max-w-4xl w-full mx-auto bg-white/70 backdrop-blur-2xl border border-white rounded-[2rem] p-6 md:p-12 shadow-[0_8px_40px_rgb(0,0,0,0.06)] relative overflow-hidden">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 pb-6 border-b border-black/5">
        <div>
          <span className="text-xs font-black text-indigo-500 uppercase tracking-widest mb-2 block">
            Question {questionNumber} / {maxQuestions}
          </span>
          <p className="text-slate-500 font-bold tracking-tight">{role} <span className="opacity-40 px-2">•</span> {topic}</p>
        </div>
        
        {!isLoadingQuestion && questionData && (
          <div className="px-4 py-1.5 rounded-full bg-slate-900 flex items-center justify-center shrink-0 shadow-sm">
            <span className="text-xs font-bold text-white tracking-widest uppercase">
              {questionData.difficulty}
            </span>
          </div>
        )}
      </div>

      {isLoadingQuestion ? (
        <div className="flex flex-col items-center justify-center py-32 text-indigo-500">
          <Loader2 strokeWidth={3} className="animate-spin mb-6" size={56} />
          <p className="font-bold text-slate-400 tracking-widest uppercase text-sm animate-pulse">Generating Custom Query</p>
        </div>
      ) : (
        <div className="space-y-8">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
             <h2 className="text-xl md:text-2xl font-black text-slate-900 leading-snug whitespace-pre-wrap tracking-tight">
              {questionData?.question}
             </h2>
          </motion.div>

          <AnimatePresence mode="wait">
            {!feedbackData ? (
              <motion.div key="answer-box" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pt-4">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-indigo-500 rounded-3xl blur opacity-0 group-focus-within:opacity-20 transition duration-500" />
                  <textarea
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Type your response here or use the microphone to speak..."
                    className="relative w-full h-64 bg-white/60 border border-slate-200/50 rounded-3xl p-6 text-slate-800 text-lg focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 transition-colors resize-none shadow-inner leading-relaxed pb-20"
                  />
                  
                  {/* Voice Control Button inside Textarea */}
                  <div className="absolute bottom-6 left-6 z-10">
                    <button 
                      onClick={toggleRecording}
                      className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm transition-all shadow-md ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-900 text-white hover:bg-slate-800 hover:-translate-y-0.5'}`}
                    >
                      {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
                      {isRecording ? 'Recording Answer...' : 'Voice Answer'}
                    </button>
                  </div>
                </div>
                
                <div className="flex justify-end mt-6">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={submitAnswer}
                    disabled={isEvaluating || !answer.trim()}
                    className="px-10 py-5 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 disabled:opacity-50 disabled:grayscale text-white font-black tracking-wide rounded-2xl flex items-center justify-center gap-3 transition-all shadow-[0_10px_25px_rgba(99,102,241,0.4)] text-lg"
                  >
                    {isEvaluating ? (
                      <><Loader2 className="animate-spin" size={20}/> EVALUATING</>
                    ) : (
                      <>GET FEEDBACK <Send size={20} /></>
                    )}
                  </motion.button>
                </div>
              </motion.div>
            ) : (
              <motion.div key="feedback" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8 bg-white/80 border border-white/50 rounded-3xl overflow-hidden shadow-lg">
                <div className="flex border-b border-black/5 bg-white/50">
                  <button 
                    onClick={() => setActiveTab('feedback')}
                    className={`flex-1 py-5 text-sm font-black uppercase tracking-widest transition-colors ${activeTab === 'feedback' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-white' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    AI Feedback
                  </button>
                  <button 
                    onClick={() => setActiveTab('strengths')}
                    className={`flex-1 py-5 text-sm font-black uppercase tracking-widest transition-colors ${activeTab === 'strengths' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-white' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    Deep Breakdown
                  </button>
                </div>

                <div className="p-8 md:p-10">
                  {activeTab === 'feedback' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                      <div className="flex flex-wrap items-center gap-4 mb-8">
                        <div className="bg-slate-900 rounded-full px-6 py-2 shadow-lg flex items-center gap-3">
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Score</span>
                          <span className="text-xl font-black text-cyan-400">{feedbackData.score}/10</span>
                        </div>
                        <div className={`px-5 py-2.5 rounded-full font-black text-xs uppercase tracking-widest shadow-sm ${
                          feedbackData.verdict === 'Poor' ? 'bg-red-50 text-red-600 border border-red-200' :
                          feedbackData.verdict === 'Average' ? 'bg-amber-50 text-amber-600 border border-amber-200' :
                          feedbackData.verdict === 'Good' ? 'bg-blue-50 text-blue-600 border border-blue-200' :
                          'bg-emerald-50 text-emerald-600 border border-emerald-200'
                        }`}>
                          {feedbackData.verdict}
                        </div>
                      </div>

                      <div className="prose prose-slate max-w-none text-slate-700 font-medium leading-relaxed">
                        <ReactMarkdown>{feedbackData.feedback}</ReactMarkdown>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'strengths' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h4 className="flex items-center gap-2 text-xs font-black tracking-widest uppercase text-emerald-600 mb-6">
                          <CheckCircle2 size={18} /> Foundational Strengths
                        </h4>
                        <ul className="space-y-4">
                          {feedbackData.strengths?.map((s: string, i: number) => (
                            <li key={i} className="flex items-start gap-4 bg-emerald-50/50 rounded-2xl p-4 text-emerald-900 border border-emerald-100/50 font-semibold text-sm">
                              <span className="text-emerald-500 mt-0.5"><CheckCircle2 size={16}/></span> <span>{s}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="flex items-center gap-2 text-xs font-black tracking-widest uppercase text-red-600 mb-6">
                          <AlertCircle size={18} /> Critical Weaknesses
                        </h4>
                        <ul className="space-y-4">
                          {feedbackData.weaknesses?.map((s: string, i: number) => (
                            <li key={i} className="flex items-start gap-4 bg-red-50/50 rounded-2xl p-4 text-red-900 border border-red-100/50 font-semibold text-sm">
                              <span className="text-red-500 mt-0.5"><AlertCircle size={16}/></span> <span>{s}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </div>

                <div className="bg-slate-50/50 p-6 md:p-8 border-t border-black/5 flex flex-col sm:flex-row justify-end gap-4">
                  {feedbackData.weaknesses?.length > 0 && questionNumber < maxQuestions && (
                    <button
                      onClick={() => fetchQuestion(true, feedbackData.weaknesses)}
                      className="px-8 py-4 bg-white hover:bg-slate-50 text-slate-800 font-bold rounded-2xl transition-all border border-slate-200 shadow-sm sm:w-auto w-full group"
                    >
                      Attempt Follow-up
                    </button>
                  )}
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onFinishInterview}
                    className="px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white font-black tracking-wider uppercase rounded-2xl transition-all shadow-xl flex items-center justify-center gap-3 sm:w-auto w-full text-base"
                  >
                    {questionNumber >= maxQuestions ? 'View Final Report' : 'Proceed to Next'}
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
