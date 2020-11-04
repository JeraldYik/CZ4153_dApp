var AuctionFactory = artifacts.require("AuctionFactory");
var Registry = artifacts.require("Registry")

module.exports = function(deployer) {
  deployer.deploy(AuctionFactory);

  // Comment this line out for actual deployer
  // deployer.deploy(Registry);
};
