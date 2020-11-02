import React, {useState} from 'react';
import { placeBid, withdraw } from '../auctionFactory';

const User = (props) => {
  const [value, setValue] = useState(0);

  const handleValueChange = (e) => {
    setValue(e.target.value);
  }

  const handleSubmitNewBid = async () => {
    await placeBid(props.index, value);
  }

  const handleWithdraw = async () => {
      await withdraw();    
  }

  const clearZero = (e) => {
    if (e.target.value === '0') {
      e.target.value = '';
    }
  }

  return (
    <div>
      <h3>User {props.index+1}</h3>
      <div>
        <p>Place Bid</p>
        <input
          type="text"
          placeholder="Enter amount (in Ether)"
          value={value}
          onChange={handleValueChange}
          onFocus={clearZero}
        />{" "}
        <input
          type="submit"
          value="New Bid"
          onClick={handleSubmitNewBid}
        />
      </div>
      <button onClick={handleWithdraw}>Withdraw from Auction</button>
    </div>
  )
}

export default User;