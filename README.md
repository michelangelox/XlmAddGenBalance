# Stellar XLM lost address retriever

## Introduction
This Node tool was written for the purpose of attempting to recover access to an XLM Stellar address of which I was not entirely sure of the combination of seed, 25th word passwords (if any), nor derivation path I may have used to generate the address,

It is fully compliant with BIP 39 and BIP 44, using the stellar-hd-wallet library for address generation.

The reason I questioned my valid seed, is that after the 1.4.1 firmware on March 6th, 2018, suddenly my Ledger wallet displayed a brand new XLM address, which of course contained 0 Lumens. This same scenario seems to have hapebe to several others, right after a firwar update. I am still attempring to retrieve +500.000 Lumens on the address that my Ledger wallet was providing me originally, before the firmware upgrade. I am 99.99999% sure of the seed I used, but still doubted myself I could hae made a mistake and needed to verify with a tool like this, to attempt every possible combination of every seed, password and several derivations path deep to ensure it wasn't a mistake of mine. 

I have narrowed it down to thae moment of the firmware upgrade. Feel free to reach out to share yor experiene with me. I'd love to know about others who have experienced the same issue. 

Anyhow, the tool takes in a JSON file  (/data/input.json) with a collections (array) of the following parameters:

* n amount of seeds
* n amount of passwords
* a single integer to specify amount of child adresses to scan within a parent derivation path. 
* n amount of target addresses to attempt to find

## Requirements

* Node.js

## Installation

Clone, then with a console in the directory of the project run: npm install --save to retrieve the required module, modify the **/data/input.json** file with your own data and then debug or run index.js in the root of the project. 

Whatever data is returned, is eventually written to a file in the same directory, named: **output.json**. 

## Configuration

Replace the data in the dummy input.json file with your own. Debug or run index.js in the root of the project

## Maintainers/Sponsors

Current maintainers:

* [Miguel Moreno](https://github.com/miguelmoreno)

## License

[GPLv3](http://www.gnu.org/licenses/gpl-3.0.txt)