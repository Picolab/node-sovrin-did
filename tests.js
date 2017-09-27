var test = require("tape");
var sovrinDID = require("./");

test("sovrinDID.fromSeed(seed)", function(t){

    var tst = function(seed_hex, expected){
        var seed = Buffer.from(seed_hex, "hex");
        var r = sovrinDID.fromSeed(seed);
        t.deepEquals(r, expected);
    };

    tst("3b75434f4fb431bfcdd1d7f3e0544fde12e5bb7d19b36a7f6cffe1a0bf1fd8ff", {

        did: "jbJWZXeXSsD5o1iWhYGFc",
        verifyKey: "QDQ7Y69yg6eeJNstq62rXw8mK8HmnnsocPwvo9DU2tS",

        secret: {
            seed: "3b75434f4fb431bfcdd1d7f3e0544fde12e5bb7d19b36a7f6cffe1a0bf1fd8ff",
            signKey: "516mChDX1BRjwHJc2w838W8cXxy8a6Eb35HKXjPR2fD8",
        },
    });

    tst("5d40a10e4723a41216f98a3cc4c1082a4fa51a0ffa6196960ad931efe654dd2e", {

        did: "E7cwAzuB9kSU3mj2n9p97P",
        verifyKey: "89ZgeKmTktxWg9UrGFzL2PbcHrToKNMPpLQtjbh17pfT",

        secret: {
            seed: "5d40a10e4723a41216f98a3cc4c1082a4fa51a0ffa6196960ad931efe654dd2e",
            signKey: "7H25Jfb2ND51hhaomL5FPhhqQvBGujd1jJeSjZZ8HQzR",
        },
    });

    tst("7cb46171cd7a9bf9440e9c74c0752b37ae89b72184bb6693d8dc73752078ea0f", {

        did: "TvqM6vQHEZb4EDYkfUVVUp",
        verifyKey: "FgFdznhQTymQEBKNoboDLKDGWB7eezrhvKKQK2uKUSU5",

        secret: {
            seed: "7cb46171cd7a9bf9440e9c74c0752b37ae89b72184bb6693d8dc73752078ea0f",
            signKey: "9Po5sqUto67MYFyfXXgV3PwvXoRxCfEXpSoMKn1eFtcv",
        },
    });

    tst("35604fb84e67d18a76b956d1cbf9ba7384994c3fba1e140ba95928cc98823058", {

        did: "MAF6ioWmybYvjYU2HD9oBE",
        verifyKey: "BzH5a2wLEyKxySUALpfBiBjHZtZudCG68J17QwWkRsdN",

        secret: {
            seed: "35604fb84e67d18a76b956d1cbf9ba7384994c3fba1e140ba95928cc98823058",
            signKey: "4bMnc36WuLYJqsWTZtiazJJrtkvPwgyWnirn7gKk7ium",
        },
    });

    t.end();
});

test("sovrinDID.gen()", function(t){

    var g1 = sovrinDID.gen();
    var seed = Buffer.from(g1.secret.seed, "hex");

    t.deepEquals(sovrinDID.fromSeed(seed), g1, "gen should just wrap .fromSeed(seed)");

    t.notEquals(g1.secret.seed, sovrinDID.gen().secret.seed);
    t.notEquals(g1.secret.seed, sovrinDID.gen().secret.seed);
    t.notEquals(g1.secret.seed, sovrinDID.gen().secret.seed);

    t.end();
});

test("sovrinDID.signMessage(message, privateKey, publicKey)", function (t) {

    var privateKey = "4bMnc36WuLYJqsWTZtiazJJrtkvPwgyWnirn7gKk7ium";
    var publicKey = "BzH5a2wLEyKxySUALpfBiBjHZtZudCG68J17QwWkRsdN";
    var message = "Hello World!!";

    var signedMessage = sovrinDID.signMessage(message, privateKey, publicKey);
    t.notEqual(message, signedMessage);
    t.end();
});

test("sovrinDID.verifySignedMessage(signedMessage, publicKey)", function (t) {

    var privateKey = "4bMnc36WuLYJqsWTZtiazJJrtkvPwgyWnirn7gKk7ium";
    var publicKey = "BzH5a2wLEyKxySUALpfBiBjHZtZudCG68J17QwWkRsdN";
    var publicKey2 = "QDQ7Y69yg6eeJNstq62rXw8mK8HmnnsocPwvo9DU2tS";
    var privateKey2 = "516mChDX1BRjwHJc2w838W8cXxy8a6Eb35HKXjPR2fD8";
    var message = "Hello World!!";
    var message2 = "I want to take over the world!!";

    var signedMessage = sovrinDID.signMessage(message, privateKey, publicKey);
    var signedMessage2 = sovrinDID.signMessage(message2, privateKey2, publicKey2);

    t.equal(sovrinDID.verifySignedMessage(signedMessage, publicKey), true);
    t.equal(sovrinDID.verifySignedMessage(signedMessage, publicKey2), false);

    t.equal(sovrinDID.verifySignedMessage(signedMessage2, publicKey2,), true);
    t.equal(sovrinDID.verifySignedMessage(signedMessage2, publicKey), false);

    t.end();
});
