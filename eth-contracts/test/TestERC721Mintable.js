const truffleAssert = require('truffle-assertions');

var ERC721MintableComplete = artifacts.require('LVCToken');

contract('TestERC721Mintable', accounts => {

    const owner = accounts[0];
    const account_one = accounts[1];
    const account_two = accounts[2];
    
    const account_one_mint_count = 2;

    describe('should match erc721 spec', function () {
        beforeEach(async function () { 
            this.contract = await ERC721MintableComplete.new({from: owner});
            //mint multiple tokens
            for(let i = 0; i < account_one_mint_count; i++){
                await this.contract.mint(account_one, i + account_one_mint_count);
            }
        })

        it('should return total supply', async function () { 
            let total_supply = await this.contract.totalSupply.call({from: owner});
            assert.equal(total_supply, account_one_mint_count, "Does not match actual supply");  
        })

        it('should get token balance', async function () { 
            let balanceAcc1 = await this.contract.balanceOf(account_one);
            assert.equal(balanceAcc1, account_one_mint_count, "Incorrect balance");

        })

        //token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
        it('should return token uri', async function () { 
            let tokenId = 3;
            let tokenURI = await this.contract.tokenURI.call(tokenId, {from: owner});
            assert.equal(tokenURI, "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/3", "Incorrect tokenURI");
        })

        it('should transfer token from one owner to another', async function () { 
            await this.contract.transferFrom(account_one, account_two, account_one_mint_count, {from: account_one});

            let balanceAcc1 = await this.contract.balanceOf(account_one);
            assert.equal(balanceAcc1, 1, "Incorrect balance");

            let balanceAcc2 = await this.contract.balanceOf(account_two);
            assert.equal(balanceAcc2, 1, "Incorrect balance");

            let newOwner = await this.contract.ownerOf(account_one_mint_count);

            assert.equal(newOwner, account_two, "Incorrect new owner");

        })
    });

    describe('have ownership properties', function () {
        beforeEach(async function () { 
            this.contract = await ERC721MintableComplete.new({from: account_one});
        })

        it('should fail when minting when address is not contract owner', async function () { 
            await truffleAssert.reverts(this.contract.mint(account_two, 1), "Caller must be contract owner");
        })

        it('should return contract owner', async function () { 
            let owner = await this.contract.getOwner();

            assert.equal(owner, account_one, "Not contract owner")
        })

    });
})