require("web3");
const AuctionFactory = artifacts.require("AuctionFactory");
const BlindAuction = artifacts.require("BlindAuction");
const Registry = artifacts.require("Registry")
const Resolver = artifacts.require("Resolver")

// test Registry's functions
contract("Registry", async (accounts) => {
  // accounts are the list of account created by the Truffle (i.e. 10 key pair)
  it("should make deployer the owner", async () => {
    const registry = await Registry.deployed();
    const owner = await registry.owner();
    assert.equal(owner, accounts[0]);
  });

  it("can register a new domain", async () => {
    // 2nd wallet on Ganache registers a new domain CZ4153.ntu (Arrange)
    const registry = await Registry.deployed();
    const buyer = accounts[1];

    // Call functions from Registry.sol (Act)
    await registry.registerNewDomain("CZ4153", buyer, {
      from: buyer,
      gas: "400000"
    });
    const namehash = await registry.registerNewDomain.call("CZ4153", buyer);
    const registered_namehash = await registry.getDomainNamehash.call("CZ4153");
    const registered_owner = await registry.queryDomainOwner.call("CZ4153");

    // Check results (Assert)
    assert.equal(namehash, registered_namehash);
    assert.equal(registered_owner, accounts[1]);
  });

  it("can transfer a domain", async() => {
    // Transfer domain from wallet 2 to wallet 3 on Ganache (Arrange)
    const registry = await Registry.deployed();
    const initHolder = accounts[1];
    const finHolder = accounts[2];
    await registry.registerNewDomain("CZ4153", initHolder, {
      from: initHolder,
      gas: "400000"
    });
    const namehash = await registry.getDomainNamehash.call("CZ4153");

    // Call functions from Registry.sol (Act)
    await registry.transferOwner(namehash, finHolder, {
      from: initHolder,
      gas: "400000"
    });
    const newHolder = await registry.queryDomainOwner.call("CZ4153");

    // Check results (Assert)
    assert.equal(newHolder, finHolder);
  });

});
