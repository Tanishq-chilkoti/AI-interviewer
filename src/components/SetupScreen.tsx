import { useState } from 'react';
import { motion } from 'framer-motion';

export function SetupScreen({ onStart }: { onStart: (role: string, level: string, topic: string, resume: string) => void }) {
  const [role, setRole] = useState('Software Engineer');
  const [level, setLevel] = useState('Intermediate');
  const [topic, setTopic] = useState('React & Web Dev');
  const [resumeText, setResumeText] = useState('');

  return (
    <div className="max-w-2xl w-full mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
          Supercharge your interview prep
        </h1>
        <p className="text-lg text-slate-600 font-medium">
          Practice job interview questions tailored to your role. Get instant AI feedback and suggestions to improve your answers.
        </p>
      </div>

      <div className="bg-white border border-slate-200/60 rounded-3xl p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 align-top">
              <label className="text-sm font-semibold text-slate-700">Role</label>
              <input 
                type="text" 
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-base shadow-sm"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Topic Focus</label>
              <div className="relative">
                <select 
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm font-medium text-base"
                >
                  <option value="DSA">Data Structures & Algorithms</option>
                  <option value="React & Web Dev">React & Frontend</option>
                  <option value="System Design">System Architecture</option>
                  <option value="Behavioral">Behavioral / Leadership</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                  <svg className="fill-current h-4 w-4" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 flex justify-between">
              <span>Paste Your CV / Resume</span>
              <span className="text-indigo-500 font-bold text-xs uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded">Highly Recommended</span>
            </label>
            <textarea 
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste the text from your resume here, or a link to your LinkedIn. The AI will read this to ask highly personalized questions..."
              className="w-full h-32 bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-sm shadow-sm resize-none"
            />
            <p className="text-xs text-slate-500 font-medium">Based on your CV, the AI will ask exactly 5 personalized questions.</p>
          </div>

          <motion.button 
            whileHover={{ scale: 1.01, y: -2 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => onStart(role, level, topic, resumeText)}
            className="w-full mt-4 bg-[#4F46E5] hover:bg-[#4338CA] text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_4px_14px_0_rgba(79,70,229,0.39)] text-lg"
          >
            Generate Custom Interview
          </motion.button>
        </div>
      </div>
      
      <p className="text-center text-slate-500 mt-6 text-sm font-medium">
        Powered by Google Gemini • Secure Processing
      </p>
    </div>
  );
}
