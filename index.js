//const bip39 = require("bip39");
//const bitcoinlib = require("bitcoinjs-lib");
const StellarHDWallet = require("stellar-hd-wallet");
const has = require("lodash/has");
const each = require("array-each");
const loadInputFile = require("load-json-file");


//var Derivation = ["m/44'/148'"];



loadInputFile("./data/input.json")
    .then(json => {

        each(json.seeds, function(seed, i) {
            console.log("");
            var seedIndex = i;


            if (StellarHDWallet.validateMnemonic(seed)) {

                each(json.passwords, function(passphrase, j) {

                    console.log("valid Mnemonic: " + seed.substr(0, 20) + "..." + " -- " + passphrase + " -- .");

                    const wallet = has(passphrase) ? StellarHDWallet.fromMnemonic(seed, passphrase) : StellarHDWallet.fromMnemonic(seed);

                    console.log("PublicKey: " + wallet.getPublicKey(0));
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