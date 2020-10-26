pragma solidity >=0.4.22 <0.8.0;

import {BlindAuction} from "./BlindAuction.sol";

contract AuctionFactory {
    BlindAuction[] private auctions;

    event AuctionCreated(
        BlindAuction auctionContract,
        address owner,
        uint256 numAuctions,
        BlindAuction[] allAuctions
    );

    constructor() public {}

    function createAuction(
        uint256 bidIncrement,
        uint256 startBlock,
        uint256 endBlock
    ) public {
        BlindAuction newAuction = new BlindAuction(
            msg.sender,
            bidIncrement,
            startBlock,
            endBlock
        );
        BlindAuction[] memory aux = new BlindAuction[](auctions.length + 1);
        for (uint256 i = 0; i < auctions.length; i++) {
            aux[i] = auctions[i];
        }
        aux[aux.length - 1] = newAuction;
        auctions = aux;

        emit AuctionCreated(newAuction, msg.sender, auctions.length, auctions);
    }

    // function allAuctions() pure public returns (address[]) {
    //     return auctions;
    // }
}
