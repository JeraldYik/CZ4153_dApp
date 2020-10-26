import React, {useState, useEffect} from "react";
import {
  ContractAddress,
  Testnet,
  getHighestBid,
  placeBid,
  cancelAuction,
  withdraw,
} from "./auction.js";
import {
  createAuction
} from "./auctionFactory.js"

const App = () => {
  const [highestBid, setHighestBid] = useState(0);
  const [user1Value, setUser1Value] = useState(0);
  const [user2Value, setUser2Value] = useState(0);

  const handleCreateAuction = async () => {
    await createAuction();
  }

  const handleCancelAuction = async () => {
    await cancelAuction();
  }

  const handleGetHighestBid = async () => {
    const highestBid = await getHighestBid();
    setHighestBid(highestBid);
  }
  
  const handleValueChange = (e) => {
    // find User #
    setUser1Value(e.target.value);
  }

  const handleSubmitNewBid = async (e) => {
    // find User #
    await placeBid();
  }

  const handleWithdraw = async (e) => {
    // find User #
    const user = '';
    switch (user) {
      case 1:
        await withdraw();
        break;
      case 2:
        await withdraw();
        break;
      default:
        throw new Error();
    }
  }

  return (
    <>
      <h1>Welcome to Auction dApp</h1>
      <p>Bank Contract Address: {ContractAddress}</p>
      <p>Network: {Testnet}</p>
      <hr />
      <div>
        <h3>Owner:</h3>
        <button onClick={handleCreateAuction}>Create Auction</button>
        <p>Highest bid: {handleGetHighestBid}</p>
        <button onClick={handleCancelAuction}>Cancel Auction</button>
      </div>
      <div>
        <h3>User 1</h3>
        <div>
          <p>Place Bid</p>
          <input
            type="text"
            placeholder="Enter amount (in Ether)"
            value={user1Value}
            onChange={handleValueChange}
          />{" "}
          <input
            type="submit"
            value="New Bid"
            onClick={handleSubmitNewBid}
          />
        </div>
        <button onClick={handleWithdraw}>Withdraw from Auction</button>
      </div>
      <div>
        <h3>User 2</h3>
        <div>
          <p>Place Bid</p>
          <input
            type="text"
            placeholder="Enter amount (in Ether)"
            value={user1Value}
            onChange={handleValueChange}
          />{" "}
          <input
            type="submit"
            value="New Bid"
            onClick={handleSubmitNewBid}
          />
        </div>
        <button onClick={handleWithdraw}>Withdraw from Auction</button>
      </div>
    </>
  );
}

export default App;