pragma solidity >=0.4.22 <0.8.0;

contract Registry {
    //static variable
    address public owner;
    mapping(bytes32 => Record) public records;
    bytes32[] public recordsKeys;
    address public test = address(this);

    constructor() public {
        owner = msg.sender;
    }

    struct Record {
        address payable currentPayableAddr;
        address owner;
        string domain;
        bool taken;
    }

    // Events to log significant events occuring within the registry
    event NewDomain(
        bytes32 indexed namehash,
        address owner,
        string domain,
        bool taken,
        address contractAddr
    );
    event Transfer(bytes32 indexed namehash, address owner);
    event AddrChanged(bytes32 indexed namehash, address walletaddress);

    // Functions which changes state variables

    // Creating a new entry for a new registered domain
    function registerNewDomain(string memory _domain, address _owner) public {
        bytes32 _namehash = getDomainNamehash(_domain);
        bool _taken = records[_namehash].taken;
        require(_taken == false, "This domain has been registered.");
        // Push these information back to the Registry if domain is unregistered
        records[_namehash] = Record({
            currentPayableAddr: address(uint160(_owner)),
            owner: _owner,
            domain: _domain,
            taken: true
        });
        recordsKeys.push(_namehash);

        emit NewDomain(
            _namehash,
            msg.sender,
            records[_namehash].domain,
            records[_namehash].taken,
            test
        );
    }

    // Transfer domain ownership, callable only by owner
    function transferOwner(bytes32 _namehash, address _newowner)
        public
        only_owner(_namehash)
    {
        emit Transfer(_namehash, _newowner);
        setAddr(_namehash, address(uint160(_newowner)));
        records[_namehash].owner = _newowner;
    }

    // Designate a payable address for the registered domain
    function setAddr(bytes32 _namehash, address payable _yourwalletaddr)
        public
        only_owner(_namehash)
    {
        records[_namehash].currentPayableAddr = _yourwalletaddr;
        emit AddrChanged(_namehash, _yourwalletaddr);
    }

    // Pay a domain's payableAddr ether
    function payDomainPayableAddr(string memory _domain) public payable {
        bytes32 _namehash = getDomainNamehash(_domain);
        address payable _currentPayableAddr = records[_namehash]
            .currentPayableAddr;
        _currentPayableAddr.transfer(msg.value);
    }

    // Functions that do not change state variables (Callable functiosn)

    // Find the domain owner from
    function queryDomainOwner(string memory _domain)
        public
        view
        returns (address)
    {
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

    function queryDomainPayableAddr(string memory _domain) public view returns (address)
    {
        bool _taken;
        bytes32 _namehash = getDomainNamehash(_domain);
        if (records[_namehash].taken == true) {
              _taken = records[_namehash].taken;
              address payable _currentPayableAddr = records[_namehash].currentPayableAddr;
              return _currentPayableAddr;
      }
      require(_taken == true, "This domain is available.");
    }

    function queryDomainFromOwner(address _owner) public view returns (string memory domainName) {
      string memory _domainName = "";
      bytes32 _currentNamehash;
      for (uint i = 0; i < recordsKeys.length; i++) {
          _currentNamehash = recordsKeys[i];
          if (records[_currentNamehash].owner == _owner) {
              _domainName = records[_currentNamehash].domain;
          }
      }
      require(keccak256(abi.encodePacked((_domainName))) != keccak256(abi.encodePacked((""))),
            "This address does not own a registered domain."
        );
        return _domainName;
    }

    function queryDomainFromPayableAddr(address _payableAddr)
        public
        view
        returns (string memory domainName)
    {
        string memory _domainName = "";
        bytes32 _currentNamehash;
        for (uint256 i = 0; i < recordsKeys.length; i++) {
            _currentNamehash = recordsKeys[i];
            if (records[_currentNamehash].currentPayableAddr == _payableAddr) {
                _domainName = records[_currentNamehash].domain;
            }
        }
        require(keccak256(abi.encodePacked((_domainName))) != keccak256(abi.encodePacked((""))),
            "This address is not designated a registered domain."
        );
        return _domainName;
    }

    // Pure functions and modifiers

    // Derive the domainNamehash for any given domain
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

    // Calls the deployed registry address
    function getRegAddress() public view returns (address) {
        return address(this);
    }

    function getCurrentPayableAddress(bytes32 _namehash)
        public
        view
        returns (address payable)
    {
        return records[_namehash].currentPayableAddr;
    }

    modifier only_owner(bytes32 namehash) {
        require(
            records[namehash].owner == msg.sender,
            "Only owner is authorised to perform this action!"
        );
        _;
    }
}
