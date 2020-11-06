import detectEthereumProvider from "@metamask/detect-provider";
import Web3 from "web3";

import artifactAF from "./contracts/AuctionFactory.json";

// const myAddress = process.env.METAMASK_ACCOUNT; // PLEASE CHANGE IT TO YOURS
// const infuraWSS = process.env.INFURA_WSS; // PLEASE CHANGE IT TO YOURS
// const infuraWSS = 'wss://ropsten.infura.io/ws/v3/3537874f2c17447e8f2dc9ceb1beae0f'; // change this to your own I haven't found a way to import .env from root

// console.log('process.env.INFURA_WSS', process.env.INFURA_WSS)

// export const ContractAddress = "0x07A6EdB8ec67Ae0e8DC7A4EB07EE42cFC821483E"; // PLEASE CHANGE IT TO YOURS
export const ContractAddress = "0xd9BF8819Ed10Ddf3037E28979bCe352D72A640F8";
export const Testnet = "ropsten"; // PLEASE CHANGE IT TO YOURS

// const web3 = new Web3(
//   Web3.currentProvider || new Web3.providers.WebsocketProvider(infuraWSS)
// );
// FOR TESTING
// const web3 = new Web3.providers.HttpProvider("http://127.0.0.1:8545");
const web3 = new Web3();
web3.setProvider(new Web3.providers.HttpProvider("http://localhost:8545"));
// doc here: https://web3js.readthedocs.io/en/v1.2.11/web3.html#providers
const contract = new web3.eth.Contract(artifactAF.abi, ContractAddress);

let userAddresses = {
  0: '',
  1: '',
  2: ''
}

export const populateUserAddresses = async () => {
  const addresses = await web3.eth.getAccounts();
  userAddresses = {
    0: addresses[0],
    1: addresses[1],
    2: addresses[2]
  }
}

let domain;

// AuctionFactory
export const createAuction = async (_bidIncrement, _biddingTime, _revealTime, _domain) => {
  const ownerAddr = userAddresses[0];
  const newAuction = await contract.methods.createAuction(_bidIncrement, _biddingTime, _revealTime, _domain).send({
    from: ownerAddr,
    gas: 4712388,
    gasPrice: 100000000000
  });
  domain = _domain;
  return newAuction;
}

// Error: Returned error: VM Exception while processing transaction: revert Only owner can call this function.
export const cancelAuction = async (_domain, ownerAddr) => {
  const cancelled = await contract.methods.cancelAuction(_domain).send({
    from: ownerAddr,
    gas: 4712388,
    gasPrice: 100000000000
  });
  domain = '';
  alert('Auction has been cancelled');
  return cancelled;
}

export const endAuction = async (_domain, ownerAddr) => {
  const topBidder = await contract.methods.endAuction(_domain).send({
    from: ownerAddr,
    gas: 4712388,
    gasPrice: 100000000000
  });
  domain = '';
  alert('Auction has been ended');
  return topBidder;
}

// Auction
export const commitBid = async (user, value, fake, salt) => {
  const addr = userAddresses[user];
  const _salt = web3.utils.fromAscii(salt);
  const hash = await contract.methods.bidHash(value, fake, _salt).call({
    from: addr,
    gas: 4712388,
    gasPrice: 100000000000
  });
  await contract.methods.commitBid(domain, hash).send({
    from: addr,
    gas: 4712388,
    gasPrice: 100000000000
  });
  alert(`User ${user} has committed a bit`);
}

export const revealBid = async (user, values, fakes, salts) => {
  console.log(await web3.eth.getAccounts())
  const addr = userAddresses[user];
  const _salts = []
  salts.forEach(s => {
    _salts.push(web3.utils.fromAscii(s));
  });
  //function revealBid(string memory domain, uint256[] memory _bidvalue, bool[] memory _fake, bytes32[] memory _salt)
  await contract.methods.revealBid(domain, values, fakes, _salts).send({
    from: addr,
    gas: 4712388,
    gasPrice: 100000000000
  });
  alert(`User ${user} has revealed a bit`)
}

// Auction
export const withdraw = async (user) => {
  const addr = userAddresses[user];
  // function withdraw(string memory domain)
  await contract.methods.withdraw(domain).send({
    from: addr,
    gas: 4712388,
    gasPrice: 100000000000
  });
  alert(`User ${user} has withdrawn`)
};

// helper functions
export const getUserAddress = (user) => {
  return userAddresses[user];
}