import React, {useState, useEffect} from 'react';
import { commitBid, withdraw, getUserAddress, revealBid } from '../auctionFactory';

const User = (props) => {
  const [bid, setBid] = useState('0');
  const [fake, setFake] = useState(false);
  const [salt, setSalt] = useState('');
  const [committed, setCommitted] = useState(false);
  const [revealbid, setrevealBid] = useState('0');
  const [revealfake, setrevealFake] = useState(fake);
  const [revealsalt, setrevealSalt] = useState('');
  const [addr, setAddr] = useState('');
  const [revealBids, setRevealBids] = useState({
    value: [],
    fake: [],
    salt: []
  });

  useEffect(() => {
    setAddr(getUserAddress(props.index));
  }, [props.index]);

  const handleBidChange = (e) => {
    setBid(e.target.value);
  }

  const handleFakeChange = () => {
    setFake(!fake)
  }

  const handleSaltChange = (e) => {
    setSalt(e.target.value);
  }

  const handlerevealBidChange = (e) => {
    setrevealBid(e.target.value);
  }

  const handlerevealFakeChange = () => {
    setrevealFake(!revealfake)
  }

  const handlerevealSaltChange = (e) => {
    setrevealSalt(e.target.value);
  }

  const handleSubmitNewBid = async () => {
    if (!bid || bid === '0') {
      alert('Bid cannot be empty');
    } else if (!salt || salt === '') {
      alert('Salt cannot be empty');
    } else {
      await commitBid(props.index, bid, fake, salt);
      setRevealBids({
        value: [...revealBids.value, revealbid],
        fake: [...revealBids.fake, revealfake],
        salt: [...revealBids.salt, revealsalt]
      })
      setCommitted(true);
    }
  }

  const handleRevealBid = async () => {
    if (bid !== revealbid || fake !== revealfake || salt !== revealsalt) {
      alert('Commit & Reveal values do not match!!! ')
    } else {
        setRevealBids({
          value: [bid],
          fake: [fake],
          salt: [salt]
        })
      await revealBid(props.index, revealBids.value, revealBids.fake, revealBids.salt)
    }
  }

  // add checks for ended or cancelled
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
      <h3>User {props.index} ({addr})</h3>
      <div>
        <p>Place Bid</p>
        <input
          type="text"
          placeholder="Enter amount (in Ether)"
          value={bid}
          disabled={committed}
          onChange={handleBidChange}
          onFocus={clearZero}
        />{" "}
        <input
          type="radio"
          checked={fake}
          disabled={committed}
          onClick={handleFakeChange}
        />Fake?{" "}
        <input
          type="text"
          placeholder="Salt cannot be empty"
          value={salt}
          disabled={committed}
          onChange={handleSaltChange}
        />{" "}
        <input
          type="submit"
          disabled={committed}
          value="Commit Bid"
          onClick={handleSubmitNewBid}
        />
      </div>
      <div>
        <p>Reveal part of the Blind Auction</p>
        <input
          type="text"
          placeholder="Enter amount (in Ether)"
          value={revealbid}
          onChange={handlerevealBidChange}
          onFocus={clearZero}
        />{" "}
        <input
          type="radio"
          checked={revealfake}
          onClick={handlerevealFakeChange}
        />Fake?{" "}
        <input
          type="text"
          placeholder="Salt cannot be empty"
          value={revealsalt}
          onChange={handlerevealSaltChange}
        />{" "}
        <input
          type="submit"
          value="Reveal Bid"
          onClick={handleRevealBid}
        />
      </div>
      <button onClick={handleWithdraw}>Withdraw from Auction</button>
    </div>
  )
}

export default User;