import { BiUniversalAccess } from "react-icons/bi";
import { MdOutlineDarkMode } from "react-icons/md";
import { TbSettings } from "react-icons/tb";
import { IoClose } from "react-icons/io5";
import { useState, useRef, useEffect } from 'react'
import { FiLogOut } from "react-icons/fi";

import './Cabecalho.css'

interface Propriedades {
    titulo: string;
}

const Cabecalho = (props: Propriedades) => {
    const [notificacao, setNotificacao] = useState(false);
    const [historico, setHistorico] = useState(false);
    const historicoRef = useRef<HTMLButtonElement>(null);
    const notificacaoRef = useRef<HTMLButtonElement>(null);
  
    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
          if (historicoRef.current && !historicoRef.current.contains(event.target as Node)) {
            setHistorico(false);
          }
          if (notificacaoRef.current && !notificacaoRef.current.contains(event.target as Node)) {
            setNotificacao(false);
          }
        };
      
        if (historico || notificacao) {
          document.addEventListener('click', handleOutsideClick);
        }
      
        return () => {
          document.removeEventListener('click', handleOutsideClick);
        };
      }, [historico, notificacao]);






      const acessibilidade = () => {
        document.getElementById("acessibilidade")?.classList.toggle("closed")
      }
      
      const [darkMode, setDarkMode] = useState(false);
      const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        localStorage.setItem('darkMode', (!darkMode).toString());
        document.documentElement.classList.toggle('dark-mode');
      };

        // Verificar se o usuário já havia escolhido o modo escuro anteriormente
      useEffect(() => {
        const storedDarkMode = localStorage.getItem('darkMode');
        if (storedDarkMode === 'true') {
          setDarkMode(true);
          document.documentElement.classList.add('dark-mode');
        }
      }, []);
    
      // Verificar se o sistema do usuário está em modo escuro e aplicar automaticamente
      useEffect(() => {
        const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDarkMode && !localStorage.getItem('darkMode')) {
          setDarkMode(true);
          document.documentElement.classList.add('dark-mode');
        }
      }, []);


    return(
        <>
        <div id='cabecalho' role="banner">
                <h1>{props.titulo}</h1>
                <button type='button' onClick={() => setNotificacao(!notificacao)} className={notificacao ? "cabecalho_button cabecalho_ativa" : "cabecalho_button"} ref={notificacaoRef} tabIndex={2}>
                    <div>
                        <TbSettings size={24} aria-hidden="true"/>
                        <h2 onClick={() => setNotificacao(!notificacao)}>
                            Configurações
                            <IoClose size={24} aria-hidden="true"/>
                        </h2>
                    </div>
                    <ul>
                        <button type='button' onClick={acessibilidade} tabIndex={1}><BiUniversalAccess size={24} /><p>Acessibilidade</p></button>
                        <button type='button' onClick={toggleDarkMode} tabIndex={1}><MdOutlineDarkMode size={24} /><p>Dark Mode</p></button>
                        <button type='button' tabIndex={1}><FiLogOut size={24} /><p>Sair</p></button>
                    </ul>
                </button>
        </div>
        </>
    )
}

export default Cabecalho