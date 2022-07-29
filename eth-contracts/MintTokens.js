const HDWalletProvider = require("truffle-hdwallet-provider")
const web3 = require('web3')
const fs = require("fs")

const proof1 = require("../zokrates/code/square/proofs/ptkn0.json")
const proof2 = require("../zokrates/code/square/proofs/ptkn1.json")
const proof3 = require("../zokrates/code/square/proofs/ptkn2.json")
const proof4 = require("../zokrates/code/square/proofs/ptkn3.json")
const proof5 = require("../zokrates/code/square/proofs/ptkn4.json")
const proof6 = require("../zokrates/code/square/proofs/ptkn5.json")
const proof7 = require("../zokrates/code/square/proofs/ptkn6.json")
const proof8 = require("../zokrates/code/square/proofs/ptkn7.json")
const proof9 = require("../zokrates/code/square/proofs/ptkn8.json")
const proof10 = require("../zokrates/code/square/proofs/ptkn9.json")
var proofs = [proof1, proof2, proof3, proof4, proof5, proof6, proof7, proof8, proof9, proof10]
const contract_abi = require('./build/contracts/SolnSquareVerifier.json').abi; 

const owner = "0x1Ae397bbaedE3C3e0830a08AFf94C29898c01d1F";
const mnemonic = fs.readFileSync(".secret").toString().trim();

async function main() {
    const w3 = new web3(new HDWalletProvider(mnemonic, `https://rinkeby.infura.io/v3/12e8d56547c1422aaf3d12f28b43e632`))
    const w3contract = new w3.eth.Contract(contract_abi, "0xb85DC7c3CDF8298b15FFEcBC8e565402f8a6be74")

    try{
        for (let i = 0; i < 10 ; i++) {
            let proof = proofs[i];
            tx = await w3contract.methods.mintToken(owner, i+1, proof.proof.a, proof.proof.b, proof.proof.c, proof.inputs).send({ from: owner });
            console.log("Minted token", (i+1), tx.transactionHash)
        }
    }catch(error){
        console.log(error)
    }
}

main()
