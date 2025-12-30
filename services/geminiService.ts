import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, DesignCategory } from "../types";

const SYSTEM_INSTRUCTION = `
You are an expert Design Professor specializing in Automotive and Industrial Design. 
Your goal is to educate students on the difference between "Smart Design" (Engineering, Functional, Systems, Technical) and "Entertainment Design" (User Experience, Aesthetics, Comfort, Fun, Emotional Connection).

You will be provided with an exploded view diagram of a vehicle or product.
1. Identify every labeled part visible in the image.
2. For each part, categorize it strictly into 'Smart Design', 'Entertainment Design', or 'Hybrid Design'.
3. Explain the skills required to design this part.
4. Provide a brief reasoning for the classification.
5. ESTIMATE the 2D bounding box for the part within the image as [ymin, xmin, ymax, xmax] on a scale of 0 to 1000. This is crucial for the interactive display.

Output valid JSON matching the schema provided.
`;

export const analyzeImage = async (base64Image: string): Promise<AnalysisResult> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/png",
              data: base64Image,
            },
          },
          {
            text: "Analyze this exploded view diagram. Identify parts, categorize them into Smart Design, Entertainment Design, or Hybrid Design, and provide bounding boxes. Output in JSON."
          },
        ],
      },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overview: {
              type: Type.STRING,
              description: "A 2-sentence summary of how this specific object balances smart and entertainment design.",
            },
            parts: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING, description: "Unique slug id for the part" },
                  name: { type: Type.STRING, description: "The name of the part as usually labeled in the diagram" },
                  category: { 
                    type: Type.STRING, 
                    enum: [
                      DesignCategory.SMART,
                      DesignCategory.ENTERTAINMENT,
                      DesignCategory.HYBRID
                    ]
                  },
                  description: { type: Type.STRING, description: "What this part does." },
                  skills: { 
                    type: Type.ARRAY, 
                    items: { type: Type.STRING },
                    description: "List of 2-3 professional skills needed (e.g., Ergonomics, UI Design, Structural Engineering)."
                  },
                  reasoning: { type: Type.STRING, description: "Why it fits into this category." },
                  boundingBox: {
                    type: Type.ARRAY,
                    items: { type: Type.NUMBER },
                    description: "Bounding box coordinates [ymin, xmin, ymax, xmax] normalized to 1000 (0-1000 scale)."
                  }
                },
                required: ["id", "name", "category", "description", "skills", "reasoning", "boundingBox"],
              },
            },
          },
          required: ["overview", "parts"],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from Gemini");
    }

    return JSON.parse(text) as AnalysisResult;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};