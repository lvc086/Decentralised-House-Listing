const truffleAssert = require('truffle-assertions');
const SquareVerifier = artifacts.require('SquareVerifier');
const SolnSquareVerifier = artifacts.require('SolnSquareVerifier');
const zokProof = require("../../zokrates/code/square/proof.json").proof;
const zokInputs = require("../../zokrates/code/square/proof.json").inputs;
const incorrectInputs = require("../../zokrates/code/square/incorrectInputProof.json").inputs;

contract('SolnSquareVerifier', accounts => {

    const to = accounts[1];
    const index = 1;

    let contract;

    describe('test token minting by providing solution', () => {
        beforeEach(async () => {
            const squareContract = await SquareVerifier.new();
            contract = await SolnSquareVerifier.new(squareContract.address);
        });

        // Test if a new solution can be added for contract - SolnSquareVerifier
        // Test if an ERC721 token can be minted for contract - SolnSquareVerifier
        it ('should mint ER721 token for contract', async function(){
            //mint token and add new solution
            let tx = await contract.mintToken(to, index, zokProof.a, zokProof.b, zokProof.c, zokInputs);
            await truffleAssert.eventEmitted(tx, "SolutionAdded");
            let tokenOwner = await contract.ownerOf.call(index);
            assert.equal(tokenOwner, to, "Incorrect owner");
        });  

        it('should not mint token with same solution', async () => {

            //mint tokens with proof
            await contract.mintToken(to, index, zokProof.a, zokProof.b, zokProof.c, zokInputs);

            // reminting token with same solution should fail
            await truffleAssert.reverts(contract.mintToken(to, index, zokProof.a, zokProof.b, zokProof.c, zokInputs))
        });

        it('should not mint token with incorrect proof', async () => {
            await truffleAssert.reverts(contract.mintToken(to, index, zokProof.a, zokProof.b, zokProof.c, incorrectInputs));
        });
    });
});