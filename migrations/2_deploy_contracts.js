var AuctionFactory = artifacts.require("AuctionFactory");
var Registry = artifacts.require("Registry")
var Resolver = artifacts.require("Resolver")

module.exports = function(deployer) {
  deployer.deploy(Resolver);
  deployer.deploy(AuctionFactory);

  // This doesn't needs to be deployed for actual migration, only for unit testing
  deployer.deploy(Registry);
};
