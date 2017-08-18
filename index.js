var nacl = require("tweetnacl");
var bs58 = require("bs58");

var fromSeed = function(seed_hex){

    var seed = Buffer.from(seed_hex, "hex");

    var x = nacl.sign.keyPair.fromSeed(seed);

    return {

        did: bs58.encode(x.publicKey.subarray(0, 16)),
        verifyKey: bs58.encode(x.publicKey),

        secret: {
            seed: Buffer.from(seed).toString("hex"),
            signKey: bs58.encode(x.secretKey.subarray(0, 32)),
        },
    };
};

//var seed = nacl.randomBytes(nacl.sign.seedLength);
module.exports = {
    fromSeed: fromSeed,
};
