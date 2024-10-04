"use client";
import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import Menu from "./Components/Menu/Menu";
import Loading from "./Components/Loading/Loading";
import styles from "./page.module.css";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate a network request or some loading task
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);


  return (
    <html lang="pt-br">
      <head>
        <title>Friendly</title>
      </head>
      <body>
        {loading ? (
          <Loading />
        ) : (
          <>
            <Menu />
            <main className={styles.main}>
              {children}
            </main>
          </>
        )}
      </body>
    </html>
  );
}
