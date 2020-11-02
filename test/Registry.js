const { assert } = require('chai');
const truffleAssert = require('truffle-assertions');

const AuctionFactory = artifacts.require("AuctionFactory");
const BlindAuction = artifacts.require("BlindAuction");
const Registry = artifacts.require("Registry");
const Resolver = artifacts.require("Resolver");

// Test Registry's functions

contract("Registry and Resolver", async (accounts) => {
  // Always deploy contract instance before any test
  let registry;
  beforeEach(async function() {
    registry = await Registry.deployed();
  });

  // accounts are the list of account created by the Truffle (i.e. 10 key pair)
  it("should make deployer the owner", async () => {
    const owner = await registry.owner();
    assert.equal(owner, accounts[0]);
  });

  it("can register a new domain", async () => {
    // 2nd wallet on Ganache registers a new domain CZ4153.ntu (Arrange)
    const buyer = accounts[1];

    // Call functions from Registry.sol (Act)
    await registry.registerNewDomain("CZ4153", buyer, {
      from: buyer,
      gas: "400000"
    });
    const registered_owner = await registry.queryDomainOwner.call("CZ4153");

    // Check results, that owner is indeed 2nd wallet (Assert)
    assert.equal(registered_owner, accounts[1]);
  });

  it("can't register an existing domain", async () => {
    // 3rd wallet on Ganache attempts to register a new domain CZ4153.ntu (Arrange)
    const hacker = accounts[2];

    // Call functions from Registry.sol (Act)
    // Check results (Assert)
    await truffleAssert.reverts(
        registry.registerNewDomain("CZ4153", hacker, {
           from: hacker,
           gas: "400000" }),
          "revert This domain has been registered."
        );
  });

  it("can transfer a domain", async() => {
    // Transfer domain from wallet 2 to wallet 3 on Ganache (Arrange)
    const initHolder = accounts[1];
    const finHolder = accounts[2];
    const namehash = await registry.getDomainNamehash.call("CZ4153");

    // Call functions from Registry.sol (Act)
    await registry.transferOwner(namehash, finHolder, {
      from: initHolder,
      gas: "400000"
    });
    const newHolder = await registry.queryDomainOwner.call("CZ4153");
    const newPayableAddr = await registry.getCurrentPayableAddress.call(namehash);

    // Check results (Assert)
    assert.equal(newHolder, finHolder);
    assert.equal(newPayableAddr, finHolder);
  });

  it("can't transfer a domain it does not own", async() => {
    // Transfering domain from wallet 3 to wallet 2 on Ganache,
    // except wallet 4 is trying to do it (Arrange)
    const initHolder = accounts[2];
    const finHolder = accounts[1];
    const hacker = accounts[3];
    const namehash = await registry.getDomainNamehash.call("CZ4153");

    // Call functions from Registry.sol (Act)
    await truffleAssert.reverts(
      registry.transferOwner(namehash, finHolder, {
        from: hacker,
        gas: "400000" }),
        "revert Only owner is authorised to perform this action!"
      )
    const newHolder = await registry.queryDomainOwner.call("CZ4153");

    // Check results (Assert)
    assert.equal(newHolder, initHolder);
  });

  // payDomainPayableAddr

  // queryDomainFromOwner

  // queryDomainFromPayableAddr

  // getDomainNamehash

  // getRegAddress

});
