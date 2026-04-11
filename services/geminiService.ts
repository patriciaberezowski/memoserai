import { GoogleGenAI } from "@google/genai";

const getAIClient = () => {
  // Inicialização segura contemplando Vite
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
  if (!apiKey) {
    console.warn("Aviso: Chave VITE_GEMINI_API_KEY ausente. Usando modo simulação (Mock).");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateMemoDraft = async (subject: string, details: string) => {
  try {
    const ai = getAIClient();
    const prompt = `Escreva um rascunho de memorando oficial em Português para o assunto: "${subject}". Detalhes adicionais: "${details}". Use um tom formal, profissional e institucional adequado para a Prefeitura de Maricá. Retorne apenas o texto do memorando, sem marcadores de markdown.`;

    // Se estivermos em modo simulação (sem chave)
    if (!ai) {
      // Simulando um delay de rede de 2 segundos
      await new Promise(resolve => setTimeout(resolve, 2000));
      return `[TEXTO GERADO POR SIMULAÇÃO - IA DESATIVADA]\n\nAssunto: ${subject}\n\nPrezados,\n\nSirvo-me do presente para informar o que se segue.\nConsiderando as informações fornecidas: ${details}\n\nNo momento, não foi detectada uma chave válida de API (VITE_GEMINI_API_KEY) no ambiente. Este é um texto de preenchimento (mock) gerado automaticamente para que você consiga validar a interface e avançar no teste do sistema.\n\nAtenciosamente.`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.7,
        topP: 0.95,
        maxOutputTokens: 1024,
      }
    });

    if (!response.text) throw new Error("A resposta da IA veio vazia.");
    return response.text;
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(error.message || "Erro ao conectar com a inteligência artificial.");
  }
};
