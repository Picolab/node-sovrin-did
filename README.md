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
  secret:
   { seed: '36a572a7e43956784b517c57b26720a8ef838d114c0619f1d8c7801c37fa4f6a',
     signKey: '4gKLe7Qq2WX249NBfymQySZbAzXboq2emMig6wBR82Bj' } }
```

## API
### sovrinDID.gen()

Generates a new did, verification key, signing key, and also gives you the seed used to generate them.

```js
{
    did: "<base58 did>",
    verifyKey: "<base58 publicKey>",

    secret: {
        seed: "<hex encoded 32-byte seed>",
        signKey: "<base58 secretKey>"
    }
}
```

### sovrinDID.fromSeed(seed)

Same as `.gen()` except you supply the seed. The seed should be a 32-byte Uint8Array (i.e. Buffer).

Example:
```
var seed = Buffer.from("36a572a7e43956784b517c57b26720a8ef838d114c0619f1d8c7801c37fa4f6a", "hex");

var d = sovrinDID.fromSeed(seed);

console.log(d);
```

The output is the same as the `.gen()` example.

### sovrinDID.signMessage(message, signKey, verifyKey)
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
 
  var signedMessage = sovrinDID.signMessage(message, signKey, verifyKey);;

```
### sovrinDID.verifySignedMessage(signedMessage, verifyKey)
Verifies that the given message  has been signed by the possessor of the given verifyKey.

* The signedMessage should be what is returned from the `signMessage(message, signKey, verifyKey)` method
* The verifyKey should be the verifyKey given from the `gen()` or `fromSeed(seed)` methods

Returns `true` if the message was signed by the owner of the verifyKey `false` otherwise.

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
  console.log(sovrinDID.verifySignedMessage(signedMessage, verifyKey2))
```

Output:
```
  true
  false
```
## License
MIT
