// Livros do Dogear:
//  - searchBooks: busca LOCAL, filtra a lista que já está dentro do app (catálogo + livros do Google Books já carregados)
//  - fetchGoogleBooks: busca livros na API do Google Books, por gênero, para alimentar as recomendações
import { catalog } from "../data/catalog.js";

// ignora acentos e maiúsculas: "memorias" encontra "Memórias Póstumas"
export const norm = (s) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

export function searchBooks(query, list = catalog) {
  const q = norm(query.trim());
  if (!q) return [];
  return list
    .filter((b) => norm(`${b.title} ${b.author} ${b.genre}`).includes(q))
    .sort((a, b) => Number(norm(b.title).includes(q)) - Number(norm(a.title).includes(q)));
}

/* ---------- Google Books ---------- */

const API = "https://www.googleapis.com/books/v1/volumes";

// gênero do Dogear -> termo de pesquisa na API (os livros recebem o gênero daqui)
export const GOOGLE_QUERIES = {
  "Ficção": "subject:fiction",
  "Fantasia": "subject:fantasy",
  "Distopia": "distopia",
  "Não ficção": "subject:history",
  "Romance contemporâneo": "romance contemporâneo",
  "Romance clássico": "subject:classics",
  "Contos": "contos",
  "Fábula": "fábulas",
};

const cleanText = (html = "") =>
  html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();

const shorten = (text, max = 360) => {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  return cut.slice(0, cut.lastIndexOf(" ")) + "…";
};

// converte um item da API para o formato dos livros do app
export function toBook(item, genre) {
  const v = item?.volumeInfo;
  if (!item?.id || !v?.title || !v.authors?.length) return null;
  const about = cleanText(v.description);
  if (about.length < 60) return null; // sem sinopse decente, não entra
  const count = Number(v.ratingsCount) || 0;
  const rating = Number(v.averageRating) || 0;
  return {
    id: `g-${item.id}`,
    source: "google",
    title: v.title,
    author: v.authors.join(", "),
    pages: Number(v.pageCount) || 0,
    genre,
    about: shorten(about),
    critics: [],
    readers: [],
    external: count > 0 && rating > 0 ? { avg: rating, count } : null,
  };
}

// busca todos os gêneros em paralelo; o que falhar é ignorado (o app continua funcionando)
export async function fetchGoogleBooks(perGenre = 8) {
  const results = await Promise.allSettled(
    Object.entries(GOOGLE_QUERIES).map(async ([genre, q]) => {
      const params = new URLSearchParams({
        q,
        langRestrict: "pt",
        printType: "books",
        orderBy: "relevance",
        maxResults: String(perGenre),
        fields: "items(id,volumeInfo(title,authors,description,pageCount,averageRating,ratingsCount))",
      });
      const res = await fetch(`${API}?${params}`);
      if (!res.ok) throw new Error(`Google Books ${res.status}`);
      const data = await res.json();
      return (data.items || []).map((item) => toBook(item, genre)).filter(Boolean);
    }),
  );

  const seen = new Set(catalog.map((b) => norm(b.title)));
  const books = [];
  for (const r of results) {
    if (r.status !== "fulfilled") continue;
    for (const b of r.value) {
      const key = norm(b.title);
      if (seen.has(key)) continue; // não repete livro que já existe no app
      seen.add(key);
      books.push(b);
    }
  }
  return books;
}
