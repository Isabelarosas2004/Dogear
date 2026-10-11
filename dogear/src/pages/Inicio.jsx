import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonListHeader, IonLabel, IonButton,
} from "@ionic/react";
import { useAuth } from "../hooks/useAuth.jsx";
import { useLibrary } from "../hooks/useLibrary.jsx";
import Stats from "../components/Stats.jsx";
import BookItem from "../components/BookItem.jsx";

export default function Inicio() {
  const { user } = useAuth();
  const { catalog, get, info, recommended } = useLibrary();
  const rec = recommended();
  const lendo = catalog.filter((b) => get(b.id).status === "lendo");
  const shown = new Set(rec.list.slice(0, 6).map((b) => b.id));
  const novos = catalog
    .filter((b) => b.source === "google" && !shown.has(b.id) && get(b.id).status !== "lido")
    .slice(0, 4);
  const top = [...catalog].sort((a, b) => info(b).readerAvg - info(a).readerAvg).slice(0, 4);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary"><IonTitle>Dogear</IonTitle></IonToolbar>
      </IonHeader>
      <IonContent>
        <h2 className="greet">Olá, {user.name.split(" ")[0]}</h2>
        <Stats />
        <IonList>
          <IonListHeader><IonLabel>Recomendados para você</IonLabel></IonListHeader>
          {!rec.hasPrefs && (
            <div className="empty">
              <p>Complete seu perfil com seus gêneros favoritos para receber recomendações.</p>
              <IonButton routerLink="/app/perfil" size="small">Completar perfil</IonButton>
            </div>
          )}
          {rec.hasPrefs && rec.list.length === 0 && (
            <p className="empty">Você já leu tudo dos seus gêneros favoritos.</p>
          )}
          {rec.list.slice(0, 6).map((b) => <BookItem key={b.id} book={b} />)}

          {novos.length > 0 && (
            <>
              <IonListHeader><IonLabel>Novidades no Dogear</IonLabel></IonListHeader>
              {novos.map((b) => <BookItem key={b.id} book={b} />)}
            </>
          )}

          <IonListHeader><IonLabel>Continue lendo</IonLabel></IonListHeader>
          {lendo.length === 0 && <p className="empty">Nenhum livro em andamento.</p>}
          {lendo.map((b) => <BookItem key={b.id} book={b} />)}

          <IonListHeader><IonLabel>Mais bem avaliados pelos leitores</IonLabel></IonListHeader>
          {top.map((b) => <BookItem key={b.id} book={b} />)}
        </IonList>
      </IonContent>
    </IonPage>
  );
}
