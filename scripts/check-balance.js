const { ethers } = require("hardhat")
const contract = require("../utils/contractAddress.js")
const { getPlant } = require("../utils/getPlant.js")

async function checkBalance() {
    const PvZNFT = await ethers.getContractAt("PvZNFT", contract.address)

    const plantIds = contract.ownTokenId

    console.log("checking balance...")
    const [signer] = await ethers.getSigners()
    const balance = await PvZNFT.balanceOf(signer.address)
    console.log(`${signer.address} owns ${balance.toString()} NFTs.`)
    console.log(plantIds)

    for (let i = 0; i < plantIds.length; i++) {
        let id = plantIds[i]

        const result = await PvZNFT.getPlant(id)

        console.log(
            `Plant ID: ${id}, ${result[0]}, ${result[1]}, ${result[2]}, ${result[3]}`
        )
    }
}

checkBalance()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
