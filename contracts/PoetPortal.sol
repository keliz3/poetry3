pragma solidity ^0.8.4;

import "hardhat/console.sol";

contract PoetPortal {
    uint256 totalPoems;

    uint256 private seed;

    event NewPoem(address indexed from, uint256 timestamp, string poetry);

    struct Poem {
        address poet;
        string poetry;
        uint256 timestamp;
    }

    Poem[] poems;

    mapping(address => uint256) public lastPoemSent;

    constructor() payable {
        console.log("greetings, earthling");
    }

    function poem(string memory _poetry) public {
        require(
            lastPoemSent[msg.sender] + 30 seconds < block.timestamp,
            "Pls wait 30 seconds before submitting again."
        );

        lastPoemSent[msg.sender] = block.timestamp;

        totalPoems += 1;
        console.log("%s wuz here.", msg.sender);

        poems.push(Poem(msg.sender, _poetry, block.timestamp));

        uint256 randomNumber = (block.difficulty + block.timestamp + seed) %
            100;
        console.log("Random # generated: %s", randomNumber);

        seed = randomNumber;

        if (randomNumber < 50) {
            console.log("%s won!", msg.sender);

            uint256 prizeAmount = 0.00001 ether;
            require(
                prizeAmount <= address(this).balance,
                "Trying to withdraw more money than the contract has."
            );
            (bool success, ) = (msg.sender).call{value: prizeAmount}("");
            require(success, "Failed to withdraw money from contract.");
        }

        emit NewPoem(msg.sender, block.timestamp, _poetry);
    }

    function getAllPoems() public view returns (Poem[] memory) {
        return poems;
    }

    function getTotalPoems() public view returns (uint256) {
        console.log("%d poets were here.", totalPoems);
        return totalPoems;
    }
}
