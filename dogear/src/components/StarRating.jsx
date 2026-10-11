export default function StarRating({ value = 0, onChange }) {
  const readOnly = !onChange;
  return (
    <div className="stars" role={readOnly ? "img" : "radiogroup"} aria-label={`Nota ${value} de 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={readOnly}
          className={n <= value ? "star-btn on" : "star-btn"}
          aria-label={`${n} ${n === 1 ? "estrela" : "estrelas"}`}
          onClick={() => onChange(n === value ? 0 : n)}
        >
          ★
        </button>
      ))}
    </div>
  );
}
