import { useState } from "react";
import {
  IonPage, IonContent, IonItem, IonInput, IonInputPasswordToggle,
  IonButton, IonSpinner, useIonRouter,
} from "@ionic/react";
import { useAuth } from "../hooks/useAuth.jsx";
import PasswordRules from "../components/PasswordRules.jsx";
import PasswordMatch from "../components/PasswordMatch.jsx";
import { isStrongPassword } from "../hooks/usePassword.js";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Register() {
  const { register } = useAuth();
  const router = useIonRouter();
  const empty = { name: "", email: "", password: "", confirm: "" };
  const [form, setForm] = useState(empty);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (field) => (e) => setForm({ ...form, [field]: e.detail.value ?? "" });

  function validate() {
    if (!form.name.trim()) return "Informe seu nome.";
    if (!emailRegex.test(form.email.trim())) return "Informe um e-mail válido.";
    if (!isStrongPassword(form.password)) return "A senha não atende a todos os requisitos.";
    if (form.password !== form.confirm) return "As senhas não são iguais.";
    return "";
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const problem = validate();
    if (problem) {
      setError(problem);
      return;
    }

    setError("");
    setLoading(true);
    try {
      await register(form);
      // cadastro feito: limpa o formulário e volta para o login, que mostra a confirmação
      setForm(empty);
      setLoading(false);
      router.push("/login", "back", "replace");
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <IonPage>
      <IonContent>
        <form className="auth-wrap" onSubmit={handleSubmit} noValidate>
          <h1>Criar cadastro</h1>
          <p className="auth-sub">Leva menos de um minuto.</p>

          <IonItem>
            <IonInput label="Nome" labelPlacement="stacked" autocomplete="name"
              value={form.name} onIonInput={set("name")} />
          </IonItem>

          <IonItem>
            <IonInput label="E-mail" labelPlacement="stacked" type="email" autocomplete="email"
              value={form.email} onIonInput={set("email")} />
          </IonItem>

          <IonItem>
            <IonInput label="Senha" labelPlacement="stacked" type="password"
              autocomplete="new-password" value={form.password} onIonInput={set("password")}>
              <IonInputPasswordToggle slot="end" />
            </IonInput>
          </IonItem>

          <PasswordRules value={form.password} />

          <IonItem>
            <IonInput label="Confirmar senha" labelPlacement="stacked" type="password"
              autocomplete="new-password" value={form.confirm} onIonInput={set("confirm")}>
              <IonInputPasswordToggle slot="end" />
            </IonInput>
          </IonItem>
          <PasswordMatch password={form.password} confirm={form.confirm} />

          {error && <p className="form-error" role="alert">{error}</p>}

          <IonButton expand="block" type="submit" disabled={loading} className="auth-btn">
            {loading ? <IonSpinner name="dots" /> : "Criar conta"}
          </IonButton>

          <IonButton expand="block" fill="clear" routerLink="/login" routerDirection="back">
            Já tenho conta. Entrar
          </IonButton>
        </form>
      </IonContent>
    </IonPage>
  );
}
