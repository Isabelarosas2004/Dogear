import { useEffect, useState } from "react";
import {
  IonPage, IonContent, IonItem, IonInput, IonInputPasswordToggle,
  IonButton, IonSpinner,
} from "@ionic/react";
import { useAuth } from "../hooks/useAuth.jsx";

export default function Login() {
  const { login, notice, clearNotice } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // depois do cadastro: preenche o e-mail criado e limpa a senha
  useEffect(() => {
    if (notice) {
      setEmail(notice.email);
      setPassword("");
      setError("");
    }
  }, [notice]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Preencha e-mail e senha.");
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <IonPage>
      <IonContent>
        <form className="auth-wrap" onSubmit={handleSubmit} noValidate>
          <h1>Dogear</h1>
          <p className="auth-sub">Seu diário de leituras: registre, avalie e favorite.</p>

          {notice && !error && (
            <p className="form-ok" role="status">
              Cadastro realizado com sucesso! Agora faça login para entrar.
            </p>
          )}

          <IonItem>
            <IonInput
              label="E-mail" labelPlacement="stacked" type="email"
              autocomplete="email" value={email}
              onIonInput={(e) => setEmail(e.detail.value ?? "")}
            />
          </IonItem>

          <IonItem>
            <IonInput
              label="Senha" labelPlacement="stacked" type="password"
              autocomplete="current-password" value={password}
              onIonInput={(e) => setPassword(e.detail.value ?? "")}
            >
              <IonInputPasswordToggle slot="end" />
            </IonInput>
          </IonItem>

          {error && <p className="form-error" role="alert">{error}</p>}

          <IonButton expand="block" type="submit" disabled={loading} className="auth-btn">
            {loading ? <IonSpinner name="dots" /> : "Entrar"}
          </IonButton>

          <IonButton expand="block" fill="clear" routerLink="/cadastro" routerDirection="forward"
            onClick={clearNotice}>
            Não tenho conta. Criar cadastro
          </IonButton>
        </form>
      </IonContent>
    </IonPage>
  );
}
