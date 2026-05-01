import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, Button, cn } from './ui/UI';
import { generateQuiz, QuizQuestion } from '../services/studyService';
import { extractTextFromPDF } from '../lib/pdf';
import { CheckCircle2, XCircle, BrainCircuit, RefreshCw, Trophy, Download } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { useAuth } from '../lib/AuthContext';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { addDoc, collection, doc, updateDoc, arrayUnion } from 'firebase/firestore';

export const PracticeTests: React.FC = () => {
  const { user, userProfile } = useAuth();
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<'upload' | 'test' | 'results'>('upload');
  const [answers, setAnswers] = useState<number[]>([]);
  const [score, setScore] = useState(0);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLoading(true);
      try {
        const text = await extractTextFromPDF(file);
        const res = await generateQuiz(text);
        setQuestions(res);
        setAnswers(new Array(res.length).fill(-1));
        setCurrentStep('test');
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubmit = async () => {
    const finalScore = answers.reduce((acc, ans, idx) => 
      ans === questions[idx].correctAnswer ? acc + 1 : acc, 0
    );
    setScore(finalScore);
    setCurrentStep('results');

    if (user) {
      const resultsPath = `users/${user.uid}/testResults`;
      const userPath = `users/${user.uid}`;
      const weakAreas = questions
        .filter((q, idx) => answers[idx] !== q.correctAnswer)
        .map(q => q.question);

      try {
        await addDoc(collection(db, 'users', user.uid, 'testResults'), {
          score: finalScore,
          totalQuestions: questions.length,
          weakAreas,
          timestamp: new Date().toISOString(),
        });

        if (weakAreas.length > 0) {
          await updateDoc(doc(db, 'users', user.uid), {
            weakPoints: arrayUnion(...weakAreas.slice(0, 5))
          });
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, resultsPath);
      }
    }
  };

  const downloadPaper = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text('Practice Test', 10, 20);
    doc.setFontSize(12);
    questions.forEach((q, i) => {
      const y = 40 + (i * 50);
      if (y > 270) doc.addPage();
      const currentY = y > 270 ? 40 : y;
      doc.text(`${i + 1}. ${q.question}`, 10, currentY);
      q.options.forEach((opt, oi) => {
        doc.text(`   [ ] ${opt}`, 10, currentY + 10 + (oi * 8));
      });
    });
    doc.save('practice_test.pdf');
  };

  return (
    <Card className="p-8 dark:bg-slate-900 border-none shadow-xl shadow-indigo-500/5">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-display font-bold flex items-center gap-3">
          <BrainCircuit className="text-orange-500" size={28} />
          AI Practice Tests
        </h2>
        {questions.length > 0 && (
          <Button onClick={downloadPaper} className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200">
            <Download size={16} className="mr-2" />
            Download Paper
          </Button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {currentStep === 'upload' && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="text-center py-12"
          >
            <input type="file" accept=".pdf" onChange={handleFileUpload} className="hidden" id="p-test-upload" />
            <label htmlFor="p-test-upload" className="cursor-pointer group flex flex-col items-center">
              <div className="w-20 h-20 bg-orange-50 dark:bg-orange-900/20 text-orange-600 rounded-2xl flex items-center justify-center mb-6 border-2 border-dashed border-orange-200 dark:border-orange-900/50 group-hover:scale-110 transition-transform">
                <RefreshCw className={loading ? "animate-spin" : "w-10 h-10"} />
              </div>
              <h3 className="text-xl font-bold mb-2">Create test from document</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs mx-auto">Upload a PDF to generate a personalized practice test using AI analysis.</p>
              {loading && <p className="text-xs font-bold text-indigo-600 mt-4 animate-pulse uppercase tracking-widest">Generating Questions...</p>}
            </label>
          </motion.div>
        )}

        {currentStep === 'test' && (
          <motion.div
            key="test"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-12"
          >
            {questions.map((q, qIdx) => (
              <div key={qIdx} className="space-y-6">
                <div className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center font-bold text-sm">
                    {qIdx + 1}
                  </span>
                  <h4 className="font-bold text-lg leading-relaxed">{q.question}</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-12">
                  {q.options.map((opt, oIdx) => (
                    <button
                      key={oIdx}
                      onClick={() => {
                        const newAnswers = [...answers];
                        newAnswers[qIdx] = oIdx;
                        setAnswers(newAnswers);
                      }}
                      className={cn(
                        "text-left p-5 rounded-2xl border-2 transition-all font-medium",
                        answers[qIdx] === oIdx 
                          ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-500/20" 
                          : "bg-white dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-900/50"
                      )}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            <div className="pt-8 border-t border-slate-100 dark:border-slate-800">
              <Button onClick={handleSubmit} className="w-full py-4 text-lg bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-500/20">
                Complete & Submit Test
              </Button>
            </div>
          </motion.div>
        )}

        {currentStep === 'results' && (
          <motion.div
            key="results"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-10"
          >
            <div className="text-center py-8 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy size={40} />
              </div>
              <h3 className="text-3xl font-display font-bold mb-2 tracking-tight">Level Complete!</h3>
              <p className="text-slate-500 dark:text-slate-400 font-medium">Your Score: {score} / {questions.length} ({(score / questions.length * 100).toFixed(0)}%)</p>
            </div>

            <div className="space-y-6">
              <h4 className="font-display text-xl font-bold flex items-center gap-2">
                <BrainCircuit className="text-indigo-600" />
                Performance Review
              </h4>
              <div className="grid gap-4">
                {questions.map((q, idx) => (
                  <Card key={idx} className={cn(
                    "p-6 border-none", 
                    answers[idx] === q.correctAnswer 
                      ? "bg-green-50/50 dark:bg-green-900/5" 
                      : "bg-red-50/50 dark:bg-red-900/5"
                  )}>
                    <div className="flex items-start gap-4">
                      {answers[idx] === q.correctAnswer 
                        ? <CheckCircle2 className="text-green-600 dark:text-green-400 shrink-0 mt-1" /> 
                        : <XCircle className="text-red-600 dark:text-red-400 shrink-0 mt-1" />
                      }
                      <div className="flex-1">
                        <p className="font-bold text-slate-800 dark:text-slate-200">{q.question}</p>
                        <div className="mt-4 flex flex-wrap gap-4 text-sm">
                           <div className="px-3 py-1 bg-white dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700">
                              <span className="text-slate-400 mr-2 uppercase text-[10px] font-bold">Your Answer:</span>
                              <span className={answers[idx] === q.correctAnswer ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
                                {answers[idx] === -1 ? 'Unanswered' : q.options[answers[idx]]}
                              </span>
                           </div>
                           <div className="px-3 py-1 bg-white dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700">
                              <span className="text-slate-400 mr-2 uppercase text-[10px] font-bold">Correct:</span>
                              <span className="text-green-600 font-bold">{q.options[q.correctAnswer]}</span>
                           </div>
                        </div>
                        <p className="text-sm mt-4 text-slate-500 dark:text-slate-400 leading-relaxed italic">
                          " {q.explanation} "
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-8">
              <Button onClick={() => {
                setQuestions([]);
                setCurrentStep('upload');
              }} className="flex-1 h-14 text-lg bg-indigo-600 hover:bg-indigo-700">
                Generate New Test
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};
