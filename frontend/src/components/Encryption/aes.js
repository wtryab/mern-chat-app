var aes256 = require('aes256');

var key = 'SHDAJHDASHD2139131OIWDALKSHDKSAHD';

const DoEncrypt = (plaintext) => {
    return aes256.encrypt(key, plaintext);
}
const DoDecrypt = (ciphertext) => {
    return aes256.decrypt(key, ciphertext);
}

module.exports = {
    DoEncrypt
}

/*const Encryption = (plaintext) => {
    const alpha = 'abcdefghijklmnopqrstuvwxyzabcdefghijklmABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLM';
    return plaintext.replace(/[a-z]/gi, letter => alpha[alpha.indexOf(letter) + 13]);
}
const Decryption = (ciphertext) => {
    const alpha = 'abcdefghijklmnopqrstuvwxyzabcdefghijklmABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLM';
    return ciphertext.replace(/[a-z]/gi, letter => alpha[alpha.indexOf(letter) - 13]);
}

module.exports = {
    Decryption,
    Encryption
}*/