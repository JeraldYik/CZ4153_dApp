import React, {useState} from 'react';
import { commitBid, withdraw } from '../auctionFactory';

const User = (props) => {
  const [bid, setBid] = useState('0');
  const [fake, setFake] = useState(false);
  const [salt, setSalt] = useState('');

  const handleBidChange = (e) => {
    setBid(e.target.value);
  }

  // not handled properly
  const handleFakeChange = () => {
    setFake(!fake)
  }

  const handleSaltChange = (e) => {
    setSalt(e.target.value);
  }

  const handleSubmitNewBid = async () => {
    if (!bid || bid === '0') {
      alert('Bid cannot be empty');
    } else if (!salt || salt === '') {
      alert('Salt cannot be empty');
    } else {
      await commitBid(props.index, bid, fake, salt);
    }
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
      <h3>User {props.index}</h3>
      <div>
        <p>Place Bid</p>
        <input
          type="text"
          placeholder="Enter amount (in Ether)"
          value={bid}
          onChange={handleBidChange}
          onFocus={clearZero}
        />{" "}
        <input
          type="radio"
          checked={fake}
          onClick={handleFakeChange}
        />Fake?{" "}
        <input
          type="text"
          placeholder="Salt cannot be empty"
          value={salt}
          onChange={handleSaltChange}
        />{" "}
        <input
          type="submit"
          bid="New Bid"
          onClick={handleSubmitNewBid}
        />
      </div>
      <button onClick={handleWithdraw}>Withdraw from Auction</button>
    </div>
  )
}

export default User;