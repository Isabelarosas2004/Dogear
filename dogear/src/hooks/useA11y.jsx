import { createContext, useContext, useEffect } from "react";
import useLocalStorage from "./useLocalStorage.js";

export const FONTS = [
  { id: "padrao", label: "Padrão", family: "" },
  { id: "legivel", label: "Alta legibilidade", family: "Verdana, Geneva, sans-serif" },
  { id: "serif", label: "Serifada", family: "Georgia, 'Times New Roman', serif" },
  { id: "redonda", label: "Arredondada", family: "'Comic Sans MS', 'Comic Neue', 'Chalkboard SE', cursive" },
];
export const SIZES = [
  { value: 90, label: "Pequena" }, { value: 100, label: "Normal" },
  { value: 115, label: "Grande" }, { value: 130, label: "Muito grande" },
];
export const THEMES = [
  { id: "auto", label: "Automático" }, { id: "light", label: "Claro" }, { id: "dark", label: "Escuro" },
];
export const ACCENTS = [
  { id: "petroleo", label: "Azul petróleo", light: "#1f5f7a", dark: "#2b7a9c" },
  { id: "verde", label: "Verde", light: "#2e6b4f", dark: "#357c5b" },
  { id: "roxo", label: "Roxo", light: "#5b4b8a", dark: "#6a5aa0" },
  { id: "vinho", label: "Vinho", light: "#8a3b4e", dark: "#a04a5f" },
  { id: "grafite", label: "Grafite", light: "#3b4a54", dark: "#4a5c69" },
  { id: "laranja", label: "Laranja", light: "#b5541c", dark: "#b5541c" },
];
export const DEFAULTS = { font: "padrao", size: 100, theme: "auto", accent: "petroleo" };

const rgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
const mix = (hex, to, amt) => {
  const a = rgb(hex), b = rgb(to);
  return "#" + a.map((v, i) => Math.round(v + (b[i] - v) * amt).toString(16).padStart(2, "0")).join("");
};

const A11yContext = createContext(null);

export function A11yProvider({ children }) {
  const [saved, setSaved] = useLocalStorage("dogear:a11y", DEFAULTS);
  const settings = { ...DEFAULTS, ...saved };

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => {
      const dark = settings.theme === "dark" || (settings.theme === "auto" && mq.matches);
      const root = document.documentElement;
      const st = root.style;
      const c = ACCENTS.find((x) => x.id === settings.accent) || ACCENTS[0];
      const hex = dark ? c.dark : c.light;

      root.classList.toggle("ion-palette-dark", dark);
      st.setProperty("--ion-color-primary", hex);
      st.setProperty("--ion-color-primary-rgb", rgb(hex).join(", "));
      st.setProperty("--ion-color-primary-contrast", "#ffffff");
      st.setProperty("--ion-color-primary-shade", mix(hex, "#000000", 0.12));
      st.setProperty("--ion-color-primary-tint", mix(hex, "#ffffff", 0.1));
      st.setProperty("--ion-background-color", dark ? "#10191d" : "#eef2f3");
      if (dark) st.setProperty("--ion-item-background", "#18262c");
      else st.removeProperty("--ion-item-background");

      st.fontSize = `${settings.size}%`;
      const f = FONTS.find((x) => x.id === settings.font);
      if (f && f.family) st.setProperty("--ion-font-family", f.family);
      else st.removeProperty("--ion-font-family");
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [settings.theme, settings.accent, settings.size, settings.font]);

  const set = (changes) => setSaved({ ...settings, ...changes });
  const reset = () => setSaved(DEFAULTS);

  return <A11yContext.Provider value={{ settings, set, reset }}>{children}</A11yContext.Provider>;
}

export const useA11y = () => useContext(A11yContext);
