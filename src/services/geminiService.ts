import { GoogleGenAI } from "@google/genai";
import { Asset } from "../types";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.warn("GEMINI_API_KEY is not defined. AI insights will not work.");
}
const ai = new GoogleGenAI({ apiKey: apiKey || "" });

export async function getAssetInsight(asset: Asset) {
  if (!apiKey) {
    return "Insight indisponível: Chave de API não configurada.";
  }

  const prompt = `Você é um analista financeiro sênior especializado em B3. Analise o ativo ${asset.ticker} (${asset.name}) do setor ${asset.sector}. 
  Indicadores atuais: 
  - Preço: ${asset.price}
  - Dividend Yield: ${asset.dy}%
  - P/VP: ${asset.pvp}
  - Rentabilidade Projetada: ${asset.projectedReturn}%
  
  Forneça uma análise preditiva concisa (máximo 280 caracteres) focada na rentabilidade futura e na viabilidade da aplicação para o cenário atual. 
  Seja direto, use tom profissional e destaque se é uma oportunidade de valor ou dividendos. Responda em Português do Brasil.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        temperature: 0.7,
        topP: 0.8,
        topK: 40
      }
    });
    
    const text = response.text;
    if (!text) throw new Error("Empty response from Gemini");
    
    return text;
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    if (error.message?.includes("API_KEY_INVALID")) {
      return "Erro: Chave de API inválida. Verifique as configurações.";
    }
    return "Ocorreu um erro ao gerar a análise. Tente novamente mais tarde.";
  }
}
