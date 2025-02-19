/**
 * Performs XOR encryption and decryption.
 * @param {string | Buffer} input - The input data to be encrypted or decrypted.
 * @param {string} key - The encryption/decryption key.
 * @returns {Buffer} - The encrypted or decrypted data as a Buffer.
 */
function xorEncryptDecrypt(input, key) {
  const inputBuffer = Buffer.from(input, 'utf8');
  const keyBuffer = Buffer.from(key, 'utf8');
  const resultBuffer = Buffer.alloc(inputBuffer.length);

  for (let i = 0; i < inputBuffer.length; i++) {
    resultBuffer[i] = inputBuffer[i] ^ keyBuffer[i % keyBuffer.length];
  }

  return resultBuffer;
}

/**
 * Encrypts a plaintext message using the given key.
 * @param {string} text - The plaintext message to be encrypted.
 * @param {string} key - The encryption key.
 * @returns {string} - The encrypted data in Hex format.
 */
function encrypt(text, key) {
  const encryptedBuffer = xorEncryptDecrypt(text, key);
  return encryptedBuffer.toString('hex');
}

/**
 * Decrypts an encrypted message using the given key.
 * @param {string} encrypted - The encrypted data in Hex format.
 * @param {string} key - The decryption key.
 * @returns {string} - The decrypted plaintext message.
 */
function decrypt(encrypted, key) {
  const encryptedBuffer = Buffer.from(encrypted, 'hex');
  const decryptedBuffer = xorEncryptDecrypt(encryptedBuffer, key);
  return decryptedBuffer.toString('utf8');
}

/**
 * Converts a Hex string to its corresponding ASCII representation.
 * @param {string} hexString - The Hex string to be converted.
 * @returns {string} - The ASCII representation of the Hex string.
 */
function hex2ascii(hexString) {
  const hexBuffer = Buffer.from(hexString, 'hex');
  return hexBuffer.toString('ascii');
}

/**
 * Converts an ASCII string to its corresponding Hex representation.
 * @param {string} asciiString - The ASCII string to be converted.
 * @returns {string} - The Hex representation of the ASCII string.
 */
function ascii2hex(asciiString) {
  const asciiBuffer = Buffer.from(asciiString, 'ascii');
  return asciiBuffer.toString('hex');
}

module.exports = {
  encrypt,
  decrypt,
  hex2ascii,
  ascii2hex,
};
