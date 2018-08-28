//const bip39 = require("bip39");
//const bitcoinlib = require("bitcoinjs-lib");
const StellarHDWallet = require("stellar-hd-wallet");
const has = require("lodash/has");
const each = require("array-each");
const loadInputFile = require("load-json-file");
const csv = require("fast-csv");


function OutputKey(_Seed, _Passphrase, _DerivationPath, _Keys) {
    this.Seed = _Seed
    this.Passphrase = _Passphrase
    this.DerivationPath = _DerivationPath
    this.Keys = _Keys
}

var outputKeys = [];

//Generate Derivation Path Object
var derivationCollection = [];

for (let i = 0; i < 3; i++) {
    var outerIndex = i;
    derivationCollection.push(outerIndex);

    //for (let j = 0; j < 3; j++) {
    //    derivationCollection.push(outerIndex + "'/" + j);
    //}
}

loadInputFile("./data/input.json")
    .then(json => {

        const target = json.target;

        each(json.seeds, function(_seed, i) {

            console.log("");
            //console.log("-----------------------------------------------------------");
            const seed = _seed;

            if (StellarHDWallet.validateMnemonic(_seed)) {
                const shortSeed = seed.substr(0, 30) + "...";

                let _s = {
                    index: i,
                    seedShort: shortSeed
                }

                each(json.passwords, function(_passphrase, j) {
                    const passphrase = _passphrase;

                    let _p = {
                        index: j,
                        passphrase: passphrase
                    }

                    each(derivationCollection, function(_path, k) {
                        const path = _path;

                        let _d = {
                            index: k,
                            path: path
                        }

                        const wallet = (passphrase != null) ? StellarHDWallet.fromMnemonic(seed, passphrase) : StellarHDWallet.fromMnemonic(seed);
                        var pubKey = wallet.getPublicKey(path);

                        console.log("PublicKey - " + "[m/44'/148'/" + path + "']: " + pubKey);

                        if (pubKey == target) {
                            console.log("!!!!!!!!FOUND!!!!!!!!!");
                        }

                        let _k = {
                            pubkey: pubKey,
                            privkey: null
                        }

                        let key = new OutputKey(_s, _p, _d, _k);

                        outputKeys.push(key);

                    });

                    console.log("");
                })
            } else {
                console.log("invalid seed: " + seed.substr(0, 20) + "...");
            }
        })
    });