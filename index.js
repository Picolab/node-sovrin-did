var nacl = require("tweetnacl");
var bs58 = require("bs58");

var fromSeed = function(seed){

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

module.exports = {
    gen: function(){
        var seed = nacl.randomBytes(nacl.sign.seedLength);
        return fromSeed(seed);
    },
    fromSeed: fromSeed,
};
