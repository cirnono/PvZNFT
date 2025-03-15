const { ethers, getNamedAccounts } = require("hardhat")
const plantFeatures = require("../utils/plantFeatures.js")
require("dotenv").config()

async function mintPlant() {
    const { deployer } = await getNamedAccounts()
    const PvZNFT = await ethers.getContract("PvZNFT", deployer)

    console.log(`Got contract PvZNFT at ${PvZNFT.address}`)
    console.log("Available plants: ", Object.keys(plantFeatures).join(", "))
    const plantType = await gameLogic.prompt("Enter plant type: ")

    if (!plantFeatures[plantType]) {
        console.log("Invalid plant type!")
        return
    }

    const mintFee = ethers.utils.parseEther("0.1")

    const [signer] = await ethers.getSigners()
    console.log("Minting new plant for address: ", signer.address)

    const metadataURI = plantConfig[plantType].metadataURI
    const message = plantConfig[plantType].message
    let attributes = {}

    for (const [key, range] of Object.entries(
        plantFeatures[plantType].randomAttributes
    )) {
        attributes[key] =
            Math.floor(Math.random() * (range.max - range.min + 1)) + range.min
    }

    try {
        const tx = await PvZNFT.mintPlant(
            deployer.address,
            plantType,
            attributes.hp || 0,
            attributes.produceRate || 0,
            attributes.attack || 0,
            metadataURI,
            { value: mintFee }
        )
        const receipt = await tx.wait()

        const tokenId = receipt.events[0].args.tokenId.toString()
        message += `ID: ${tokenID}`
        for (const [key, value] of Object.entries(attributes)) {
            message += `, ${key}: ${value}`
        }
        console.log(message)
    } catch (error) {
        console.error("❌ Minting failed:", error)
    }
}

mintPlant()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })

async function prompt(question) {
    const readline = require("readline").createInterface({
        input: process.stdin,
        output: process.stdout,
    })
    return new Promise((resolve) =>
        readline.question(question, (ans) => {
            readline.close()
            resolve(ans)
        })
    )
}
