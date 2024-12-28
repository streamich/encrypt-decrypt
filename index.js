const s2b = (str) => new TextEncoder().encode(str);
const b2s = (bytes) => new TextDecoder().decode(bytes);
const bytesToBase64 = (arr) => btoa(Array.from(arr, (b) => String.fromCharCode(b)).join(""));
const base64ToBytes = (base64) => Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));

export const getKey = async (password, salt) => {
  const bytes = s2b(password);
  const initialKey = await crypto.subtle.importKey("raw", bytes, {name: "PBKDF2"}, false, ["deriveKey"]);
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" },
    initialKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
};

export const encryptBinary = async (bytes, password) => {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await getKey(password, salt);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const cipherBuffer = await crypto.subtle.encrypt({name: "AES-GCM", iv}, key, bytes);
  const cipher = new Uint8Array(cipherBuffer);
  const fullCipher = new Uint8Array(28 + cipher.byteLength);
  fullCipher.set(salt);
  fullCipher.set(iv, 16);
  fullCipher.set(cipher, 28);
  return fullCipher;
};

export const decryptBinary = async (bytes, password) => {
  const key = await getKey(password, bytes.slice(0, 16));
  const buffer = await crypto.subtle.decrypt({name: "AES-GCM", iv: bytes.slice(16, 28)}, key, bytes.slice(28));
  return new Uint8Array(buffer);
};

export const encrypt = async (plaintext, password) => {
  const bytes = s2b(plaintext);
  const cipher = await encryptBinary(bytes, password);
  const ciphertext = bytesToBase64(cipher);
  const decrypted = await decrypt(ciphertext, password);
  if (decrypted !== plaintext) throw new Error('Test decoding failed.');
  return ciphertext;
};

export const decrypt = async (ciphertext, password) => {
  const bytes = base64ToBytes(ciphertext);
  const decrypted = await decryptBinary(bytes, password);
  return b2s(decrypted);
};
