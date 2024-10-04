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
  const messagesEndRef = useRef<HTMLDivElement | null>(null); // Ref for the end of messages

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
    const emotionResponse = await fetch('/api/emocao', {
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
    const response = await fetch('/api/openai', {
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
    onSend();
    
    // Call the scrollToBottom function immediately
    scrollToBottom();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLSpanElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSend();
    }
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom(); // Scroll when the message history changes
  }, [messageHistory]);

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
                    <div className={isUserMessage ? "message" : "message_ai"}>
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
              {/* This empty div will act as the scroll target */}
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
