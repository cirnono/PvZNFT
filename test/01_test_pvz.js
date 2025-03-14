const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PlantVsZombies", function () {
  let game;
  let owner;

  beforeEach(async () => {
    [owner] = await ethers.getSigners();
    const Game = await ethers.getContractFactory("PlantVsZombies");
    game = await Game.deploy();
  });

  it("应该正确初始化游戏", async () => {
    expect(await game.sunlight()).to.equal(100);
    expect(await game.currentRound()).to.equal(1);
  });

  it("允许种植向日葵", async () => {
    await game.executeAction(1, 0, 2, 3);
    const [plants] = await game.getGameState();
    expect(plants.length).to.equal(1);
    expect(plants[0].pType).to.equal(0);
  });

  it("应该正确显示游戏状态", async () => {
    await game.executeAction(1, 0, 2, 3); // 种植向日葵
    await game.executeAction(1, 1, 1, 5); // 种植豌豆射手
    await printGameState(game); // 传入合约实例
  });
});