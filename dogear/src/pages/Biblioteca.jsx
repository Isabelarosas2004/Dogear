import { useState } from "react";
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonSegment,
  IonSegmentButton, IonLabel, IonSearchbar,
} from "@ionic/react";
import { useLibrary } from "../hooks/useLibrary.jsx";
import { searchBooks } from "../hooks/useBookSearch.js";
import BookItem from "../components/BookItem.jsx";

export default function Biblioteca() {
  const { catalog, get } = useLibrary();
  const [filter, setFilter] = useState("todos");
  const [query, setQuery] = useState("");

  const q = query.trim();
  const byStatus = (b) => filter === "todos" || get(b.id).status === filter;

  // sem lista fixa: os livros aparecem conforme a pessoa digita
  let visible;
  if (q) visible = searchBooks(q, catalog).filter(byStatus);
  else visible = filter === "todos" ? [] : catalog.filter(byStatus);

  const hint = q
    ? `Nenhum livro encontrado para “${q}”.`
    : filter === "todos"
      ? "Digite o nome de um livro, autor ou gênero para pesquisar."
      : "Nenhum livro nesta lista ainda.";

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary"><IonTitle>Explorar</IonTitle></IonToolbar>
        <IonToolbar>
          <IonSearchbar placeholder="Pesquisar livro, autor ou gênero" value={query}
            debounce={0} onIonInput={(e) => setQuery(e.detail.value ?? "")} />
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonSegment value={filter} onIonChange={(e) => setFilter(e.detail.value)} scrollable>
          <IonSegmentButton value="todos"><IonLabel>Todos</IonLabel></IonSegmentButton>
          <IonSegmentButton value="lendo"><IonLabel>Lendo</IonLabel></IonSegmentButton>
          <IonSegmentButton value="lido"><IonLabel>Lidos</IonLabel></IonSegmentButton>
          <IonSegmentButton value="quero"><IonLabel>Quero ler</IonLabel></IonSegmentButton>
        </IonSegment>

        {visible.length === 0 ? (
          <p className="empty">{hint}</p>
        ) : (
          <IonList>{visible.map((b) => <BookItem key={b.id} book={b} />)}</IonList>
        )}
      </IonContent>
    </IonPage>
  );
}
