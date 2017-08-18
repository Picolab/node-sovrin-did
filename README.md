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

## License
MIT
