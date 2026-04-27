import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Award, Briefcase, CheckCircle, XCircle, TrendingUp, Loader2 } from 'lucide-react';

export function ReportScreen({ scores, feedbackList, onRestart }: any) {
  const [report, setReport] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const generateReport = async () => {
      try {
        const res = await fetch('/api/generate-report', {
          method: 'POST',
          body: JSON.stringify({ scores, feedbackList })
        });
        const data = await res.json();
        setReport(data);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    generateReport();
  }, [scores, feedbackList]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-indigo-500">
        <Loader2 strokeWidth={3} className="animate-spin mb-4" size={56} />
        <p className="text-lg font-bold text-slate-800 mb-2">Analyzing Your Performance</p>
        <p className="text-sm font-medium text-slate-500">Generating comprehensive feedback report...</p>
      </div>
    );
  }

  const isHire = report?.final_verdict === 'Hire';
  const isBorderline = report?.final_verdict === 'Borderline';

  return (
    <div className="max-w-5xl w-full mx-auto pb-12">
      <div className="text-center mb-12">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="inline-flex items-center justify-center p-5 bg-indigo-100 rounded-full text-indigo-600 mb-6 border-4 border-white shadow-md cursor-default hover:scale-105 transition-transform"
        >
          <Award size={48} />
        </motion.div>
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
          Interview Complete
        </h1>
        <p className="text-slate-600 font-medium text-lg">Here is your comprehensive evaluation report.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        {/* Score Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white border border-slate-200 rounded-3xl p-8 flex flex-col items-center justify-center shadow-[0_4px_20px_rgb(0,0,0,0.03)]"
        >
          <span className="text-sm font-bold text-indigo-500 uppercase tracking-widest mb-4">Final Score</span>
          <div className="flex items-baseline gap-2">
            <span className="text-7xl font-black text-slate-900">{report?.average_score}</span>
            <span className="text-2xl text-slate-400 font-bold">/ 10</span>
          </div>
        </motion.div>
        
        {/* Verdict Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`md:col-span-2 bg-white border rounded-3xl p-8 flex flex-col justify-center shadow-[0_4px_20px_rgb(0,0,0,0.03)] ${
            isHire ? 'border-emerald-200' :
            isBorderline ? 'border-amber-200' :
            'border-red-200'
          }`}
        >
          <span className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Overall Verdict</span>
          <span className={`text-4xl md:text-5xl font-black tracking-tight ${
            isHire ? 'text-emerald-600' :
            isBorderline ? 'text-amber-500' :
            'text-red-600'
          }`}>
            {report?.final_verdict?.toUpperCase()}
          </span>
          <p className="text-slate-700 font-medium mt-4 text-lg leading-relaxed">{report?.final_feedback}</p>
        </motion.div>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} className="bg-white border border-slate-200 rounded-3xl p-8 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
          <h3 className="flex items-center gap-3 font-bold text-lg tracking-tight text-slate-900 mb-6 border-b border-slate-100 pb-4">
            <CheckCircle className="text-emerald-500" size={24} /> Key Strengths
          </h3>
          <ul className="space-y-4">
            {report?.strengths_summary?.map((s: string, i: number) => (
              <li key={i} className="flex items-start gap-3 text-slate-700 font-medium">
                <span className="text-emerald-500 mt-0.5">✓</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }} className="bg-white border border-slate-200 rounded-3xl p-8 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
          <h3 className="flex items-center gap-3 font-bold text-lg tracking-tight text-slate-900 mb-6 border-b border-slate-100 pb-4">
            <XCircle className="text-red-500" size={24} /> Areas to Improve
          </h3>
          <ul className="space-y-4">
            {report?.weaknesses_summary?.map((s: string, i: number) => (
              <li key={i} className="flex items-start gap-3 text-slate-700 font-medium">
                <span className="text-red-500 mt-0.5">✕</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      {report?.next_steps && report.next_steps.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-white border border-slate-200 rounded-3xl p-8 mb-12 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
          <h3 className="flex items-center gap-3 font-bold text-lg tracking-tight text-slate-900 mb-6 border-b border-slate-100 pb-4">
            <TrendingUp className="text-indigo-500" size={24} /> Actionable Next Steps
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {report?.next_steps?.map((step: string, i: number) => (
              <div key={i} className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-6 relative group hover:bg-indigo-50 transition-colors">
                <span className="text-indigo-200 font-black text-5xl absolute -top-1 right-2">
                  {i + 1}
                </span>
                <p className="text-slate-800 font-medium relative z-10 leading-relaxed mt-4">{step}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="flex justify-center text-center">
        <button 
          onClick={onRestart}
          className="group relative px-10 py-5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl transition-all shadow-xl hover:shadow-2xl flex items-center justify-center gap-3 text-lg"
        >
          <Briefcase size={20} />
          <span>Start Another Interview</span>
        </button>
      </motion.div>
    </div>
  );
}
