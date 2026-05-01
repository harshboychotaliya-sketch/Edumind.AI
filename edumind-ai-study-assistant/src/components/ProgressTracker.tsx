import React from 'react';
import { useAuth } from '../lib/AuthContext';
import { Card } from './ui/UI';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Target, TrendingUp, AlertTriangle } from 'lucide-react';

export const ProgressTracker: React.FC = () => {
  const { userProfile } = useAuth();

  // Mock chart data - in a real app, fetch from Firestore
  const data = [
    { name: 'Mon', score: 65 },
    { name: 'Tue', score: 70 },
    { name: 'Wed', score: 85 },
    { name: 'Thu', score: 80 },
    { name: 'Fri', score: 92 },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="p-6 md:col-span-2 dark:bg-slate-900 border-none shadow-xl shadow-indigo-500/5">
        <h3 className="font-display font-bold mb-6 flex items-center gap-2 text-slate-800 dark:text-slate-100 uppercase text-xs tracking-widest">
          <TrendingUp className="text-indigo-600" />
          Learning Curve
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#64748b20" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10}} />
              <Tooltip 
                contentStyle={{
                  borderRadius: '12px', 
                  border: 'none', 
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  backgroundColor: '#1E293B',
                  color: '#fff'
                }} 
              />
              <Line type="monotone" dataKey="score" stroke="#4f46e5" strokeWidth={4} dot={{ r: 5, fill: '#4f46e5', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 7, strokeWidth: 0 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="space-y-6">
        <Card className="p-6 bg-indigo-600 text-white shadow-xl shadow-indigo-500/20 border-none">
          <h3 className="font-bold mb-2 flex items-center gap-2">
            <Target size={20} />
            Average Score
          </h3>
          <p className="text-4xl font-display font-bold">78%</p>
          <p className="text-[10px] uppercase font-bold opacity-70 mt-2 tracking-widest">+5% from last week</p>
        </Card>

        <Card className="p-6 dark:bg-slate-900 border-none shadow-lg">
          <h3 className="font-bold mb-4 flex items-center gap-2 text-red-500">
            <AlertTriangle size={20} />
            Focus Areas
          </h3>
          <div className="space-y-3">
            {userProfile?.weakPoints?.length > 0 ? (
              userProfile.weakPoints.map((point: string, i: number) => (
                <div key={i} className="text-[11px] font-bold p-3 bg-red-50 dark:bg-red-900/10 text-red-700 dark:text-red-400 rounded-xl border border-red-100 dark:border-red-900/30">
                  {point.length > 50 ? point.substring(0, 50) + "..." : point}
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400 italic">No weak points detected yet. Take a test!</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};
