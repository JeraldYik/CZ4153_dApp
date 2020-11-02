import React, {useState, useEffect} from "react";
import User from './components/User';
import {
  ContractAddress,
  Testnet,
  createAuction,
  cancelAuction,
  findAuction,
  getHighestBid
} from "./auctionFactory.js"

const App = () => {
  const [domainName, setDomainName] = useState('');
  const [ownerAddr, setOwnerAddr] = useState('');
  const [canceled, setCanceled] = useState(false);
  const [highestBid, setHighestBid] = useState(0);
  const [users, setUsers] = useState([]);
  const [auctions, setAuctions] = useState([]);

  const NUM_USERS = 2;
  const BID_INCREMENT = 10;
  const BIDDING_TIME = 10;
  const REVEAL_TIME = 1;

  useEffect(() => {
    const _users = [];
    for (var i=1; i<=NUM_USERS; i++) {
      _users.push(<User index={i} />);
    }
    setUsers(_users);
  }, []);

  const handleDomainNameChange = (e) => {
    setDomainName(e.target.value);
  }

  const handleCreateAuction = async () => {
    let { newAuction, ownerAddr } = await createAuction(BID_INCREMENT, BIDDING_TIME, REVEAL_TIME, domainName);
    setAuctions([...auctions, newAuction]);
    setOwnerAddr(ownerAddr);
  }

  const handleCancelAuction = async () => {
    const canceled = await cancelAuction(domainName);
    if (canceled) {
      setCanceled(true);
      setDomainName('');
      setOwnerAddr('');
    }
  }

  const handleGetHighestBid = async () => {
    const auction = await findAuction(domainName);
    const _highestBid = await getHighestBid(auction);
    setHighestBid(_highestBid);
  }

  return (
    <>
      <h1>Welcome to Auction dDNS dApp</h1>
      <p>Bank Contract Address: {ContractAddress}</p>
      <p>Network: {Testnet}</p>
      <hr />
      <div>
        <h3>Owner:</h3>
        <input
          id="domain-name"
          type="text"
          placeholder="domain"
          value={domainName}
          onChange={handleDomainNameChange}
          disabled={ownerAddr !== ''}
        />
        <label for="domain-name">.ntu</label>
        <br />
        <input 
          type="submit"
          value="Create Auction"
          onClick={handleCreateAuction}
          disabled={ownerAddr !== ''}
        />
        <p>{ownerAddr !== '' && `Auction for Domain ${domainName}.ntu created!`}</p>
        <p>{ownerAddr !== '' && `Owner's address: ${ownerAddr}`}</p>
        <p>{canceled && 'Auction has ended'}</p>
        <p>Highest bid: {highestBid}</p>
        <button onClick={handleGetHighestBid}>Get Highest Bid</button>
        <button onClick={handleCancelAuction}>End Auction</button>
      </div>
      {users}
    </>
  );
}

export default App;