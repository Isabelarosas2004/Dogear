import { useEffect, useState } from "react";
import Splash from "./components/Splash.jsx";
import { A11yProvider } from "./hooks/useA11y.jsx";
import {
  IonApp, IonRouterOutlet, IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Redirect, Route } from "react-router-dom";
import { homeOutline, searchOutline, heartOutline, personOutline } from "ionicons/icons";
import { AuthProvider, useAuth } from "./hooks/useAuth.jsx";
import { BooksProvider } from "./hooks/useLibrary.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Inicio from "./pages/Inicio.jsx";
import Biblioteca from "./pages/Biblioteca.jsx";
import Favoritos from "./pages/Favoritos.jsx";
import Detalhe from "./pages/Detalhe.jsx";
import Perfil from "./pages/Perfil.jsx";

function Tabs() {
  return (
    <BooksProvider>
      <IonTabs>
        <IonRouterOutlet>
          <Route exact path="/app/inicio" component={Inicio} />
          <Route exact path="/app/biblioteca" component={Biblioteca} />
          <Route exact path="/app/favoritos" component={Favoritos} />
          <Route exact path="/app/perfil" component={Perfil} />
          <Route exact path="/app/livro/:id" component={Detalhe} />
          <Route exact path="/app"><Redirect to="/app/inicio" /></Route>
        </IonRouterOutlet>

        <IonTabBar slot="bottom">
          <IonTabButton tab="inicio" href="/app/inicio">
            <IonIcon icon={homeOutline} /><IonLabel>Início</IonLabel>
          </IonTabButton>
          <IonTabButton tab="biblioteca" href="/app/biblioteca">
            <IonIcon icon={searchOutline} /><IonLabel>Explorar</IonLabel>
          </IonTabButton>
          <IonTabButton tab="favoritos" href="/app/favoritos">
            <IonIcon icon={heartOutline} /><IonLabel>Favoritos</IonLabel>
          </IonTabButton>
          <IonTabButton tab="perfil" href="/app/perfil">
            <IonIcon icon={personOutline} /><IonLabel>Perfil</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </BooksProvider>
  );
}

function Routes() {
  const { user } = useAuth();

  return (
    <IonReactRouter>
      <IonRouterOutlet>
        <Route exact path="/login" render={() => (user ? <Redirect to="/app" /> : <Login />)} />
        <Route exact path="/cadastro" render={() => (user ? <Redirect to="/app" /> : <Register />)} />
        <Route path="/app" render={() => (user ? <Tabs key={user.id} /> : <Redirect to="/login" />)} />
        <Route exact path="/" render={() => <Redirect to="/app" />} />
      </IonRouterOutlet>
    </IonReactRouter>
  );
}

export default function App() {
  const [splash, setSplash] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setSplash(false), 2400);
    return () => clearTimeout(t);
  }, []);

  return (
    <A11yProvider>
      <IonApp>
        <AuthProvider>{splash ? <Splash /> : <Routes />}</AuthProvider>
      </IonApp>
    </A11yProvider>
  );
}
