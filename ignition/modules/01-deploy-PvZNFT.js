const { network } = require("hardhat")
const { networkConfig, developmentChains } = require("../../helper-hardhat-config")
// const { verify } = require("../../utils/verify")
require("dotenv").config()

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()
  const chainId = network.config.chainId

  let ethUsdPriceFeedAddress
  if (chainId == 31337) {
      const ethUsdAggregator = await deployments.get("MockV3Aggregator")
      ethUsdPriceFeedAddress = ethUsdAggregator.address
  } else {
      ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
  }
  log("----------------------------------------------------")
  log("Deploying PvZ and waiting for confirmations...")
  const pvZNFT = await deploy("PvZNFT", {
      from: deployer,
      args: [ethUsdPriceFeedAddress],
      log: true,
      waitConfirmations: network.config.blockConfirmations || 1,
  })
  log(`PvZNFT deployed at ${pvZNFT.address}`)

  if (
      !developmentChains.includes(network.name) &&
      process.env.ETHERSCAN_API_KEY
  ) {
      await verify(pvZNFT.address, [ethUsdPriceFeedAddress])
  }

}

module.exports.tags = ["all", "PvZNFT"]

