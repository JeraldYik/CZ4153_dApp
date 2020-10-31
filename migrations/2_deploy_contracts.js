var AuctionFactory = artifacts.require("AuctionFactory");
var Registry = artifacts.require("Registry")
var Resolver = artifacts.require("Resolver")

module.exports = function(deployer) {
  deployer.deploy(Resolver);
  deployer.deploy(Registry).then(function() {
    return deployer.deploy(AuctionFactory, Registry.address);
  });
};
