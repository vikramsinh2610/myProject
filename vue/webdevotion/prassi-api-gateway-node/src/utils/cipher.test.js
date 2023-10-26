const { encrypt, decrypt, ALGORITHMS } = require('./cipher');

describe('Cipher', () => {
  const text = 'pippo';
  const password = 'topolino';

  test('should encrypt a string', () => {
    const crypted = encrypt(text, password, ALGORITHMS.AES_256);
    expect(crypted).toMatchSnapshot();
  });

  test('should decrypt a string', () => {
    const crypted = encrypt(text, password, ALGORITHMS.AES_256);
    const decrypted = decrypt(crypted, password, ALGORITHMS.AES_256);
    expect(decrypted).toEqual('pippo');
  });
});
