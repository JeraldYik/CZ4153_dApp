import detectEthereumProvider from "@metamask/detect-provider";
// NOTE: be aware of this: https://flaviocopes.com/parcel-regeneratorruntime-not-defined/
import Web3 from "web3";
// FOR TESTING


// importing a compiled contract artifact which contains function signature etc. to interact
import artifactAF from "./contracts/AuctionFactory.json";

// const myAddress = process.env.METAMASK_ACCOUNT; // PLEASE CHANGE IT TO YOURS
// const infuraWSS = process.env.INFURA_WSS; // PLEASE CHANGE IT TO YOURS
// const infuraWSS = 'wss://ropsten.infura.io/ws/v3/3537874f2c17447e8f2dc9ceb1beae0f'; // change this to your own I haven't found a way to import .env from root

// console.log('process.env.INFURA_WSS', process.env.INFURA_WSS)

// export const ContractAddress = "0x07A6EdB8ec67Ae0e8DC7A4EB07EE42cFC821483E"; // PLEASE CHANGE IT TO YOURS
export const ContractAddress = "0xa3E1538Fb00aE4A02FC08442968Bc3B5C85DB06e";
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

const userAddresses = {
  0: '0xCFCed6536a070c255548C46CecA8d72fBd032B86',
  1: '0x69B4cA50d8715Cd5Ac74e4997fB8831FB79bce1B',
  2: '0xf674bA0fb5c845F6395B3DBBa456f88e4f3fA095'
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
  return {newAuction, ownerAddr};
}

export const cancelAuction = async (_domain) => {
  domain = '';
  return await contract.methods.endAuction(_domain).call();
}

export const findAuction = async (_domain) => {
  return await contract.methods.findAuction(_domain).call();
}

// Auction
export const getHighestBid = async (_auction) => {
  
}

// Auction
export const commitBid = async (user, value, fake, salt) => {
  console.log({domain, user, value, fake, salt})
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

// Auction
export const withdraw = async () => {

};
