const toHex = (buf) =>
  [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");

export const randomSalt = () => toHex(crypto.getRandomValues(new Uint8Array(16)));

export async function hashPassword(password, salt) {
  const data = new TextEncoder().encode(salt + password);
  return toHex(await crypto.subtle.digest("SHA-256", data));
}
