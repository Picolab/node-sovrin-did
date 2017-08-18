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
        key_verify: "QDQ7Y69yg6eeJNstq62rXw8mK8HmnnsocPwvo9DU2tS",
        key_sign: "516mChDX1BRjwHJc2w838W8cXxy8a6Eb35HKXjPR2fD8",
        seed: "3b75434f4fb431bfcdd1d7f3e0544fde12e5bb7d19b36a7f6cffe1a0bf1fd8ff",
    });

    tst("5d40a10e4723a41216f98a3cc4c1082a4fa51a0ffa6196960ad931efe654dd2e", {
        did: "E7cwAzuB9kSU3mj2n9p97P",
        key_verify: "89ZgeKmTktxWg9UrGFzL2PbcHrToKNMPpLQtjbh17pfT",
        key_sign: "7H25Jfb2ND51hhaomL5FPhhqQvBGujd1jJeSjZZ8HQzR",
        seed: "5d40a10e4723a41216f98a3cc4c1082a4fa51a0ffa6196960ad931efe654dd2e",
    });

    tst("7cb46171cd7a9bf9440e9c74c0752b37ae89b72184bb6693d8dc73752078ea0f", {
        did: "TvqM6vQHEZb4EDYkfUVVUp",
        key_verify: "FgFdznhQTymQEBKNoboDLKDGWB7eezrhvKKQK2uKUSU5",
        key_sign: "9Po5sqUto67MYFyfXXgV3PwvXoRxCfEXpSoMKn1eFtcv",
        seed: "7cb46171cd7a9bf9440e9c74c0752b37ae89b72184bb6693d8dc73752078ea0f",
    });

    t.end();
});
