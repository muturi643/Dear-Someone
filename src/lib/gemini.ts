import { GoogleGenAI, Type } from "@google/genai";
import { Intent, Tone, LetterTemplate } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function generateCompliments(
  recipientName: string,
  specialSauce: string,
  tone: Tone
): Promise<string[]> {
  const model = "gemini-3-flash-preview";
  const prompt = `You are "Dear Someone", a world-class relationship strategist and writer from the "Ink & Soul" stationery house. 
  Based on the following information about a person named ${recipientName} and a "Special Sauce" (a unique memory, joke, or trait): "${specialSauce}", 
  generate 3-5 punchy, high-impact compliments. 
  The tone should be ${tone}. 
  Each compliment should be short (max 15 words) and feel like a "compliment shower" – unexpected, specific, and deeply flattering.
  Return the compliments as a JSON array of strings.`;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
      },
    },
  });

  try {
    return JSON.parse(response.text || "[]");
  } catch (e) {
    console.error("Failed to parse compliments", e);
    return [];
  }
}

export async function generateLetter(
  recipientName: string,
  intent: Intent,
  specialSauce: string,
  tone: Tone,
  template: LetterTemplate = 'None',
  vulnerability: number = 50,
  professionalism: number = 50,
  nostalgia: number = 50
): Promise<string> {
  const model = "gemini-3-flash-preview";
  const prompt = `You are "Dear Someone", a human-centric stationery house called "Ink & Soul" that writes heartfelt, soul-baring letters. 
  Write a personalized letter for ${recipientName}.
  
  CONTEXT:
  - Intent: ${intent} (Safety Net = checking in/reconnecting, The Move = expressing interest/asking out, The Proposal = serious commitment/deep expression).
  - Template: ${template} (If not 'None', use this as a thematic guide for the letter's structure and message).
  - Special Sauce: ${specialSauce} (A unique memory or trait to anchor the letter).
  - Tone: ${tone}.
  - Emotional Intensity: ${vulnerability}/100.
  - Professionalism Level: ${professionalism}/100.
  - Nostalgia Level: ${nostalgia}/100.

  GUIDELINES:
  - The letter should be optimized for WhatsApp (short paragraphs, punchy sentences).
  - It should feel like a high-end, deeply personal letter – sophisticated yet raw and honest.
  - It must bridge the gap from crushing to committing.
  - Use the "Special Sauce" as the emotional anchor.
  - Do not use generic AI greetings. Start with something striking.
  - End with a custom Call to Action based on the ${intent}.
  
  Return only the text of the letter.`;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
  });

  return response.text || "Failed to generate letter.";
}

export async function refineLetter(
  currentContent: string,
  refinementType: 'Deeper' | 'Funnier' | 'Shorter' | 'Surprise Me'
): Promise<string> {
  const model = "gemini-3-flash-preview";
  const prompt = `You are "Dear Someone". Refine the following letter to be ${refinementType}. 
  Keep the core intent and recipient the same, but adjust the prose accordingly.
  
  LETTER:
  ${currentContent}`;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
  });

  return response.text || currentContent;
}
