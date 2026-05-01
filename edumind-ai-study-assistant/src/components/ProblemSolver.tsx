import React, { useState } from 'react';
import { Card, Button, cn } from './ui/UI';
import { explainProblem, ExplanationResult } from '../services/studyService';
import { BookOpen, Brain, Loader2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';

export const ProblemSolver: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [subject, setSubject] = useState('Math');
  const [isEli10, setIsEli10] = useState(false);
  const [result, setResult] = useState<ExplanationResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSolve = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    try {
      const res = await explainProblem(prompt, subject, isEli10);
      setResult(res);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 dark:bg-slate-900 border-none shadow-xl shadow-indigo-500/5 transition-all">
        <h2 className="text-xl font-display font-bold mb-4 flex items-center gap-2">
          <Brain className="text-indigo-600 dark:text-indigo-400" />
          AI Problem Solver
        </h2>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {['Math', 'Physics', 'Chemistry', 'Biology'].map((s) => (
            <button
              key={s}
              onClick={() => setSubject(s)}
              className={cn(
                "px-3 py-1 rounded text-xs font-bold transition-all uppercase tracking-tight",
                subject === s 
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-none" 
                  : "bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700"
              )}
            >
              {s}
            </button>
          ))}
        </div>

        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe your problem in detail..."
          className="w-full h-32 p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-4 focus:ring-indigo-500/10 dark:focus:ring-indigo-500/5 focus:bg-white dark:focus:bg-slate-800 focus:outline-none resize-none mb-4 transition-all"
        />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <label className="flex items-center gap-2 cursor-pointer group">
            <div className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isEli10}
                onChange={(e) => setIsEli10(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-8 h-4 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-indigo-600"></div>
            </div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-tighter group-hover:text-indigo-600 transition-colors">ELI10 MODE</span>
          </label>
          
          <Button onClick={handleSolve} disabled={loading} className="w-full sm:w-auto">
            {loading ? <Loader2 className="animate-spin mr-2" /> : <Sparkles size={16} className="mr-2" />}
            Analyze Problem
          </Button>
        </div>
      </Card>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-4"
          >
            <Card className="p-6 dark:bg-slate-900 border-none shadow-lg">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <BookOpen className="text-green-600 dark:text-green-400" />
                Step-by-Step Explanation
              </h3>
              <div className="space-y-4">
                {result.stepByStep.map((step, i) => (
                  <div key={i} className="flex gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                    <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-sm">
                      {i + 1}
                    </span>
                    <p className="text-slate-700 dark:text-slate-300 pt-1 text-sm leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6 bg-indigo-50 dark:bg-indigo-900/10 border-indigo-100 dark:border-indigo-900/30">
              <h3 className="font-bold text-lg mb-2 text-indigo-900 dark:text-indigo-300">Quick Summary</h3>
              <p className="text-indigo-800 dark:text-indigo-400/80 text-sm leading-relaxed">{result.summary}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {result.concepts.map((concept, i) => (
                  <span key={i} className="px-2 py-1 bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-900/50 text-indigo-600 dark:text-indigo-400 text-[10px] rounded font-bold uppercase tracking-wider">
                    {concept}
                  </span>
                ))}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
