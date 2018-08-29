//const bip39 = require("bip39");
//const bitcoinlib = require("bitcoinjs-lib");
const StellarHDWallet = require("stellar-hd-wallet");
const each = require("array-each");
const loadInputFile = require("load-json-file");
const fse = require('fs-extra');

const jsonfile = require('jsonfile')
const Json2csvParser = require('json2csv').Parser;

var keysArray = [];
const basePath = `m/44'/148'/`;
const outputFile = './data/output.csv';


//Generate Derivation Path Object
var derivationCollection = [];
for (let i = 0; i < 3; i++) {
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
        seedShort: _seed.substr(0, 10) + "********"
    }

    let _p = {
        passphrase_index: _passphrase_index,
        passphrase: _passphrase.substr(0, 5) + "********"
    }

    let _d = {
        path_index: _path_index,
        path: fullpath,
        derive: derive,
        parentkey: derive.toString('hex')
    }

    let _k = {
        pubkey: pubKey,
        privkey: null,
        isMatch: (pubKey == _target)
    }

    console.log("PublicKey - " + fullpath + "]: " + pubKey + " = " + _k.ismatch);

    return new OutputKey(_s, _p, _d, _k);
}



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

                    each(json.passwords, function(_passphrase, j) {
                        const passphrase = _passphrase;

                        each(derivationCollection, function(_path, k) {
                            var path = _path;

                            var fullpath = getFullDerivationPath(path);

                            const key = getAddressFromSeed(seed, i, passphrase, j, path, k, fullpath, k, target);
                            keysArray.push(key);

                            //one level deeper, one more round
                            for (let m = 0; m < 3; m++) {
                                secondlevelpath = path + "'/" + m + "'";

                                const address = getAddressFromSeed(seed, i, passphrase, j, secondlevelpath, k + "[" + m + "]", target);

                                keysArray.push(address);
                            }

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

        const fields = ['Seed.seed_index', 'Seed.seedShort', 'Passphrase.passphrase_index', 'Passphrase.passphrase', 'DerivationPath.path_index', 'DerivationPath.path', 'DerivationPath.parentkey', 'Keys.pubkey', 'Keys.isMatch'];
        const opts = {
            fields,
            quote: '',
            unnwind: ['Seed.seed_index', 'Seed', 'Passphrase.passphrase_index', 'Passphrase.passphrase', 'DerivationPath.path_index', 'DerivationPath.path', 'DerivationPath.parentkey', 'Keys.pubkey', 'Keys.isMatch']
        };

        try {
            const parser = new Json2csvParser(opts);
            const csv = parser.parse(keysArray)
            console.log(csv);
        } catch (err) {
            console.error(err);
        }

        // jsonfile.writeFileSync(outputFile, keysArray, {
        //     spaces: 2,
        //     EOL: '\r\n'
        // })

        console.log("done");
    });