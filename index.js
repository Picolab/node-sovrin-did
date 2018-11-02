var nacl = require('tweetnacl')
var bs58 = require('bs58')

var fromSeed = function (seed) {
  var x = nacl.sign.keyPair.fromSeed(seed)
  var secretKey = x.secretKey.subarray(0, 32)
  var signKey = bs58.encode(Buffer.from(secretKey))
  var keyPair = nacl.box.keyPair.fromSecretKey(secretKey)

  return {

    did: bs58.encode(Buffer.from(x.publicKey.subarray(0, 16))),
    verifyKey: bs58.encode(Buffer.from(x.publicKey)),
    encryptionPublicKey: bs58.encode(Buffer.from(keyPair.publicKey)),

    secret: {
      seed: Buffer.from(seed).toString('hex'),
      signKey: signKey,
      encryptionPrivateKey: bs58.encode(Buffer.from(keyPair.secretKey))
    }
  }
}

var verifySignedMessage = function (signedMessage, verifyKey) {
  var decodedKey = bs58.decode(verifyKey)
  var signed = nacl.sign.open(signedMessage, decodedKey)
  return signed !== null ? Buffer.from(signed).toString('utf8') : false
}

var signMessage = function (message, signKey, verifyKey) {
  verifyKey = bs58.decode(verifyKey)
  signKey = bs58.decode(signKey)
  var fullSignKey = Buffer.concat([signKey, verifyKey])
  var arrayMessage = Buffer.from(message, 'utf8')
  return nacl.sign(arrayMessage, fullSignKey)
}

function getArrayFromKey (key) {
  return Uint8Array.from(bs58.decode(key))
}

var getNonce = function () {
  return nacl.randomBytes(nacl.box.nonceLength)
}

var getKeyPairFromSignKey = function (signKey) {
  return nacl.box.keyPair.fromSecretKey(getArrayFromKey(signKey))
}

var getSharedSecret = function (theirVerifyKey, mySigningKey) {
  theirVerifyKey = typeof theirVerifyKey === 'string' ? bs58.decode(theirVerifyKey) : theirVerifyKey
  mySigningKey = typeof mySigningKey === 'string' ? bs58.decode(mySigningKey) : mySigningKey
  return nacl.box.before(theirVerifyKey, mySigningKey)
}

var decryptMessage = function (encryptedMessage, nonce, sharedSecret) {
  var verifiedEncrypTion = nacl.box.open.after(encryptedMessage, nonce, sharedSecret)
  return verifiedEncrypTion !== null ? Buffer.from(verifiedEncrypTion).toString('utf8') : false
}

var encryptMessage = function (message, nonce, sharedSecret) {
  return nacl.box.after(Buffer.from(message, 'utf8'), nonce, sharedSecret)
}

module.exports = {
  gen: function () {
    var seed = nacl.randomBytes(nacl.sign.seedLength)
    return fromSeed(seed)
  },
  fromSeed: fromSeed,
  signMessage: signMessage,
  verifySignedMessage: verifySignedMessage,
  getKeyPairFromSignKey: getKeyPairFromSignKey,
  getSharedSecret: getSharedSecret,
  decryptMessage: decryptMessage,
  encryptMessage: encryptMessage,
  getNonce: getNonce
}
