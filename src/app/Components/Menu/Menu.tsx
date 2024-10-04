"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { GiHamburgerMenu } from "react-icons/gi";
import { FaYoutube } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import Logo_icon from "../../Assets/Logo_icon/Logo_icon";
import './Menu.css';

const Menu = () => {
  //TROCA A CLASSE AO CLICAR NO LINK
  const [activeLink, setActiveLink] = useState('/');

  const handleLinkClick = (path: string) => {
    setActiveLink(path);
  }


  //TROCA A CLASSE AO CLICAR NO BOTÃO
  const menu_hide = () => {
    document.getElementById("header")?.classList.toggle("header_closed")
    document.getElementById("header_open")?.classList.toggle("header_closed2")
    document.getElementById("sombra_menu")?.classList.toggle("sombra_menu_open")
    document.getElementById("btn_menu")?.classList.toggle("btn_menu_closed")
  }
  //DEIXA CLASSE FECHADA COMO PADRÃO QUANDO TIVER MOBILE
  useEffect(() => {
    const header = document.getElementById('header');
    const header2 = document.getElementById('header_open');
    const btn_menu = document.getElementById('btn_menu');

    if (header && header2 && btn_menu) {
        header.classList.add('header_closed');
        header2.classList.add('header_closed2');
        btn_menu.classList.add('btn_menu_closed');
      }
    else {
      console.error("Tanto 'header' ou 'header_open' nao foram encontrados.");
    }
  }, []);


  //DEIXA CLASSE FECHADA COMO PADRÃO QUANDO TIVER MOBILE
  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 888px)');
    const sombra_menu = document.getElementById('sombra_menu');

    if (sombra_menu) {
      if (mediaQuery.matches) {
        sombra_menu.classList.remove('sombra_menu_open');
      }

      mediaQuery.addEventListener('change', () => {
        if (mediaQuery.matches) {
          sombra_menu.classList.remove('sombra_menu_open');
        } else {
          sombra_menu.classList.add('sombra_menu_open');
        }
      });
    } else {
      console.error("Tanto 'header' ou 'header_open' nao foram encontrados.");
    }
  }, []);

  return (
    <>
      <div id='header_open'></div>
      <button onClick={menu_hide} tabIndex={1} className='btn_menu' id='btn_menu' ><GiHamburgerMenu size={20} /></button>
      <header id="header" role="navigation">
        <nav>
          <div>
            <div className='links'>
              <Link href="/" tabIndex={1} className={activeLink === '/' ? 'ativo' : ''} onClick={() => { handleLinkClick('/'); if (window.matchMedia("(max-width: 888px)").matches) { menu_hide(); } }}>
                <Logo_icon width='18px' height='16px' /><p>FRIENDLY</p>
              </Link>
            </div>
          </div>
          <ul>
            <a href=""><FaGithub />Github</a>
            <a href=""><FaYoutube />Youtube</a>
            <a href="">friendly@gmail.com</a>
          </ul>
        </nav>
      </header>
      <div className='sombra_menu_closed' id='sombra_menu' onClick={menu_hide}></div>
    </>
  )
}

export default Menu