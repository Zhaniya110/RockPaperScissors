document.addEventListener('DOMContentLoaded', async () => {
    if (window.ethereum) {
        window.web3 = new Web3(ethereum);
        try {
            await ethereum.enable();
        } catch (error) {
            console.error("User denied account access");
        }
    } else if (window.web3) {
        window.web3 = new Web3(web3.currentProvider);
    } else {
        console.error("Non-Ethereum browser detected. You should consider trying MetaMask!");
    }

    const contractAddress = '0x63e8827e9d57244bD6aa996371affB59FCA5E4a0';
    const contractABI = [
        {
            "inputs": [],
            "name": "bothPlayed",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "bothRevealed",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "clearMove1",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "clearMove2",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "contractBalance",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "getContractBalance",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "getOutcome",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "hashedMove1",
            "outputs": [
                {
                    "internalType": "bytes32",
                    "name": "",
                    "type": "bytes32"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "hashedMove2",
            "outputs": [
                {
                    "internalType": "bytes32",
                    "name": "",
                    "type": "bytes32"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "minBet",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "bytes32",
                    "name": "_hashedMove",
                    "type": "bytes32"
                }
            ],
            "name": "play",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "player1",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "player2",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "register",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "_clearMove",
                    "type": "string"
                }
            ],
            "name": "reveal",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "revealStartTime",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "revealTimeLeft",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "revealTimeout",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "startRevealPhase",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "whoAmI",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }
    ];

    const contract = new web3.eth.Contract(contractABI, contractAddress);

    const account = await web3.eth.getAccounts();
    console.log("Current Account: ", account[0]);

    // Register function
    window.register = async () => {
        await contract.methods.register().send({ from: account[0], value: web3.utils.toWei('0.0001', 'ether') });
        updateStatus();
    };

    // Play function
    window.play = async (move) => {
        const hashedMove = web3.utils.soliditySha3(move);
        await contract.methods.play(hashedMove).send({ from: account[0] });
        updateStatus();
    };

    // Reveal function
    window.reveal = async (clearMove) => {
        await contract.methods.reveal(clearMove).send({ from: account[0] });
        updateStatus();
    };

    // Get Outcome function
    window.getOutcome = async () => {
        await contract.methods.getOutcome().send({ from: account[0] });
        updateStatus();
    };

    // Start Reveal Phase function
    window.startRevealPhase = async () => {
        await contract.methods.startRevealPhase().send({ from: account[0] });
        updateStatus();
    };

    // Update status function
    const updateStatus = async () => {
        const whoAmI = await contract.methods.whoAmI().call({ from: account[0] });
        const bothPlayed = await contract.methods.bothPlayed().call();
        const bothRevealed = await contract.methods.bothRevealed().call();
        const revealTimeLeft = await contract.methods.revealTimeLeft().call();

        document.getElementById('status').innerHTML = `
            <p>Current Account: ${account[0]}</p>
            <p>Player ID: ${whoAmI}</p>
            <p>Both Played: ${bothPlayed}</p>
            <p>Both Revealed: ${bothRevealed}</p>
            <p>Reveal Time Left: ${revealTimeLeft} seconds</p>
        `;
    };

    updateStatus();
});
