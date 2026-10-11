import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList } from "@ionic/react";
import { useLibrary } from "../hooks/useLibrary.jsx";
import BookItem from "../components/BookItem.jsx";

export default function Favoritos() {
  const { catalog, get } = useLibrary();
  const favs = catalog.filter((b) => get(b.id).favorite);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary"><IonTitle>Favoritos ({favs.length})</IonTitle></IonToolbar>
      </IonHeader>
      <IonContent>
        {favs.length === 0 ? (
          <p className="empty">Você ainda não favoritou nenhum livro. Toque no coração em qualquer livro.</p>
        ) : (
          <IonList>{favs.map((b) => <BookItem key={b.id} book={b} />)}</IonList>
        )}
      </IonContent>
    </IonPage>
  );
}
