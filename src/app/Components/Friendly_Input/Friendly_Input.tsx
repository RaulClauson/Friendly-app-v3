import { useRef, useState, useEffect } from 'react'; 
import './Friendly_Input.css';
import { BiSolidSend } from "react-icons/bi";
import * as Typewriter from "react-effect-typewriter";

// Define the type Message
type Message = {
  role: 'system' | 'user' | 'assistant';  // Define possible roles
  content: string;  // The content of the message
};

type Emotion = 'Alegre' | 'Triste' | 'Neutro' | 'Irritado' | 'Confuso'; // Add more emotions as needed

const emotionMapping: Record<Emotion, number> = {
  Alegre: 10,
  Confuso: 20,
  Triste: 30,
  Irritado: 40,
  Neutro: 0,
};

const Friendly_Input = ({ onChange, onSend }: { onChange: (newEmotion: number) => void; onSend: () => void; }) => {
  const [response, setResponse] = useState('');  // AI response
  const [messageHistory, setMessageHistory] = useState<Message[]>([]); // Type the message history
  const spanRef = useRef<HTMLSpanElement>(null);
  const maxLength = 500;
  const [emocao, setEmocao] = useState<number>(0); // Change to number
  const [isButtonEnabled, setIsButtonEnabled] = useState<boolean>(false); // Button state
  const messagesEndRef = useRef<HTMLDivElement | null>(null); // Reference for scrolling

  const handleContentChange = (event: React.FormEvent<HTMLSpanElement>) => {
    let newContent = event.currentTarget.textContent || "";
    if (newContent.length > maxLength) {
      newContent = newContent.slice(0, maxLength);
    }
    if (spanRef.current) {
      spanRef.current.textContent = newContent;
    }
    setIsButtonEnabled(newContent.trim().length > 0); // Enable button if there's content
  };

  const handleSend = async () => {
    const userMessage = spanRef.current?.textContent || '';
    if (!userMessage) return;
  
    console.log("Enviando mensagem:", userMessage);
  
    // Request to the emotion API
    const emotionResponse = await fetch('/pages/api/emocao', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ mensagem: userMessage }), // Send the message to detect emotion
    });
  
    const emotionData = await emotionResponse.json();
  
    // Update emotion state using the mapping
    const newEmotion = emotionMapping[emotionData.emocao as Emotion]; // Ensure value is of type Emotion
    setEmocao(newEmotion); // Now it is of type number
    onChange(newEmotion); // Pass the new emotion to the parent component
  
    // Update the message history with the user's message first
    setMessageHistory(prevMessages => [
      ...prevMessages,
      { role: 'user', content: userMessage }
    ]);
  
    // Request to the back-end sending the user's message and message history
    const response = await fetch('/pages/api/openai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userMessage, messageHistory, emotion: emotionData }), // Send message, history, and emotion
    });
  
    const data = await response.json();
    const botMessage = data.message;
  
    // Update the message history with the bot's message
    setMessageHistory(prevMessages => [
      ...prevMessages,
      { role: 'assistant', content: botMessage }
    ]);
  
    setResponse(botMessage);  // Update AI response
    if (spanRef.current) {
      spanRef.current.textContent = ''; // Clear the input
    }
    setIsButtonEnabled(false); // Disable button after sending
  
    // Call the scrollToBottom function after a delay of 1 second
    onSend();
  
    setTimeout(() => {
      scrollToBottom(); // Scroll after 1 second delay
    }, 0);
  };

  // Function to scroll to the bottom
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLSpanElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSend();
    }
  };

  const pRef = useRef<HTMLDivElement | null>(null); // Use a div ref instead of p for typewriter effect

  useEffect(() => {
    if (pRef.current) {
      // Seleciona o <div> e remove o texto que não está dentro do <span>
      const paragraphs = pRef.current.getElementsByTagName('div');

      for (let i = 0; i < paragraphs.length; i++) {
        const paragraph = paragraphs[i];
        const span = paragraph.querySelector('span');
        
        // Remove o texto do <div> que não está dentro do <span>
        if (span) {
          const spanText = span.innerHTML; // Obtém o texto do <span>
          paragraph.innerHTML = ''; // Limpa o conteúdo do <div>
          paragraph.appendChild(span); // Mantém o <span>
          // Adiciona o texto do <span> de volta
          paragraph.insertAdjacentText('afterbegin', spanText); 
        }
      }
    }
  }, [response]); // Execute o efeito quando a resposta mudar

  return (
    <>
      <div id='Friendly_Input'>
        <div className='Friendly_Input_dentro'>
          <div className="box_chat_messages">
            <div className='box_chat_messages_dentro'>
            {messageHistory.map((msg, index) => {
              const isUserMessage = msg.role === 'user';
              return (
                <div key={index} className={isUserMessage ? "chat_msg_user" : "chat_msg_ia"}>
                  <div className={isUserMessage ? "message" : "message_ai"} ref={pRef}>
                    {isUserMessage ? (msg.content) : (
                      <Typewriter.Paragraph typingSpeed={10}>
                        <p>
                          <span>{msg.content}</span> {/* Envolva o conteúdo em um <span> */}
                        </p>
                      </Typewriter.Paragraph>
                    )}
                  </div>
                </div>
              );
            })}
            {/* Invisible div to allow auto-scrolling */}
            <div ref={messagesEndRef} />
            </div>
          </div>
          <label htmlFor="span_textarea">
            <span 
              id='span_textarea' 
              role="textbox" 
              contentEditable 
              ref={spanRef} 
              aria-label="Digite sua pergunta aqui"
              onInput={handleContentChange}
              onKeyDown={handleKeyDown}
            ></span>
            <button 
              type="button" 
              id='enviar_diagnostico' 
              aria-label="Enviar pergunta" 
              onClick={handleSend} 
              disabled={!isButtonEnabled} // Disable button based on state
            >
              <BiSolidSend size={20} style={{ transform: 'rotate(-45deg)' }} aria-hidden="true" />
            </button>
          </label>
          <p className='informacao'>A AI do Friendly pode apresentar informações imprecisas. Por isso, cheque as respostas.</p>
          {/* {emocao && <p>Emoção reconhecida: {emocao}</p>}  */}
        </div>
      </div>
    </>
  );
}

export default Friendly_Input;
