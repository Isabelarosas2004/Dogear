import { IonIcon } from "@ionic/react";
import { checkmarkCircle, closeCircle } from "ionicons/icons";

// Mostra, enquanto a pessoa digita, se a confirmação é igual à senha.
export default function PasswordMatch({ password, confirm }) {
  if (!confirm) return null;
  const same = password === confirm;

  return (
    <p className={`match ${same ? "ok" : "bad"}`} role="status" aria-live="polite">
      <IonIcon icon={same ? checkmarkCircle : closeCircle} />
      {same ? "As senhas são iguais" : "As senhas não são iguais"}
    </p>
  );
}
