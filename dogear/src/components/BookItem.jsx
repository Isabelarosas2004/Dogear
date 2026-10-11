import { IonItem, IonLabel, IonButton, IonIcon, IonProgressBar } from "@ionic/react";
import { heart, heartOutline } from "ionicons/icons";
import { useLibrary, fmt } from "../hooks/useLibrary.jsx";

export default function BookItem({ book }) {
  const { info, toggleFav } = useLibrary();
  const { mine, readerAvg, criticAvg } = info(book);

  return (
    <IonItem routerLink={`/app/livro/${book.id}`} detail={false} lines="full">
      <IonLabel className="ion-text-wrap">
        <h2>{book.title}</h2>
        <p>{book.author} · {book.genre}</p>
        <p className="scores">Leitores ★ {fmt(readerAvg)}{book.critics.length > 0 && ` · Crítica ★ ${fmt(criticAvg)}`}</p>
        {mine.rating > 0 && <p className="scores">Sua nota: ★ {mine.rating}</p>}
        {mine.status === "lendo" && book.pages > 0 && (
          <IonProgressBar value={Math.min(mine.pagesRead / book.pages, 1)} />
        )}
      </IonLabel>
      <IonButton
        slot="end" fill="clear"
        aria-label={mine.favorite ? "Desfavoritar" : "Favoritar"}
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFav(book.id); }}
      >
        <IonIcon slot="icon-only" icon={mine.favorite ? heart : heartOutline}
          color={mine.favorite ? "danger" : "medium"} />
      </IonButton>
    </IonItem>
  );
}
