const { encrypt, decrypt, hex2ascii, ascii2hex } = require('../index.js');

// Test cases for encrypt and decrypt functions
describe('Encryption Module', () => {
  const encryptionKey = 'my_secret_key';

  it('should correctly encrypt and decrypt the data', () => {
    const originalData = 'Hello, this is a secret message!';
    const encryptedData = encrypt(originalData, encryptionKey);
    const decryptedData = decrypt(encryptedData, encryptionKey);
    
    expect(decryptedData).toBe(originalData);
  });

  it('should correctly encrypt and decrypt the data with different keys', () => {
    const originalData = 'Hello, this is another secret message!';
    const encryptionKey1 = 'key1';
    const encryptionKey2 = 'key2';

    const encryptedData1 = encrypt(originalData, encryptionKey1);
    const encryptedData2 = encrypt(originalData, encryptionKey2);
    const decryptedData1 = decrypt(encryptedData1, encryptionKey1);
    const decryptedData2 = decrypt(encryptedData2, encryptionKey2);

    expect(decryptedData1).toBe(originalData);
    expect(decryptedData2).toBe(originalData);
  });
});

// Test cases for hex2ascii and ascii2hex functions
describe('Conversion functions', () => {
  it('should correctly convert hex to ascii', () => {
    const hexString = '48656c6c6f2c2074686973206973206120736563726574206d65737361676521';
    const asciiString = 'Hello, this is a secret message!';
    expect(hex2ascii(hexString)).toBe(asciiString);
  });

  it('should correctly convert ascii to hex', () => {
    const hexString = '48656c6c6f2c2074686973206973206120736563726574206d65737361676521';
    const asciiString = 'Hello, this is a secret message!';
    expect(ascii2hex(asciiString)).toBe(hexString);
  });
});
