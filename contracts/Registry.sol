pragma solidity >=0.4.22 <0.8.0;

contract Registry {
    //static variable
    constructor() public {}

    struct Record {
        string domain;
        bytes32 namehash;
        address owner;
    }

    mapping(bytes32 => Record) public records;
    bytes32[] recordsKeys;

    // Stores owner's namehash for his/her owned domain
    bytes32 ownernamehash;

    // Events to log significant events occuring within the registry
    event NewDomain(bytes32 indexed namehash, address owner);
    event Transfer(bytes32 indexed namehash, address owner);

    // Creating a new entry for a new registered domain
    function registerNewDomain(string memory _domain, address _owner)
        public
        returns (bytes32 namehash)
    {
        bytes32 _namehash = getOwnerNamehash(_domain);
        // Push these information back to the Registry
        records[_namehash] = Record({
            domain: _domain,
            namehash: _namehash,
            owner: _owner
        });
        recordsKeys.push(_namehash);

        emit NewDomain(_namehash, msg.sender);
        return _namehash;
    }

    function getOwnerNamehash(string memory _domain)
        public
        pure
        returns (bytes32 _namehash)
    {
        // Create namehash for quicker referencing since its indexed
        // This approach does not account for '.' in the _domain variable
        string memory empty = "";
        if (keccak256(bytes(_domain)) == keccak256(bytes(empty))) {
            _namehash = 0x00000000000000000000000000000000;
        } else {
            _namehash = keccak256(
                abi.encodePacked(
                    _namehash,
                    keccak256(abi.encodePacked(_domain))
                )
            );
            _namehash = keccak256(
                abi.encodePacked(_namehash, keccak256(abi.encodePacked("ntu")))
            );
        }
    }

    function owner(bytes32 _namehash) public returns (address owner) {
        address _owner;
        for (uint256 i = 0; i < recordsKeys.length; i++) {
            if (records[_namehash].owner != address(0x0)) {
                _owner = owner;
                return _owner;
            }
        }
        require(_owner != address(0x0), "Owner cannot be found");
    }

    //
    function transferOwner(bytes32 _namehash, address _newowner)
        public
        only_owner(ownernamehash)
    {
        emit Transfer(_namehash, _newowner);
        records[_namehash].owner = _newowner;
    }

    modifier only_owner(bytes32 namehash) {
        require(
            records[namehash].owner == msg.sender,
            "Only owner is authorised to perform this action!"
        );
        _;
    }
}

// struct Bid {
//   address bidOwner;
//   uint bidAmount;
//   bytes32 nameEntity;
// }
//
// mapping(bytes32 => Bid[]) highestBidder;
//
// function getBidCount(bytes32 name) public constant returns (uint) {
//     return highestBidder[name].length;
// }
//
// function getBid(bytes32 name, uint index) public constant returns (address, uint, bytes32) {
//     Bid storage bid = highestBidder[name][index];
//
//     return (bid.bidOwner, bid.bidAmount, bid.nameEntity);
// }
