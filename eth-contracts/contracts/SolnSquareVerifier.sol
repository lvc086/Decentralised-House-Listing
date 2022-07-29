pragma solidity 0.5.5;

import {LVCToken} from "./ERC721Mintable.sol";
import {SquareVerifier} from "./SquareVerifier.sol";

// TODO define another contract named SolnSquareVerifier that inherits from your ERC721Mintable class
contract SolnSquareVerifier is LVCToken {

    /**
     * @dev Modifier that requires a solution to be unique
     */
    modifier requireSolutionUnique(bytes32 key) {
        require(uniqueSolutions[key].to == address(0), "Solution is not unique");
        _;
    }

    /**
     * @dev Modifier that requires a solution to be correct
     */
    modifier requireCorrectSolution(uint[2] memory a, uint[2][2] memory b, uint[2] memory c, uint[2] memory input) {
        require(verifierContract.verifyTx(a, b, c, input), "Incorrect Solution");
        _;
    }

    // TODO define a contract call to the zokrates generated solidity contract <Verifier> or <renamedVerifier>
    SquareVerifier verifierContract;

    constructor(address verifierAddress) public{
        verifierContract = SquareVerifier(verifierAddress);
    }

    // TODO define a solutions struct that can hold an index & an address
    struct Solution {
        uint256 index;
        address to;
    }

    // TODO define an array of the above struct
    Solution[] solArray;

    // TODO define a mapping to store unique solutions submitted
    mapping(bytes32 => Solution) uniqueSolutions;

    // TODO Create an event to emit when a solution is added
    event SolutionAdded(bytes32 indexed key, address indexed to, uint256 indexed index);

    // TODO Create a function to add the solutions to the array and emit the event
    function addSolution(bytes32 key, address to, uint256 index) internal requireSolutionUnique(key)
    {
        Solution memory newSolution = Solution({index : index, to : to});
        uniqueSolutions[key] = newSolution;
        solArray.push(newSolution);
        emit SolutionAdded(key, to, index);
    }

    // TODO Create a function to mint new NFT only after the solution has been verified
    //  - make sure the solution is unique (has not been used before)
    //  - make sure you handle metadata as well as tokenSupply
    function mintToken(
        address to,
        uint256 index,
        uint[2] memory a,
        uint[2][2] memory b,
        uint[2] memory c,
        uint[2] memory input
    ) public requireCorrectSolution(a, b, c, input) whenNotPaused
    {
        addSolution(keccak256(abi.encodePacked(a, b, c, input)), to, index);
        super.mint(to, index);
    }
}