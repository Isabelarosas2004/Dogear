import { useState } from "react";
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonIcon, IonAlert,
  IonItem, IonInput, IonSelect, IonSelectOption, IonChip, IonLabel, IonList,
  IonListHeader, IonProgressBar, IonToast, IonSegment, IonSegmentButton, IonAccordion, IonAccordionGroup,
} from "@ionic/react";
import { logOutOutline, mailOutline, lockClosedOutline, checkmark, accessibilityOutline } from "ionicons/icons";
import { useAuth } from "../hooks/useAuth.jsx";
import { useLibrary, allGenres } from "../hooks/useLibrary.jsx";
import Stats from "../components/Stats.jsx";
import AccountModal from "../components/AccountModal.jsx";
import { useA11y, FONTS, SIZES, THEMES, ACCENTS } from "../hooks/useA11y.jsx";

const orientations = [
  "Heterossexual", "Homossexual", "Bissexual", "Pansexual", "Assexual", "Outra", "Prefiro não informar",
];

export default function Perfil() {
  const { user, logout } = useAuth();
  const { profile, setProfile } = useLibrary();
  const { settings: a, set: setA, reset: resetA } = useA11y();
  const [age, setAge] = useState(profile.age);
  const [orientation, setOrientation] = useState(profile.orientation);
  const [genres, setGenres] = useState(profile.genres);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [ask, setAsk] = useState(false);
  const [modal, setModal] = useState(null);

  const first = user.name.split(" ")[0];
  const done = [String(age) !== "", orientation !== "", genres.length > 0].filter(Boolean).length;
  const toggle = (g) => setGenres(genres.includes(g) ? genres.filter((x) => x !== g) : [...genres, g]);

  function saveProfile() {
    const n = Number(age);
    if (String(age) !== "" && (n < 5 || n > 120)) return setError("Informe uma idade válida.");
    setError("");
    setProfile({ age: String(age) === "" ? "" : n, orientation, genres });
    setToast("Perfil atualizado");
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary"><IonTitle>Perfil</IonTitle></IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="profile">
          <div className="avatar">{user.name[0].toUpperCase()}</div>
          <h2>{user.name}</h2>
          <p>{user.email}</p>
        </div>

        <Stats />

        <IonList>
          <IonListHeader><IonLabel>Complete seu perfil · {Math.round((done / 3) * 100)}%</IonLabel></IonListHeader>
          <IonProgressBar value={done / 3} className="meter" />

          <IonItem>
            <IonInput label="Idade" labelPlacement="stacked" type="number" min="5" max="120"
              value={age} onIonInput={(e) => setAge(e.detail.value ?? "")} />
          </IonItem>
          <IonItem>
            <IonSelect label="Orientação sexual (opcional)" labelPlacement="stacked" value={orientation}
              placeholder="Selecionar" onIonChange={(e) => setOrientation(e.detail.value)}>
              {orientations.map((o) => <IonSelectOption key={o} value={o}>{o}</IonSelectOption>)}
            </IonSelect>
          </IonItem>

          <div className="chips">
            <IonLabel>Gêneros de livro favoritos</IonLabel>
            <div>
              {allGenres.map((g) => (
                <IonChip key={g} color={genres.includes(g) ? "primary" : "medium"}
                  outline={!genres.includes(g)} onClick={() => toggle(g)}>
                  {g}
                </IonChip>
              ))}
            </div>
          </div>

          {error && <p className="form-error" role="alert">{error}</p>}
          <div className="ion-padding">
            <IonButton expand="block" onClick={saveProfile}>Salvar perfil</IonButton>
          </div>

          <IonAccordionGroup>
            <IonAccordion value="acessibilidade">
              <IonItem slot="header">
                <IonIcon slot="start" icon={accessibilityOutline} />
                <IonLabel>Acessibilidade</IonLabel>
              </IonItem>
              <div slot="content">
          <IonItem lines="none">
            <IonLabel className="ion-text-wrap">
              <h3>Exemplo de texto</h3>
              <p>Dom Casmurro, de Machado de Assis. Capitu e a dúvida que atravessa o livro.</p>
            </IonLabel>
          </IonItem>

          <div className="chips">
            <IonLabel>Tamanho da letra</IonLabel>
            <IonSegment scrollable value={String(a.size)}
              onIonChange={(e) => e.detail.value && setA({ size: Number(e.detail.value) })}>
              {SIZES.map((s) => (
                <IonSegmentButton key={s.value} value={String(s.value)}><IonLabel>{s.label}</IonLabel></IonSegmentButton>
              ))}
            </IonSegment>
          </div>

          <IonItem>
            <IonSelect label="Tipo de letra" labelPlacement="stacked" value={a.font}
              onIonChange={(e) => setA({ font: e.detail.value })}>
              {FONTS.map((f) => <IonSelectOption key={f.id} value={f.id}>{f.label}</IonSelectOption>)}
            </IonSelect>
          </IonItem>

          <div className="chips">
            <IonLabel>Tema</IonLabel>
            <IonSegment value={a.theme} onIonChange={(e) => e.detail.value && setA({ theme: e.detail.value })}>
              {THEMES.map((t) => (
                <IonSegmentButton key={t.id} value={t.id}><IonLabel>{t.label}</IonLabel></IonSegmentButton>
              ))}
            </IonSegment>
          </div>

          <div className="chips">
            <IonLabel>Cor do aplicativo</IonLabel>
            <div className="swatches">
              {ACCENTS.map((c) => (
                <button key={c.id} type="button" className={`sw ${a.accent === c.id ? "on" : ""}`}
                  style={{ background: c.light }} aria-label={c.label} aria-pressed={a.accent === c.id}
                  onClick={() => setA({ accent: c.id })}>
                  {a.accent === c.id && <IonIcon icon={checkmark} />}
                </button>
              ))}
            </div>
          </div>

          <div className="ion-padding">
            <IonButton expand="block" fill="outline" onClick={resetA}>Restaurar padrão</IonButton>
          </div>

              </div>
            </IonAccordion>
          </IonAccordionGroup>

          <IonListHeader><IonLabel>Conta</IonLabel></IonListHeader>
          <IonItem button detail onClick={() => setModal("email")}>
            <IonIcon slot="start" icon={mailOutline} /><IonLabel>Alterar e-mail</IonLabel>
          </IonItem>
          <IonItem button detail onClick={() => setModal("senha")}>
            <IonIcon slot="start" icon={lockClosedOutline} /><IonLabel>Alterar senha</IonLabel>
          </IonItem>
          <IonItem button detail={false} onClick={() => setAsk(true)}>
            <IonIcon slot="start" icon={logOutOutline} color="danger" />
            <IonLabel color="danger">Sair da conta</IonLabel>
          </IonItem>
        </IonList>

        {modal && (
          <AccountModal mode={modal} onClose={(msg) => { setModal(null); if (msg) setToast(msg); }} />
        )}

        <IonToast isOpen={!!toast} message={toast} duration={1800} onDidDismiss={() => setToast("")} />

        <IonAlert
          isOpen={ask}
          header="Sair da conta"
          message={`Deseja realmente sair, ${first}?`}
          onDidDismiss={() => setAsk(false)}
          buttons={[
            { text: "Cancelar", role: "cancel" },
            { text: "Sair", role: "destructive", handler: () => logout() },
          ]}
        />
      </IonContent>
    </IonPage>
  );
}
