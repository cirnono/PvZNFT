// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract PvZNFT is ERC721URIStorage  {
    uint256 private _nextTokenId;

    // 事件定义
    event PlantMinted(uint256 tokenId, string plantType, uint256 hp, uint256 produceRate, uint256 attack);

    struct Plant {
        string plantType; // 记录植物类型，如 "Sunflower"、"Peashooter"
        uint256 hp;
        uint256 produceRate;
        uint256 attack;
    }

    mapping(uint256 => Plant) public plantData; // NFT ID -> 植物属性

    constructor() ERC721("PvZPlants", "PVZP") {
        _nextTokenId = 1;
    }

    function mintPlant(
        address player,
        string memory plantType,
        uint256 hp,
        uint256 produceRate, 
        uint256 attack,
        string memory metadataURI
    ) public payable returns (uint256) {
        uint256 newTokenId = _nextTokenId;
        _nextTokenId++;

        _safeMint(player, newTokenId);
        _setTokenURI(newTokenId, metadataURI);

        plantData[newTokenId] = Plant(plantType, hp, produceRate, attack);
        // 在 mintPlant 中触发事件
        emit PlantMinted(newTokenId, plantData[newTokenId].plantType, plantData[newTokenId].hp, plantData[newTokenId].produceRate, plantData[newTokenId].attack);
        return (newTokenId);
    }

    function getPlant(
        uint256 tokenId
    ) public view returns (string memory, uint256, uint256, uint256) {
        Plant memory plant = plantData[tokenId];
        return (plant.plantType, plant.hp, plant.produceRate, plant.attack);
    }

}
