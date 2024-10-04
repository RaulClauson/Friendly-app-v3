import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Mapeamento de emoções simplificado
const emocaoMap = {
  alegre: ["feliz", "animado", "contente"],
  triste: ["triste", "desanimado"],
  irritado: ["irritado", "zangado", "frustrado"],
  ansioso: ["ansioso", "nervoso", "preocupado"],
  confuso: ["confuso", "perplexo"],
  neutro: ["neutro", "indiferente"]
};

async function detectarEmocao(mensagem) {
  const emocao = await chatGPT(mensagem);
  
  // Normalizando a emoção para comparação
  const emocaoNormalizada = emocao.toLowerCase();

  // Busca por palavras-chave em vez de correspondência exata
  for (const [emocaoCategoria, palavrasChave] of Object.entries(emocaoMap)) {
    if (palavrasChave.some(palavra => emocaoNormalizada.includes(palavra))) {
      return emocaoCategoria.charAt(0).toUpperCase() + emocaoCategoria.slice(1); // Retorna a emoção com a primeira letra maiúscula
    }
  }

  // Fallback para "Neutro" se nenhuma palavra-chave for encontrada
  return "Neutro";
}


// Função para chamar o modelo GPT para detectar a emoção na mensagem
async function chatGPT(mensagem) {
  const prompt = `
  Analise a seguinte mensagem e determine qual emoção ela transmite: "${mensagem}". 
  Escolha entre as seguintes emoções: feliz, triste, neutro, animado, irritado, ansioso, confuso, ou qualquer outra emoção implícita.
  Seja breve e direto na resposta, fornecendo apenas o nome da emoção.
  `;
  
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
    });

    const emotion = response.choices[0]?.message?.content.trim();

    if (!emotion) {
      throw new Error('A resposta do modelo não contém uma emoção válida.');
    }

    return emotion;
  } catch (error) {
    console.error("Erro ao analisar a emoção:", error);
    return 'neutro'; // Fallback para neutro em caso de erro
  }
}

// Função handler da API para lidar com requisições POST
export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { mensagem } = req.body;

    if (!mensagem || typeof mensagem !== 'string') {
      return res.status(400).json({ error: 'Mensagem inválida ou não fornecida.' });
    }

    try {
      const resultado = await detectarEmocao(mensagem);
      res.status(200).json({ emocao: resultado }); // Envia a emoção detectada
    } catch (error) {
      console.error("Erro ao processar a solicitação:", error);
      res.status(500).json({ error: 'Erro ao processar a solicitação' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Método ${req.method} não permitido`);
  }
}