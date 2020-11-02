import { useState, useRef, useEffect } from "react";
import detectEthereumProvider from "@metamask/detect-provider";
// NOTE: be aware of this: https://flaviocopes.com/parcel-regeneratorruntime-not-defined/
import Web3 from "web3";

// importing a compiled contract artifact which contains function signature etc. to interact
import artifact from "./contracts/Auction.json";

// const myAddress = process.env.METAMASK_ACCOUNT; // PLEASE CHANGE IT TO YOURS
// const infuraWSS = process.env.INFURA_WSS; // PLEASE CHANGE IT TO YOURS
const infuraWSS = 'wss://ropsten.infura.io/ws/v3/3537874f2c17447e8f2dc9ceb1beae0f'; // change this to your own I haven't found a way to import .env from root

export const ContractAddress = "0xfE3F93684e6dD9cE47D72D2D4B6Ba9b175E2F3dE"; // PLEASE CHANGE IT TO YOURS
export const Testnet = "ropsten"; // PLEASE CHANGE IT TO YOURS
export const ChainID = 3;

const web3 = new Web3(
  Web3.currentProvider || new Web3.providers.WebsocketProvider(infuraWSS)
);
// doc here: https://web3js.readthedocs.io/en/v1.2.11/web3.html#providers
const contract = new web3.eth.Contract(artifact.abi, ContractAddress);

export const updateDeposit = async (addr) => {
  // doc here: https://web3js.readthedocs.io/en/v1.2.11/web3-eth-contract.html#methods-mymethod-call
  const newBalance = await contract.methods.balance().call({ from: addr });
  return { address: addr, deposit: newBalance };
};

export const newDeposit = async (amount) => {
  // Using MetaMask API to send transaction
  //
  // please read: https://docs.metamask.io/guide/ethereum-provider.html#ethereum-provider-api
  const provider = await detectEthereumProvider();
  if (provider) {
    // From now on, this should always be true:
    // provider === window.ethereum
    window.ethereum.request({
      method: "eth_sendTransaction",
      params: [
        {
          from: window.ethereum.selectedAddress,
          to: ContractAddress,
          value: web3.utils.toWei(amount),
          data: web3.eth.abi.encodeFunctionCall(
            {
              name: "deposit",
              type: "function",
              inputs: [],
            },
            []
          ), // https://web3js.readthedocs.io/en/v1.2.11/web3-eth-abi.html#encodefunctioncall
          chainId: 3, // ropsten
        },
      ],
    });
  } else {
    console.log("Please install MetaMask!");
  }
};

const userAddress = {
  1: '0xCf42FB6FcFD04dc60c60ff17866FD051Cd47dA72',
  2: '0x0ea17d43cf7D42E06f0bdd334bd6c04fF7B900Fe'
}

// Auction
export const getHighestBid = async (_auction) => {
  
}

// Auction
export const placeBid = async (user, value) => {
  // function placeBid(address bidder, uint value)
  const addr = userAddress[user];
  await contract.methods.placeBid(addr, value).send({
    from: addr,
    gas: 4712388,
    gasPrice: 100000000000
  });
}

// Auction
export const withdraw = async () => {

}