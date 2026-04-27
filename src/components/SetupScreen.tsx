import { useState } from 'react';
import { motion } from 'framer-motion';

export function SetupScreen({ onStart }: { onStart: (role: string, level: string, topic: string, resume: string) => void }) {
  const [role, setRole] = useState('Software Engineer');
  const [level, setLevel] = useState('Intermediate');
  const [topic, setTopic] = useState('React & Web Dev');
  const [resumeText, setResumeText] = useState('');

  return (
    <div className="max-w-2xl w-full mx-auto">
      <div className="text-center mb-10">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-bold tracking-widest uppercase mb-6"
        >
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
          AI Mock Interview Engine
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
          className="text-5xl md:text-6xl font-black mb-6 tracking-tighter"
        >
          <span className="text-slate-900">Ace your next </span>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500">
            tech interview.
          </span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
          className="text-lg text-slate-500 font-medium max-w-lg mx-auto"
        >
          Paste your resume and let our intelligent engine craft personalized, hyper-realistic technical questions.
        </motion.p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}
        className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-[2rem] p-8 md:p-10 shadow-[0_8px_40px_rgb(0,0,0,0.04)] relative overflow-hidden group"
      >
        {/* Animated gradient top border reflection */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-purple-400 to-transparent opacity-30" />
        
        <div className="space-y-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 align-top group/input">
              <label className="text-xs font-bold tracking-widest uppercase text-slate-400">Target Role</label>
              <input 
                type="text" 
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-white/50 border border-slate-200/60 rounded-2xl p-4 text-slate-800 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all font-semibold text-lg shadow-sm placeholder-slate-300"
              />
            </div>
            
            <div className="space-y-2 group/input">
              <label className="text-xs font-bold tracking-widest uppercase text-slate-400">Focus Area</label>
              <div className="relative">
                <select 
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full appearance-none bg-white/50 border border-slate-200/60 rounded-2xl p-4 text-slate-800 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all shadow-sm font-semibold text-lg"
                >
                  <option value="DSA">Data Structures & Algo</option>
                  <option value="React & Web Dev">React & Frontend</option>
                  <option value="System Design">System Architecture</option>
                  <option value="Behavioral">Behavioral / Leadership</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                  <svg className="fill-current h-4 w-4" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2 group/input">
            <label className="flex justify-between items-baseline">
              <span className="text-xs font-bold tracking-widest uppercase text-slate-400">Context (CV / Links)</span>
              <span className="text-purple-600 font-bold text-[10px] uppercase tracking-widest bg-purple-50 border border-purple-100 px-2 py-0.5 rounded-full">Boosts Accuracy</span>
            </label>
            <textarea 
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste your resume text here. The AI will scan it to generate hyper-personalized questions based on your actual work history..."
              className="w-full h-32 bg-white/50 border border-slate-200/60 rounded-2xl p-4 text-slate-700 focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-400 transition-all font-medium text-sm shadow-sm resize-none placeholder-slate-300"
            />
          </div>

          <motion.button 
            whileHover={{ scale: 1.01, boxShadow: "0 20px 40px -15px rgba(99,102,241,0.5)" }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onStart(role, level, topic, resumeText)}
            className="relative w-full mt-6 bg-slate-900 border border-slate-800 text-white font-bold py-5 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-xl overflow-hidden group/btn"
          >
            {/* Shimmer effect inside button */}
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover/btn:animate-[shimmer_1.5s_infinite]" />
            <span className="relative z-10 text-lg tracking-wide">Generate Custom Interview</span>
          </motion.button>
        </div>
      </motion.div>
      
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="text-center text-slate-400 mt-8 text-xs font-bold uppercase tracking-widest">
        Powered by Multi-Modal AI Engine
      </motion.p>
    </div>
  );
}
