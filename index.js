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

var verifySignedMessage = function(signedMessage, verifyKey) {
    var decodedKey = bs58.decode(verifyKey);
    var signed = nacl.sign.open(signedMessage, decodedKey);
    return signed !== null;
};

var signMessage = function(message, signKey, verifyKey) {
    verifyKey = bs58.decode(verifyKey);
    signKey = bs58.decode(signKey);
    var signKey = Buffer.concat([signKey, verifyKey]);
    var arrayMessage = Uint8Array.from(message);
    return nacl.sign(arrayMessage, signKey);
};

module.exports = {
    gen: function(){
        var seed = nacl.randomBytes(nacl.sign.seedLength);
        return fromSeed(seed);
    },
    fromSeed: fromSeed,
    signMessage: signMessage,
    verifySignedMessage: verifySignedMessage,
};
