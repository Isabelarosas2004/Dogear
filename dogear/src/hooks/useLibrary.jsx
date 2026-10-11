import { createContext, useContext, useMemo } from "react";
import { useAuth } from "./useAuth.jsx";
import useLocalStorage from "./useLocalStorage.js";
import useGoogleBooks from "./useGoogleBooks.js";
import { catalog as localCatalog } from "../data/catalog.js";

const LibraryContext = createContext(null);

export const avg = (list) => (list.length ? list.reduce((s, x) => s + x, 0) / list.length : 0);
export const fmt = (n) => (n ? n.toFixed(1).replace(".", ",") : "–");

export const allGenres = [...new Set(localCatalog.map((b) => b.genre))];

const blank = { status: "", rating: 0, review: "", favorite: false, pagesRead: 0 };

// intercala as listas (1 do catálogo, 1 do Google Books, ...) para as duas fontes aparecerem juntas
const interleave = (a, b) => {
  const out = [];
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    if (a[i]) out.push(a[i]);
    if (b[i]) out.push(b[i]);
  }
  return out;
};

export function BooksProvider({ children }) {
  const { user } = useAuth();
  const [mine, setMine] = useLocalStorage(`dogear:mine:${user.id}`, {});

  const [profile, setProfile] = useLocalStorage(`dogear:profile:${user.id}`, {
    age: "", orientation: "", genres: [],
  });

  // catálogo do app + livros do Google Books (aparecem como parte do app)
  const googleBooks = useGoogleBooks();
  const catalog = useMemo(() => [...localCatalog, ...googleBooks], [googleBooks]);

  const get = (id) => ({ ...blank, ...(mine[id] || {}) });
  const update = (id, changes) => setMine({ ...mine, [id]: { ...get(id), ...changes } });
  const toggleFav = (id) => update(id, { favorite: !get(id).favorite });

  // médias: leitores (comunidade + Google Books + sua nota) e crítica profissional
  const info = (book) => {
    const m = get(book.id);
    const ratings = book.readers.map((r) => r.rating);
    if (m.rating > 0) ratings.push(m.rating);
    let sum = ratings.reduce((s, x) => s + x, 0);
    let count = ratings.length;
    if (book.external) {
      sum += book.external.avg * book.external.count;
      count += book.external.count;
    }
    return {
      mine: m,
      readerAvg: count ? sum / count : 0,
      readerCount: count,
      criticAvg: avg(book.critics.map((c) => c.score)),
    };
  };

  const summary = () => {
    const all = catalog.map((b) => get(b.id));
    return {
      read: all.filter((e) => e.status === "lido").length,
      avgMine: avg(all.filter((e) => e.rating > 0).map((e) => e.rating)),
      reviews: all.filter((e) => e.review).length,
    };
  };

  // recomendações: gêneros escolhidos no perfil + gêneros dos livros que você avaliou com 4 ou 5
  // (livros do catálogo e do Google Books aparecem intercalados)
  const recommended = () => {
    const liked = catalog.filter((b) => get(b.id).rating >= 4).map((b) => b.genre);
    const prefs = new Set([...profile.genres, ...liked]);
    const pool = catalog
      .filter((b) => prefs.has(b.genre) && get(b.id).status !== "lido")
      .sort((a, b) => info(b).readerAvg - info(a).readerAvg);
    return {
      hasPrefs: prefs.size > 0,
      list: interleave(
        pool.filter((b) => b.source !== "google"),
        pool.filter((b) => b.source === "google"),
      ),
    };
  };

  return (
    <LibraryContext.Provider value={{ catalog, get, update, toggleFav, info, summary, profile, setProfile, recommended }}>
      {children}
    </LibraryContext.Provider>
  );
}

export const useLibrary = () => useContext(LibraryContext);
