const fs = require("fs")
const { ethers, getNamedAccounts } = require("hardhat")
const plantFeatures = require("../utils/plantFeatures.js")
const contract = require("../utils/contractAddress.js")
const { accountPrompt } = require("./user-manager.js")
require("dotenv").config()
const USERS_FILE = "./user.json"

async function mintPlant() {
    // ask player to login to get user's information
    console.log("Please log in or sign up")
    const userInfo = await accountPrompt()
    const user = await ethers.getSigner(userInfo.walletAddress)
    console.log(user)
    console.log("------------------------------------------")

    // get contract
    const PvZNFT = await ethers.getContractAt("PvZNFT", contract.address)
    console.log(`Got contract PvZNFT at ${PvZNFT.address}`)

    // get what user want to mint
    console.log("Available plants: ", Object.keys(plantFeatures).join(", "))
    const plantType = await prompt("Enter plant type: ")

    if (!plantFeatures[plantType]) {
        console.log("Invalid plant type!")
        return
    }

    const { deployer } = await getNamedAccounts()
    console.log(deployer)
    console.log(
        "Minting new plant for wallet address: ",
        userInfo.walletAddress
    )

    // define properties of the plant
    const mintFee = ethers.utils.parseEther("0.1")
    const metadataURI = plantFeatures[plantType].metadataURI
    let message = plantFeatures[plantType].message
    let attributes = {}

    // generate actual properties
    for (const [key, range] of Object.entries(
        plantFeatures[plantType].attributes
    )) {
        attributes[key] =
            Math.floor(Math.random() * (range.max - range.min + 1)) + range.min
    }

    // mintting process
    try {
        const tx = await PvZNFT.mintPlant(
            user.address,
            plantType,
            attributes.hp || 0,
            attributes.produceRate || 0,
            attributes.attack || 0,
            metadataURI,
            { value: mintFee, gasLimit: 500000 }
        )

        const receipt = await tx.wait()
        const tokenId = receipt.events[0].args.tokenId.toString()

        // print success message and relevant properties
        message += ` ID: ${tokenId}`
        for (const [key, value] of Object.entries(attributes)) {
            message += `, ${key}: ${value}`
        }
        console.log(message)

        // define mint event
        const plantEvent = receipt.events.find(
            (event) => event.event === "PlantMinted"
        )

        // an example of how event can be used
        if (plantEvent) {
            const { tokenId, plantType, hp, produceRate, attack } =
                plantEvent.args

            console.log("我是植物:")
            console.log(`Token ID: ${tokenId}`)
            console.log(`Plant Type: ${plantType}`)
            console.log(`HP: ${hp}`)
            console.log(`Produce Rate: ${produceRate}`)
            console.log(`Attack: ${attack}`)

            let users = []
            if (fs.existsSync(USERS_FILE)) {
                users = JSON.parse(fs.readFileSync(USERS_FILE, "utf8"))
            }
            userInfo.ownTokens.push(tokenId.toString())
            users.pop()
            users.push(userInfo)
            fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), "utf8")
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
