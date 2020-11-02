pragma solidity >=0.4.22 <0.8.0;

import {BlindAuction} from "./BlindAuction.sol";
import {Registry} from "./Registry.sol";

contract AuctionFactory {
    constructor() public {
      owner = msg.sender;
    }

    // Mapping domainNamehash to struct AuctionParam
    mapping(bytes32 => AuctionParam) public auctions;
    bytes32[] public auctionKeys;
    address public owner;

    // Instantiating new Registry
    Registry registry = new Registry();

    // Declaring Structs used in this contract
    struct AuctionParam {
      BlindAuction auctionContract;
      string domain;
      bool taken;
      bool ended;
    }

    // Declaring events that will be emitted
    event AuctionCreated(
        BlindAuction auctionContract,
        address owner,
        uint256 numAuctions
    );

    event AuctionEnded(address topBidder, uint256 topBid);


    // Functions which changes state variables

    // Creating new auctions
    function createAuction (
        uint256 bidIncrement,
        uint256 biddingTime,
        uint256 revealTime,
        string memory _domain
    )
        public
        payable
        returns (BlindAuction)
    {
        bytes32 _namehash = registry.getDomainNamehash(_domain);
        BlindAuction newAuction = new BlindAuction(
            bidIncrement,
            biddingTime,
            revealTime,
            _namehash,
            address(uint160(address(owner)))
        );
        require(auctions[_namehash].ended == false, "The current domain is already registered");
        require(auctions[_namehash].taken == false, "The current domain is currently being bidded for");

        // mapping new auction parameters for the domainNamehash
        auctions[_namehash] = AuctionParam({
           auctionContract: newAuction,
           domain: _domain,
           taken: true,
           ended: false
        });
        auctionKeys.push(_namehash);

        emit AuctionCreated(newAuction, msg.sender, auctionKeys.length);
        return newAuction;
    }

    // End ongoing auctions for a given domain name
    function endAuction(string memory domain)
        public
    {
        bytes32 _namehash = registry.getDomainNamehash(domain);
        require(auctions[_namehash].ended == false, "Auction has already ended!");
        require(auctions[_namehash].taken == true, "No such ongoing auctions!");
        auctions[_namehash].ended = true;

        BlindAuction auctionContract = auctions[_namehash].auctionContract;
        address addr = address(auctionContract);
        address payable instanceAddr = address(uint160(addr));
        BlindAuction instance = BlindAuction(instanceAddr);
        //
        address topBidder = instance.auctionEnd();
        registry.registerNewDomain(domain, topBidder);
    }


    // Functions that do not change state variables (Callable functiosn)

    // Call registry address
    function registryAddr() public view returns (address) {
      address regAddr = registry.getRegAddress();
      return regAddr;
    }

    // Find and return only ongoing auctions from domain name
    function findAuction(string memory domain)
        public
        view
        returns (BlindAuction)
    {
        bytes32 _namehash = registry.getDomainNamehash(domain);
        require(auctions[_namehash].ended == false, "Domain has already been registered");
        require(auctions[_namehash].taken == true, "Domain is available for auction");
        return auctions[_namehash].auctionContract;
    }

    // Returns number of ongoing auctions
    function getAuctionsCount()
        public
        view
        returns(uint auctionCount)
    {
        return auctionKeys.length;
    }

    // Returns all ongoing auctions' addresses
    function allAuctionsAddr()
        public
        view
        returns (BlindAuction[] memory)
    {
        BlindAuction[] memory contractaddress;
        uint auctionCount = auctionKeys.length;

        for (uint i = 0; i < auctionCount; i++) {
            bytes32 curr_namehash = auctionKeys[i];
            AuctionParam storage curr_auctionParam = auctions[curr_namehash];
            if (curr_auctionParam.taken == true && curr_auctionParam.ended == false) {
              contractaddress[i] = curr_auctionParam.auctionContract;
            }
        }
        return (contractaddress);
    }

    // Returns all ongoing auctions' domain names
    function allAuctionsDomain()
        public
        view
        returns (bytes32[] memory)
    {
        bytes32[] memory domainName;
        uint auctionCount = auctionKeys.length;

        for (uint i = 0; i < auctionCount; i++) {
            bytes32 curr_namehash = auctionKeys[i];
            AuctionParam storage curr_auctionParam = auctions[curr_namehash];
            if (curr_auctionParam.taken == true && curr_auctionParam.ended == false) {
              string memory strDomainName = curr_auctionParam.domain;
              bytes32 byteDomainName = stringToBytes32(strDomainName);
              domainName[i] = byteDomainName;
            }
        }
        return (domainName);
    }


    // Pure functions and modifiers

    // Converts a string to a bytes32 variable
    function stringToBytes32(string memory _source) pure public returns (bytes32 result) {
        bytes memory tempEmptyStringTest = bytes(_source);
        if (tempEmptyStringTest.length == 0) {
            return 0x0;
        }

        assembly {
            result := mload(add(_source, 32))
        }
    }

}
