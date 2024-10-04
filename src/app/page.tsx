"use client";
import Friendly_Input from "./Components/Friendly_Input/Friendly_Input";
import Cabecalho from "./Components/Cabecalho/Cabecalho";
import styles from "./page.module.css";
import Friendly_Olhos from "./Components/Friendly_Olhos/Friendly_Olhos";
import { useState, useRef, useEffect } from 'react';

export default function Home() {
  
  const [emocao, setEmocao] = useState<number>(0); // Estado para a emoção
  const olhosRef = useRef<{ handleClick: () => void }>(null); // Referência para Friendly_Olhos

  // Função para atualizar a emoção, que pode ser passada para Friendly_Input
  const handleEmocaoChange = (novaEmocao: number) => {
    setEmocao(novaEmocao);
  };

  // Função chamada quando uma mensagem é enviada
  const handleSendMessage = () => {
    if (olhosRef.current) {
      olhosRef.current.handleClick(); // Chama handleClick do Friendly_Olhos
    }
  };

  return (
    <main className={styles.main} id="main">
      <Cabecalho titulo='FRIENDLY' />
      <Friendly_Olhos ref={olhosRef} emocao={emocao} /> {/* Passando a referência para Friendly_Olhos */}
      <Friendly_Input onChange={handleEmocaoChange} onSend={handleSendMessage} /> {/* Passando a função para Friendly_Input */}
    </main>
  );
}
