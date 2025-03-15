const { ethers } = require("hardhat")
const contract = require("./contractAddress.js")
// 有问题，先别用
const getPlant = async (plantId) => {
    const PvZNFT = await ethers.getContractAt("PvZNFT", contract.address)

    // needs token id as input
    try {
        const { type, hp, rate, attack } = await PvZNFT.getPlant(plantId)
        return `Plant ID: ${plantId}, ${/*type,*/ (hp, rate, attack)}`
    } catch (error) {
        console.error("❌ Get NFT info failed:", error)
    }
}

module.exports = { getPlant }
