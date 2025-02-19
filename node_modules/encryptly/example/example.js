const encryptly = require('../index.js');

const ENCRYPTION_KEY = 'your_secret_key_here';

// Replace with your secret key

// Example 1: Encrypt and Decrypt data
const originalData = 'Encryptly - encrypt and Decrypt.';
const encryptedData = encryptly.encrypt(originalData, ENCRYPTION_KEY);
const decryptedData = encryptly.decrypt(encryptedData, ENCRYPTION_KEY);

console.log('Original Data:', originalData, '\n');
console.log('Encrypted Data:', encryptedData, '\n');
console.log('Decrypted Data:', decryptedData, '\n');

// Example 2: Convert between Hex and ASCII
const hexString = '53656372657420776f7264206865726521';
const asciiString = 'Secret word here!';

const convertedToAscii = encryptly.hex2ascii(hexString);
const convertedToHex = encryptly.ascii2hex(asciiString);

console.log('Hex to ASCII:', convertedToAscii, '\n');
console.log('ASCII to Hex:', convertedToHex, '\n');
