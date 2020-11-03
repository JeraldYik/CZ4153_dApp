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
    BlindAuction[] public allAuctAddr;
    bytes32[] public allAuctDomains;
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
    function createAuction(
        uint256 bidIncrement,
        uint256 biddingTime,
        uint256 revealTime,
        string memory _domain
    ) public payable returns (BlindAuction) {
        bytes32 _namehash = registry.getDomainNamehash(_domain);
        BlindAuction newAuction = new BlindAuction(
            bidIncrement,
            biddingTime,
            revealTime,
            _namehash,
            address(uint160(address(owner)))
        );
        require(
            auctions[_namehash].ended == false,
            "The current domain is already registered"
        );
        require(
            auctions[_namehash].taken == false,
            "The current domain is currently being bidded for"
        );

        // mapping new auction parameters for the domainNamehash
        auctions[_namehash] = AuctionParam({
            auctionContract: newAuction,
            domain: _domain,
            taken: true,
            ended: false
        });
        auctionKeys.push(_namehash);
        allAuctAddr.push(newAuction);
        bytes32 domainInBytes = stringToBytes32(_domain);
        allAuctDomains.push(domainInBytes);

        emit AuctionCreated(newAuction, msg.sender, auctionKeys.length);
        return newAuction;
    }

    // End ongoing auctions for a given domain name
    function endAuction(string memory domain) public {
        bytes32 _namehash = registry.getDomainNamehash(domain);
        require(
            auctions[_namehash].ended == false,
            "Auction has already ended!"
        );
        require(auctions[_namehash].taken == true, "No such ongoing auctions!");

        BlindAuction auctionContract = auctions[_namehash].auctionContract;
        address addr = address(auctionContract);
        address payable instanceAddr = address(uint160(addr));
        BlindAuction instance = BlindAuction(instanceAddr);
        bool _checkCancel = instance.checkCancel();

        if (_checkCancel == false) {
            auctions[_namehash].ended = true;
            address topBidder = instance.auctionEnd();
            registry.registerNewDomain(domain, topBidder);
        } else {
            auctions[_namehash].ended = false;
            auctions[_namehash].taken = false;
        }
    }

    // Expose relevant BlindAuction methods
    function commitBid(string memory domain, bytes32 _blindBid) public {
        bytes32 _namehash = registry.getDomainNamehash(domain);
        require(
            auctions[_namehash].ended == false,
            "Auction has already ended!"
        );
        BlindAuction auction = auctions[_namehash].auctionContract;
        auction.commitBid(_blindBid);
    }

    function revealBid(
        string memory domain,
        uint256[] memory _bidvalue,
        bool[] memory _fake,
        bytes32[] memory _salt
    ) public {
        bytes32 _namehash = registry.getDomainNamehash(domain);
        require(
            auctions[_namehash].ended == false,
            "Auction has already ended!"
        );
        BlindAuction auction = auctions[_namehash].auctionContract;
        auction.revealBid(_bidvalue, _fake, _salt);
    }

    function bidHash(
        uint256 _bidvalue,
        bool _fake,
        bytes32 _salt
    ) public pure returns (bytes32 blindBid) {
        blindBid = keccak256(abi.encodePacked(_bidvalue, _fake, _salt));
        return blindBid;
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
        require(
            auctions[_namehash].ended == false,
            "Domain has already been registered"
        );
        require(
            auctions[_namehash].taken == true,
            "Domain is available for auction"
        );
        return auctions[_namehash].auctionContract;
    }

    // Returns number of ongoing auctions
    function getAuctionsCount() public view returns (uint256 auctionCount) {
        return auctionKeys.length;
    }

    // Returns all ongoing auctions' addresses
    function allAuctionsAddr() public view returns (BlindAuction[] memory) {
        // BlindAuction[] memory contractaddress;
        // uint auctionCount = auctionKeys.length;
        // //
        // for (uint i = 0; i < auctionCount; i++) {
        //     bytes32 curr_namehash = auctionKeys[i];
        //     AuctionParam storage curr_auctionParam = auctions[curr_namehash];
        //     if (curr_auctionParam.taken == true && curr_auctionParam.ended == false) {
        //       BlindAuction currAuctContract = curr_auctionParam.auctionContract;
        //       contractaddress[i] = currAuctContract;
        //     }
        // }
        return (allAuctAddr);
    }

    // Returns all ongoing auctions' domain names
    function allAuctionsDomain() public view returns (bytes32[] memory) {
        // bytes32[] memory domainName;
        // uint auctionCount = auctionKeys.length;
        //
        // for (uint i = 0; i < auctionCount; i++) {
        //     bytes32 curr_namehash = auctionKeys[i];
        //     AuctionParam storage curr_auctionParam = auctions[curr_namehash];
        //     if (curr_auctionParam.taken == true && curr_auctionParam.ended == false) {
        //       string memory strDomainName = curr_auctionParam.domain;
        //       bytes32 byteDomainName = stringToBytes32(strDomainName);
        //       domainName[i] = byteDomainName;
        //     }
        // }
        return (allAuctDomains);
    }

    // Pure functions and modifiers

    // Converts a string to a bytes32 variable
    function stringToBytes32(string memory _source)
        public
        pure
        returns (bytes32 result)
    {
        bytes memory tempEmptyStringTest = bytes(_source);
        if (tempEmptyStringTest.length == 0) {
            return 0x0;
        }

        assembly {
            result := mload(add(_source, 32))
        }
    }
}
