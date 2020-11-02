var AuctionFactory = artifacts.require("AuctionFactory");
var Registry = artifacts.require("Registry")

module.exports = function(deployer) {
  deployer.deploy(AuctionFactory);

  // This doesn't needs to be deployed for actual migration, only for unit testing
  deployer.deploy(Registry);
};
