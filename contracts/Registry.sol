pragma solidity >=0.4.22 <0.8.0;

contract Registry {
    //static variable
    address public owner;
    mapping(bytes32 => Record) public records;
    bytes32[] public recordsKeys;

    constructor() public {
      owner = msg.sender;
    }

    struct Record {
        string domain;
        bytes32 namehash;
        address owner;
        bool taken;
    }

    // Events to log significant events occuring within the registry
    event NewDomain(bytes32 indexed namehash, address owner, string domain, bool taken);
    event Transfer(bytes32 indexed namehash, address owner);

    // Creating a new entry for a new registered domain
    function registerNewDomain(string memory _domain, address _owner)
        public
        returns (bytes32 namehash)
    {
        bytes32 _namehash = getDomainNamehash(_domain);
        bool _taken = records[_namehash].taken;
        require(_taken == false, "This domain has been registered.");
        // Push these information back to the Registry if domain is unregistered
        records[_namehash] = Record({
            domain: _domain,
            namehash: _namehash,
            owner: _owner,
            taken: true
        });
        recordsKeys.push(_namehash);

        emit NewDomain(_namehash, msg.sender, records[_namehash].domain, records[_namehash].taken);
        return _namehash;
    }

    function queryDomainOwner(string memory _domain) public view returns (address) {
      address _owner;
      bool _taken;
      bytes32 _namehash = getDomainNamehash(_domain);
      if (records[_namehash].taken == true) {
              _taken = records[_namehash].taken;
              _owner = records[_namehash].owner;
              return _owner;
      }
      require(_taken == true, "This domain is available.");
    }

    // Transfer domain ownership, callable only by owner
    function transferOwner(bytes32 _namehash, address _newowner)
        public
        only_owner(_namehash)
    {
        emit Transfer(_namehash, _newowner);
        records[_namehash].owner = _newowner;
    }

    // Pure functions and modifiers
    function getDomainNamehash(string memory _domain)
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

    modifier only_owner(bytes32 namehash) {
        require(
            records[namehash].owner == msg.sender,
            "Only owner is authorised to perform this action!"
        );
        _;
    }
}
