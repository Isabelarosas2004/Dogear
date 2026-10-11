export const passwordRules = (pw = "") => [
  { label: "Mínimo de 6 caracteres", ok: pw.length >= 6 },
  { label: "Pelo menos uma letra maiúscula", ok: /\p{Lu}/u.test(pw) },
  { label: "Pelo menos um número", ok: /\d/.test(pw) },
];

export const isStrongPassword = (pw) => passwordRules(pw).every((r) => r.ok);
