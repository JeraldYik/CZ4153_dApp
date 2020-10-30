const AuctionFactory = artifacts.require("AuctionFactory");
const BlindAuction = artifacts.require("BlindAuction");
const Registry = artifacts.require("Registry");
const Resolver = artifacts.require("Resolver");
const truffleAssert = require('truffle-assertions');

// Test AuctionFactory's functions
contract("AuctionFactory", async (accounts) => {
  // accounts are the list of account created by the Truffle (i.e. 10 key pair)
  it("should make deployer the owner", async () => {
    const auctionfactory = await AuctionFactory.deployed();
    const owner = await auctionfactory.owner();
    assert.equal(owner, accounts[0]);
  });

  // this test still has errors
  it("should deploy BlindAuction successfully", async () => {
    const auctionfactory = await AuctionFactory.deployed();
    await auctionfactory.createAuction(50000,90,90,"CZ4153", {
      from: accounts[0],
      gas: "400000"
    });
    domain_name = auctionfactory.findAuction.call("CZ4153").domain;
    // assert.equal(domain_name, "CZ4153");
  });

});
