import { useState } from "react";
import {
  IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonContent,
  IonItem, IonInput, IonInputPasswordToggle,
} from "@ionic/react";
import { useAuth } from "../hooks/useAuth.jsx";
import PasswordRules from "./PasswordRules.jsx";
import PasswordMatch from "./PasswordMatch.jsx";
import { isStrongPassword } from "../hooks/usePassword.js";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// mode: "email" | "senha". onClose(mensagem?) fecha e opcionalmente avisa o sucesso.
export default function AccountModal({ mode, onClose }) {
  const { changeEmail, changePassword } = useAuth();
  const [f, setF] = useState({ email: "", current: "", next: "", confirm: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const isEmail = mode === "email";
  const set = (k) => (e) => setF({ ...f, [k]: e.detail.value ?? "" });

  async function save() {
    setError("");
    if (!f.current) return setError("Informe sua senha atual.");
    if (isEmail && !emailRegex.test(f.email.trim())) return setError("Informe um e-mail válido.");
    if (!isEmail && !isStrongPassword(f.next)) return setError("A nova senha não atende a todos os requisitos.");
    if (!isEmail && f.next !== f.confirm) return setError("As senhas não são iguais.");

    setBusy(true);
    try {
      if (isEmail) await changeEmail(f.email, f.current);
      else await changePassword(f.current, f.next);
      onClose(isEmail ? "E-mail atualizado" : "Senha atualizada");
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  return (
    <IonModal isOpen onDidDismiss={() => onClose()}>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start"><IonButton onClick={() => onClose()}>Cancelar</IonButton></IonButtons>
          <IonTitle>{isEmail ? "Alterar e-mail" : "Alterar senha"}</IonTitle>
          <IonButtons slot="end"><IonButton strong disabled={busy} onClick={save}>Salvar</IonButton></IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {isEmail && (
          <IonItem>
            <IonInput label="Novo e-mail" labelPlacement="stacked" type="email" autocomplete="email"
              value={f.email} onIonInput={set("email")} />
          </IonItem>
        )}
        <IonItem>
          <IonInput label="Senha atual" labelPlacement="stacked" type="password"
            autocomplete="current-password" value={f.current} onIonInput={set("current")}>
            <IonInputPasswordToggle slot="end" />
          </IonInput>
        </IonItem>
        {!isEmail && (
          <>
            <IonItem>
              <IonInput label="Nova senha" labelPlacement="stacked" type="password"
                autocomplete="new-password" value={f.next} onIonInput={set("next")}>
                <IonInputPasswordToggle slot="end" />
              </IonInput>
            </IonItem>
            <PasswordRules value={f.next} />
            <IonItem>
              <IonInput label="Confirmar nova senha" labelPlacement="stacked" type="password"
                autocomplete="new-password" value={f.confirm} onIonInput={set("confirm")}>
                <IonInputPasswordToggle slot="end" />
              </IonInput>
            </IonItem>
            <PasswordMatch password={f.next} confirm={f.confirm} />
          </>
        )}
        {error && <p className="form-error" role="alert">{error}</p>}
      </IonContent>
    </IonModal>
  );
}
