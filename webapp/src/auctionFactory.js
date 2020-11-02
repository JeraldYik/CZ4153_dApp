import { useState, useRef, useEffect } from "react";
import detectEthereumProvider from "@metamask/detect-provider";
// NOTE: be aware of this: https://flaviocopes.com/parcel-regeneratorruntime-not-defined/
import Web3 from "web3";
// FOR TESTING


// importing a compiled contract artifact which contains function signature etc. to interact
import artifact from "./contracts/AuctionFactory.json";

// const myAddress = process.env.METAMASK_ACCOUNT; // PLEASE CHANGE IT TO YOURS
// const infuraWSS = process.env.INFURA_WSS; // PLEASE CHANGE IT TO YOURS
const infuraWSS = 'wss://ropsten.infura.io/ws/v3/3537874f2c17447e8f2dc9ceb1beae0f'; // change this to your own I haven't found a way to import .env from root

// console.log('process.env.INFURA_WSS', process.env.INFURA_WSS)

// export const ContractAddress = "0x07A6EdB8ec67Ae0e8DC7A4EB07EE42cFC821483E"; // PLEASE CHANGE IT TO YOURS
export const ContractAddress = "0xcfdc4ec61e7f8527e2d5dcc7e5901db0bd299325";
export const Testnet = "ropsten"; // PLEASE CHANGE IT TO YOURS

// const web3 = new Web3(
//   Web3.currentProvider || new Web3.providers.WebsocketProvider(infuraWSS)
// );
// FOR TESTING
// const web3 = new Web3.providers.HttpProvider("http://127.0.0.1:8545");
const web3 = new Web3();
web3.setProvider(new Web3.providers.HttpProvider("http://localhost:8545"));
// doc here: https://web3js.readthedocs.io/en/v1.2.11/web3.html#providers
const contract = new web3.eth.Contract(artifact.abi, ContractAddress);

// AuctionFactory
export const createAuction = async (_bidIncrement, _biddingTime, _revealTime, _domain) => {
  return await contract.methods.createAuction(_bidIncrement, _biddingTime, _revealTime, _domain).send({
    from: '0xFd55d965Fb9f2E53Fc0071B6fd8aCffe13Bda55E'
  }, (err) => {
    console.log({err})
  });
}

export const cancelAuction = async (_domain) => {
  await contract.methods.endAuction(_domain).call();
}

export const findAuction = async (_domain) => {
  return await contract.methods.findAuction(_domain).call();
}
