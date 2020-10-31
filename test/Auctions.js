const truffleAssert = require('truffle-assertions');
const { time } = require('openzeppelin-test-helpers');
const should = require('chai').should();
const Web3 = require('web3');

const AuctionFactory = artifacts.require("AuctionFactory");
const BlindAuction = artifacts.require("BlindAuction");
const Registry = artifacts.require("Registry");
const Resolver = artifacts.require("Resolver");

// Test AuctionFactory's functions
contract("AuctionFactory", async (accounts) => {
  // Always deploy contract instance before any test
  let auctionfactory, startTime, bidTimeEnd, revealTimeEnd, contract;
  beforeEach(async function() {
    // Advance to the next block to correctly read time in the solidity
    await time.advanceBlock();

    auctionfactory = await AuctionFactory.deployed();
  });


  it("should make deployer the owner", async () => {
    const owner = await auctionfactory.owner();
    assert.equal(owner, accounts[0]);
  });

  // A new contract address should be generated when it is deployed
  it("should deploy BlindAuction successfully", async () => {
    contract = await auctionfactory.createAuction.call(50000,90,90,"CZ4153");
    await auctionfactory.createAuction(50000,90,90,"CZ4153");
    const addr = await auctionfactory.findAuction.call("CZ4153");
    assert.equal(contract, addr);
  });

  // Still working on this
  it("should allow people to bid", async () => {
    startTime = await time.latest();
    bidTimeEnd = startTime + 90;
    revealTimeEnd = startTime + 180;


    // const contract = await auctionfactory.createAuction.call(50000,90,90,"CZ4153");
    // const addr = await auctionfactory.findAuction.call("CZ4153");
    // const test = contract.test(2)
    // assert.equal(contract, addr);
    //
    // await time.increaseTo(revealTimeEnd);
    // const contract = await auctionfactory.endAuction("CZ4152");
    // await truffleAssert.reverts(
    //     auctionfactory.findAuction("CZ4152", {
    //        from: addr,
    //        gas: "400000" }),
    //       "revert Domain has already been registered"
    //     );
  });

  // it("should end an ongoing Auction successfully", async () => {
  //   startTime = await time.latest();
  //   revealTimeEnd = startTime + 200; // Must add more than 180
  //   const addr = await auctionfactory.findAuction.call("CZ4153");
  //   await time.increaseTo(revealTimeEnd);
  //   const contract = await auctionfactory.endAuction("CZ4153");
  //   await truffleAssert.reverts(
  //       auctionfactory.findAuction("CZ4153", {
  //          from: addr,
  //          gas: "400000" }),
  //         "revert Domain has already been registered"
  //       );
  // });



});
