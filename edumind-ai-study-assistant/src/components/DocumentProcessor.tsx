import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Card, Button } from './ui/UI';
import { extractTextFromPDF } from '../lib/pdf';
import { summarizeDocument } from '../services/studyService';
import { FileText, Upload, Loader2, Download } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { jsPDF } from 'jspdf';

export const DocumentProcessor: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setLoading(true);
      try {
        const text = await extractTextFromPDF(selectedFile);
        const res = await summarizeDocument(text);
        setSummary(res);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  };

  const downloadPDF = () => {
    if (!summary) return;
    const doc = new jsPDF();
    const splitText = doc.splitTextToSize(summary, 180);
    doc.text('Study Summary', 10, 10);
    doc.text(splitText, 10, 20);
    doc.save(`${file?.name || 'study'}_summary.pdf`);
  };

  return (
    <Card className="p-6 dark:bg-slate-900 border-none shadow-xl shadow-indigo-500/5">
      <h2 className="text-xl font-display font-bold mb-4 flex items-center gap-2">
        <FileText className="text-purple-600 dark:text-purple-400" />
        Document Summarizer
      </h2>

      <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center hover:border-indigo-400 dark:hover:border-indigo-600 transition-colors group">
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileUpload}
          className="hidden"
          id="pdf-upload"
        />
        <label htmlFor="pdf-upload" className="cursor-pointer flex flex-col items-center">
          <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Upload className="w-8 h-8 text-slate-400 group-hover:text-indigo-500" />
          </div>
          <p className="text-sm font-bold text-slate-600 dark:text-slate-400">
            {file ? file.name : "Click to upload a PDF study material"}
          </p>
          <p className="text-xs text-slate-400 mt-1">Maximum 30,000 characters support</p>
        </label>
      </div>

      {loading && (
        <div className="mt-8 flex flex-col items-center gap-3">
          <Loader2 className="animate-spin text-indigo-600" size={32} />
          <p className="text-sm font-bold text-slate-500 animate-pulse">AI is reading your document...</p>
        </div>
      )}

      {summary && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-800 dark:text-slate-200 uppercase text-xs tracking-widest">AI Insights</h3>
            <Button onClick={downloadPDF} className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700">
              <Download size={14} className="mr-2" />
              Save to PDF
            </Button>
          </div>
          <div className="prose prose-slate dark:prose-invert max-w-none text-slate-700 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/40 p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
            <ReactMarkdown>{summary}</ReactMarkdown>
          </div>
        </motion.div>
      )}
    </Card>
  );
};
