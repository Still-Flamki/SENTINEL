import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function analyzeTransaction(transaction: any, history: any[]) {
  const model = "gemini-3.1-flash-lite-preview";
  
  const prompt = `
    You are the SENTINEL Orchestrator. Analyze this transaction for fraud.
    Transaction: ${JSON.stringify(transaction)}
    Recent History: ${JSON.stringify(history.slice(0, 10))}
    
    Return a JSON object with:
    - riskScore (0-100)
    - verdict (SAFE, REVIEW, BLOCK)
    - reasoning (short explanation)
    - flags (array of strings)
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            riskScore: { type: Type.INTEGER },
            verdict: { type: Type.STRING },
            reasoning: { type: Type.STRING },
            flags: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["riskScore", "verdict", "reasoning", "flags"]
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("AI Analysis failed:", error);
    return { riskScore: 0, verdict: "SAFE", reasoning: "Analysis failed", flags: [] };
  }
}

export async function investigateEntity(query: string) {
  const model = "gemini-3.1-pro-preview";
  
  const response = await ai.models.generateContentStream({
    model,
    contents: [{ parts: [{ text: `Investigate this entity for potential fraud: ${query}. Provide a multi-step forensic report.` }] }],
  });

  return response;
}
