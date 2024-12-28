const bytesToString = (bytes) => new TextDecoder().decode(bytes);
const stringToBytes = (str) => new TextEncoder().encode(str);
const bytesToBase64 = (arr) => btoa(Array.from(arr, (b) => String.fromCharCode(b)).join(""));
const base64ToBytes = (base64) => Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));

export const getKey = async (password, salt) => {
  const bytes = stringToBytes(password);
  const initialKey = await crypto.subtle.importKey("raw", bytes, {name: "PBKDF2"}, false, ["deriveKey"]);
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" },
    initialKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
};

export const encrypt = async (plaintext, password) => {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await getKey(password, salt);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const bytes = stringToBytes(plaintext);
  const cipherBuffer = await crypto.subtle.encrypt({name: "AES-GCM", iv}, key, bytes);
  const cipher = new Uint8Array(cipherBuffer);
  const fullCipher = new Uint8Array(28 + cipher.byteLength);
  fullCipher.set(salt);
  fullCipher.set(iv, 16);
  fullCipher.set(cipher, 28);
  const line = bytesToBase64(fullCipher);
  const decrypted = await decrypt(line, password);
  if (decrypted !== plaintext) throw new Error('Test decoding failed.');
  return line;
};

export const decrypt = async (line, password) => {
  const fullCipher = base64ToBytes(line);
  const salt = fullCipher.slice(0, 16);
  const iv = fullCipher.slice(16, 28);
  const cipher = fullCipher.slice(28);
  const key = await getKey(password, salt);
  const contentBytes = new Uint8Array(await crypto.subtle.decrypt({name: "AES-GCM", iv}, key, cipher));
  return bytesToString(contentBytes);
};
