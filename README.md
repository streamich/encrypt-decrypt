# Plain text encryption and decryption

A very simple module which provides robust implementation for plain text
encryption and decryption using a password. Works in Browser and Node.js.


## Usage

Browser:

```html
<script type="module">
  import { encrypt, decrypt } from "//esm.sh/encrypt-decrypt-text";

  const text = 'ho-ho-ho';
  const cipher = await encrypt(text, 'santa');
  const plaintext = await decrypt(cipher, 'santa');
  
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
