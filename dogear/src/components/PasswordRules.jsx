import { IonIcon } from "@ionic/react";
import { checkmarkCircle, ellipseOutline } from "ionicons/icons";
import { passwordRules } from "../hooks/usePassword.js";

export default function PasswordRules({ value }) {
  return (
    <ul className="rules" aria-label="Requisitos da senha">
      {passwordRules(value).map((r) => (
        <li key={r.label} className={r.ok ? "ok" : ""}>
          <IonIcon icon={r.ok ? checkmarkCircle : ellipseOutline} />
          <span>{r.label}</span>
        </li>
      ))}
    </ul>
  );
}
