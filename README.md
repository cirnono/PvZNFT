# PvZNFT

A project used to strength understanding to hardhat and solidity while learning

Package used outdagted, to be refractor into foundry version

## To start:
```shell
yarn
yarn hardhat compile
```

## To deploy to a local hardhat testnet
1. Start a new terminal and run
```shell
yarn hardhat node
```
2. Create your .env file and record the private keys to .env. By default, the first account is the deployer
3. Start a new terminal while keeping the first terminal alive
4. Run
```shell
yarn deploy:local
```
if you need to re-deploy, run
```shell
yarn deploy:local --reset
```
5. Record the contract address to utils/contractAddress.js (auto record will be implemented in the future)

## To interact with the deployed contract
1. To mint an NFT, run
```shell
yarn mint
```
the default network is hardhat, you can specify the network by --network <network_name>.
e.g.
```shell
yarn mint --network localhost
```
to interact with the contract deployed on the local hardhat node

2. To check balance of the user, run
```shell
yarn hardhat run scripts/getGameState.js
```

## TODOs
0. Account manager, user is asked to login (or sign up if it is for the first time). Then minted NFTs, username, password, and wallet connection can be stored
1. Implement game-logic.js, which starts the game, allow players to play with their own NFTs and verify the the provided NFTs
2. Implement scripts that auto record contract address, player's address and the token ids they own.
3. Write tests
4. Front-end
5. NFT trading

## Take-aways:
1. function returns of solidiy is in the form of storing address, need to .toString() to convert to actual value
2. To use hard-had deploy, need ethers@5.7.2
