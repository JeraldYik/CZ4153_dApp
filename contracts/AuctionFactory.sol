pragma solidity >=0.4.22 <0.8.0;

import {Auction} from "./Auction.sol";

contract AuctionFactory {
    Auction[] private auctions;

    event AuctionCreated(
        Auction auctionContract,
        address owner,
        uint256 numAuctions,
        Auction[] allAuctions
    );

    constructor() public {}

    function createAuction(
        uint256 bidIncrement,
        uint256 startBlock,
        uint256 endBlock
    ) public {
        Auction newAuction = new Auction(
            msg.sender,
            bidIncrement,
            startBlock,
            endBlock
        );
        Auction[] memory aux = new Auction[](auctions.length + 1);
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
