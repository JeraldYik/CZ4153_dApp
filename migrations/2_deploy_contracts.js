var AuctionFactory = artifacts.require("AuctionFactory");
var BlindAuction = artifacts.require("BlindAuction");
var Registry = artifacts.require("Registry")
var Resolver = artifacts.require("Resolver")

module.exports = function(deployer) {
  deployer.deploy(AuctionFactory);
  deployer.deploy(Registry);
};
