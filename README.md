# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a Hardhat Ignition module that deploys that contract.

To start:

```shell
yarn
yarn hardhat compile
```




To deploy to a local hardhat testnet, open a terminal and run:
```shell
yarn hardhat node
``` 

Open another terminal while leaving the first one running the hardhat nodes with lists of accounts
Deploy a nft generator PvZNFT.sol, to be used for minting NFTs:

```shell
yarn hardhat run scripts/01-deploy-PvZNFT.js
```



To mint plant NFT:
```shell
yarn hardhat run scripts/mintPlant.js
```

To run the game:
```shell
yarn hardhat run scripts/gameLogics.js
```

To check game status:

```shell
yarn hardhat run scripts/getGameState.js
```