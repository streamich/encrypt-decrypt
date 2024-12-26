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
  const contentBytes = stringToBytes(plaintext);
  const cipher = new Uint8Array(await crypto.subtle.encrypt({name: "AES-GCM", iv}, key, contentBytes));
  const line = `${bytesToBase64(salt)}:${bytesToBase64(iv)}:${bytesToBase64(cipher)}`;
  const decrypted = await decrypt(line, password);
  if (decrypted !== plaintext) throw new Error('Test decoding failed.');
  return line;
};

export const decrypt = async (line, password) => {
  const split = line.split(':');
  const encryptedData = {salt: split[0], iv: split[1], cipher: split[2]};
  const salt = base64ToBytes(encryptedData.salt);
  const key = await getKey(password, salt);
  const iv = base64ToBytes(encryptedData.iv);
  const cipher = base64ToBytes(encryptedData.cipher);
  const contentBytes = new Uint8Array(await crypto.subtle.decrypt({name: "AES-GCM", iv}, key, cipher));
  return bytesToString(contentBytes);
};
