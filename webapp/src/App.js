import React, {useState, useEffect} from "react";
import User from './components/User';

import AuctionFactory from './contracts/AuctionFactory.json';
import BlindAuction from './contracts/BlindAuction.json';
import Registry from './contracts/Registry.json';

import { useGetWeb3 } from './hooks/useGetWeb3';
import useGetAccounts from './hooks/useGetAccounts';
import useGetAuctFactInstance from './hooks/useGetAuctFactInstance';
import useGetRegInstance from './hooks/useGetRegInstance';
import useGetAuctionAddressesList from './hooks/useGetAuctionList';
import useGetAuctionInstances from './hooks/useGetAuctionInstances';

// import {
//   ContractAddress,
//   Testnet,
//   populateUserAddresses,
//   createAuction,
//   cancelAuction,
//   getUserAddress,
//   endAuction
// } from "./auctionFactory.js"

const App = () => {
  const web3 = useGetWeb3();
  const userAccounts = useGetAccounts({ web3 });
  const { auctFactInstance, auctFactAddr } = useGetAuctFactInstance({ web3, contract: AuctionFactory });
  const { regInstance, regAddr } = useGetRegInstance({ web3, auctFactInstance, contract: Registry });
  const auctionAddressesList = useGetAuctionAddressesList({ auctFactInstance });
  const auctionInstances = useGetAuctionInstances({ web3, contractAddresses: auctionAddressesList, contract: BlindAuction });

  // const [isUserAddressSet, setIsUserAddressSet] = useState(false);
  const [domainName, setDomainName] = useState('');
  const [ownerAddr, setOwnerAddr] = useState('');
  // const [created, setCreated] = useState(false);
  // const [canceled, setCanceled] = useState(false);
  // const [users, setUsers] = useState([]);
  // const [auctions, setAuctions] = useState([]);
  // const [winner, setWinner] = useState('');
  //
  // const NUM_USERS = 2;
  // const BID_INCREMENT = 10;
  // const BIDDING_TIME = 100;
  // const REVEAL_TIME = 1;
  //
  // useEffect(() => {
  //   const _populateUserAddresses = async () => {
  //     await populateUserAddresses();
  //     setIsUserAddressSet(true);
  //   };
  //   _populateUserAddresses();
  // }, []);
  //
  // useEffect(() => {
  //   setOwnerAddr(getUserAddress(0));
  //   const _users = [];
  //   for (var i=1; i<=NUM_USERS; i++) {
  //     _users.push(<User index={i} address={getUserAddress(i)}/>);
  //   }
  //   setUsers(_users);
  // }, [isUserAddressSet])
  //
  const handleDomainNameChange = (e) => {
    setDomainName(e.target.value);
  }
  //
  // const handleCreateAuction = async () => {
  //   const newAuction = await createAuction(BID_INCREMENT, BIDDING_TIME, REVEAL_TIME, domainName);
  //   setAuctions([...auctions, newAuction]);
  //   setCreated(true);
  // }
  //
  // const handleCancelAuction = async () => {
  //   const canceled = await cancelAuction(domainName, ownerAddr);
  //   if (canceled) {
  //     setCanceled(true);
  //     setDomainName('');
  //     setCreated(false);
  //   }
  // }
  //
  // const handleEndAuction = async () => {
  //   const topBidder = await endAuction(domainName);
  //   setWinner(topBidder);
  //   setCanceled(true);
  // }

  return (
    <>
      <h1>Welcome to Auction dDNS dApp</h1>
      <p>Bank Contract Address: {auctFactAddr}</p>
      <p>Registry Contract Address: {regAddr}</p>
      <hr />
      <div>
        <h3>Owner: {userAccounts}</h3>
        <input
          id="domain-name"
          type="text"
          placeholder="domain"
          value={domainName}
        />
        <label for="domain-name">.ntu</label>
        <br />
        <input
          type="submit"
          value="Create Auction"
        />

        </div>

    </>
  );
}

export default App;
