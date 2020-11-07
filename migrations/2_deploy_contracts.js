var AuctionFactory = artifacts.require("AuctionFactory");
var Registry = artifacts.require("Registry")

module.exports = function(deployer) {
  deployer.deploy(AuctionFactory);
};
