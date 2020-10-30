pragma solidity >=0.4.22 <0.8.0;

import {BlindAuction} from "./BlindAuction.sol";
import {Registry} from "./Registry.sol";
import {Resolver} from "./Resolver.sol";

contract AuctionFactory {
    mapping(bytes32 => BlindAuction) private auctions;
    bytes32[] namehashes;
    Registry registry = new Registry();
    // DomainName[] public domains;

    event AuctionCreated(
        BlindAuction auctionContract,
        address owner,
        uint256 numAuctions
    );

    event AuctionEnded(address topBidder, uint256 topBid);

    constructor() public {}

    function createAuction(
        uint256 bidIncrement,
        uint256 biddingTime,
        uint256 revealTime,
        string memory domain
    ) public returns (BlindAuction) {
        bytes32 namehash = registry.registerNewDomain(domain, msg.sender);
        BlindAuction newAuction = new BlindAuction(
            msg.sender,
            bidIncrement,
            biddingTime,
            revealTime,
            namehash
        );
        auctions[namehash] = newAuction;
        namehashes.push(namehash);

        emit AuctionCreated(newAuction, msg.sender, namehashes.length);
        return newAuction;
    }

    function findAuction(string memory domain)
        public
        view
        returns (BlindAuction)
    {
        bytes32 _namehash = registry.getDomainNamehash(domain);
        // require(auctions[_namehash].namehash != 0, "Domain cannot be found");
        return auctions[_namehash];
    }

    function endAuction(string memory domain) public {
        bytes32 namehash = registry.registerNewDomain(domain, msg.sender);
        address topBidder = auctions[namehash].auctionEnd();
        registry.transferOwner(namehash, topBidder);
        // remove auction from storage?
    }

    // function allAuctions() public returns (BlindAuction[] memory) {
    //     BlindAuction[] memory _auctions = new BlindAuction[](namehashes.length);
    //     for (uint256 i = 0; i < namehashes.length; i++) {
    //         _auctions[i] = auctions[i];
    //     }
    //     return _auctions;
    // }
}
