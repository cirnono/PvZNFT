// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract PvZNFT is ERC721URIStorage {
    uint256 private _nextTokenId;

    struct Plant {
        string plantType; // 记录植物类型，如 "Sunflower"、"Peashooter"
        uint hp;
        uint produceRate;
        uint attack;
    }

    mapping(uint => Plant) public plantData; // NFT ID -> 植物属性

    constructor() ERC721("PvZPlants", "PVZP") {
        _nextTokenId = 1;
    }

    function mintPlant(
        address player,
        string memory plantType,
        uint hp,
        uint produceRate,
        uint attack,
        string memory metadataURI
    ) public payable returns (uint) {
        uint256 newTokenId = _nextTokenId;
        _nextTokenId++;

        _safeMint(player, newTokenId);
        _setTokenURI(newTokenId, metadataURI);

        plantData[newTokenId] = Plant(plantType, hp, produceRate, attack);

        return newTokenId;
    }

    function getPlant(
        uint tokenId
    ) public view returns (string memory, uint, uint, uint) {
        Plant memory plant = plantData[tokenId];
        return (plant.plantType, plant.hp, plant.produceRate, plant.attack);
    }
}
