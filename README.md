# Plain text encryption and decryption

A very simple module which provides robust implementation for plain text
encryption and decryption using a password. Works in Browser and Node.js.


## Usage

```javascript
import { encrypt, decrypt } from 'plain-text-encryption';

const encrypted = await encrypt('Hello World', 'password');
const decrypted = await decrypt(encrypted, 'password');
```
