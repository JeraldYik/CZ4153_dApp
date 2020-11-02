pragma solidity >=0.4.22 <0.8.0;

contract Resolver {
  constructor () public {}

  // Declaring a struct holding domain's information
  struct DomainInfo {
    address payable currentPayableAddr;
    address domainOwner;
    bytes32 domainNamehash;
    string domainName;
  }

  // Declaring events to be emitted
  event AddrChanged(bytes32 indexed namehash, address walletaddress);

  // Mapping a 32bytes domainNamehash to the corresponding DomainInfo
  mapping(bytes32=>DomainInfo) private getDomainInfo;

  // Functions which changes state variables

  // Set address for the corresponding domain name
  function setAddr(bytes32 _namehash, address _yourwalletaddr) public {
    address currentOwner = getDomainInfo[_namehash].domainOwner;
    require(msg.sender == currentOwner, "Only owner is authorised to perform this action!");

    getDomainInfo[_namehash].domainOwner = _yourwalletaddr;
    emit AddrChanged(_namehash, _yourwalletaddr);
  }


  // Functions that do not change state variables (Callable functions)
  // function addr(bytes32 _namehash) view public returns(memory DomainInfo) {
  //   return getDomainInfo[_namehash];
  // }


  // function supportsInterface(bytes4 interfaceID) constant returns (bool) {
  //     return interfaceID == 0x3b3b57de || interfaceID == 0x01ffc9a7;
  // }

}
