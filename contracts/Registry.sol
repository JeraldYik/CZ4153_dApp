pragma solidity >=0.4.22 <0.8.0;

contract Registry {
  constructor() public {}

  struct Record {
    bytes32 domain;
    bytes32 namehash;
    address owner;
    address resolver;
  }

  mapping(bytes32=>Record[]) public records;

  // Stores owner's namehash for his/her owned domain
  bytes32 ownernamehash;

  // Events to log significant events occuring within the registry
  event NewDomain(bytes32 indexed namehash, address owner);
  event Transfer(bytes32 indexed namehash, address owner);

  // Creating a new entry for a new registered domain
  function registerNewDomain(bytes32 _domain, address _resolver) public {
    bytes32 _namehash = getOwnerNamehash(_domain);
    address _owner = msg.sender;
    // Push these information back to the Registry
    records[_namehash].push(Record({
    domain: _domain,
    namehash: _namehash,
    owner: _owner,
    resolver: _resolver
    }));

    emit NewDomain(_namehash, msg.sender);
  }

  function getOwnerNamehash(bytes32 _domain) pure public returns (bytes32 _namehash) {
    // Create namehash for quicker referencing since its indexed
    // This approach does not account for '.' in the _domain variable
    _namehash = 0x00000000000000000000000000000000;
    _namehash = keccak256(abi.encodePacked(_namehash, keccak256(abi.encodePacked(_domain))));
    _namehash = keccak256(abi.encodePacked(_namehash, keccak256(abi.encodePacked('ntu'))));
  }

  // function owner(bytes32 _namehash) public returns (address) {
  //   Record storage record = records[_namehash];
  //   return (record.owner);
  // }
  // //
  // function transferOwner(bytes32 _namehash, address _newowner) only_owner(ownernamehash) public {
  //   emit Transfer(_namehash, _newowner);
  //   records[_namehash].owner = _newowner;
  // }
  //
  // modifier only_owner(bytes32 namehash) {require(records[namehash].owner == msg.sender, "Only owner is authorised to perform this action!"); _; }

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
