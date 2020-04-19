# Stellar XLM lost address retriever

## Introduction
This Node tool was written for the purpose of attempting to recover access to an XLM Stellar address of which I was not entirely sure of the combination of seed, 25th word passwords (if any), nor derivation path I may have used to generate the address,

It is fully compliant with BIP 39 and BIP 44, using the stellar-hd-wallet library for address generation.

The reason I questioned my valid seed, is that after the 1.4.1 firmware on March 6th, 2018, suddenly my Ledger wallet displayed a brand new XLM address, which of course contained 0 Lumens. This same scenario seems to have happened to several others, right after the firmware update. I am still attemping to retrieve a substantial amount of Lumens on the address that my Ledger wallet was providing me originally, before the firmware upgrade. Although I am 99.99999% sure of the seed I used, I wanted to verify with a tool like this, to attempt every possible combination of every seed, password and several derivations path deep to ensure it wasn't a mistake of mine. 

I have narrowed it down to the moment of the firmware upgrade. Feel free to reach out to share yor experience with me. I'd love to know about others who have experienced the same issue. 

Anyhow, the tool takes in a JSON file (/data/input.json) with a collection (array) of the following parameters:

* n amount of seeds
* n amount of passwords
* a single integer to specify amount of child adresses to scan within a parent derivation path. 
* n amount of target addresses to attempt to find

## Requirements

* Node.js

## Installation

- Clone and with a console in the directory of the project,
- Run: npm install --save (to retrieve the required dependencies/modules) 
- Modify the provided **/data/input.json** file with your own data 
- Run or debug index.js (in the root of the project)

Whatever data is returned, is  written to a file in the same /data/ directory, named: **output.json**.

## Configuration

Replace the data in the dummy input.json file with your own. Debug or run index.js in the root of the project

## Result

While the program is running, the console displays ongoing parsing and results. Once done it will write a .csv file with all the results to the data folder, named output.json, looking something like this: 

```csv
Seed Index, Shortened Seed, Password Index, Shortened Password, Derivation Path, Derivation Parent Key, Stellar Public Key, Matches Seeked Key
0, asthm, 0, *****, m/44'/148'/0', b927859376ca051d16e90cc75fd48f90b305472da8f537903929cd7a81a704a2, GBJCYUFJA7VA4GOZV7ZFVB7FGZTLVQTNS7JWJOWQVK6GN7DBUW7L5I5O, false
1, asthm, 0, *****, m/44'/148'/0', b927859376ca051d16e90cc75fd48f90b305472da8f537903929cd7a81a704a2, GBJCYUFJA7VA4GOZV7ZFVB7FGZTLVQTNS7JWJOWQVK6GN7DBUW7L5I5O, false
0, asthm, 0, *****, m/44'/148'/0'/0', 5b34ffa5746ed93da03ff5e28bbac3a17a4621fa7ec12f25836e59a2f5f0026d, GBA7EOSFAO5WMVUZIUM6WIMPLM6QCBWKBEEDIWJQVRL653C6GOQK3MGL, false
1, asthm, 0, *****, m/44'/148'/0'/0', 5b34ffa5746ed93da03ff5e28bbac3a17a4621fa7ec12f25836e59a2f5f0026d, GBA7EOSFAO5WMVUZIUM6WIMPLM6QCBWKBEEDIWJQVRL653C6GOQK3MGL, false
0, asthm, 0, *****, m/44'/148'/0'/0'/0', 87e1de5636bc84e6994dade2e3c87bc9a638fab6f82f8b0c123602b7596989c8, GCA33TBOIPYEV7LWQRM4LOXQME5C7JGCFA5WDRSGJKKLVGKHQFMR7CQT, false
1, asthm, 0, *****, m/44'/148'/0'/0'/0', 87e1de5636bc84e6994dade2e3c87bc9a638fab6f82f8b0c123602b7596989c8, GCA33TBOIPYEV7LWQRM4LOXQME5C7JGCFA5WDRSGJKKLVGKHQFMR7CQT, false
0, asthm, 0, *****, m/44'/148'/0'/0'/1', a546b77ab0111fb8066c7d690459695811756bc9dc1e58da6254012e98e455ec, GCOHBJI4WDWUWVMMMAJNUJKNBXCLDNG34FTTT7TTSIVHNMR7TJJZSN7S, false
1, asthm, 0, *****, m/44'/148'/0'/0'/1', a546b77ab0111fb8066c7d690459695811756bc9dc1e58da6254012e98e455ec, GCOHBJI4WDWUWVMMMAJNUJKNBXCLDNG34FTTT7TTSIVHNMR7TJJZSN7S, false
0, asthm, 0, *****, m/44'/148'/0'/0'/2', bef849c02147649f251c8e25df7eaea76fa829cda52a36088c58c98c8f86a19a, GBRW3DRFAFQLDARST7XFD5WFHJCIVKQVPMOWMGZ64NRB7IWPGHF6J7LI, false
1, asthm, 0, *****, m/44'/148'/0'/0'/2', bef849c02147649f251c8e25df7eaea76fa829cda52a36088c58c98c8f86a19a, GBRW3DRFAFQLDARST7XFD5WFHJCIVKQVPMOWMGZ64NRB7IWPGHF6J7LI, false
0, asthm, 0, *****, m/44'/148'/0'/0'/3', 2a45c5f2363c525236437747907c6878260ec986c63e2614710877241b6efd27, GAMELKM4QRF5XUTMGRHKJXAN7ADS3XLLBCRYG32ZITDJYYJNW2XZLEQ2, false
1, asthm, 0, *****, m/44'/148'/0'/0'/3', 2a45c5f2363c525236437747907c6878260ec986c63e2614710877241b6efd27, GAMELKM4QRF5XUTMGRHKJXAN7ADS3XLLBCRYG32ZITDJYYJNW2XZLEQ2, false
0, asthm, 0, *****, m/44'/148'/0'/0'/4', ccc33122c6384ea5a79b473f9f05e9b8c30f102ec279ff256af81ca51bf71c45, GCFKBB7W47J3L7ETXGSMP2VP52VLNBF4DJNM4ZUWNOWQVUFRFFJNIL5B, false
1, asthm, 0, *****, m/44'/148'/0'/0'/4', ccc33122c6384ea5a79b473f9f05e9b8c30f102ec279ff256af81ca51bf71c45, GCFKBB7W47J3L7ETXGSMP2VP52VLNBF4DJNM4ZUWNOWQVUFRFFJNIL5B, false
0, asthm, 0, *****, m/44'/148'/0'/0'/5', 53bfa91d87d4ca68d8ea4b0d11718e16288bb0767e5e565ba32e8b99c57bc615, GDP6Q4N5Y3FUSGSKTXQWDVRRQJOTWDE6JCXTYR5GOLRF7KG2DSIREYAJ, false
1, asthm, 0, *****, m/44'/148'/0'/0'/5', 53bfa91d87d4ca68d8ea4b0d11718e16288bb0767e5e565ba32e8b99c57bc615, GDP6Q4N5Y3FUSGSKTXQWDVRRQJOTWDE6JCXTYR5GOLRF7KG2DSIREYAJ, false
0, asthm, 0, *****, m/44'/148'/0'/1', ba5dc29bf108d707d2ebe7a2248adaca2c57ade0eb3510bc093db01b3ff3b510, GA6IXV2T7V3YUX2LEBEGGWNBKFXVR5CMMXAQKGS7QZTKE6VBDCN4RWIE, false
1, asthm, 0, *****, m/44'/148'/0'/1', ba5dc29bf108d707d2ebe7a2248adaca2c57ade0eb3510bc093db01b3ff3b510, GA6IXV2T7V3YUX2LEBEGGWNBKFXVR5CMMXAQKGS7QZTKE6VBDCN4RWIE, false
0, asthm, 0, *****, m/44'/148'/0'/1'/0', 9254db21f2d24f547aa244e96d4e0b7f47c0517392543b0746b1db7884e7218e, GAVCFCC2PTTIF5EP44VLDENDKOAXBMNWTA34B4GAXYT6DB342UNTENNY, false
1, asthm, 0, *****, m/44'/148'/0'/1'/0', 9254db21f2d24f547aa244e96d4e0b7f47c0517392543b0746b1db7884e7218e, GAVCFCC2PTTIF5EP44VLDENDKOAXBMNWTA34B4GAXYT6DB342UNTENNY, false
0, asthm, 0, *****, m/44'/148'/0'/1'/1', 8973258b56bf00e570735729416d05649ba743d9849e361e8032ce4703a48737, GAFKIMJEEOB4HZ74CHPTZSMLRKSZ3V2SBGGRQXAFNLVF3XNLBWTIYXGL, false
1, asthm, 0, *****, m/44'/148'/0'/1'/1', 8973258b56bf00e570735729416d05649ba743d9849e361e8032ce4703a48737, GAFKIMJEEOB4HZ74CHPTZSMLRKSZ3V2SBGGRQXAFNLVF3XNLBWTIYXGL, false
0, asthm, 0, *****, m/44'/148'/0'/1'/2', 63873e577ba0af8ff44163925852c8e86ba1a9958f3d436f74039827b52941a5, GABTHFSG6QX74LGPEJ7I2FHTBVKEV2N6JOIYVKT6TMPMFSLXYMN4JX6N, false
1, asthm, 0, *****, m/44'/148'/0'/1'/2', 63873e577ba0af8ff44163925852c8e86ba1a9958f3d436f74039827b52941a5, GABTHFSG6QX74LGPEJ7I2FHTBVKEV2N6JOIYVKT6TMPMFSLXYMN4JX6N, false
0, asthm, 0, *****, m/44'/148'/0'/1'/3', 456d7baac1d1edb28a6ee8466d159a93e86c254680e985b8307bb3f1a8083781, GBSNOSVK3GC7PVVGND4OUHNLHDHVXDDEYU34WD453TJRMTR5JZSLOMA3, false
1, asthm, 0, *****, m/44'/148'/0'/1'/3', 456d7baac1d1edb28a6ee8466d159a93e86c254680e985b8307bb3f1a8083781, GBSNOSVK3GC7PVVGND4OUHNLHDHVXDDEYU34WD453TJRMTR5JZSLOMA3, false
0, asthm, 0, *****, m/44'/148'/0'/1'/4', 0ff741e04a218e5a550108774cd41bd19f6045f3e687c37da2fb2997673179af, GDHOZAIZAXWBW3RSSHFMBNAJBVMXQHSEOW6F53NCWW745DRLL43OKOTX, false
1, asthm, 0, *****, m/44'/148'/0'/1'/4', 0ff741e04a218e5a550108774cd41bd19f6045f3e687c37da2fb2997673179af, GDHOZAIZAXWBW3RSSHFMBNAJBVMXQHSEOW6F53NCWW745DRLL43OKOTX, false
0, asthm, 0, *****, m/44'/148'/0'/1'/5', 0f765da59a2943691430645c6c73d9a96b5844bbfe96687a23601c74e386121e, GC4GMTBMMDRSDHU5ZMYZFCINSE2FKZFQ5OESK57X32NFPVVUCIRK7IVM, false
1, asthm, 0, *****, m/44'/148'/0'/1'/5', 0f765da59a2943691430645c6c73d9a96b5844bbfe96687a23601c74e386121e, GC4GMTBMMDRSDHU5ZMYZFCINSE2FKZFQ5OESK57X32NFPVVUCIRK7IVM, false
```

## Maintainers

Current maintainers:

* [Miguel Moreno](https://github.com/miguelmoreno)

## License

[GPLv3](http://www.gnu.org/licenses/gpl-3.0.txt)