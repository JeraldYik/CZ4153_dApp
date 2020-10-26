pragma solidity >=0.4.22 <0.8.0;

contract Resolver {
  constructor () public {}

  event AddrChanged(bytes32 indexed namehash, address walletaddress);

    // Stores owner's namehash and address for his/her owned domain
  address owner;

  mapping(bytes32=>address) addresses;

  function addr(bytes32 _namehash) view public returns(address) {
    return addresses[_namehash];
  }

  function setAddr(bytes32 _namehash, address _yourwalletaddr) only_owner() public {
    addresses[_namehash] = _yourwalletaddr;
    emit AddrChanged(_namehash, _yourwalletaddr);
  }

  // function supportsInterface(bytes4 interfaceID) constant returns (bool) {
  //     return interfaceID == 0x3b3b57de || interfaceID == 0x01ffc9a7;
  // }

  modifier only_owner() {require(msg.sender == owner, "Only owner is authorised to perform this action!"); _; }
}
