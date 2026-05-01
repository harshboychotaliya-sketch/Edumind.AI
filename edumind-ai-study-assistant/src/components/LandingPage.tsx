import React from 'react';
import { motion } from 'motion/react';
import { 
  GraduationCap, 
  Brain, 
  Sparkles, 
  BookOpen, 
  Target, 
  Network, 
  FileText, 
  ArrowRight,
  Sun,
  Moon
} from 'lucide-react';
import { Button, Card } from './ui/UI';
import { useAuth } from '../lib/AuthContext';

export const LandingPage: React.FC<{ isDark: boolean; toggleDark: () => void }> = ({ isDark, toggleDark }) => {
  const { signIn } = useAuth();

  const features = [
    {
      title: "Step-by-Step Solver",
      desc: "Instant help for Math, Physics, Chemistry, and Biology problems.",
      icon: Brain,
      color: "text-blue-500",
      bg: "bg-blue-50"
    },
    {
      title: "Document Summaries",
      desc: "Upload PDFs or notes and get concise, AI-powered summaries.",
      icon: FileText,
      color: "text-purple-500",
      bg: "bg-purple-50"
    },
    {
      title: "Practice Tests",
      desc: "Generate custom quizzes from your study material in seconds.",
      icon: Target,
      color: "text-orange-500",
      bg: "bg-orange-50"
    },
    {
      title: "AI Concept Maps",
      desc: "Visualize complex topics with automatically generated mind maps.",
      icon: Network,
      color: "text-cyan-500",
      bg: "bg-cyan-50"
    }
  ];

  return (
    <div className={`min-h-screen font-sans selection:bg-indigo-200 ${isDark ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'}`}>
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-inherit/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
              <GraduationCap size={20} />
            </div>
            <span className="font-display font-bold text-xl tracking-tight">EduMind AI</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleDark}
              className={`p-2 rounded-full transition-colors ${isDark ? 'bg-slate-800 text-yellow-400' : 'bg-slate-100 text-slate-600'}`}
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <Button onClick={signIn} className="bg-indigo-600 hover:bg-indigo-700">Get Started</Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-6">
              <Sparkles size={14} />
              AI-Powered Learning
            </div>
            <h1 className="font-display text-5xl md:text-7xl font-bold leading-[1.1] mb-6">
              Master Your Studies <br />
              <span className="text-indigo-600">With AI Intelligence.</span>
            </h1>
            <p className={`text-lg mb-8 max-w-lg leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              The all-in-one study companion. Solve complex problems, summarize notes, and generate practice tests instantly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button onClick={signIn} className="px-8 py-4 text-lg bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-200 dark:shadow-none">
                Start Studying Free
                <ArrowRight className="ml-2" size={20} />
              </Button>
              <Button onClick={signIn} className={`px-8 py-4 text-lg border-2 ${isDark ? 'border-slate-800 hover:bg-slate-800' : 'bg-white text-slate-900 border-slate-100 hover:bg-slate-50 shadow-sm'}`}>
                Sign in with Google
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-indigo-500/10 blur-3xl rounded-full translate-x-12 -translate-y-12" />
            <Card className={`p-8 relative border-none ${isDark ? 'bg-slate-900/50 backdrop-blur-xl' : 'bg-white shadow-2xl shadow-indigo-100'}`}>
               <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                      <Brain />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Step-by-Step Solver</p>
                      <p className="font-bold">Solve x² + 2x + 1 = 0</p>
                    </div>
                  </div>
                  <div className={`p-4 rounded-lg border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-100'}`}>
                    <p className="text-sm italic opacity-80">"Step 1: Identify the coefficients..."</p>
                    <div className="w-full h-2 bg-indigo-600/20 rounded-full mt-4 overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: "65%" }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="h-full bg-indigo-600"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className={`p-4 rounded-xl text-center ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
                      <p className="text-2xl font-bold">98%</p>
                      <p className="text-[10px] uppercase font-bold text-slate-400">Accuracy</p>
                    </div>
                    <div className={`p-4 rounded-xl text-center ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
                      <p className="text-2xl font-bold">24/7</p>
                      <p className="text-[10px] uppercase font-bold text-slate-400">Tutor Availability</p>
                    </div>
                  </div>
               </div>
            </Card>
          </motion.div>
        </div>
      </main>

      {/* Features Grid */}
      <section className={`py-20 px-6 ${isDark ? 'bg-slate-900/50' : 'bg-slate-50'}`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Study Smarter, Not Harder.</h2>
            <p className={`max-w-2xl mx-auto ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Our AI evaluates your notes and study habits to provide personalized learning paths and instant solutions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className={`p-6 h-full transition-all hover:scale-105 border-transparent ${isDark ? 'bg-slate-800 hover:bg-slate-750' : 'hover:shadow-xl hover:shadow-indigo-100'}`}>
                  <div className={`w-12 h-12 ${f.bg} dark:bg-slate-900 ${f.color} rounded-xl flex items-center justify-center mb-6`}>
                    <f.icon size={24} />
                  </div>
                  <h3 className="text-lg font-bold mb-3">{f.title}</h3>
                  <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {f.desc}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof / Study Vibe */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8 inline-flex items-center gap-1">
             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
             <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Join 10,000+ Students</span>
          </div>
          <p className="font-display text-4xl font-bold mb-12 italic leading-tight">
            "EduMind helped me crack my physics finals. The step-by-step explanations are like having a personal tutor at 2 AM."
          </p>
          <div className="flex items-center justify-center gap-4">
             <div className="w-12 h-12 rounded-full bg-slate-200" />
             <div className="text-left">
               <p className="font-bold">Alex Johnson</p>
               <p className="text-xs text-slate-500 uppercase font-bold tracking-widest">Medical Student</p>
             </div>
          </div>
        </div>
      </section>

      {/* Footer / Final CTA */}
      <footer className={`py-12 border-t border-white/5 px-6 shadow-2xl`}>
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
                <GraduationCap size={20} />
              </div>
              <span className="font-bold tracking-tight">EduMind AI</span>
            </div>
            <div className="flex gap-8 text-sm font-bold text-slate-400">
               <a href="#" className="hover:text-indigo-600 transition-colors">Privacy</a>
               <a href="#" className="hover:text-indigo-600 transition-colors">Terms</a>
               <a href="#" className="hover:text-indigo-600 transition-colors">Support</a>
            </div>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">© 2026 EduMind AI. Built with Gemini</p>
         </div>
      </footer>
    </div>
  );
};
