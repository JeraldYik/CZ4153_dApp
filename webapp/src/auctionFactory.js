import { useState, useRef, useEffect } from "react";
import detectEthereumProvider from "@metamask/detect-provider";
// NOTE: be aware of this: https://flaviocopes.com/parcel-regeneratorruntime-not-defined/
import Web3 from "web3";
// FOR TESTING


// importing a compiled contract artifact which contains function signature etc. to interact
import artifactAF from "./contracts/AuctionFactory.json";
import artifactA from "./contracts/Auction.json";

// const myAddress = process.env.METAMASK_ACCOUNT; // PLEASE CHANGE IT TO YOURS
// const infuraWSS = process.env.INFURA_WSS; // PLEASE CHANGE IT TO YOURS
const infuraWSS = 'wss://ropsten.infura.io/ws/v3/3537874f2c17447e8f2dc9ceb1beae0f'; // change this to your own I haven't found a way to import .env from root

// console.log('process.env.INFURA_WSS', process.env.INFURA_WSS)

// export const ContractAddress = "0x07A6EdB8ec67Ae0e8DC7A4EB07EE42cFC821483E"; // PLEASE CHANGE IT TO YOURS
export const ContractAddress = "0xa04b8A8533230253Dd97AEafd78a29d6B554Ac43";
export const Testnet = "ropsten"; // PLEASE CHANGE IT TO YOURS

// const web3 = new Web3(
//   Web3.currentProvider || new Web3.providers.WebsocketProvider(infuraWSS)
// );
// FOR TESTING
// const web3 = new Web3.providers.HttpProvider("http://127.0.0.1:8545");
const web3 = new Web3();
web3.setProvider(new Web3.providers.HttpProvider("http://localhost:8545"));
// doc here: https://web3js.readthedocs.io/en/v1.2.11/web3.html#providers
const contractAF = new web3.eth.Contract(artifactAF.abi, ContractAddress);
const contractA = new web3.eth.Contract(artifactA.abi, ContractAddress);

const userAddresses = {
  0: '0x0390Cc4E553Eea54EEF1165c285A7C7B09ECba14',
  1: '0x15149a6bB8d1FcB56B0De169747958D6D7580E2D',
  2: '0xC7a3c5db93a327df94C603F22357733A60913BF3'
}

// AuctionFactory
export const createAuction = async (_bidIncrement, _biddingTime, _revealTime, _domain) => {
  const ownerAddr = userAddresses[0];
  const newAuction = await contractAF.methods.createAuction(_bidIncrement, _biddingTime, _revealTime, _domain).send({
    from: ownerAddr,
    gas: 4712388,
    gasPrice: 100000000000
  });
  return {newAuction, ownerAddr};
}

export const cancelAuction = async (_domain) => {
  return await contractAF.methods.endAuction(_domain).call();
}

export const findAuction = async (_domain) => {
  return await contractAF.methods.findAuction(_domain).call();
}

// Auction
export const getHighestBid = async (_auction) => {
  
}

// Auction
export const placeBid = async (user, value) => {
  // function placeBid(address bidder, uint value)
  const addr = userAddresses[user];
  await contractA.methods.placeBid(addr, value).send({
    from: addr,
    gas: 4712388,
    gasPrice: 100000000000
  });
}

// Auction
export const withdraw = async () => {

};
