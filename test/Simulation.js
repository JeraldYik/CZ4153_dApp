const truffleAssert = require('truffle-assertions');
const { time } = require('openzeppelin-test-helpers');
const should = require('chai').should();
const Web3 = require('web3');

const AuctionFactory = artifacts.require("AuctionFactory");
const BlindAuction = artifacts.require("BlindAuction");
const Registry = artifacts.require("Registry");

contract("Simulation", async (accounts) => {
  // Constants
  let  registry, auctionfactory, regAddr;
  const owner = accounts[0];
  const bidder1 = accounts[1];
  const bidder2 = accounts[2];
  const bidder3 = accounts[3];
  const recipient = accounts[4];
  const bid1Salt = web3.utils.fromAscii("B1b1");
  const bid2Salt = web3.utils.fromAscii("B2b2");
  const bid3Salt = web3.utils.fromAscii("B3b3");
  beforeEach(async function() {
    // Advance to the next block to correctly read time in the solidity
    await time.advanceBlock();

    auctionfactory = await AuctionFactory.deployed();
    regAddr = await auctionfactory.registryAddr();
    registry = new Registry(regAddr);
  });

  it("Simulation", async () => {
    console.log("Here we will instantiate a AuctionFactory with it's corresponding Registry.");
    console.log("Then we will start 2 bids for CZ4153.ntu and CE4153.ntu with different parameters.");
    console.log("We will have 3 bidders.");
    // Query for availability of CZ4153 and CE4153
    await truffleAssert.reverts(registry.queryDomainOwner.call("CZ4153"), "This domain is available.");
    await truffleAssert.reverts(registry.queryDomainOwner.call("CE4153"), "This domain is available.");
    console.log("Both CZ4153.ntu and CE4153.ntu are available");

    // Starting the Auctions for both domains with different parameters with a 30 second break
    cz4153Auction = await auctionfactory.createAuction.call(100000,150,150,"CZ4153");
    await auctionfactory.createAuction(100000,150,150,"CZ4153");
    const czInstance = new BlindAuction(cz4153Auction);
    await time.increase(30); // Time now: 30 seconds in
    ce4153Auction = await auctionfactory.createAuction.call(50000,50,50,"CE4153");
    await auctionfactory.createAuction(50000,50,50,"CE4153");
    const ceInstance = new BlindAuction(ce4153Auction);
    const cz4153Addr = await auctionfactory.findAuction.call("CZ4153");
    const ce4153Addr = await auctionfactory.findAuction.call("CE4153");
    assert.equal(cz4153Auction, cz4153Addr);
    assert.equal(ce4153Auction, ce4153Addr);
    console.log("Both contracts for CZ4153 and CE4153.ntu have been deployed");

    // Query for availability of CZ4153 and CE4153 again
    await truffleAssert.reverts(registry.queryDomainOwner.call("CZ4153"), "This domain is available");
    await truffleAssert.reverts(registry.queryDomainOwner.call("CE4153"), "This domain is available");
    await truffleAssert.reverts(auctionfactory.createAuction(100000,150,150,"CZ4153"), "The current domain is currently being bidded for");
    await truffleAssert.reverts(auctionfactory.createAuction(100000,150,150,"CE4153"), "The current domain is currently being bidded for");
    console.log("Both CZ4153.ntu and CE4153.ntu are currently being bidded for");

    // Bidders 1, 2 and 3 places increasing bids for CZ4153
    // Only Bidder 2 has placed a valid bid as he meets the bidIncrement and deposited enough Ether
    const bidderOne_CZBidOne = await czInstance.bidHash.call(50000, false, bid1Salt);
    const bidderTwo_CZBidOne = await czInstance.bidHash.call(100000, false, bid2Salt);
    const bidderThree_CZBidOne = await czInstance.bidHash.call(150000, false, bid3Salt);

    await czInstance.commitBid(bidderOne_CZBidOne, {
      from: bidder1,
      value: 100000,
      gas: "400000"
    });
    await czInstance.commitBid(bidderTwo_CZBidOne, {
      from: bidder2,
      value: 100000,
      gas: "400000"
    });
    await czInstance.commitBid(bidderThree_CZBidOne, {
      from: bidder3,
      value: 100000,
      gas: "400000"
    });
    console.log("");
    console.log("Time: 30s");
    console.log("");
    console.log("CZ4153: 100K from Bidder 2");
    console.log("Bidder 1 deposit for CZ: 100K");
    console.log("Bidder 2 deposit for CZ: 100K");
    console.log("Bidder 3 deposit for CZ: 100K");

    // Bidders 1, 2 and 3 places increasing bids for CE4153
    const bidderOne_CEBidOne = await ceInstance.bidHash.call(50000, false, bid1Salt);
    const bidderTwo_CEBidOne = await ceInstance.bidHash.call(60000, false, bid2Salt);
    const bidderThree_CEBidOne = await ceInstance.bidHash.call(100000, false, bid3Salt);

    await ceInstance.commitBid(bidderOne_CEBidOne, {
      from: bidder1,
      value: 100000,
      gas: "400000"
    });
    await ceInstance.commitBid(bidderTwo_CEBidOne, {
      from: bidder2,
      value: 100000,
      gas: "400000"
    });
    await ceInstance.commitBid(bidderThree_CEBidOne, {
      from: bidder3,
      value: 100000,
      gas: "400000"
    });
    console.log("");
    console.log("CE4153: 100K from Bidder 3");
    console.log("Bidder 1 deposit for CE: 100K");
    console.log("Bidder 2 deposit for CE: 100K");
    console.log("Bidder 3 deposit for CE: 100K");

    // Increase time to 60s (20s left for CE to bid and 90s left for CZ to bid)
    await time.increase(30);
    console.log("");
    console.log("Time: 60s, 90s left for CZ to bid and 20s left for CE to bid");
    console.log("");

    // Fresh bids for CZ, bidder 1 fakes a bid, bidder 3 outbids and bidder 2 abstains
    const bidderOne_CZBidTwo = await czInstance.bidHash.call(50000, true, bid1Salt);
    const bidderThree_CZBidTwo = await czInstance.bidHash.call(250000, false, bid3Salt);
    await czInstance.commitBid(bidderOne_CZBidTwo, {
      from: bidder1,
      value: 20000,
      gas: "400000"
    });
    await czInstance.commitBid(bidderThree_CZBidTwo, {
      from: bidder3,
      value: 300000,
      gas: "400000"
    });
    console.log("CZ4153: 250K (rounds to 200K) from Bidder 2");
    console.log("Bidder 1 deposit for CZ: 120K");
    console.log("Bidder 2 deposit for CZ: 100K");
    console.log("Bidder 3 deposit for CZ: 400K");

    // Fresh bids for CE, bidder 1 raises to 150K, bidder 2 tries for 180K (invalid), bidder 3 bids 220K (rounds down to 200K)
    const bidderOne_CEBidTwo = await ceInstance.bidHash.call(150000, false, bid1Salt);
    const bidderTwo_CEBidTwo = await ceInstance.bidHash.call(180000, false, bid2Salt);
    const bidderThree_CEBidTwo = await ceInstance.bidHash.call(220000, false, bid3Salt);
    await ceInstance.commitBid(bidderOne_CEBidTwo, {
      from: bidder1,
      value: 150000,
      gas: "400000"
    });
    await ceInstance.commitBid(bidderTwo_CEBidTwo, {
      from: bidder2,
      value: 180000,
      gas: "400000"
    });
    await ceInstance.commitBid(bidderThree_CEBidTwo, {
      from: bidder3,
      value: 250000,
      gas: "400000"
    });
    console.log("");
    console.log("CE4153: 220K (200K) from Bidder 3");
    console.log("Bidder 1 deposit for CE: 250K");
    console.log("Bidder 2 deposit for CE: 280K");
    console.log("Bidder 3 deposit for CE: 350K");

    // Increase time to 90s (40s left for CE to reveal and 60s left for CZ to bid)
    await time.increase(30);
    console.log("");
    console.log("Time: 90s, 60s left for CZ to bid and 40s left for CE to reveal");
    console.log("");

    // Reveal bids for CE domainName
    const bidder1ValArrayCE = [50000,150000];
    const bidder1FakeArrayCE = [false, false];
    const bidder1SaltArrayCE = [bid1Salt, bid1Salt];
    const bidder2ValArrayCE = [60000,180000];
    const bidder2FakeArrayCE = [false, false];
    const bidder2SaltArrayCE = [bid2Salt, bid2Salt];
    const bidder3ValArrayCE = [100000,220000];
    const bidder3FakeArrayCE = [false, false];
    const bidder3SaltArrayCE = [bid3Salt, bid3Salt];
    await ceInstance.revealBid(bidder1ValArrayCE, bidder1FakeArrayCE, bidder1SaltArrayCE, {
      from: bidder1,
      gas: "400000"
    });
    await ceInstance.revealBid(bidder2ValArrayCE, bidder2FakeArrayCE, bidder2SaltArrayCE, {
      from: bidder2,
      gas: "400000"
    });
    await ceInstance.revealBid(bidder3ValArrayCE, bidder3FakeArrayCE, bidder3SaltArrayCE, {
      from: bidder3,
      gas: "400000"
    });
    console.log("All 3 bidders successfully revealed bids for CE4153");
    console.log("");

    // 3rd round of bidding for CZ4153, bidder1 outbids, bidder2 outbids bidder1
    const bidderOne_CZBidThree = await czInstance.bidHash.call(310000, false, bid1Salt);
    const bidderTwo_CZBidTwo = await czInstance.bidHash.call(420000, false, bid2Salt);
    const bidderThree_CZBidThree = await czInstance.bidHash.call(350000, false, bid3Salt);
    await czInstance.commitBid(bidderOne_CZBidThree, {
      from: bidder1,
      value: 350000,
      gas: "400000"
    });
    await czInstance.commitBid(bidderTwo_CZBidTwo, {
      from: bidder2,
      value: 450000,
      gas: "400000"
    });
    await czInstance.commitBid(bidderThree_CZBidThree, {
      from: bidder3,
      value: 350000,
      gas: "400000"
    });
    console.log("CZ4153: 400K from Bidder 2");
    console.log("Bidder 1 deposit for CZ: 470K");
    console.log("Bidder 2 deposit for CZ: 550K");
    console.log("Bidder 3 deposit for CZ: 750K");

    // Increase time to 160s (CE Auction has ended and 140s left for CZ to reveal)
    await time.increase(70);
    console.log("");
    console.log("Time: 160s, CE Auction has ended and 140s left for CZ to reveal");
    console.log("");

    // Ends the CE Auction first and query its domain owner followed by withdrawing refunds
    await auctionfactory.endAuction("CE4153");
    const ceDomainOwner = await registry.queryDomainOwner("CE4153");
    assert.equal(bidder3, ceDomainOwner);
    const ceWithdraw1 = await ceInstance.withdraw.call({
      from: bidder1,
      gas: "400000"
    });
    await ceInstance.withdraw.call({
      from: bidder1,
      gas: "400000"
    });
    const ceWithdraw2 = await ceInstance.withdraw.call({
      from: bidder2,
      gas: "400000"
    });
    await ceInstance.withdraw({
      from: bidder2,
      gas: "400000"
    });
    const ceWithdraw3 = await ceInstance.withdraw.call({
      from: bidder3,
      gas: "400000"
    });
    await ceInstance.withdraw({
      from: bidder3,
      gas: "400000"
    });
    console.log("Bidder 1 withdraws: " + ceWithdraw1.toNumber().toString());
    console.log("Bidder 2 withdraws: " + ceWithdraw2.toNumber().toString());
    console.log("Bidder 3 withdraws: " + ceWithdraw3.toNumber().toString());
    console.log("Domain Owner: Bidder 3 (paid 100000)")
    // Cannot withdraw for CZ4153
    await truffleAssert.reverts(czInstance.withdraw.call({
      from: bidder1,
      gas: "400000"
    }), "Auction is still ongoing");
    // Reveal bids for CZ4153
    const bidder1ValArrayCZ = [50000, 50000, 310000];
    const bidder1FakeArrayCZ = [false, true, false];
    const bidder1SaltArrayCZ = [bid1Salt, bid1Salt, bid1Salt];
    const bidder2ValArrayCZ = [100000, 420000];
    const bidder2FakeArrayCZ = [false, false];
    const bidder2SaltArrayCZ = [bid2Salt, bid2Salt];
    const bidder3ValArrayCZ = [150000, 250000, 350000];
    const bidder3FakeArrayCZ = [false, false, false];
    const bidder3SaltArrayCZ = [bid3Salt, bid3Salt, bid3Salt];

    await czInstance.revealBid(bidder1ValArrayCZ, bidder1FakeArrayCZ, bidder1SaltArrayCZ, {
      from: bidder1,
      gas: "400000"
    });
    await czInstance.revealBid(bidder2ValArrayCZ, bidder2FakeArrayCZ, bidder2SaltArrayCZ, {
      from: bidder2,
      gas: "400000"
    });
    await czInstance.revealBid(bidder3ValArrayCZ, bidder3FakeArrayCZ, bidder3SaltArrayCZ, {
      from: bidder3,
      gas: "400000"
    });
    console.log("All 3 bidders successfully revealed bids for CE4153");
    console.log("");

    // Increase time to 310s (CE Auction has ended and 140s left for CZ to reveal)
    await time.increase(150);
    console.log("");
    console.log("Time: 310s, Both Auctions are revealed");
    console.log("");

    // Ending the CZ4153 auction
    const txn = await auctionfactory.endAuction("CZ4153");
    const czDomainOwner = await registry.queryDomainOwner("CZ4153");
    assert.equal(bidder2, czDomainOwner);

    const czWithdraw1 = await czInstance.withdraw.call({
      from: bidder1,
      gas: "400000"
    });
    await czInstance.withdraw.call({
      from: bidder1,
      gas: "400000"
    });
    const czWithdraw2 = await czInstance.withdraw.call({
      from: bidder2,
      gas: "400000"
    });
    await czInstance.withdraw({
      from: bidder2,
      gas: "400000"
    });
    const czWithdraw3 = await czInstance.withdraw.call({
      from: bidder3,
      gas: "400000"
    });
    await czInstance.withdraw({
      from: bidder3,
      gas: "400000"
    });
    console.log("Bidder 1 withdraws: " + czWithdraw1.toNumber().toString());
    console.log("Bidder 2 withdraws: " + czWithdraw2.toNumber().toString());
    console.log("Bidder 3 withdraws: " + czWithdraw3.toNumber().toString());
    console.log("Domain Owner: Bidder 2 (paid 400000)")

    // Bidder 2 and 3 attempts to transfer ownership of cz4153.ntu to Bidder 1
    const czhash = await registry.getDomainNamehash.call("CZ4153");
    await truffleAssert.reverts(registry.transferOwner(czhash, bidder1, {
        from: bidder3,
        gas: "400000"
      }), "Only owner is authorised to perform this action!"
    );
    await registry.transferOwner(czhash, bidder1, {
        from: bidder2,
        gas: "400000"
      });
    const czNewDomainOwner = await registry.queryDomainOwner.call("CZ4153");
    assert.equal(bidder1, czNewDomainOwner);
    console.log("");
    console.log("Bidder 2 transferred 'CZ4153.ntu' to Bidder 1 successfully");

    // Bidder 1 and 3 attempts to designate payable address for CZ4153.ntu
    await truffleAssert.reverts(registry.setAddr(czhash, recipient, {
        from: bidder3,
        gas: "400000"
      }), "Only owner is authorised to perform this action!"
    );
    await registry.setAddr(czhash, recipient, {
        from: bidder1,
        gas: "400000"
      });
    const czNewPayableAddr = await registry.queryDomainPayableAddr.call("CZ4153");
    assert.equal(recipient, czNewPayableAddr);
    console.log("Bidder 1 has assigned Recipient as the payable address for CZ4153.ntu");

    // Reverse queries
    const domainByOwner = await registry.queryDomainFromOwner.call(bidder1);
    const domainByPayableAddr = await registry.queryDomainFromPayableAddr.call(recipient);
    assert.equal(domainByOwner, "CZ4153");
    assert.equal(domainByOwner, domainByPayableAddr);
    console.log("Reverse query functions are working!")

    // Send recipient some Ether
    const transferTxn = await registry.payDomainPayableAddr("CZ4153", {
      from: accounts[0],
      value: 5000000000000000000,
      gas: "400000"
    });
    const getBalance = await web3.eth.getBalance(recipient);
    console.log("Recipient New Balance:");
    console.log(getBalance);
  });
});
