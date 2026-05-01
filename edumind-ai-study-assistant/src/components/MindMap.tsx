import React, { useState } from 'react';
import { Card, Button, cn } from './ui/UI';
import { Network, Zap, Plus, Minus } from 'lucide-react';
import { motion } from 'motion/react';
import { ai, MODELS } from '../lib/gemini';
import { Type } from '@google/genai';

interface MindNode {
  title: string;
  children: string[];
}

export const MindMap: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [nodes, setNodes] = useState<MindNode[]>([]);

  const generateMap = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    try {
      const result = await ai.models.generateContent({
        model: MODELS.flash,
        contents: `Create a mind map for "${topic}". Break it down into main branches and sub-points.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                children: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
              required: ["title", "children"],
            },
          },
        },
      });
      setNodes(JSON.parse(result.text));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Network className="text-cyan-600" />
        AI Concept Map
      </h2>

      <div className="flex gap-2 mb-8">
        <input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter a topic (e.g. Quantum Physics)"
          className="flex-1 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none"
        />
        <Button onClick={generateMap} disabled={loading} className="bg-cyan-600 hover:bg-cyan-700">
          {loading ? "Thinking..." : "Generate Map"}
        </Button>
      </div>

      <div className="relative min-h-[400px] bg-gray-50 rounded-xl p-8 overflow-auto">
        <div className="flex flex-wrap items-start justify-center gap-12">
          {nodes.length > 0 ? (
            nodes.map((node, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center"
              >
                <div className="px-6 py-3 bg-white border-2 border-cyan-500 rounded-xl shadow-sm text-cyan-700 font-bold mb-4 whitespace-nowrap">
                  {node.title}
                </div>
                <div className="flex flex-col gap-2">
                  {node.children.map((child, ci) => (
                    <motion.div
                      key={ci}
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: (i * 0.1) + (ci * 0.05) }}
                      className="flex items-center gap-2"
                    >
                      <div className="w-4 h-px bg-cyan-300" />
                      <div className="px-3 py-1 bg-cyan-50 border border-cyan-100 rounded-lg text-xs text-cyan-600">
                        {child}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))
          ) : (
            <div className="flex flex-col items-center text-gray-400 mt-20">
              <Zap size={48} className="mb-4 opacity-20" />
              <p>Type a topic above to visualize its core concepts</p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
