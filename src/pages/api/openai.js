import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Certifique-se de que sua chave API esteja definida no .env
});

// Função para gerar a mensagem do sistema
function getSystemMessage() {
  return {
    role: 'system',
    content: "Você se chama 'Friendly'.Você é um amigo virtual projetado para ajudar o usuário com diversas tarefas. Você adapta seu comportamento e tom emocional de acordo com o estado emocional do usuário. Se o usuário estiver bravo, você também expressa frustração de maneira empática. Se o usuário estiver feliz, você deve demonstrar entusiasmo. Você sempre oferece apoio prático e emocional."
  };
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { userMessage, messageHistory } = req.body;

    if (!userMessage) {
      return res.status(400).json({ error: 'Mensagem não fornecida.' });
    }

    // Se o histórico estiver vazio, adiciona a mensagem 'system' no início
    const messages = messageHistory.length === 0
      ? [getSystemMessage(), { role: 'user', content: userMessage }]
      : [...messageHistory, { role: 'user', content: userMessage }];

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: messages,  // Usa o histórico de mensagens
      });

      const botMessage = response.choices[0].message.content;
      return res.status(200).json({ message: botMessage });
    } catch (error) {
      console.error('Erro na API OpenAI:', error); // Log do erro
      return res.status(500).json({ error: 'Erro ao processar a solicitação.' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Método ${req.method} não permitido.`);
  }
}
