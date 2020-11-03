import React, {useState, useEffect} from "react";
import User from './components/User';
import {
  ContractAddress,
  Testnet,
  populateUserAddresses,
  createAuction,
  cancelAuction,
  getUserAddress,
  endAuction
} from "./auctionFactory.js"

const App = () => {
  const [isUserAddressSet, setIsUserAddressSet] = useState(false);
  const [domainName, setDomainName] = useState('');
  const [ownerAddr, setOwnerAddr] = useState('');
  const [created, setCreated] = useState(false);
  const [canceled, setCanceled] = useState(false);
  const [users, setUsers] = useState([]);
  const [auctions, setAuctions] = useState([]);
  const [winner, setWinner] = useState('');

  const NUM_USERS = 2;
  const BID_INCREMENT = 10;
  const BIDDING_TIME = 100;
  const REVEAL_TIME = 1;

  useEffect(async () => {
    const _populateUserAddresses = async () => {
      await populateUserAddresses();
      setIsUserAddressSet(true);
    };
    _populateUserAddresses();
    const _users = [];
    for (var i=1; i<=NUM_USERS; i++) {
      _users.push(<User index={i} />);
    }
    setUsers(_users);
  }, []);

  useEffect(() => {
    setOwnerAddr(getUserAddress(0));
  }, [isUserAddressSet])

  const handleDomainNameChange = (e) => {
    setDomainName(e.target.value);
  }

  const handleCreateAuction = async () => {
    const newAuction = await createAuction(BID_INCREMENT, BIDDING_TIME, REVEAL_TIME, domainName);
    setAuctions([...auctions, newAuction]);
    setCreated(true);
  }

  const handleCancelAuction = async () => {
    const canceled = await cancelAuction(domainName, ownerAddr);
    if (canceled) {
      setCanceled(true);
      setDomainName('');
      setCreated(false);
    }
  }

  const handleEndAuction = async () => {
    const topBidder = await endAuction(domainName);
    setWinner(topBidder);
    setCanceled(true);
  }

  return (
    <>
      <h1>Welcome to Auction dDNS dApp</h1>
      <p>Bank Contract Address: {ContractAddress}</p>
      <p>Network: {Testnet}</p>
      <hr />
      <div>
        <h3>Owner: ({ownerAddr})</h3>
        <input
          id="domain-name"
          type="text"
          placeholder="domain"
          value={domainName}
          onChange={handleDomainNameChange}
          disabled={created}
        />
        <label for="domain-name">.ntu</label>
        <br />
        <input 
          type="submit"
          value="Create Auction"
          onClick={handleCreateAuction}
          disabled={created}
        />
        <p>{created && `Auction for Domain ${domainName}.ntu created!`}</p>
        <p>{created && `Owner's address: ${ownerAddr}`}</p>
        <p>{canceled && 'Auction has ended'}</p>
        <button onClick={handleCancelAuction}>Cancel Auction</button>
        <button onClick={handleEndAuction}>End Auction</button>
        {canceled && `${winner} is the top bidder`}
      </div>
      {users}
    </>
  );
}

export default App;