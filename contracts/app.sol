// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract RockPaperScissors {
    address public player1;
    address public player2;
    uint256 public minBet = 0.0001 ether;
    uint256 public contractBalance;
    bytes32 public hashedMove1;
    bytes32 public hashedMove2;
    string public clearMove1;
    string public clearMove2;
    uint256 public revealTimeout = 60; // in seconds
    uint256 public revealStartTime;

    modifier onlyRegistered() {
        require(msg.sender == player1 && msg.sender == player2, "Not registered");
        _;
    }

    modifier bothPlayersPlayed() {
        require(bytes(clearMove1).length > 0 && bytes(clearMove2).length > 0, "Both players must play");
        _;
    }

    modifier revealPhase() {
        require(block.timestamp > revealStartTime && block.timestamp < revealStartTime + revealTimeout, "Not in reveal phase");
        _;
    }

    function register() external payable {
        require(msg.value >= minBet, "Insufficient funds");
        if (player1 == address(0)) {
            player1 = msg.sender;
        } else if (player2 == address(0)) {
            require(msg.sender != player1, "Player 1 and Player 2 must be different");
            player2 = msg.sender;
        } else {
            revert("Both players are already registered");
        }
        contractBalance += msg.value;
    }

    function play(bytes32 _hashedMove) external onlyRegistered {
        if (msg.sender == player1) {
            require(hashedMove1 == bytes32(0), "Player 1 has already played");
            hashedMove1 = _hashedMove;
        } else {
            require(hashedMove2 == bytes32(0), "Player 2 has already played");
            hashedMove2 = _hashedMove;
        }
    }

    function reveal(string memory _clearMove) external onlyRegistered revealPhase {
        if (msg.sender == player1) {
            require(keccak256(abi.encodePacked(_clearMove)) == hashedMove1, "Invalid move or password");
            clearMove1 = _clearMove;
        } else {
            require(keccak256(abi.encodePacked(_clearMove)) == hashedMove2, "Invalid move or password");
            clearMove2 = _clearMove;
        }
    }

    function getOutcome() external onlyRegistered bothPlayersPlayed revealPhase {
        require(keccak256(abi.encodePacked(clearMove1)) != keccak256(abi.encodePacked(clearMove2)), "It's a draw");

        if (
            keccak256(abi.encodePacked(clearMove1)) == keccak256(abi.encodePacked("Rock")) && keccak256(abi.encodePacked(clearMove2)) == keccak256(abi.encodePacked("Scissors")) 
            ) {
            payable(msg.sender).transfer(contractBalance);
        } else {
            payable((msg.sender == player1) ? player2 : player1).transfer(contractBalance);
        }

        // Reset the game
        resetGame();
    }

    function resetGame() internal {
        player1 = address(0);
        player2 = address(0);
        hashedMove1 = bytes32(0);
        hashedMove2 = bytes32(0);
        clearMove1 = "";
        clearMove2 = "";
        contractBalance = 0;
        revealStartTime = 0;
    }

    function startRevealPhase() external onlyRegistered bothPlayersPlayed {
        require(revealStartTime == 0, "Reveal phase already started");
        revealStartTime = block.timestamp;
    }

    function getContractBalance() external view returns (uint256) {
        return contractBalance;
    }

    function whoAmI() external view returns (uint256) {
        if (msg.sender == player1) {
            return 1;
        } else if (msg.sender == player2) {
            return 2;
        } else {
            return 0;
        }
    }

}