//const bip39 = require("bip39");
//const bitcoinlib = require("bitcoinjs-lib");
const StellarHDWallet = require("stellar-hd-wallet");
const has = require("lodash/has");
const each = require("array-each");
const loadInputFile = require("load-json-file");
const csv = require("fast-csv");
const fse = require('fs-extra')



//Constructor for holding each one of the keys
function OutputKey(_Seed, _Passphrase, _DerivationPath, _Keys) {
    this.Seed = _Seed
    this.Passphrase = _Passphrase
    this.DerivationPath = _DerivationPath
    this.Keys = _Keys
}

//Array for holding all the keys
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

const output = './data/output.json';

//load json file, parse and recursively populate the object with keys
loadInputFile("./data/input.json")
    .then(json => {
        try {
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

                            const basePath = `m/44'/148'/`;
                            const fullpath = basePath + path + "'";

                            const wallet = (passphrase != null) ? StellarHDWallet.fromMnemonic(seed, passphrase) : StellarHDWallet.fromMnemonic(seed);
                            var pubKey = wallet.getPublicKey(path);
                            var derive = wallet.derive(fullpath);

                            let _d = {
                                index: k,
                                path: fullpath,
                                derive: derive,
                                parentkey: derive.toString('hex')
                            }


                            //console.log("PublicKey - " + "[m/44'/148'/" + path + "']: " + pubKey);

                            let _k = {
                                pubkey: pubKey,
                                privkey: null,
                                ismatch: (pubKey == target)
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

        } catch (error) {
            console.log(error);
        }
        let results = JSON.stringify(outputKeys);

        fse.writeJson(output, results)
            .then(() => {
                console.log('success!')
            })
            .catch(err => {
                console.error(err)
            })
    });