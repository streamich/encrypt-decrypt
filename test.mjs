import {encrypt, decrypt} from './index.js';

const plaintext = 'Hello, World!';
const password = 'password';

const encrypted = await encrypt(plaintext, password);
console.log(encrypted);

const decrypted = await decrypt(encrypted, password);
console.log(decrypted);

if (decrypted !== plaintext) throw new Error('Decoding failed.');
