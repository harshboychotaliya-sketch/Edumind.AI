import { GoogleGenAI, Type } from "@google/genai";
import { MODELS, ai } from "../lib/gemini";

export interface ExplanationResult {
  stepByStep: string[];
  summary: string;
  concepts: string[];
}

export async function explainProblem(prompt: string, subject: string, isEli10: boolean = false): Promise<ExplanationResult> {
  const systemInstruction = `You are an expert tutor in ${subject}. 
  Provide a detailed step-by-step explanation for the given problem. 
  ${isEli10 ? "Explain it strictly in an 'Explain Like I'm 10' (ELI10) style, using simple analogies and avoiding complex jargon." : "Use professional technical language but stay clear."}
  Return your response in a structured JSON format with 'stepByStep' (array of strings), 'summary' (string), and 'concepts' (array of strings).`;

  const result = await ai.models.generateContent({
    model: MODELS.pro,
    contents: prompt,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          stepByStep: { type: Type.ARRAY, items: { type: Type.STRING } },
          summary: { type: Type.STRING },
          concepts: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["stepByStep", "summary", "concepts"],
      },
    },
  });

  return JSON.parse(result.text);
}

export async function summarizeDocument(text: string): Promise<string> {
  const result = await ai.models.generateContent({
    model: MODELS.flash,
    contents: `Summarize the following study material efficiently:\n\n${text.substring(0, 30000)}`,
  });
  return result.text;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export async function generateQuiz(text: string): Promise<QuizQuestion[]> {
  const result = await ai.models.generateContent({
    model: MODELS.flash,
    contents: `Based on this text, generate 5 multiple choice questions for a practice test:\n\n${text.substring(0, 30000)}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            correctAnswer: { type: Type.INTEGER, description: "Index of correct option (0-3)" },
            explanation: { type: Type.STRING },
          },
          required: ["question", "options", "correctAnswer", "explanation"],
        },
      },
    },
  });
  return JSON.parse(result.text);
}
