import { useLibrary, fmt } from "../hooks/useLibrary.jsx";

export default function Stats() {
  const { summary } = useLibrary();
  const { read, avgMine, reviews } = summary();

  return (
    <section className="stats" aria-label="Resumo">
      <div><strong>{read}</strong><span>livros lidos</span></div>
      <div><strong>{avgMine ? fmt(avgMine) : "–"}</strong><span>sua nota média</span></div>
      <div><strong>{reviews}</strong><span>avaliações escritas</span></div>
    </section>
  );
}
