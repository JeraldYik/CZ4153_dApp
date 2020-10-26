pragma solidity >=0.4.23 <0.8.0;

contract BlindAuction {

  constructor() public {}

  // Bid structure
  struct Bid {
    bytes32 blindBid;
    uint deposit;
    uint64 block;
    bool revealed;
  }
  // mapping an address to Bid's structure, method called bids
  mapping (address => Bid[]) public bids;

  // Static variables
  address public owner;
  uint public endBidding;
  uint public endReveal;
  bool public hasEnded;
  uint256 public bidIncrement;

  // State variables
  bool public canceled;
  address public topBidder;
  uint public topBid;
  bool public ownerHasWithdrawn;

  // Allowed withdrawals of previous bids
  mapping(address => uint) pendingReturns;

  // Events to be emitted
  event LogWithdrawal(address withdrawer, uint256 amount);
  event AuctionEnded(address winner, uint highestBid);
  event LogCanceled();

  // Define bidding time and reveal time
  constructor(uint _biddingTime, uint _revealTime, address _owner) public {
    owner = _owner;
    biddingEnd = now + _biddingTime;
    revealEnd = biddingEnd + _revealTime;
  }

  // function to derive bidHash
  function bidHash(bytes32 _bidvalue, bool _fake, bytes32 _salt) public returns (bytes32 blindBid) {
    blindBid = keccak256(_bidvalue, _fake, _salt);
    return blindBid;
  }

  // Commit portion of blind auction
  function commitBid(bytes32 _blindBid) public payable onlyBefore(bidEnds){
    // Place a blinded bid with `_blindBid` = keccak256(bidvalue, fake, salt)
    bids[msg.sender].push(Bid({
    blindBid: _blindBid,
    deposit: msg.value
    }));
    // Records latest block number and revealed status
    bids[msg.sender].block = uint64(block.number);
    bids[msg.sender].revealed = false;
  }

  // Revealing portion of blind auction
  function revealBid(uint[] _bidvalue, bool[] _fake, bytes32[] _salt) public onlyAfter(biddingEnd) onlyBefore(revealEnd) {
    //make sure it hasn't been revealed yet and set it to revealed
    require(bids[msg.sender].revealed==false,"CommitReveal::revealBid: Already revealed");
    bids[msg.sender].revealed=true;
    //require that the block number is greater than the original block
    require(uint64(block.number)>bids[msg.sender].block,"CommitReveal::reveal: Reveal and commit happened on the same block");
    // Tallying all responses from 1 bidder
    uint length = bids[msg.sender].length;
    require(_bidvalue.length == length);
    require(_fake.length == length);
    require(_salt.length == length);

    uint refund;
    for (uint i = 0; i < length; i++) {
        // Takes all n bids made by one bidder and sums up the deposits made, along with which bids were fake
        Bid storage bid = bids[msg.sender][i];
        (uint bidvalue, bool fake, bytes32 salt) = (_bidvalue[i], _fake[i], _salt[i]);
        if (bid.blindBid != keccak256(bidvalue, fake, salt)) {
            // Bid was not actually revealed. Hash did not match.
            // Do not refund deposit.
          continue;
        }
        // Adds up all deposits which were sent to this contract
        refund += bid.deposit;
        // If bid is not fake and deposit is greater than the value bidded, counts as valid bid
        if (!fake && bid.deposit >= bidvalue) {
          // Consider if bid placed was actually the highest bid as of point of revealing
          if (placeBid(msg.sender, bidvalue))
            // Deduct the bid value from the refund amount
            refund -= bidvalue;
        }
        // Make it impossible for the sender to re-claim the same deposit.
        bid.blindBid = bytes32(0);
    }
    msg.sender.transfer(refund);
  }

  function placeBid(address bidder, uint value) internal returns (bool success) {
    // This negates any revealed bid which is not currently higher than the highest
    if (value <= highestBid) {
        return false;
    }
    if (highestBidder != address(0)) {
      // Refund the previously highest bidder
      pendingReturns[topBidder] += topBid;
    }
    // changes the highest bid and the correspodning bidder
    topBid = topBid + bidIncrement;
    topBidder = bidder;
    // Refunds the excess to the current bidder
    pendingReturns[topBidder] = value - topBid;
    return true;
  }

  /// Withdraw a bid that was out-bidded
  function withdraw() onlyEndedOrCanceled public {
    uint amount = pendingReturns[msg.sender];
    if (amount > 0) {
      emit LogWithdrawal(msg.sender, amount);
      // It is important to set this to zero to prevent recipients from calling this function again
      pendingReturns[msg.sender] = 0;
      msg.sender.transfer(amount);
    }
  }

  /// End the auction and send the highest bid to the owner of the contract
  function auctionEnd() public onlyAfter(revealEnd) {
    require(!ended);
    emit AuctionEnded(topBidder, topBid);
    ended = true;
    owner.transfer(topBid);
  }

  function cancelAuction() public onlyOwner onlyBeforeEnd onlyNotCanceled returns (bool success) {
      canceled = true;
      emit LogCanceled();
      return true;
  }

  // Modifiers to validate inputs to functions. For instance `onlyBefore` is applied to `commitBid`
  // The new function body is the modifier's body, where `_` represents the old function body.
  modifier onlyBefore(uint _time) { require(now < _time); _; }
  modifier onlyAfter(uint _time) { require(now > _time); _; }
  modifier onlyEndedOrCanceled {
      require(block.number < endBlock && !canceled);
      _;
  }

}
