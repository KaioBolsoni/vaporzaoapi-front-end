import { useState, useEffect } from "react";
import { GlobalStateContext } from "./GlobalStateContext";
import api from "../services/api";

export default function GlobalState({ children }) {
  const [generos, setGeneros] = useState([]);
  const [generosLoading, setGenerosLoading] = useState(true);
  const [jogos, setJogos] = useState([]);
  const [jogosLoading, setJogosLoading] = useState(true);

  async function fetchGeneros() {
    setGenerosLoading(true);
    try {
      const res = await api.get("/generos");
      setGeneros(res.data || []);
    } catch {
      setGeneros([]);
    } finally {
      setGenerosLoading(false);
    }
  }

  async function fetchJogos() {
    setJogosLoading(true);
    try {
      const res = await api.get("/jogos?limite=100");
      const raw = res.data;
      setJogos(Array.isArray(raw) ? raw : raw?.itens || []);
    } catch {
      setJogos([]);
    } finally {
      setJogosLoading(false);
    }
  }

  useEffect(() => {
    fetchGeneros();
    fetchJogos();
  }, []);

  const states = { generos, generosLoading, jogos, jogosLoading };
  const requests = { fetchGeneros, fetchJogos };

  return (
    <GlobalStateContext.Provider value={{ states, requests }}>
      {children}
    </GlobalStateContext.Provider>
  );
}
