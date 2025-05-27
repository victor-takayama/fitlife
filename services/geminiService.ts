

// Fix: Removed GenerateContentStreamResult from import as it's not a public/correct type for this usage
import { GoogleGenAI, Chat, GenerateContentResponse, GenerateContentParameters } from "@google/genai";
import { GEMINI_TEXT_MODEL } from '../constants';
import { ChatMessage, WorkoutPlan, NutritionPlan, FitnessLevel, Exercise } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn(
    "API_KEY for Gemini not found in environment variables. AI features will be significantly limited or non-functional. Using mock data or error states."
  );
}

const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

const SIMULATED_DELAY = 1000; // ms

const simulateDelay = <T,>(data: T): Promise<T> => {
  return new Promise(resolve => setTimeout(() => resolve(data), SIMULATED_DELAY));
}

// Helper to parse JSON from Gemini response, handling markdown fences
const parseJsonFromText = <T,>(text: string): T | null => {
  let jsonStr = text.trim();
  const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s; // Matches ```json ... ``` or ``` ... ```
  const match = jsonStr.match(fenceRegex);
  if (match && match[2]) {
    jsonStr = match[2].trim();
  }
  try {
    return JSON.parse(jsonStr) as T;
  } catch (e) {
    console.error("Failed to parse JSON response:", e, "Raw text:", text);
    return null;
  }
};


export const createFitLifeChat = (): Chat | null => {
  if (!ai) return null;
  return ai.chats.create({
    model: GEMINI_TEXT_MODEL,
    config: {
      systemInstruction: `Você é FitLife AI, um assistente de fitness e nutrição amigável, motivador e especialista. 
      Seu objetivo é ajudar os usuários a atingirem seus objetivos de saúde e bem-estar.
      Forneça conselhos personalizados, gere planos de treino e nutrição quando solicitado, e responda a perguntas de forma clara e concisa.
      Mantenha um tom positivo e encorajador. Se não souber uma resposta, admita e sugira onde o usuário pode encontrar a informação.
      Ao gerar planos, peça detalhes como nível de experiência, objetivos, tempo disponível, equipamentos, etc.
      Responda sempre em Português do Brasil.`,
    },
  });
};

export const sendChatMessage = async (chat: Chat, message: string): Promise<ChatMessage> => {
  if (!ai) {
    await simulateDelay(null);
    return { id: Date.now().toString(), text: "Desculpe, o serviço de IA está indisponível no momento. Tente novamente mais tarde.", sender: 'ai', timestamp: new Date() };
  }
  try {
    const response: GenerateContentResponse = await chat.sendMessage({ message });
    return {
      id: Date.now().toString(),
      text: response.text,
      sender: 'ai',
      timestamp: new Date(),
    };
  } catch (error) {
    console.error("Gemini chat error:", error);
    return { id: Date.now().toString(), text: "Ocorreu um erro ao processar sua mensagem. Tente novamente.", sender: 'ai', timestamp: new Date() };
  }
};

export const sendChatMessageStream = async (
  chat: Chat,
  message: string,
  onChunk: (chunkText: string) => void
): Promise<void> => {
  if (!ai) {
    await simulateDelay(null);
    onChunk("Desculpe, o serviço de IA está indisponível no momento. Tente novamente mais tarde.");
    return;
  }
  try {
    // Fix: Removed GenerateContentStreamResult type annotation. chat.sendMessageStream returns AsyncIterable<GenerateContentResponse>.
    const result = await chat.sendMessageStream({ message });
    for await (const chunk of result) {
      onChunk(chunk.text);
    }
  } catch (error) {
    console.error("Gemini streaming chat error:", error);
    onChunk("Ocorreu um erro ao processar sua mensagem em streaming. Tente novamente.");
  }
};


export const generateWorkoutPlan = async (
  fitnessLevel: FitnessLevel,
  goals: string[],
  timePerSession: number, // minutes
  daysPerWeek: number,
  availableEquipment: string[],
  exerciseLibrary: Exercise[] // Pass the library for context if needed by the model
): Promise<WorkoutPlan | null> => {
  if (!ai) {
    // Mock response if AI is unavailable
    await simulateDelay(null);
    console.warn("AI unavailable, returning mock workout plan.");
    return {
      id: 'mock-plan-1',
      name: 'Plano de Treino Simulado (IA Indisponível)',
      fitnessLevel: fitnessLevel,
      goals: goals,
      days: [
        { day: 'Dia 1', focus: 'Corpo Inteiro', exercises: [
          { exerciseId: 'ex001', name: 'Agachamento Livre (Simulado)', sets: '3', reps: '10', rest: '60s' },
          { exerciseId: 'ex002', name: 'Flexão (Simulado)', sets: '3', reps: 'Máximo', rest: '60s' },
        ]}
      ]
    };
  }

  const equipmentList = availableEquipment.length > 0 ? availableEquipment.join(', ') : 'peso corporal apenas';
  const exerciseNames = exerciseLibrary.map(ex => ex.name).join(', ');

  const prompt = `
    Crie um plano de treino detalhado para ${daysPerWeek} dias na semana.
    Nível de condicionamento: ${fitnessLevel}.
    Objetivos principais: ${goals.join(', ')}.
    Tempo disponível por sessão: ${timePerSession} minutos.
    Equipamentos disponíveis: ${equipmentList}.
    Considere os seguintes exercícios disponíveis na nossa base (use-os se apropriado, ou sugira variações): ${exerciseNames}.

    Para cada dia do plano, especifique:
    - "day": Nome do dia (e.g., "Dia 1", "Segunda-feira - Foco Superior")
    - "focus": O foco principal do treino para aquele dia (e.g., "Corpo Inteiro", "Pernas e Glúteos", "Peito e Tríceps").
    - "exercises": Uma lista de exercícios. Para cada exercício:
        - "name": Nome do exercício (pode ser da lista fornecida ou um exercício comum adequado).
        - "sets": Número de séries (e.g., "3", "3-4").
        - "reps": Número de repetições ou duração (e.g., "8-12", "15", "30 segundos").
        - "rest": Tempo de descanso entre as séries (e.g., "60s", "45-75s").
        - "videoUrl": (Opcional) Se for um exercício da lista, pode referenciar, caso contrário deixe em branco ou use um placeholder. Para esta tarefa, pode omitir videoUrl.
    
    O plano deve ser equilibrado e visar progressão.
    Retorne a resposta APENAS no formato JSON como um objeto WorkoutPlan, seguindo esta estrutura:
    {
      "id": "string (gere um id único)",
      "name": "string (nome criativo para o plano, ex: 'Plano Força Total Iniciante')",
      "description": "string (breve descrição do plano)",
      "fitnessLevel": "${fitnessLevel}",
      "goals": ["${goals.join('","')}"],
      "days": [
        {
          "day": "string",
          "focus": "string",
          "exercises": [
            { "name": "string", "sets": "string", "reps": "string", "rest": "string" }
          ],
          "estimatedDurationMinutes": number (opcional)
        }
      ]
    }
    Certifique-se que o JSON é válido. Não inclua nenhuma explicação fora do JSON.
  `;

  try {
    const params: GenerateContentParameters = {
      model: GEMINI_TEXT_MODEL,
      contents: prompt,
      config: { responseMimeType: "application/json" }
    };
    const response: GenerateContentResponse = await ai.models.generateContent(params);
    const parsedPlan = parseJsonFromText<WorkoutPlan>(response.text);
    if (parsedPlan) {
        // Enrich with exerciseId and videoUrl if names match library
        parsedPlan.days.forEach(day => {
            day.exercises.forEach(ex => {
                const foundExercise = exerciseLibrary.find(libEx => libEx.name.toLowerCase() === ex.name.toLowerCase());
                if (foundExercise) {
                    (ex as any).exerciseId = foundExercise.id; // Casting to add property dynamically
                    ex.videoUrl = foundExercise.videoUrl;
                }
            });
        });
    }
    return parsedPlan;

  } catch (error) {
    console.error("Gemini workout plan generation error:", error);
    return null;
  }
};

export const generateNutritionPlan = async (
  goal: string, // e.g., "Perda de Peso", "Ganho de Massa Muscular", "Manutenção Saudável"
  dailyCalories: number,
  dietaryRestrictions: string[] // e.g., "Sem lactose", "Vegetariano"
): Promise<NutritionPlan | null> => {
  if (!ai) {
     await simulateDelay(null);
     console.warn("AI unavailable, returning mock nutrition plan.");
     return {
        id: 'mock-nutrition-1',
        name: 'Plano Nutricional Simulado (IA Indisponível)',
        dailyCalorieTarget: dailyCalories,
        days: [{
            day: 'Dia Simulado',
            meals: {
                breakfast: { name: 'Café da Manhã Simulado', description: 'Aveia com frutas (simulado)' },
                lunch: { name: 'Almoço Simulado', description: 'Frango grelhado e salada (simulado)' },
                dinner: { name: 'Jantar Simulado', description: 'Salmão assado e legumes (simulado)' },
            }
        }]
     };
  }

  const restrictionsText = dietaryRestrictions.length > 0 ? `Restrições alimentares: ${dietaryRestrictions.join(', ')}.` : 'Sem restrições alimentares específicas.';

  const prompt = `
    Crie um plano nutricional de 7 dias.
    Objetivo: ${goal}.
    Meta calórica diária aproximada: ${dailyCalories} kcal.
    ${restrictionsText}

    Para cada dia, forneça sugestões para café da manhã, lanche da manhã (opcional), almoço, lanche da tarde (opcional) e jantar.
    Para cada refeição, inclua:
    - "name": Nome da refeição (e.g., "Omelete de Claras com Espinafre").
    - "description": Breve descrição ou ingredientes principais (e.g., "3 claras de ovo, 1 xícara de espinafre, temperos a gosto").
    - "calories": Estimativa de calorias (opcional, mas útil).
    - "protein": Estimativa de proteína em gramas (opcional).
    - "carbs": Estimativa de carboidratos em gramas (opcional).
    - "fats": Estimativa de gorduras em gramas (opcional).

    O plano deve ser variado, equilibrado e usar alimentos comuns e acessíveis no Brasil.
    Retorne a resposta APENAS no formato JSON como um objeto NutritionPlan, seguindo esta estrutura:
    {
      "id": "string (gere um id único)",
      "name": "string (nome criativo para o plano, ex: 'Plano Nutricional Foco Total')",
      "description": "string (breve descrição do plano)",
      "dailyCalorieTarget": ${dailyCalories},
      "days": [
        {
          "day": "string (e.g., 'Segunda-feira')",
          "meals": {
            "breakfast": { "name": "string", "description": "string", "calories": number? },
            "snack1": { "name": "string", "description": "string", "calories": number? }?,
            "lunch": { "name": "string", "description": "string", "calories": number? },
            "snack2": { "name": "string", "description": "string", "calories": number? }?,
            "dinner": { "name": "string", "description": "string", "calories": number? }
          },
          "totalCalories": number? // Soma das calorias do dia (opcional)
        }
      ]
    }
    Certifique-se que o JSON é válido. Não inclua nenhuma explicação fora do JSON.
  `;

  try {
    const params: GenerateContentParameters = {
      model: GEMINI_TEXT_MODEL,
      contents: prompt,
      config: { responseMimeType: "application/json" }
    };
    const response: GenerateContentResponse = await ai.models.generateContent(params);
    return parseJsonFromText<NutritionPlan>(response.text);
  } catch (error) {
    console.error("Gemini nutrition plan generation error:", error);
    return null;
  }
};

export const generateGeneralContent = async (prompt: string): Promise<string | null> => {
    if (!ai) {
        await simulateDelay(null);
        return "Serviço de IA indisponível. Conteúdo simulado.";
    }
    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: GEMINI_TEXT_MODEL,
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Gemini general content generation error:", error);
        return "Erro ao gerar conteúdo.";
    }
};

export const analyzeBodyScanData = async (metrics: { weightKg?: number; heightCm?: number; age?: number; gender?: 'male' | 'female' | 'other'; activityLevel?: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active' }): Promise<string | null> => {
  if (!ai) {
    await simulateDelay(null);
    return "Análise simulada: Seus dados indicam que você está no caminho certo! Continue focado nos seus objetivos. (IA Indisponível)";
  }

  const promptParts: string[] = ["Analise os seguintes dados de um usuário e forneça um breve feedback e recomendações gerais (2-3 parágrafos). Seja positivo e motivador:"];
  if (metrics.weightKg) promptParts.push(`- Peso: ${metrics.weightKg} kg`);
  if (metrics.heightCm) promptParts.push(`- Altura: ${metrics.heightCm} cm`);
  if (metrics.age) promptParts.push(`- Idade: ${metrics.age} anos`);
  if (metrics.gender) promptParts.push(`- Gênero: ${metrics.gender}`);
  if (metrics.activityLevel) promptParts.push(`- Nível de Atividade: ${metrics.activityLevel}`);
  
  const prompt = promptParts.join('\n');

  try {
    const response = await ai.models.generateContent({
      model: GEMINI_TEXT_MODEL,
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini body scan analysis error:", error);
    return "Erro ao analisar os dados. Tente novamente.";
  }
};

export const getMotivationalMessage = async (): Promise<string> => {
  if (!ai) {
    await simulateDelay(null);
    return "Lembre-se: cada passo, por menor que seja, aproxima você do seu objetivo! (IA Indisponível)";
  }
  const prompt = "Gere uma mensagem motivacional curta e impactante sobre fitness e bem-estar (1-2 frases).";
  try {
    const response = await ai.models.generateContent({ model: GEMINI_TEXT_MODEL, contents: prompt });
    return response.text;
  } catch (error) {
    console.error("Error fetching motivational message:", error);
    return "Acredite em você!";
  }
};

export const generateCommunityPostOrChallenge = async (type: 'post' | 'challenge'): Promise<string | null> => {
    if (!ai) {
        await simulateDelay(null);
        return type === 'post' ? "Post simulado: Mantenha-se hidratado durante seus treinos! #DicaFitLife (IA Indisponível)" : "Desafio simulado: Faça 10 minutos de alongamento todos os dias desta semana! (IA Indisponível)";
    }
    const prompt = type === 'post'
        ? "Gere um post curto e engajador para uma comunidade de fitness e bem-estar. Pode ser uma dica, uma pergunta ou uma pequena motivação (máximo 3 frases)."
        : "Gere uma ideia para um desafio semanal divertido e alcançável para uma comunidade de fitness. Inclua um título para o desafio e uma breve descrição (máximo 3 frases no total).";
    
    try {
        const response = await ai.models.generateContent({ model: GEMINI_TEXT_MODEL, contents: prompt });
        return response.text;
    } catch (error) {
        console.error(`Gemini ${type} generation error:`, error);
        return null;
    }
};