const { ethers, getNamedAccounts } = require("hardhat")
const plantFeatures = require("../utils/plantFeatures.js")
const contract = require("../utils/contractAddress.js")
require("dotenv").config()

async function mintPlant() {
    const PvZNFT = await ethers.getContractAt("PvZNFT", contract.address)

    console.log(`Got contract PvZNFT at ${PvZNFT.address}`)
    console.log("Available plants: ", Object.keys(plantFeatures).join(", "))
    const plantType = await prompt("Enter plant type: ")

    if (!plantFeatures[plantType]) {
        console.log("Invalid plant type!")
        return
    }

    const mintFee = ethers.utils.parseEther("0.1")

    const { deployer } = await getNamedAccounts()
    console.log("Minting new plant for address: ", deployer)

    const metadataURI = plantFeatures[plantType].metadataURI
    let message = plantFeatures[plantType].message
    let attributes = {}

    for (const [key, range] of Object.entries(
        plantFeatures[plantType].attributes
    )) {
        attributes[key] =
            Math.floor(Math.random() * (range.max - range.min + 1)) + range.min
    }

    try {
        const tx = await PvZNFT.mintPlant(
            deployer,
            plantType,
            attributes.hp || 0,
            attributes.produceRate || 0,
            attributes.attack || 0,
            metadataURI,
            { value: mintFee, gasLimit: 500000 }
        )
        const receipt = await tx.wait()

        const tokenId = receipt.events[0].args.tokenId.toString()

        message += ` ID: ${tokenId}`
        for (const [key, value] of Object.entries(attributes)) {
            message += `, ${key}: ${value}`
        }
        console.log(message)

        //plant
        const plantEvent = receipt.events.find(
            (event) => event.event === "PlantMinted"
        )

        // 获取并打印植物属性
        if (plantEvent) {
            const { tokenId, plantType, hp, produceRate, attack } =
                plantEvent.args

            console.log("我是植物:")
            console.log(`Token ID: ${tokenId}`)
            console.log(`Plant Type: ${plantType}`)
            console.log(`HP: ${hp}`)
            console.log(`Produce Rate: ${produceRate}`)
            console.log(`Attack: ${attack}`)
        }
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
