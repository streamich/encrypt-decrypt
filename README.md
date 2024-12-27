# Plain text encryption and decryption

A very simple module which provides robust implementation for plain text
encryption and decryption using a password. Works in Browser and Node.js.


## Usage

Browser ([JsDlivr CDN](https://cdn.jsdelivr.net/npm/encrypt-decrypt-text/index.js), [ESM.sh CDN](https://esm.sh/encrypt-decrypt-text@1.1.0)):

```html
<script type="module">
  import { encrypt, decrypt } from "//esm.sh/encrypt-decrypt-text";

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
