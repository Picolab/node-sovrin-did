var test = require('tape')
var nacl = require('tweetnacl')
var sovrinDID = require('./')

test('sovrinDID.fromSeed(seed)', function (t) {
  var tst = function (seedHex, expected) {
    var seed = Buffer.from(seedHex, 'hex')
    var r = sovrinDID.fromSeed(seed)
    t.deepEquals(r, expected)
  }

  tst('3b75434f4fb431bfcdd1d7f3e0544fde12e5bb7d19b36a7f6cffe1a0bf1fd8ff', {

    did: 'jbJWZXeXSsD5o1iWhYGFc',
    verifyKey: 'QDQ7Y69yg6eeJNstq62rXw8mK8HmnnsocPwvo9DU2tS',
    encryptionPublicKey: 'C2CLejK2c3SC9Rz4JLFuNtWJM8WDRq2CEMJuRqaJvr35',

    secret: {
      seed: '3b75434f4fb431bfcdd1d7f3e0544fde12e5bb7d19b36a7f6cffe1a0bf1fd8ff',
      signKey: '516mChDX1BRjwHJc2w838W8cXxy8a6Eb35HKXjPR2fD8',
      encryptionPrivateKey: '516mChDX1BRjwHJc2w838W8cXxy8a6Eb35HKXjPR2fD8'
    }
  })

  tst('5d40a10e4723a41216f98a3cc4c1082a4fa51a0ffa6196960ad931efe654dd2e', {

    did: 'E7cwAzuB9kSU3mj2n9p97P',
    verifyKey: '89ZgeKmTktxWg9UrGFzL2PbcHrToKNMPpLQtjbh17pfT',
    encryptionPublicKey: '5UAXeov4Gi7ioSTLDoMPtdvqX6RRmJcQAWagVgdaxUej',

    secret: {
      seed: '5d40a10e4723a41216f98a3cc4c1082a4fa51a0ffa6196960ad931efe654dd2e',
      signKey: '7H25Jfb2ND51hhaomL5FPhhqQvBGujd1jJeSjZZ8HQzR',
      encryptionPrivateKey: '7H25Jfb2ND51hhaomL5FPhhqQvBGujd1jJeSjZZ8HQzR'
    }
  })

  tst('7cb46171cd7a9bf9440e9c74c0752b37ae89b72184bb6693d8dc73752078ea0f', {

    did: 'TvqM6vQHEZb4EDYkfUVVUp',
    verifyKey: 'FgFdznhQTymQEBKNoboDLKDGWB7eezrhvKKQK2uKUSU5',
    encryptionPublicKey: '3mosoLnk91yNrGga3vJtLaFNXf9yi85gSNisMT643HyH',

    secret: {
      seed: '7cb46171cd7a9bf9440e9c74c0752b37ae89b72184bb6693d8dc73752078ea0f',
      signKey: '9Po5sqUto67MYFyfXXgV3PwvXoRxCfEXpSoMKn1eFtcv',
      encryptionPrivateKey: '9Po5sqUto67MYFyfXXgV3PwvXoRxCfEXpSoMKn1eFtcv'
    }
  })

  tst('35604fb84e67d18a76b956d1cbf9ba7384994c3fba1e140ba95928cc98823058', {

    did: 'MAF6ioWmybYvjYU2HD9oBE',
    verifyKey: 'BzH5a2wLEyKxySUALpfBiBjHZtZudCG68J17QwWkRsdN',
    encryptionPublicKey: '7QhcMiFkfZLf6TScAucX2kw3A9561MHMukWUhnsSzba8',

    secret: {
      seed: '35604fb84e67d18a76b956d1cbf9ba7384994c3fba1e140ba95928cc98823058',
      signKey: '4bMnc36WuLYJqsWTZtiazJJrtkvPwgyWnirn7gKk7ium',
      encryptionPrivateKey: '4bMnc36WuLYJqsWTZtiazJJrtkvPwgyWnirn7gKk7ium'
    }
  })

  t.end()
})

test('sovrinDID.gen()', function (t) {
  var g1 = sovrinDID.gen()
  var seed = Buffer.from(g1.secret.seed, 'hex')

  t.deepEquals(sovrinDID.fromSeed(seed), g1, 'gen should just wrap .fromSeed(seed)')

  t.notEquals(g1.secret.seed, sovrinDID.gen().secret.seed)
  t.notEquals(g1.secret.seed, sovrinDID.gen().secret.seed)
  t.notEquals(g1.secret.seed, sovrinDID.gen().secret.seed)

  t.end()
})

test('sovrinDID.signMessage(message, signKey, verifyKey)', function (t) {
  var signKey = '4bMnc36WuLYJqsWTZtiazJJrtkvPwgyWnirn7gKk7ium'
  var verifyKey = 'BzH5a2wLEyKxySUALpfBiBjHZtZudCG68J17QwWkRsdN'
  var message = 'Hello World!!'

  var signedMessage = sovrinDID.signMessage(message, signKey, verifyKey)
  t.notEqual(message, signedMessage)
  t.end()
})

test('sovrinDID.verifySignedMessage(signedMessage, verifyKey)', function (t) {
  var signKey = '4bMnc36WuLYJqsWTZtiazJJrtkvPwgyWnirn7gKk7ium'
  var verifyKey = 'BzH5a2wLEyKxySUALpfBiBjHZtZudCG68J17QwWkRsdN'
  var verifyKey2 = 'QDQ7Y69yg6eeJNstq62rXw8mK8HmnnsocPwvo9DU2tS'
  var signKey2 = '516mChDX1BRjwHJc2w838W8cXxy8a6Eb35HKXjPR2fD8'
  var message = 'Hello World!!'
  var message2 = 'I want to take over the world!!'

  var signedMessage = sovrinDID.signMessage(message, signKey, verifyKey)
  var signedMessage2 = sovrinDID.signMessage(message2, signKey2, verifyKey2)

  t.equal(sovrinDID.verifySignedMessage(signedMessage, verifyKey), message)
  t.equal(sovrinDID.verifySignedMessage(signedMessage, verifyKey2), false)

  t.equal(sovrinDID.verifySignedMessage(signedMessage2, verifyKey2), message2)
  t.equal(sovrinDID.verifySignedMessage(signedMessage2, verifyKey), false)

  t.end()
})

test('sovrinDID.getKeyPairFromSignKey(signKey)', function (t) {
  var signKey = '4bMnc36WuLYJqsWTZtiazJJrtkvPwgyWnirn7gKk7ium'
  var keyPair = sovrinDID.getKeyPairFromSignKey(signKey)

  t.equal(keyPair.publicKey.length, 32)
  t.equal(keyPair.secretKey.length, 32)

  t.end()
})

test('sovrinDID.getSharedSecret(theirVerifyKey, mySigningKey)', function (t) {
  var signKey1 = '4bMnc36WuLYJqsWTZtiazJJrtkvPwgyWnirn7gKk7ium'
  var signKey2 = '516mChDX1BRjwHJc2w838W8cXxy8a6Eb35HKXjPR2fD8'
  var signKey3 = '7H25Jfb2ND51hhaomL5FPhhqQvBGujd1jJeSjZZ8HQzR'

  var keyPair1 = sovrinDID.getKeyPairFromSignKey(signKey1)
  var keyPair2 = sovrinDID.getKeyPairFromSignKey(signKey2)
  var keyPair3 = sovrinDID.getKeyPairFromSignKey(signKey3)

  var sovrin1 = sovrinDID.gen()
  var sovrin2 = sovrinDID.gen()

  // Create shared secrets from the string version of the keys
  var sharedSecret1 = sovrinDID.getSharedSecret(sovrin2.encryptionPublicKey, sovrin1.secret.encryptionPrivateKey)
  var sharedSecret2 = sovrinDID.getSharedSecret(sovrin1.encryptionPublicKey, sovrin2.secret.encryptionPrivateKey)
  t.equal(nacl.verify(sharedSecret1, sharedSecret2), true)

  var sharedSecret1To2 = sovrinDID.getSharedSecret(keyPair2.publicKey, keyPair1.secretKey)
  var sharedSecret2To1 = sovrinDID.getSharedSecret(keyPair1.publicKey, keyPair2.secretKey)
  var sharedSecret3To1 = sovrinDID.getSharedSecret(keyPair3.publicKey, keyPair1.secretKey)

  t.equal(nacl.verify(sharedSecret1To2, sharedSecret2To1), true)
  t.equal(nacl.verify(sharedSecret3To1, sharedSecret2To1), false)

  t.end()
})

test('sovrinDID.encryptMessage(message, nonce, sharedSecret)', function (t) {
  var signKey1 = '4bMnc36WuLYJqsWTZtiazJJrtkvPwgyWnirn7gKk7ium'
  var signKey2 = '516mChDX1BRjwHJc2w838W8cXxy8a6Eb35HKXjPR2fD8'

  var keyPair1 = sovrinDID.getKeyPairFromSignKey(signKey1)
  var keyPair2 = sovrinDID.getKeyPairFromSignKey(signKey2)

  var sharedSecret1To2 = sovrinDID.getSharedSecret(keyPair2.publicKey, keyPair1.secretKey)

  var message = 'Hello World!!'
  var nonce = sovrinDID.getNonce()
  var encryptedMessage = sovrinDID.encryptMessage(message, nonce, sharedSecret1To2)

  t.notEqual(message, encryptedMessage)

  t.end()
})

test('sovrinDID.decryptMessage(theirVerifyKey, mySigningKey', function (t) {
  var signKey1 = '4bMnc36WuLYJqsWTZtiazJJrtkvPwgyWnirn7gKk7ium'
  var signKey2 = '516mChDX1BRjwHJc2w838W8cXxy8a6Eb35HKXjPR2fD8'
  var signKey3 = '7H25Jfb2ND51hhaomL5FPhhqQvBGujd1jJeSjZZ8HQzR'

  var keyPair1 = sovrinDID.getKeyPairFromSignKey(signKey1)
  var keyPair2 = sovrinDID.getKeyPairFromSignKey(signKey2)
  var keyPair3 = sovrinDID.getKeyPairFromSignKey(signKey3)

  var sharedSecret1To2 = sovrinDID.getSharedSecret(keyPair2.publicKey, keyPair1.secretKey)
  var sharedSecret2To1 = sovrinDID.getSharedSecret(keyPair1.publicKey, keyPair2.secretKey)
  var sharedSecret3To1 = sovrinDID.getSharedSecret(keyPair3.publicKey, keyPair1.secretKey)

  var message = 'Hello World!!'
  var nonce = sovrinDID.getNonce()

  var encryptedMessage = sovrinDID.encryptMessage(message, nonce, sharedSecret1To2)
  var decryptedMessage = sovrinDID.decryptMessage(encryptedMessage, nonce, sharedSecret2To1)
  var attemptedDecryption = sovrinDID.decryptMessage(encryptedMessage, nonce, sharedSecret3To1)

  t.equal(decryptedMessage, message)
  t.notEqual(message, attemptedDecryption)
  t.equal(attemptedDecryption, false)

  t.end()
})
