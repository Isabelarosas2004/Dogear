import { useEffect } from "react";
import useLocalStorage from "./useLocalStorage.js";
import { fetchGoogleBooks } from "./useBookSearch.js";

const KEY = "dogear:google-books";
const DAY = 24 * 60 * 60 * 1000;

// Carrega os livros do Google Books em segundo plano e guarda no aparelho.
// Na próxima vez eles já aparecem na hora (e até sem internet); a lista é renovada a cada 24 h.
// Livros que já foram carregados nunca somem, para não perder notas e favoritos do usuário.
export default function useGoogleBooks() {
  const [cache, setCache] = useLocalStorage(KEY, { at: 0, books: [] });

  useEffect(() => {
    if (cache.books.length > 0 && Date.now() - cache.at < DAY) return;
    let cancelled = false;
    fetchGoogleBooks()
      .then((fresh) => {
        if (cancelled || fresh.length === 0) return;
        setCache((old) => {
          const ids = new Set(fresh.map((b) => b.id));
          return { at: Date.now(), books: [...fresh, ...old.books.filter((b) => !ids.has(b.id))] };
        });
      })
      .catch(() => {}); // sem internet: segue com o que já tem
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return cache.books;
}
