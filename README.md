# Decentralized Domain Registrar

## Project Overview

We have built a “xxx.ntu” domain name registrar service on a local Ganache instance, using “commit-and-reveal” bidding process, together with a front-end Web Application to demonstrate our code in an interactive fashion.

## General Flow

The general idea of our implementation is for a way to let users bid for a domain name, by utilising a decentralised infrastructure in a blockchain. The general flow of the process would be:

1. The owner creates an auction on a particular domain name as a contract and puts the new contract onto the chain
2. Users can then commit their bid for that auction during the commit phase, as many times as they want anytime before biddingTime ends
3. During the reveal phase, users can then input their reveal bids input, as many times as they want anytime before biddingTime + revealTime ends
4. After the auction has ended, the owner would then retrieve the top bidder's bid to their account, and transfer ownership of that domain to the top bidder. At the same time, the revealed bids from the other bidders are refunded. Committed bids that are not revealed are consequently not refunded.
5. At any point in time can a user withdraw from the auction.
6. At any point in time can the owner cancel the auction.

## Rationale

Having the bids onto a blockchain, the information committed by users are therefore public. To circumvent this and add more security to encapsulate information, we added a functionality to send in 'fake' commits and salting our bids. Lastly, using the three information given (bids, fake boolean, salt), we then concatenate and hash the final value. The hashed value is then stored onto the chain.

Verification comes in the form of the reveal process and the end auction process, whereby users would have to reveal their bids after committing. By revealing a bid would mean that the user would likely to have to input the same salt and fake values, corresponding to a previous bid.

## Code Structure

We have 3 contracts, namely:

1. [AuctionFactory.sol](https://github.com/JeraldYik/CZ4153_dApp/blob/master/contracts/AuctionFactory.sol): The main entry point for the migration. This contract handles the creation of auctions with their respective registry, as well as exposing methods from other contracts
2. [BlindAuction.sol](https://github.com/JeraldYik/CZ4153_dApp/blob/master/contracts/BlindAuction.sol): This contract possess all variables and methods required for a single BlindAuction instance to function. It includes methods like commitBid, revealBid & withdraw
3. [Registry.sol](https://github.com/JeraldYik/CZ4153_dApp/blob/master/contracts/Registry.sol): This contract holds information of the relationship between the domain name and its owner. Also, when the auction ends, this contract handles the transferring of ETH to the owner's account, and the transferring of ownership to the top bidder.

## How to Set Up

- Before we begin, please ensure that you the following installed:
  - [node](https://nodejs.org/en/) v8.9.4 or later
  - [npm](https://www.npmjs.com/get-npm) or [yarn](https://classic.yarnpkg.com/en/docs/install/) (you can test by running `npm -v` or `yarn -v`)
  - [truffle](https://www.trufflesuite.com/docs/truffle/overview) (run `npm install truffle -g`)
  - [Ganache](https://www.trufflesuite.com/ganache)
  - [Metamask](https://metamask.io/download.html)
- Since this application is mounted on a Local Ganache Blockchain Instance. As such, please ensure that Ganache and Metamask are installed and configured. Do also note that since Ganache is running on port 7545, connect Metamask to port 7545.
- Before we begin running the script, please run `npm install` in both the root folder & in `/webapp`.
- Back in the root folder, run `truffle migrate` to migrate our contracts to Ganache. (You may want to run `truffle test` to look at the unit tests, which we will explain in further detail below).
- Should your local Ganache instance not have the migrated contracts, please attempt to run `truffle develop` before running `truffle migrate`.
- Then, depending on your OS, run `npm run copy-contracts:cp` for Mac Users, and `npm run copy-contracts:xcode` for Windows Users. This is to copy the artifacts over from the root folder into the React WebApp `/src` folder.
- Run `npm start` to boot up the local Webapp server.

## Brief description of Unit Tests & Simulation

Our unit tests in [./test/Auctions.js](./test/Auctions.js) and [./test/Registry.js](./test/Registry.js) test every of the functions declared in our contracts, by declaring individual senarios that as a whole, covers the workings of our application.

We also created a simulation test in [./test/Simulation.js](./test/Simulation.js) to provide a thorough run through of the entire Auction process, from the creation of an auction, to the transfer of ownership and fees. Edge cases are also tested to cover as many possibilities as possible.

## WebApp

Our WebApp is unfinished due to the lack of front end expertise. We understand that it is important to have a functional front end interface, so we have implemented some of the functions. Owing to the fact that our Webapp is not completed, we have created a Simulation.js unit test to prove that the contracts can function with the right ABI call.
