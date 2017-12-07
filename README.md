# node-sovrin-did

[![build status](https://secure.travis-ci.org/Picolab/node-sovrin-did.svg)](https://travis-ci.org/Picolab/node-sovrin-did)

node.js module to generate DID and Ed25519 keys to use with [Sovrin](https://sovrin.org/)


## Install

```sh
$ npm i sovrin-did
```


## Example

```js
var sovrinDID = require("sovrin-did");

var d = sovrinDID.gen();

console.log(d);
```
output:
```js
{ did: 'S7evWWTSbaXELyE9w53sFr',
  verifyKey: 'EgvhZsLKSsqsbNBfJ2wfR9FFWo9YqkpxpfXeT4ifR1Cq',
  encryptionPublicKey: '5UAXeov4Gi7ioSTLDoMPtdvqX6RRmJcQAWagVgdaxUej',
  secret:
   { seed: '36a572a7e43956784b517c57b26720a8ef838d114c0619f1d8c7801c37fa4f6a',
     signKey: '4gKLe7Qq2WX249NBfymQySZbAzXboq2emMig6wBR82Bj',
     encryptionPrivateKey: '7H25Jfb2ND51hhaomL5FPhhqQvBGujd1jJeSjZZ8HQzR'} }
```


## API


### gen()

Generates a new did, verification key, signing key, and also gives you the seed used to generate them. It also includes the public and private key used for encryption.

```js
{
    did: "<base58 did>",
    verifyKey: "<base58 publicKey>",
    publicKey: "<base58 publicKey>",

    secret: {
        seed: "<hex encoded 32-byte seed>",
        signKey: "<base58 secretKey>",
        privateKey: "<base58 privateKey>"
    }
}
```


### fromSeed(seed)

Same as `.gen()` except you supply the seed. The seed should be a 32-byte Uint8Array (i.e. Buffer).

Example:
```
var seed = Buffer.from("36a572a7e43956784b517c57b26720a8ef838d114c0619f1d8c7801c37fa4f6a", "hex");

var d = sovrinDID.fromSeed(seed);

console.log(d);
```

The output is the same as the `.gen()` example.


### signMessage(message, signKey, verifyKey)

Signs a message with the given signKey and verifyKey.

* The message should be a string.
* Both the signKey and verifyKey should be the signKey and verifyKey given from the `gen()` or `fromSeed(seed)` methods

Returns a signed message as a Uint8Array (i.e. Buffer).

Example:
```js
  var sovrin = sovrinDID.gen();
 
  var signKey = sovrin.secret.signKey;
  var verifyKey = sovrin.verifyKey;
  var message = "Hello World!!";
 
  var signedMessage = sovrinDID.signMessage(message, signKey, verifyKey);
```


### verifySignedMessage(signedMessage, verifyKey)

Verifies that the given message  has been signed by the possessor of the given verifyKey.

* The signedMessage should be what is returned from `signMessage(message, signKey, verifyKey)`
* The verifyKey should be the verifyKey given from the `gen()` or `fromSeed(seed)` methods

Returns the original message if the message was signed by the owner of the verifyKey `false` otherwise.

Example:
```js
  var sovrin = sovrinDID.gen();
  var sovrin2 = sovrinDID.gen();
 
  var signKey = sovrin.secret.signKey;
  var verifyKey = sovrin.verifyKey;
  var verifyKey2 = sovrin2.verifyKey;
 
  var message = "Hello World!!";
 
  var signedMessage = sovrinDID.signMessage(message, signKey, verifyKey);
 
  console.log(sovrinDID.verifySignedMessage(signedMessage, verifyKey));
  console.log(sovrinDID.verifySignedMessage(signedMessage, verifyKey2));
```

Output:
```
  Hello World!!
  false
```


### getKeyPairFromSignKey(signKey)

Returns a key pair that is valid to use for encrypting. 
* The signKey should be the signKey given from the object given from `gen()` or `fromSeed()`

Example:
```js
var sovrin = sovrinDID.gen();
var signKey = sovrin.secret.signKey;

var keyPair = sovrinDID.getKeyPairFromSignKey(signKey);
console.log(keyPair);
```

Output:
```js
{
   publicKey: ...   // Uint8Array with 32-byte public key
   secretKey: ...   // Uint8Array with 32-byte secret key
}
```


### getNonce()

Returns a random nonce as a Uint8Array that can be used for encrypting.

Example:
```js
var nonce = sovrinDID.getNonce();
```


### getSharedSecret(theirVerifyKey, mySigningKey)

Computes a sharedSecret to be used for encryption.

* theirVerifyKey should be the publicKey given from the `getKeyPairFromSignKey(signKey)` method or the publicKey string given from the `gen()` method.
* mySigningKey should be the secretKey given from the `getKeyPairFromSignKey(signKey)` method or the privateKey given from the `gen()` method.

Example:
```js
var sovrin1 = sovrinDID.gen();
var sovrin2 = sovrinDID.gen();

// Using the strings given via the gen() method
var sharedSecret1 = sovrinDID.getSharedSecret(sovrin2.encryptionPublicKey, sovrin1.secret.encryptionPrivateKey);
var sharedSecret2 = sovrinDID.getSharedSecret(sovrin1.encryptionPublicKey, sovrin2.secret.encryptionPrivateKey);

var signKey1 = sovrin1.secret.signKey;
var signKey2 = sovrin2.secret.signKey;

var keyPair1 = sovrinDID.getKeyPairFromSignKey(signKey1);
var keyPair2 = sovrinDID.getKeyPairFromSignKey(signKey2);

// Using the buffer given from the getKeyPairFromSignKey(signKey2) method
var sharedSecret3 = sovrinDID.getSharedSecret(keyPair2.publicKey, keyPair1.secretKey);
var sharedSecret4 = sovrinDID.getSharedSecret(keyPair1.publicKey, keyPair2.secretKey);

// All the secrets generated are equivalent
```


### encryptMessage(message, nonce, sharedSecret)

Encrypts a the given message using a precomputed sharedSecret.
* message should be given as a string
* nonce should be a nonce from the `getNonce()` method 
    * Note: The nonce used for encrypting and decrypting need to be the same
* sharedSecret should be computed using the `getSharedSecret(theirVerifyKey, mySigningKey)` method

Example:

```js
var sovrin1 = sovrinDID.gen();
var sovrin2 = sovrinDID.gen();

var signKey1 = sovrin1.secret.signKey;
var signKey2 = sovrin2.secret.signKey;

var keyPair1 = sovrinDID.getKeyPairFromSignKey(signKey1);
var keyPair2 = sovrinDID.getKeyPairFromSignKey(signKey2);
var sharedSecret1To2 = sovrinDID.getSharedSecret(keyPair2.publicKey, keyPair1.secretKey);

var message = "Hello World!!";
var nonce = sovrinDID.getNonce();
var encryptedMessage = sovrinDID.encryptMessage(message, nonce, sharedSecret1To2);
```


### decryptMessage(encryptedMessage, nonce, sharedSecret)

Verifies and decrypts a previously encrypted message.
* encryptedMessage should be what is returned from the `encryptMessage(message, nonce, sharedSecret)` method
* nonce should be a nonce given from the `getNonce()` method
    * Note: The nonce used for encrypting and decrypting need to be the same
* sharedSecret should be computed using the `getSharedSecret(theirVerifyKey, mySigningKey)` method

Example:
```js
var signKey1 = "4bMnc36WuLYJqsWTZtiazJJrtkvPwgyWnirn7gKk7ium";
var signKey2 = "516mChDX1BRjwHJc2w838W8cXxy8a6Eb35HKXjPR2fD8";
var signKey3 = "7H25Jfb2ND51hhaomL5FPhhqQvBGujd1jJeSjZZ8HQzR";

var keyPair1 = sovrinDID.getKeyPairFromSignKey(signKey1);
var keyPair2 = sovrinDID.getKeyPairFromSignKey(signKey2);
var keyPair3 = sovrinDID.getKeyPairFromSignKey(signKey3);

var sharedSecret1To2 = sovrinDID.getSharedSecret(keyPair2.publicKey, keyPair1.secretKey);
var sharedSecret2To1 = sovrinDID.getSharedSecret(keyPair1.publicKey, keyPair2.secretKey);
var sharedSecret3To1 = sovrinDID.getSharedSecret(keyPair3.publicKey, keyPair1.secretKey);

var message = "Hello World!!";
var nonce = sovrinDID.getNonce();

var encryptedMessage = sovrinDID.encryptMessage(message, nonce, sharedSecret1To2);
var decryptedMessage = sovrinDID.decryptMessage(encryptedMessage, nonce, sharedSecret2To1);
var attemptedDecryption = sovrinDID.decryptMessage(encryptedMessage, nonce, sharedSecret3To1);

console.log(decryptedMessage);
console.log(attemptedDecryption);
```

Output:
```
Hello World!!
false
```


## License

MIT
