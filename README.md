# Plain text encryption and decryption

A very simple module which provides robust implementation for plain text
encryption and decryption using a password. Works in Browser and Node.js.

- Generates random password salt and IV (Initialization Vector) for each encryption
  and stores them in the resulting cipher prepended as a header.
- Uses `AES-GCM` algorithms from the `WebCrypto` API in the Browser and `crypto` module in Node.js.
- To generate a key from a password, uses `PBKDF2` algorithm with `SHA-256` hash function.
  A random salt is generated for each key derivation and then `SHA-256` hash is
  iterated 100,000 times.


## Usage

Browser ([JsDlivr CDN](https://cdn.jsdelivr.net/npm/encrypt-decrypt-text/index.js), [ESM.sh CDN](https://esm.sh/encrypt-decrypt-text@1.1.0)):

```html
<script type="module">
  import { encrypt, decrypt } from "//cdn.jsdelivr.net/npm/encrypt-decrypt-text";

  const text = 'ho-ho-ho';
  const password = 'santa';
  const cipher = await encrypt(text, password);
  const plaintext = await decrypt(cipher, password);
  
  document.body.innerHTML = `
    <pre>
      <code>
        Encrypted: ${cipher}
        Decrypted: ${plaintext}
      </code>
    </pre>`;
</script>
```

With NPM:

```javascript
import { encrypt, decrypt } from 'encrypt-decrypt-text';

const encrypted = await encrypt('Hello World', 'password');
const decrypted = await decrypt(encrypted, 'password');
```

Also supports binary data as `Uint8Array`:

```javascript
import { encryptBinary, decryptBinary } from 'encrypt-decrypt-text';

const plaintext = new Uint8Array([1, 2, 3, 4, 5]);
const encrypted = await encryptBinary(plaintext, 'password');
const decrypted = await decryptBinary(encrypted, 'password');
```
