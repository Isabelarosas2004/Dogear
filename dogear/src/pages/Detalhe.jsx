import { useState } from "react";
import { Redirect, useParams } from "react-router-dom";
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton,
  IonButton, IonIcon, IonItem, IonInput, IonSelect, IonSelectOption, IonTextarea,
  IonLabel, IonListHeader, IonToast,
} from "@ionic/react";
import { heart, heartOutline } from "ionicons/icons";
import { useLibrary, fmt } from "../hooks/useLibrary.jsx";
import StarRating from "../components/StarRating.jsx";

export default function Detalhe() {
  const { id } = useParams();
  const { catalog, get, update, toggleFav, info } = useLibrary();
  const [draft, setDraft] = useState(() => get(id).review);
  const [toast, setToast] = useState(false);
  const book = catalog.find((b) => b.id === id);

  if (!book) return <Redirect to="/app/biblioteca" />;

  const { mine, readerAvg, readerCount, criticAvg } = info(book);
  const set = (changes) => update(book.id, changes);
  const readers = [
    ...(mine.rating > 0 || mine.review ? [{ user: "Você", rating: mine.rating, comment: mine.review }] : []),
    ...book.readers,
  ];

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start"><IonBackButton defaultHref="/app/biblioteca" text="" /></IonButtons>
          <IonTitle>Detalhes</IonTitle>
          <IonButtons slot="end">
            <IonButton aria-label="Favoritar" onClick={() => toggleFav(book.id)}>
              <IonIcon slot="icon-only" icon={mine.favorite ? heart : heartOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <div className="detail-head">
          <h2>{book.title}</h2>
          <p>{book.author} · {book.genre}{book.pages > 0 && ` · ${book.pages} páginas`}</p>
          <p className="about">{book.about}</p>
        </div>

        <div className="rb">
          <div><span>Sua nota</span><StarRating value={mine.rating} onChange={(rating) => set({ rating })} /></div>
          <div><span>Média dos leitores <small>({readerCount} avaliações)</small></span><strong>★ {fmt(readerAvg)}</strong></div>
          {book.critics.length > 0 && (
            <div><span>Crítica profissional <small>({book.critics.length} críticos)</small></span><strong>★ {fmt(criticAvg)}</strong></div>
          )}
        </div>

        <IonItem>
          <IonSelect label="Minha situação" labelPlacement="stacked" value={mine.status}
            onIonChange={(e) => set({ status: e.detail.value })}>
            <IonSelectOption value="">Sem marcação</IonSelectOption>
            <IonSelectOption value="quero">Quero ler</IonSelectOption>
            <IonSelectOption value="lendo">Lendo</IonSelectOption>
            <IonSelectOption value="lido">Lido</IonSelectOption>
          </IonSelect>
        </IonItem>

        {mine.status === "lendo" && (
          <IonItem>
            <IonInput label="Página atual" labelPlacement="stacked" type="number" min="0"
              max={book.pages || undefined} value={mine.pagesRead}
              onIonInput={(e) => set({ pagesRead: Math.max(0, Number(e.detail.value) || 0) })} />
          </IonItem>
        )}

        <IonItem>
          <IonTextarea label="Sua avaliação" labelPlacement="stacked" rows={3} autoGrow
            placeholder="O que você achou deste livro?" value={draft}
            onIonInput={(e) => setDraft(e.detail.value ?? "")} />
        </IonItem>
        <div className="ion-padding">
          <IonButton expand="block" onClick={() => { set({ review: draft.trim() }); setToast(true); }}>
            Publicar avaliação
          </IonButton>
        </div>

        {book.critics.length > 0 && (
          <>
            <IonListHeader><IonLabel>Crítica profissional</IonLabel></IonListHeader>
            {book.critics.map((c) => (
              <IonItem key={c.outlet} lines="full">
                <IonLabel className="ion-text-wrap">
                  <h3>{c.outlet} · ★ {fmt(c.score)}</h3>
                  <p>{c.quote}</p>
                </IonLabel>
              </IonItem>
            ))}
          </>
        )}

        <IonListHeader><IonLabel>Avaliações dos leitores</IonLabel></IonListHeader>
        {readers.length === 0 && (
          <p className="empty">Ainda não há avaliações deste livro. Seja a primeira pessoa a avaliar.</p>
        )}
        {readers.map((r) => (
          <IonItem key={r.user} lines="full">
            <IonLabel className="ion-text-wrap">
              <h3>{r.user}</h3>
              {r.rating > 0 && <StarRating value={r.rating} />}
              {r.comment && <p>{r.comment}</p>}
            </IonLabel>
          </IonItem>
        ))}

        {book.source === "google" && <p className="empty">Informações do livro: Google Books</p>}

        <IonToast isOpen={toast} message="Avaliação publicada" duration={1500}
          onDidDismiss={() => setToast(false)} />
      </IonContent>
    </IonPage>
  );
}
