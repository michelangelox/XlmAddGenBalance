//const bip39 = require("bip39");
//const bitcoinlib = require("bitcoinjs-lib");
const StellarHDWallet = require("stellar-hd-wallet");
const has = require("lodash/has");
const each = require("array-each");
const loadInputFile = require("load-json-file");


//Generate Derivation Path Object
var derivationCollection = [];

for (let i = 0; i < 11; i++) {
    var outerIndex = i;
    derivationCollection.push(outerIndex);

    for (let j = 0; j < 11; j++) {
        derivationCollection.push(outerIndex + "'/" + j);
    }
}

loadInputFile("./data/input.json")
    .then(json => {

        const target = json.target;

        each(json.seeds, function(_seed, i) {
            console.log("");
            console.log("-----------------------------------------------------------");
            const seed = _seed;

            if (StellarHDWallet.validateMnemonic(_seed)) {
                const shortSeed = seed.substr(0, 20) + "...";
                console.log("validated seed loop: " + shortSeed);

                each(json.passwords, function(_passphrase, j) {
                    const passphrase = _passphrase;
                    console.log("   passphrase loop: -" + passphrase + "- + " + shortSeed);

                    each(derivationCollection, function(_path, k) {
                        const path = _path;

                        const wallet = (passphrase != null) ? StellarHDWallet.fromMnemonic(seed, passphrase) : StellarHDWallet.fromMnemonic(seed);
                        var pubKey = wallet.getPublicKey(path);

                        console.log("         PublicKey[m/44'/148'/" + path + "']: " + pubKey);

                        if (pubKey == target) {
                            console.log("!!!!!!!!FOUND!!!!!!!!!");
                        }
                    });

                    console.log("");
                })
            } else {
                console.log("invalid seed: " + seed.substr(0, 20) + "...");
            }

        })
    })