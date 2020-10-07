// const SafeMath = artifacts.require("../contracts/libs/SafeMath.sol");
// const Ownable = artifacts.require("../contracts/common/Ownable.sol");
const DDNSService = artifacts.require("../contracts/DDNS.sol");
module.exports = (deployer) => {
  deployer.deploy(DDNSService);
};
