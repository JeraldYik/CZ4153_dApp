pragma solidity >=0.4.22 <0.8.0;

contract Registry {
    constructor(address _auctFactOwner) public {
      owner = _auctFactOwner;
    }
    //static variable
    address public owner;
    mapping(bytes32 => Record) public records;
    mapping(address => bytes32[]) public addrOwnerDomains;
    mapping(address => bytes32[]) public regAddrOfDomains;
    bytes32[] public recordsKeys;

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
        bytes32[] test
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

        bytes32[] memory finalDomainNameArray = getTrimmedArrayFromOwner(_owner);
        addrOwnerDomains[_owner] = finalDomainNameArray;

        emit NewDomain(
            _namehash,
            msg.sender,
            records[_namehash].domain,
            records[_namehash].taken,
            finalDomainNameArray
        );
    }

    // Transfer domain ownership, callable only by owner
    function transferOwner(bytes32 _namehash, address _newowner)
        public
        only_owner(_namehash)
    {
        address oldOwner = msg.sender;
        setPayableAddr(_namehash, address(uint160(_newowner)));
        records[_namehash].owner = _newowner;

        bytes32[] memory oldOwnerDomains = getTrimmedArrayFromOwner(oldOwner);
        bytes32[] memory newOwnerDomains = getTrimmedArrayFromOwner(_newowner);
        addrOwnerDomains[oldOwner] = oldOwnerDomains;
        addrOwnerDomains[_newowner] = newOwnerDomains;

        emit Transfer(_namehash, _newowner);
    }

    // Designate a payable address for the registered domain
    function setPayableAddr(bytes32 _namehash, address payable _yourwalletaddr)
        public
        only_owner(_namehash)
    {
        address payable oldPayable = records[_namehash].currentPayableAddr;
        records[_namehash].currentPayableAddr = _yourwalletaddr;

        bytes32[] memory oldPayableDomains = getTrimmedArrayFromPayable(oldPayable);
        bytes32[] memory newPayableDomains = getTrimmedArrayFromPayable(_yourwalletaddr);
        regAddrOfDomains[oldPayable] = oldPayableDomains;
        regAddrOfDomains[_yourwalletaddr] = newPayableDomains;

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
    function queryDomainOwner(string memory _domain) public view returns (address)
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

    function queryDomainPayableAddr(string memory _domain) public view returns (address payable)
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

    function queryDomainFromOwner(address _owner) public view returns (bytes32[] memory domainNameArray) {
        domainNameArray = addrOwnerDomains[_owner];
        return domainNameArray;
    }

    function queryDomainFromPayableAddr(address _payableAddr) public view returns (bytes32[] memory domainNameArray)
    {
        domainNameArray = regAddrOfDomains[_payableAddr];
        return domainNameArray;
    }

    function getTrimmedArrayFromOwner(address target) public view returns (bytes32[] memory finalArray) {
        bytes32[] memory currentDomainNameArray = new bytes32[](recordsKeys.length);
        for (uint i = 0; i < recordsKeys.length; i++) {
            bytes32 _currentNamehash = recordsKeys[i];
            if (records[_currentNamehash].owner == target) {
                string memory _domainName = records[_currentNamehash].domain;
                bytes32 _domainNameInBytes = stringToBytes32(_domainName);
                currentDomainNameArray[i] = _domainNameInBytes;
            } else { currentDomainNameArray[i] = bytes32(0x0); }
        }
        finalArray = new bytes32[](recordsKeys.length);
        uint elementCount = 0;
        for (uint j = 0; j < currentDomainNameArray.length; j++) {
            bytes32 currentDomainName = currentDomainNameArray[j];
            if (currentDomainName != bytes32(0x0)) {
              finalArray[elementCount] = currentDomainName;
              elementCount = elementCount + 1;
            }
        }
        return finalArray;
    }

    function getTrimmedArrayFromPayable(address target) public view returns (bytes32[] memory finalArray) {
        bytes32[] memory currentDomainNameArray = new bytes32[](recordsKeys.length);
        for (uint i = 0; i < recordsKeys.length; i++) {
            bytes32 _currentNamehash = recordsKeys[i];
            if (records[_currentNamehash].currentPayableAddr == target) {
                string memory _domainName = records[_currentNamehash].domain;
                bytes32 _domainNameInBytes = stringToBytes32(_domainName);
                currentDomainNameArray[i] = _domainNameInBytes;
            } else { currentDomainNameArray[i] = bytes32(0x0); }
        }
        finalArray = new bytes32[](recordsKeys.length);
        uint elementCount = 0;
        for (uint j = 0; j < currentDomainNameArray.length; j++) {
            bytes32 currentDomainName = currentDomainNameArray[j];
            if (currentDomainName != bytes32(0x0)) {
              finalArray[elementCount] = currentDomainName;
              elementCount = elementCount + 1;
            }
        }
        return finalArray;
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

    // Converts a string to bytes32 type
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

    // Calls the deployed registry address
    function getRegAddress() public view returns (address) {
        return address(this);
    }

    // Calls reg owner
    function getRegOwner() public view returns (address) {
        return owner;
    }

    modifier only_owner(bytes32 namehash) {
        require(
            records[namehash].owner == msg.sender,
            "Only owner is authorised to perform this action!"
        );
        _;
    }
}
