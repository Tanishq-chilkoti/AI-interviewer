import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Award, Briefcase, CheckCircle, XCircle, TrendingUp, Loader2, Download } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

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
      <div className="flex flex-col items-center justify-center py-32 text-indigo-500">
        <Loader2 strokeWidth={3} className="animate-spin mb-6" size={56} />
        <p className="font-bold text-slate-400 tracking-widest uppercase text-sm animate-pulse">Analyzing Data Streams</p>
      </div>
    );
  }

  const isHire = report?.final_verdict === 'Hire';
  const isBorderline = report?.final_verdict === 'Borderline';

  const downloadPDF = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl w-full mx-auto pb-12 print:max-w-none print:pb-0">
      
      <div className="flex justify-end mb-6 print:hidden">
        <button 
          onClick={downloadPDF}
          className="flex items-center gap-2 bg-white/70 backdrop-blur-md border border-white/80 text-slate-700 px-5 py-2.5 rounded-full font-bold hover:bg-white transition-colors shadow-[0_4px_20px_rgb(0,0,0,0.04)]"
        >
          <Download size={18} /> Export PDF
        </button>
      </div>

      <div className="text-center mb-16 relative">
        <motion.div 
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          className="inline-flex items-center justify-center p-6 bg-indigo-50/80 backdrop-blur-md rounded-full text-indigo-600 mb-8 border-4 border-white/50 shadow-xl"
        >
          <Award size={56} />
        </motion.div>
        <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-slate-900 to-slate-500 mb-6 tracking-tighter">
          Interview Complete.
        </h1>
        <p className="text-slate-500 font-bold text-xl uppercase tracking-widest">Global Analytics Report</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 print:gap-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white/60 backdrop-blur-2xl border border-white rounded-[2rem] p-10 flex flex-col items-center justify-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] print:shadow-none print:border-slate-300"
        >
          <span className="text-xs font-black text-neutral-400 uppercase tracking-widest mb-6">Aggregate Score</span>
          <div className="flex items-baseline gap-2">
            <span className="text-8xl font-black text-slate-900 tracking-tighter">{report?.average_score}</span>
            <span className="text-3xl text-slate-300 font-black">/ 10</span>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className={`md:col-span-2 bg-white/60 backdrop-blur-2xl border border-white rounded-[2rem] p-10 flex flex-col justify-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] print:shadow-none print:border-slate-300 relative overflow-hidden`}
        >
          <div className={`absolute top-0 right-0 w-64 h-64 blur-[80px] -mr-20 -mt-20 opacity-40 ${isHire ? 'bg-emerald-400' : isBorderline ? 'bg-amber-400' : 'bg-red-400'}`} />
          
           <span className="text-xs font-black text-neutral-400 uppercase tracking-widest mb-6 relative z-10">Final Verdict</span>
          <span className={`text-5xl md:text-7xl font-black tracking-tighter relative z-10 ${
            isHire ? 'text-emerald-500' : isBorderline ? 'text-amber-500' : 'text-red-500'
          }`}>
            {report?.final_verdict?.toUpperCase()}
          </span>
          <div className="text-slate-600 font-medium mt-6 text-xl leading-relaxed prose max-w-none relative z-10">
            <ReactMarkdown>{report?.final_feedback}</ReactMarkdown>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 print:block print:space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white/60 backdrop-blur-2xl border border-white rounded-[2rem] p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] print:shadow-none print:border-slate-300">
          <h3 className="flex items-center gap-3 font-black text-sm tracking-widest uppercase text-emerald-600 mb-8 pb-6 border-b border-black/5">
            <CheckCircle size={24} className="text-emerald-500" /> Key Strengths
          </h3>
          <ul className="space-y-5">
            {report?.strengths_summary?.map((s: string, i: number) => (
              <li key={i} className="flex items-start gap-4 text-slate-700 font-semibold text-lg leading-relaxed">
                <span className="text-emerald-500 bg-emerald-50 p-1 rounded-full mt-0.5"><CheckCircle size={14}/></span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white/60 backdrop-blur-2xl border border-white rounded-[2rem] p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] print:shadow-none print:border-slate-300">
          <h3 className="flex items-center gap-3 font-black text-sm tracking-widest uppercase text-red-600 mb-8 pb-6 border-b border-black/5">
            <XCircle size={24} className="text-red-500" /> Critical Weaknesses
          </h3>
          <ul className="space-y-5">
            {report?.weaknesses_summary?.map((s: string, i: number) => (
              <li key={i} className="flex items-start gap-4 text-slate-700 font-semibold text-lg leading-relaxed">
                <span className="text-red-500 bg-red-50 p-1 rounded-full mt-0.5"><XCircle size={14}/></span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      {report?.next_steps && report.next_steps.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-white/60 backdrop-blur-2xl border border-white rounded-[2rem] p-10 mb-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] print:shadow-none print:border-slate-300">
          <h3 className="flex items-center gap-3 font-black text-sm tracking-widest uppercase text-indigo-600 mb-8 pb-6 border-b border-black/5">
            <TrendingUp size={24} className="text-indigo-500" /> Actionable Next Steps
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 print:grid-cols-2">
            {report?.next_steps?.map((step: string, i: number) => (
              <div key={i} className="bg-white border border-slate-100 rounded-[1.5rem] p-6 relative shadow-sm group hover:-translate-y-1 transition-transform">
                <span className="text-indigo-100 font-black text-6xl absolute -top-2 right-4">
                  {i + 1}
                </span>
                <p className="text-slate-700 font-bold relative z-10 leading-relaxed mt-4">{step}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="flex justify-center text-center print:hidden">
        <button 
          onClick={onRestart}
          className="px-12 py-6 bg-slate-900 hover:bg-slate-800 text-white font-black uppercase tracking-widest rounded-2xl transition-all shadow-[0_10px_30px_rgba(0,0,0,0.2)] hover:shadow-[0_10px_40px_rgba(0,0,0,0.3)] flex items-center justify-center gap-3 text-lg"
        >
          <Briefcase size={20} /> Initialize New Session
        </button>
      </motion.div>
    </div>
  );
}
