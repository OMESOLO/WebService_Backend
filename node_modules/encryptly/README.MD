

# Encryptly - Simple and Secure Encryption and Decryption Library

Encryptly is a lightweight JavaScript library that provides easy-to-use functions for encrypting and decrypting data securely using XOR encryption. It offers a simple and effective way to protect sensitive information, making it an excellent choice for various applications.

## Installation

You can install the `encryptly` package using npm:

```bash
npm install encryptly
```

## Usage

To use Encryptly in your project, you need to require it as follows:

```javascript
const encryptly = require('encryptly');
```

### Encrypting and Decrypting

Encryptly offers two main functions, `encrypt` and `decrypt`, to encrypt and decrypt data using XOR encryption.

```javascript
const encryptly = require('encryptly');
const ENCRYPTION_KEY = 'your_secret_key_here'; // Replace with your secret key

const originalData = 'Secret word here!';
const encryptedData = encryptly.encrypt(originalData, ENCRYPTION_KEY);
const decryptedData = encryptly.decrypt(encryptedData, ENCRYPTION_KEY);

console.log('Original Data:', originalData);
console.log('Encrypted Data:', encryptedData);
console.log('Decrypted Data:', decryptedData);
```

### Hex to ASCII and ASCII to Hex Conversion

Encryptly also provides two additional functions, `hex2ascii` and `ascii2hex`, to convert data between Hex and ASCII representations.

```javascript
const hexString = '48656c6c6f2c2074686973206973206120736563726574206d65737361676521';
const asciiString = 'Secret word here!';

const convertedToAscii = encryptly.hex2ascii(hexString);
const convertedToHex = encryptly.ascii2hex(asciiString);

console.log('Hex to ASCII:', convertedToAscii);
console.log('ASCII to Hex:', convertedToHex);
```
## Test

```bash
npm test 
```
## License

This project is licensed under the [MIT License](LICENSE).

