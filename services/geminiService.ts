
import { GoogleGenAI, Type } from "@google/genai";

const getAIClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
};

export const generateMemoDraft = async (subject: string, details: string) => {
  const ai = getAIClient();
  const prompt = `Escreva um rascunho de memorando oficial em Português para o assunto: "${subject}". Detalhes adicionais: "${details}". Use um tom formal, profissional e institucional adequado para a Prefeitura de Maricá.`;
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.7,
        topP: 0.95,
        maxOutputTokens: 1024,
      }
    });

    return response.text || "Não foi possível gerar o rascunho no momento.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Erro ao conectar com a inteligência artificial.";
  }
};
