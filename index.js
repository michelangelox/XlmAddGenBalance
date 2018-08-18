//NPM modules required
const StellarHDWallet = require("stellar-hd-wallet");
const jsonfile = require("jsonfile");

var mnemonics = loadJsonFile("foo.json").then(json => {
  console.log(json);
  //=> {foo: true}
});

var passwords = [];

var derivations = [];

var returnVallue = "";
//wallet.derive(`m/44'/148'/0'`)

//first round without passwords
mnemonics.forEach(function(mnemonic, password) {
  var password = null;
  var derivation = null;
  var wallet = getWalletObjectFromMnemonic(mnemonic);
  console.log(getPublicKeyFromMnemocic(wallet, mnemonic, password, derivation));
});

console.log("First round: done!");

//second round with passwords
mnemonics.forEach(function(mnemonic) {
  passwords.forEach(function(password) {
    var derivation = null;
    var wallet = getWalletObjectFromMnemonic(mnemonic, password);
    returnVallue = getPublicKeyFromMnemocic(
      wallet,
      mnemonic,
      password,
      derivation
    );
    console.log();
  });
});

console.log("Second round done!");

//function getWalletObjectFromMnemonic(mnemonic) {
//	return StellarHDWallet.fromMnemonic(mnemonic);
//}

function getWalletObjectFromMnemonic(mnemonic, password) {
  return StellarHDWallet.fromMnemonic(mnemonic, password);
}

function getPublicKeyFromMnemocic(wallet, mnemonic, password, derivation) {
  var returnValue = "";

  returnValue +=
    "Seed: " +
    mnemonic +
    ", with" +
    (password == null ? "out passsword" : " password: " + password) +
    (derivation == null
      ? "out specifiec derivation path"
      : " derivation path: " + derivation);

  if (StellarHDWallet.validateMnemonic(mnemonic)) {
    returnValue += "mnemonic validated...";

    var publicKey = wallet.getPublicKey(0);
    returnValue += "\nPublicKey: " + publicKey + "\n";

    if (
      publicKey == "GAMSDIRPPPDDAURTEYZ645XZESKWUHVT27SF4IYUYCUFK32WL53X5X5N"
    ) {
      returnValue +=
        "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!";
    }

    //var secret = wallet.getSecret(0)
    //returnValue += ", secret: " + secret;

    var keypair = wallet.getKeypair(0);
  } else {
    returnValue += "mnemonic NOT valid...moving to next";
  }

  return returnValue;
}
