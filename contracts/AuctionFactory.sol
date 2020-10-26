pragma solidity >=0.4.22 <0.8.0;

import {BlindAuction} from "./BlindAuction.sol";

contract AuctionFactory {
    BlindAuction[] private auctions;
    // DomainName[] public domains;

    event AuctionCreated(
        BlindAuction auctionContract,
        address owner,
        uint256 numAuctions,
        BlindAuction[] allAuctions
    );

    event AuctionEnded(
      address topBidder,
      uint topBid
    );

    constructor() public {}

    function createAuction(uint256 bidIncrement, uint biddingTime, uint256 revealTime) public {
        BlindAuction newAuction = new BlindAuction(
            msg.sender,
            bidIncrement,
            biddingTime,
            revealTime
        );
        BlindAuction[] memory aux = new BlindAuction[](auctions.length + 1);
        for (uint256 i = 0; i < auctions.length; i++) {
            aux[i] = auctions[i];
        }
        aux[aux.length - 1] = newAuction;
        auctions = aux;

        emit AuctionCreated(newAuction, msg.sender, auctions.length, auctions);
    }

    function endAuction() public {

    }
    // function allAuctions() pure public returns (address[]) {
    //     return auctions;
    // }
}
