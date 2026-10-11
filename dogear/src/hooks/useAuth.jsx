import { createContext, useContext, useEffect, useState } from "react";
import { hashPassword, randomSalt } from "./crypto.js";
import { demoMine } from "../data/catalog.js";

const USERS_KEY = "dogear:users";
const SESSION_KEY = "dogear:session";
export const DEMO = { email: "demo@dogear.com", password: "123456" };

const AuthContext = createContext(null);

function readUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  } catch {
    return [];
  }
}

const publicUser = (u) => ({ id: u.id, name: u.name, email: u.email });
const seedFor = (id) =>
  localStorage.setItem(`dogear:mine:${id}`, JSON.stringify(demoMine));

let demoPromise;
async function ensureDemo() {
  const users = readUsers();
  if (users.some((u) => u.email === DEMO.email)) return;
  const salt = randomSalt();
  const demo = {
    id: "demo", name: "Leitora Demo", email: DEMO.email,
    salt, hash: await hashPassword(DEMO.password, salt),
  };
  localStorage.setItem(USERS_KEY, JSON.stringify([...readUsers(), demo]));
  seedFor(demo.id);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const id = localStorage.getItem(SESSION_KEY);
    const found = readUsers().find((u) => u.id === id);
    return found ? publicUser(found) : null;
  });
  // aviso mostrado na tela de login depois de um cadastro concluído: { email }
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    demoPromise ??= ensureDemo();
  }, []);

  function startSession(u) {
    localStorage.setItem(SESSION_KEY, u.id);
    setUser(publicUser(u));
  }

  async function register({ name, email, password }) {
    await demoPromise;
    const users = readUsers();
    const mail = email.trim().toLowerCase();
    if (users.some((u) => u.email === mail)) {
      throw new Error("Este e-mail já existe. Use outro e-mail ou faça login.");
    }
    const salt = randomSalt();
    const newUser = {
      id: crypto.randomUUID(), name: name.trim(), email: mail,
      salt, hash: await hashPassword(password, salt),
    };
    localStorage.setItem(USERS_KEY, JSON.stringify([...users, newUser]));
    // não entra sozinho: a pessoa volta para o login e entra com a conta nova
    setNotice({ email: mail });
  }

  async function login(email, password) {
    await demoPromise;
    const mail = email.trim().toLowerCase();
    const found = readUsers().find((u) => u.email === mail);
    if (!found || (await hashPassword(password, found.salt)) !== found.hash) {
      throw new Error("E-mail ou senha incorretos.");
    }
    setNotice(null);
    startSession(found);
  }

  async function verify(password) {
    const u = readUsers().find((x) => x.id === user.id);
    if (!u || (await hashPassword(password, u.salt)) !== u.hash) {
      throw new Error("Senha atual incorreta.");
    }
    return u;
  }

  async function changeEmail(email, password) {
    const u = await verify(password);
    const mail = email.trim().toLowerCase();
    const users = readUsers();
    if (users.some((x) => x.email === mail && x.id !== u.id)) {
      throw new Error("Este e-mail já está em uso.");
    }
    localStorage.setItem(USERS_KEY, JSON.stringify(users.map((x) => (x.id === u.id ? { ...x, email: mail } : x))));
    setUser({ ...user, email: mail });
  }

  async function changePassword(current, next) {
    const u = await verify(current);
    const salt = randomSalt();
    const hash = await hashPassword(next, salt);
    localStorage.setItem(
      USERS_KEY,
      JSON.stringify(readUsers().map((x) => (x.id === u.id ? { ...x, salt, hash } : x)))
    );
  }

  function logout() {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, register, login, logout, changeEmail, changePassword, notice, clearNotice: () => setNotice(null) }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return ctx;
}
