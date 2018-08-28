//const bip39 = require("bip39");
//const bitcoinlib = require("bitcoinjs-lib");
const StellarHDWallet = require("stellar-hd-wallet");
const has = require("lodash/has");
const each = require("array-each");
const loadInputFile = require("load-json-file");


//var Derivation = ["m/44'/148'"];

loadInputFile("./data/input.json")
    .then(json => {

        const target = json.target;

        each(json.seeds, function(_seed, i) {
            console.log("");
            console.log("-----------------------------------------------------------");
            const seed = _seed;

            console.log("seed loop: " + seed.substr(0, 20) + "...");

            if (StellarHDWallet.validateMnemonic(_seed)) {

                each(json.passwords, function(_passphrase, j) {
                    console.log("   passphrase loop");

                    const passphrase = (_passphrase == "") ? null : _passphrase;

                    console.log("      valid Mnemonic: " + seed.substr(0, 20) + "... " + ((passphrase != null) ? ("+ pwd: " + passphrase) : ""));

                    const wallet = (passphrase != null) ? StellarHDWallet.fromMnemonic(seed, passphrase) : StellarHDWallet.fromMnemonic(seed);

                    //wallet.derive(`m/44'/148'/0'`)
                    //wallet.derive("m/44'/148'").toString('hex')

                    const pubKey = wallet.getPublicKey(0);

                    if (pubKey == target) {
                        console.log("!!!!!!!!FOUND!!!!!!!!!");
                    }

                    console.log("      PublicKey: " + pubKey);
                    console.log("");
                })
            } else {
                console.log("Invalid Mnemonic");
            }

        })
    })





/*
for (var i = 0; ++i; i < Mnemonic.length() - 1) {
    var seed = Mnemonic[i - 1].
    ;
    var passphrase = Passphrase[0];

    //var path = Derivation[0]

    const validated = StellarHDWallet.validateMnemonic(seed)

    if (validated) {
        console.log("valid Mnemonic");
        const wallet = has(passphrase) ? StellarHDWallet.fromMnemonic(seed, passphrase) : StellarHDWallet.fromMnemonic(seed);

        console.log("wallet.getPublicKey(0): " + wallet.getPublicKey(0));
        console.log("wallet.getSecret(0): " + wallet.getSecret(0));
    } else {
        console.log("not valid!!");
    }
}*/