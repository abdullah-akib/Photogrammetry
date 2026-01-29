
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function explainStep(stepTitle: string, formula: string, result: string): Promise<string> {
  const prompt = `You are a professional geomatics engineer. Explain the following photogrammetry flight planning step to a civil engineering student in simple, clear language. 
  Step: ${stepTitle}
  Formula used: ${formula}
  Calculated Result: ${result}
  
  Please cover:
  1. Why this step is needed in flight planning.
  2. What it means physically (the real-world implication).
  3. Why we use this specific formula.
  
  Keep the tone academic but accessible. Avoid overly complex math jargon where a simple physical explanation suffices.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "Unable to generate explanation at this time.";
  } catch (error) {
    console.error("Gemini API error:", error);
    return "The AI assistant is temporarily unavailable. This step is a standard photogrammetry calculation used to ensure proper coverage and geometric accuracy.";
  }
}
