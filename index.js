//const bip39 = require("bip39");
//const bitcoinlib = require("bitcoinjs-lib");
const StellarHDWallet = require("stellar-hd-wallet");
const each = require("array-each");
const loadInputFile = require("load-json-file");
const fse = require('fs-extra');
const jsonfile = require('jsonfile')
const Json2csvParser = require('json2csv').Parser;
const Json2csvTransform = require('json2csv').Transform;
const createCsvStringifier = require('csv-writer').createObjectCsvStringifier;
const CsvStream = require('json2csv-stream');
const stringToStream = require('string-to-stream');
const transform = require('stream-transform');

const depth_1stround = 11;
const depth_2ndround = 11;

const outputFile = './data/output.csv';

var keysArray = [];
const basePath = `m/44'/148'/`;

const opts = {
    fields: [{
        label: "Seed Index",
        value: 'Seed.seed_index'
    }, {
        label: "Shortened Seed",
        value: "Seed.seedShort"
    }, {
        label: "Password Index",
        value: "Passphrase.passphrase_index"
    }, {
        label: "Shortened Password",
        value: "Passphrase.passphrase"
    }, {
        label: "Derivation Path",
        value: "DerivationPath.path"
    }, {
        label: "Derivation Parent Key",
        value: "DerivationPath.parentkey"
    }, {
        label: "Stellar Public Key",
        value: "Keys.pubkey"
    }, {
        label: "Matches Seeked Key",
        value: "Keys.isMatch"
    }],
    delimiter: ", ",
    quote: '',
    unnwind: ['Seed.seed_index', 'Seed', 'Passphrase.passphrase_index', 'Passphrase.passphrase', 'DerivationPath.path_index', 'DerivationPath.path', 'DerivationPath.parentkey', 'Keys.pubkey', 'Keys.isMatch']
};

//Generate Derivation Path Object
var derivationCollection = [];
for (let i = 0; i < depth_1stround; i++) {
    var outerIndex = i;
    derivationCollection.push(outerIndex);
}

//Constructor for holding each one of the keys
function OutputKey(_Seed, _Passphrase, _DerivationPath, _Keys) {
    this.Seed = _Seed
    this.Passphrase = _Passphrase
    this.DerivationPath = _DerivationPath
    this.Keys = _Keys
}

function getFullDerivationPath(_path) {
    return basePath + _path + "'";
}

function getAddressFromSeed(_seed, _seed_index, _passphrase, _passphrase_index, _path, _path_index, _target) {
    const wallet = (_passphrase != null) ? StellarHDWallet.fromMnemonic(_seed, _passphrase) : StellarHDWallet.fromMnemonic(_seed);
    var pubKey = wallet.getPublicKey(_path);
    const fullpath = getFullDerivationPath(_path);
    var derive = wallet.derive(fullpath);

    let _s = {
        seed_index: _seed_index,
        seedShort: (_seed.substr(0, 5) + "********").substr(0, 5)
    }

    let _p = {
        passphrase_index: _passphrase_index,
        passphrase: (_passphrase.substr(0, 5) + "********").substr(0, 5)
    }

    let _d = {
        path_index: _path_index,
        derive: derive,
        parentkey: derive.toString('hex'),
        path: fullpath + (fullpath.length <= 13) ? fullpath + "\t" + "\t" : null,
    }

    let _k = {
        pubkey: pubKey,
        privkey: null,
        isMatch: (pubKey == _target)
    }

    //console.log("PublicKey [" + _s.seed_index + "." + _p.passphrase_index + "." + _path_index + "] - [" + fullpath + "]: " + pubKey + " = " + _k.isMatch);

    return new OutputKey(_s, _p, _d, _k);
}

//load json file, parse and recursively populate the object with keys
loadInputFile("./data/input.json")
    .then(json => {
        try {
            const target = json.target;

            console.log("Looking for : " + target);

            each(json.seeds, function(_seed, i) {

                const seed = _seed;

                if (StellarHDWallet.validateMnemonic(_seed)) {
                    const shortSeed = seed.substr(0, 30) + "...";

                    each(json.passwords, function(_passphrase, j) {
                        const passphrase = _passphrase;

                        each(derivationCollection, function(_path, k) {
                            var path = _path;
                            5
                            var fullpath = getFullDerivationPath(path);

                            const key = getAddressFromSeed(seed, i, passphrase, j, path, k, fullpath, k, target);
                            keysArray.push(key);

                            //one level deeper, one more round
                            for (let m = 0; m < depth_2ndround; m++) {
                                secondlevelpath = path + "'/" + m;

                                const address = getAddressFromSeed(seed, i, passphrase, j, secondlevelpath, k + "[" + m + "]", target);

                                if (address.Keys.pubkey == target) {
                                    var found = "-------------------------------------------------------\n\r";
                                    found = found + "\t found!!!!!!  ---> target at: " + address.Seed.seed_index + "_" + j + "_" + k + "_" + m + "\n\r";
                                    found = found + "-------------------------------------------------------\n\r";
                                    console.log(found);

                                    keysArray.push(found);

                                    return;
                                }

                                keysArray.push(address);
                            }
                        });
                    })
                } else {
                    console.log("invalid seed: " + seed.substr(0, 20) + "...");
                }
            })

        } catch (error) {
            console.log(error);
        }

        try {

            const parser = new Json2csvParser(opts);
            const outputCsvString = parser.parse(keysArray)
            //console.log(outputCsvString);

            fse.outputFile(outputFile, outputCsvString)
                .then(() => fse.readFile(outputFile, 'utf8'))
                .then(data => {
                    console.log(data)
                    console.log("done");
                })
                .catch(err => {
                    console.error(err)
                })
        } catch (err) {
            console.error(err);
        }
    });