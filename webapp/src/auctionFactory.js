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
export const ContractAddress = "0x55319536eaFffd8BbF48D07B00df7DC8ff28D147";
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
  0: '0xfE37c835c81c1d9a71bC1D23CB1f6C12A3effdE6',
  1: '0xD386EbA8aF77f88d11952EDb4a11cd24683d9E21',
  2: '0xe6AE182389a46024b136bb8F9750792b24469E0E'
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

export const cancelAuction = async (_domain) => {
  domain = '';
  return await contract.methods.endAuction(_domain).call();
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
  const addr = userAddresses[user];
  const _salts = []
  salts.forEach(s => {
    _salts.push(web3.utils.fromAscii(s));
  });
  //function revealBid(string memory domain, uint256[] memory _bidvalue, bool[] memory _fake, bytes32[] memory _salt) 
  await contract.methods.revealBid(domain, values, fakes, _salts).call({
    from: addr,
    gas: 4712388,
    gasPrice: 100000000000
  });
  alert(`User ${user} has revealed a bit`)
}

// Auction
export const withdraw = async () => {

};

// helper functions
export const getUserAddress = (user) => {
  return userAddresses[user];
}
