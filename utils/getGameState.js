const { ethers } = require("hardhat");
require("dotenv").config();

async function getGameState() {
    const contractAddress = "0xYourDeployedContractAddress";
    const pvzContract = await ethers.getContractAt("PvZNFT", contractAddress);

    const totalSupply = await pvzContract.totalSupply();
    let plants = [];

    for (let i = 1; i <= totalSupply; i++) {
        const owner = await pvzContract.ownerOf(i);
        const [plantType, hp, produceRate, attack] = await pvzContract.getPlant(i);
        const tokenURI = await pvzContract.tokenURI(i);

        plants.push({
            id: `p${i}`,
            owner,
            type: plantType,
            hp: Number(hp),
            produceRate: Number(produceRate),
            attack: Number(attack),
            metadataURI: tokenURI
        });
    }

    console.log("🌱 Current Plants in Game:", JSON.stringify(plants, null, 2));
}

getGameState().catch(console.error);