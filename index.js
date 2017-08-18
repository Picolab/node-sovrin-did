var nacl = require("tweetnacl");
var bs58 = require("bs58");

var fromSeed = function(seed_hex){

    var seed = Buffer.from(seed_hex, "hex");

    var x = nacl.sign.keyPair.fromSeed(seed);

    return {
        did: bs58.encode(x.publicKey.subarray(0, 16)),

        key_verify: bs58.encode(x.publicKey),

        key_sign: bs58.encode(x.secretKey.subarray(0, 32)),

        seed: Buffer.from(seed).toString("hex"),
    };
};

//var seed = nacl.randomBytes(nacl.sign.seedLength);
module.exports = {
    fromSeed: fromSeed,
};
