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
const replaceLast = require('replace-last');

var childDepthDepth = 6; //default valuemif not define in JSON
var depth_ParentRound = childDepthDepth;
var depth_Child1Round = childDepthDepth;
var depth_Child2Round = childDepthDepth;

const outputFile = './data/output.csv';

var allFoundKeysArray = [];
const basePath = `m/44'/148'/`;
const hideMe = "*****";

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

//Generate Derivation Path Object, 3 levels deep
var derivationCollection = [];

for (let i = 0; i < depth_ParentRound; i++) { //level 1
    var parentIndex = i.toString() + "'";

    derivationCollection.push(parentIndex);

    for (let j = 0; j < depth_Child1Round; j++) { // level 2
        var child1Index = j.toString() + "'";

        derivationCollection.push(parentIndex + "/" + child1Index);

        for (let k = 0; k < depth_Child2Round; k++) { // level 3
            var child2Index = k.toString() + "'";

            derivationCollection.push(parentIndex + "/" + child1Index + "/" + child2Index);
        }
    }
}

//Constructor for holding each one of the keys and corresponding data
function OutputKey(_Seed, _Passphrase, _DerivationPath, _Keys) {
    this.Seed = _Seed
    this.Passphrase = _Passphrase
    this.DerivationPath = _DerivationPath
    this.Keys = _Keys
}

function getFullDerivationPath(_pathObject) {
    return basePath + _pathObject;
}

function getAddressFromSeed(_seed, _seed_index, _passphrase, _passphrase_index, _pathObject, _pathObjectIndex, _target) {

    const wallet = (_passphrase != null) ? StellarHDWallet.fromMnemonic(_seed, _passphrase) : StellarHDWallet.fromMnemonic(_seed);
    const fullDerivationPath = getFullDerivationPath(_pathObject);

    //last child cannot be hardened for Public Key retrieval - stellar-hd-wallet library does not support it and throws an exception
    var santitizedPath = replaceLast(_pathObject, "'", "");
    var pubKey = wallet.getPublicKey(santitizedPath);

    var derive = wallet.derive(fullDerivationPath);

    let _s = {
        seed_index: _seed_index,
        seedShort: (_seed.substr(0, 5) + hideMe).substr(0, 5)
    }

    let _p = {
        passphrase_index: _passphrase_index,
        passphrase: (_passphrase.substr(0, 5) + hideMe).substr(0, 5)
    }

    let _d = {
        path_index: _pathObjectIndex,
        derive: derive,
        parentkey: derive.toString('hex'),
        //helps format the csv, so short derivation paths get extra padding and don't skew the columns
        path: fullDerivationPath + (fullDerivationPath.length <= 13) ? fullDerivationPath + "       \t" + "\t" : null,
    }

    let _k = {
        pubkey: pubKey,
        privkey: hideMe,
        isMatch: (pubKey == _target)
    }

    console.log("Checking PublicKey @ [seedIndex: " + _s.seed_index + ", passphraseIndex: " + _p.passphrase_index + ", derivationPathIndex: " + _pathObjectIndex + "]: fullDerivationPath: " + fullDerivationPath + " - (" + pubKey.substr(0, 5) + hideMe + " == " + _target.substr(0, 5) + hideMe + ") ==> isMatch: " + _k.isMatch);

    return new OutputKey(_s, _p, _d, _k);

}

//loads json file, parses and recursively populate the object with found keys
loadInputFile("./data/input.json")
    .then(json => {
        try {
            const targets = json.targets;

            console.log("INIT: Strating search with: " +
                json.seeds.length +
                " seed(s), " +
                json.passwords.length +
                " password(s) and " + derivationCollection.length + " derivation path combination(s). Attempting every possible combination... looking for " + targets.length + " target(s).");

            childDepthDepth = (json.children != undefined) ? json.childre : childDepthDepth;

            each(json.seeds, function(_seed, i) {

                const seed = _seed;

                if (StellarHDWallet.validateMnemonic(_seed)) {
                    const shortSeed = seed.substr(0, 30) + hideMe;

                    each(json.passwords, function(_passphrase, j) {
                        const passphrase = _passphrase;

                        each(derivationCollection, function(_pathObject, k) {

                            each(targets, function(_target, i) {

                                const key = getAddressFromSeed(seed, i, passphrase, j, _pathObject, k, _target);

                                allFoundKeysArray.push(key);

                                if (_target == key.Keys.pubkey) {

                                    var found = "-------------------------------------------------------\n\r";
                                    found += "\t target + "
                                    _target + " FOUND!!!!!!  ---> target at: " + key.Seed.seed_index + "_" + j + "_" + k + "_" + m + "\n\r";
                                    found += "-------------------------------------------------------\n\r";

                                    console.log(found);

                                    allFoundKeysArray.push(found);

                                    return;
                                };
                            });
                        });
                    })
                } else {
                    console.log("invalid seed: " + seed.substr(0, 20) + hideMe);
                }
            })

        } catch (error) {
            console.log(error);
        }

        try {

            console.log("please wait while output is written to file...."

            )
            const parser = new Json2csvParser(opts);
            const outputCsvString = parser.parse(allFoundKeysArray)
            console.log(outputCsvString);

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