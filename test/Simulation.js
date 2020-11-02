const truffleAssert = require('truffle-assertions');
const { time } = require('openzeppelin-test-helpers');
const should = require('chai').should();
const Web3 = require('web3');

const AuctionFactory = artifacts.require("AuctionFactory");
const BlindAuction = artifacts.require("BlindAuction");
const Registry = artifacts.require("Registry");

contract("Simulation", async (accounts) => {
  // Always deploy contract instance before any test
  console.log(
    "Here we will instantiate a AuctionFactory with it's corresponding Registry. Then we will start 2 bids for CZ4153.ntu and CE4153.ntu with different parameters. We will have 3 bidders."
  )
  let  registry, auctionfactory;
  const owner = accounts[0];
  const bidder1 = accounts[1];
  const bidder2 = accounts[2];
  const bidder3 = accounts[3];
  beforeEach(async function() {
    // Advance to the next block to correctly read time in the solidity
    await time.advanceBlock();

    auctionfactory = await AuctionFactory.deployed();
    const regAddr = await auctionfactory.registryAddr();
    const regInstance = new Registry(regAddr);
  });
});
