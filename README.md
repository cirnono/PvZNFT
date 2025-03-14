# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a Hardhat Ignition module that deploys that contract.

To start:

```shell
yarn
yarn hardhat compile
```

Deploy a nft generator PvZNFT.sol, to be used for minting NFTs:

```shell
yarn hardhat ignition deploy --network sepolia
```

To mint plant NFT:

```shell
node scripts/mintPlant.js
```

or

```shell
yarn hardhat run scripts/mintPlant.js
```

To check game status:

```shell
node scripts/getGameState.js
```

or 

```shell
yarn hardhat run scripts/getGameState.js
```

To run the game:
```shell
node scripts/gameLogics.js
```

or 

```shell
yarn hardhat run scripts/gameLogics.js
```