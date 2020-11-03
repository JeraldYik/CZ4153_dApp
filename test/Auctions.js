const truffleAssert = require('truffle-assertions');
const { time } = require('openzeppelin-test-helpers');
const should = require('chai').should();
const Web3 = require('web3');
const { utils } = require('web3');

const AuctionFactory = artifacts.require("AuctionFactory");
const BlindAuction = artifacts.require("BlindAuction");
const Registry = artifacts.require("Registry");

// Test AuctionFactory's and BlindAuction's functions
contract("AuctionFactory and BlindAuction", async (accounts) => {
  // Always deploy contract instance before any test
  let  registry, auctionfactory, contract;
  beforeEach(async function() {
    // Advance to the next block to correctly read time in the solidity
    await time.advanceBlock();

    auctionfactory = await AuctionFactory.deployed();
    const regAddr = await auctionfactory.registryAddr();
    registry = new Registry(regAddr);
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

  // Able to accept valid bids during bidding period and reveal bids after it ends
  it("should be able to accept bids during an ongoing Auction successfully", async () => {
    const contractinstance = new BlindAuction(contract);
    const bidvalue = 100000;
    const fake = false;
    const saltinbytes = web3.utils.fromAscii("password");
    const bidHash = await contractinstance.bidHash.call(bidvalue, fake, saltinbytes);
    const bidder = accounts[1];

    // Send bid in
    const txn = await contractinstance.commitBid(bidHash, {
      from: bidder,
      value: 100000,
      gas: "400000"
    });

    // Need toLowerCase the actual addresses because the return params are all in lower case
    // Eth addresses are not case sensitive either
    assert.equal(txn.receipt.from, accounts[1].toLowerCase());
    assert.equal(txn.receipt.to, contract.toLowerCase());
  });

  // Cannot reveal bids before revealTime
  it("should not be able to reveal bids before revealTime", async () => {
    const contractinstance = new BlindAuction(contract);
    const bidvalue = 100000;
    const fake = false;
    const saltinbytes = web3.utils.fromAscii("password");
    await truffleAssert.reverts(
        contractinstance.revealBid([bidvalue],[fake],[saltinbytes]),
        "revert block.timestamp must be after _time"
      );
  });

  // Can reveal but cannot bid after bidTime is over
  it("should not be able to bid but able to reveal after bidTIme and before revealTime", async () => {
    const contractinstance = new BlindAuction(contract);
    const bidvalue = 100000;
    const fake = false;
    const saltinbytes = web3.utils.fromAscii("password");
    const bidHash = await contractinstance.bidHash.call(bidvalue, fake, saltinbytes);
    const bidder = accounts[1];
    await time.increase(91);

    await truffleAssert.reverts(
      contractinstance.commitBid(bidHash),
        "revert block.timestamp must be before _time"
      );

    const txn = await contractinstance.revealBid([bidvalue],[fake],[saltinbytes], {
      from: bidder,
      gas: "400000"
    });
  });

  // Cannot reveal already revealed bid and cannot bid nor reveal after revealTime
  it("should not be able to reveal bids which are already revealed and no bids nor reveals after revealTime", async () => {
    const contractinstance = new BlindAuction(contract);
    const bidvalue = 3;
    const fake = false;
    const saltinbytes = web3.utils.fromAscii("password");
    const bidHash = await contractinstance.bidHash.call(bidvalue, fake, saltinbytes);
    const bidder = accounts[1];
    await truffleAssert.reverts(contractinstance.revealBid([bidvalue],[fake],[saltinbytes], {
      from: bidder,
      gas: "400000"
    }),
      "revert CommitReveal::revealBid: Already revealed"
    );

    // after revealTime
    await time.increase(91);
    await truffleAssert.reverts(
      contractinstance.commitBid(bidHash),
        "revert block.timestamp must be before _time"
      );
    await truffleAssert.reverts(contractinstance.revealBid([bidvalue],[fake],[saltinbytes], {
      from: bidder,
      gas: "400000"
    }),
      "revert block.timestamp must be before _time"
    );

  });

  // Able to end ongoing bids and register domain to the topBidder
  it("should be able to end ongoing bids and register new domains", async () => {
    // await auctionfactory.testEndAuction.call("CZ4153");
    await auctionfactory.endAuction("CZ4153");
    await truffleAssert.reverts(
         auctionfactory.findAuction("CZ4153"),
         "revert Domain has already been registered"
        );
    // const regAddr = await auctionfactory.registryAddr();
    // const regInstance = new Registry(regAddr);
    const domainHolder = await registry.queryDomainOwner.call("CZ4153");
    assert.equal(accounts[1], domainHolder);
  });

  it("owner should be able to cancel ongoing bids", async () => {
    contract = await auctionfactory.createAuction.call(50000,90,90,"TestCancelDomain");
    await auctionfactory.createAuction(50000,90,90,"TestCancelDomain");
    const addr = await auctionfactory.findAuction.call("TestCancelDomain");
    const contractinstance = new BlindAuction(contract);

    // This can occur anytime before revealEnd
    await contractinstance.cancelAuction({
      from: accounts[0],
      gas: "400000"
    });

    const bidvalue = 100000;
    const fake = false;
    const saltinbytes = web3.utils.fromAscii("password");
    const bidHash = await contractinstance.bidHash.call(bidvalue, fake, saltinbytes);
    await contractinstance.commitBid(bidHash, {
      from: accounts[1],
      value: 150000,
      gas: "400000"
    });
    await time.increase(91);
    // Still have to reveal your bid if you want the refund
    await contractinstance.revealBid([bidvalue],[fake],[saltinbytes], {
      from: accounts[1],
      gas: "400000"
    });
    const withdrawAmt = await contractinstance.withdraw.call({
      from: accounts[1],
      gas: "400000"
    });
    const txn = await contractinstance.withdraw({
      from: accounts[1],
      gas: "400000"
    });
    // Deposit of 150K but only 1 bid increment of 50K, hence 150K - 50K
    const withdrawAmtInt = withdrawAmt.toNumber();
    assert.equal(withdrawAmtInt, 150000-50000);
  });

  it("should be able to start an auction for a cancelled domain", async () => {
    await time.increase(91);
    await auctionfactory.endAuction("TestCancelDomain");
    contract = await auctionfactory.createAuction.call(50000,90,90,"TestCancelDomain");
    await auctionfactory.createAuction(50000,90,90,"TestCancelDomain");
    const addr = await auctionfactory.findAuction.call("TestCancelDomain");
    const contractinstance = new BlindAuction(contract);
    assert.equal(addr,contract);
  });

  it("should be able to list ongoing auctions addresses and domains", async () => {
    const auctCount = await auctionfactory.getAuctionsCount.call();
    const auctCountInt = auctCount.toNumber();
    const auctAddr = await auctionfactory.allAuctionsAddr.call();
    const auctDomains = await auctionfactory.allAuctionsDomain.call();
    const auctNames = [];
    for (i = 0; i < auctDomains.length; i++) {
      let currentByteName = auctDomains[i];
      let currentName = web3.utils.toAscii(currentByteName).replace(/\0/g, '');
      auctNames[i] = currentName;
    };
    assert.equal(auctCount,auctAddr.length);
    assert.equal(auctCount,auctDomains.length);
    assert.equal(auctAddr.length,auctDomains.length);
  });

});
