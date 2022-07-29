// migrating the appropriate contracts
var SquareVerifier = artifacts.require("./SquareVerifier.sol");
var SolnSquareVerifier = artifacts.require("./SolnSquareVerifier.sol");

module.exports = async (deployer) => {
  await deployer.deploy(SquareVerifier);
  let squareVerifier= await SquareVerifier.deployed();
  await deployer.deploy(SolnSquareVerifier, squareVerifier.address);
};
