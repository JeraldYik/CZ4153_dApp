import {
  makeStyles, Button, Typography, Paper, TextField, FormControlLabel, Modal, Card
} from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';
import ToggleButton from '@material-ui/lab/ToggleButton';
import web3 from 'web3';
import React, {useState, useEffect, useCallback} from "react";
import moment from 'moment';

const useStyles = makeStyles(() => ({
  detailComponent: {
    margin: '0.5em',
    padding: '20px'
  },
  bidButton: {
  },
  modal: {
    position: 'absolute',
    width: 400,
    top: '50%',
    left: '50%',
    padding: '10px',
    transform: 'translate(-50%,-50%)'
  },
  modalEntry: {
    borderBottom: '10px solid #EEEEE',
  },
  textField: {
    width: '80%',
    marginBottom: '0.5em',
  },
  toggle: {
    whiteSpace: 'nowrap',
    overflow: 'auto',
    height: '30px',
  },
  checkicon: {
    display: 'inline-block'
  },
  addRevealEntry: {
    marginTop: '10px',
    float: 'right'
  }
}));

/**
 * Ongoing Auction - List of ongoing auctions, 
 * click on them opens modal to bid before reveal time, 
 * modal changes to reveal after reveal time. 
 * After auction ended, the button to bid/reveal is disabled and the button to withdraw is enabled.
 */

function UserOnAuction({ domain, bidIncrement, bidEndTime, revealEndTime, auctFactInstance }) {
  const [openModal, setOpenModal] = useState(false);
  const [domainSelected, setDomainSelected] = useState('');
  const [bidAmountCommit, setBidAmountCommit] = useState('');
  const [isFakeCommit, setIsFakeCommit] = useState(false);
  const [saltCommit, setSaltCommit] = useState('');
  const [commitTimeOver, setCommitTimeOver] = useState(false);
  const [numReveals, setNumReveals] = useState(1);
  // const [revealedBids, setRevealedBids] = useState([]);
  // const [revealedFakes, setRevealedFakes] = useState([]);
  // const [revealedSalts, setRevealedSalts] = useState([]);
  const [initialisingTime, setInitialisingTime] = useState(null);
  const [auctionEnd, setAuctionEnd] = useState(false);

  const classes = useStyles();

  let noRerenderRevealedBids = [];
  let noRerenderRevealedFakes = [];
  let noRerenderRevealedSalts = [];


  useEffect(() => {
    setInitialisingTime(moment());
  }, [])

  useEffect(() => {
    const now = moment();
    if (now - initialisingTime > bidEndTime) {
      setCommitTimeOver(true);
    } else if (now - initialisingTime > bidEndTime + revealEndTime) {
      setAuctionEnd(true);
    }
  })

  const handleBidding = (e) => {
    let domain = e.currentTarget.value;
    domain = domain.replace(/\0/g, '');
    setDomainSelected(domain);
    setOpenModal(true);
  };

  const handleBidAmountCommitChange = (e) => {
    setBidAmountCommit(e.target.value);
  }

  const handleFakeCommitChange = () => {
    setIsFakeCommit(!isFakeCommit);
  }

   const handleSaltCommitChange = (e) => {
    setSaltCommit(e.target.value);
  }

  // bid value (wiling to pay) & message value multiple commit
  const commitBid = () => {
    const digits = /^[0-9]*$/;
    if (digits.test(parseInt(bidAmountCommit))) {
      console.log(`submitting commit for ${domainSelected} with bid amount ${bidAmountCommit}, fake ${isFakeCommit}, salt ${saltCommit}`);
      auctFactInstance.methods.bidHash(bidAmountCommit, isFakeCommit, web3.utils.fromAscii(saltCommit))
        .call()
        .then(blindBid => 
          auctFactInstance.methods.commitBid(domainSelected, blindBid)
          .call()
          .then(() => {
            alert('Commit success');
            closeModal(true);
          })
          .catch(err => console.log(err)))
        .catch(err => console.log(err));
      
    } else {
      alert("Invalid input. Please try again");
    }
  };

  // reveal multiple times (one shot)
  const revealBid = () => {
    console.log(`submitting reveals...`);
    auctFactInstance.methods.revealBid(domainSelected, noRerenderRevealedBids, noRerenderRevealedFakes, noRerenderRevealedSalts)
      .call()
      .then(() => {
        alert('Reveal success');
        closeModal(true);
      })
      .catch(err => console.log(err));
  }

  const closeModal = (success) => {
    setOpenModal(false);
    if (!success) {
      setDomainSelected('');
      setBidAmountCommit(0);
      setIsFakeCommit(false);
      setSaltCommit('');
    }
  }

  const addRevealEntry = () => {
    setNumReveals(numReveals + 1);
  }

  const RevealBidsComponent = ({ idx }) => {
    const [bidAmountReveal, setBidAmountReveal] = useState('');
    const [isFakeReveal, setIsFakeReveal] = useState(false);
    const [saltReveal, setSaltReveal] = useState('');

    const handleBidAmountRevealChange = (e) => {
      setBidAmountReveal(e.target.value);
    }

    const handleFakeRevealChange = () => {
      setIsFakeReveal(!isFakeReveal);
    }

    const handleSaltRevealChange = (e) => {
      setSaltReveal(e.target.value);
    }

    const submit = () => {
      const digits = /^[0-9]*$/;
      if (!digits.test(parseInt(bidAmountReveal))) {
        alert("Invalid input. Please try again");
      } else {
        noRerenderRevealedBids = [...noRerenderRevealedBids, bidAmountReveal];
        noRerenderRevealedFakes = [...noRerenderRevealedFakes, isFakeReveal];
        noRerenderRevealedSalts = [...noRerenderRevealedSalts, web3.utils.fromAscii(saltReveal)];
        alert('Reveal submitted');
      }
    }

    return (
      <Paper className={classes.modelEntry}>
        <TextField label="Pay Domain (in Eth)" type="text" className={classes.textField} value={bidAmountReveal} onChange={handleBidAmountRevealChange} />
        <TextField label="Set Salt" type="text" className={classes.textField} value={saltReveal} onChange={handleSaltRevealChange} />
        <ToggleButton value="check" selected={isFakeReveal} className={classes.toggle} onChange={handleFakeRevealChange}>
          <p>Fake</p><CheckIcon className={classes.checkicon}/> 
        </ToggleButton>
        <Button className={classes.smallbutton} variant="contained" color="default" onClick={submit}> Submit this Reveal </Button>
      </Paper>
    )
  }

  return (
    <>
      <Paper key={domain} className={classes.detailComponent} elevation={2}>
        <Typography align="left" variant="h4">Domain: {domain}</Typography>
        <Typography align="left" variant="h6">Bid Increment: {bidIncrement}</Typography>
        <Typography align="left" variant="h6">Bid End Time: {bidEndTime.toString()}</Typography>
        <Typography align="left" variant="h6">Reveal End TIme: {revealEndTime.toString()}</Typography>
        <Button className={classes.bidButton} variant="outlined" color="primary" value={domain} onClick={handleBidding} disabled={commitTimeOver || auctionEnd}>Commit bid for this Domain</Button>
        <Button className={classes.bidButton} variant="outlined" color="primary" value={domain} onClick={handleBidding} disabled={!commitTimeOver || auctionEnd}>Reveal bid for this Domain</Button>
      </Paper>
      <Modal open={openModal && !commitTimeOver && !auctionEnd} onClose={() => closeModal(false)} >
        <Paper className={classes.modal}>
          <Typography align="center" variant="h6"> Commit Bid </Typography>
          <TextField label="Pay Domain (in Eth)" type="text" className={classes.textField} value={bidAmountCommit} onChange={handleBidAmountCommitChange} />
          <TextField label="Set Salt" type="text" className={classes.textField} value={saltCommit} onChange={handleSaltCommitChange} />
          <ToggleButton value="check" selected={isFakeCommit} className={classes.toggle} onChange={handleFakeCommitChange}>
            <p>Fake</p><CheckIcon className={classes.checkicon}/> 
          </ToggleButton>
          <br/> <br/>
          <Button className={classes.smallbutton} variant="contained" color="primary" onClick={commitBid}> Confirm Payment </Button>
          <Button className={classes.smallbutton} variant="contained" color="default" onClick={() => closeModal(false)}> Close </Button>
        </Paper>
      </Modal>
      <Modal open={openModal && commitTimeOver && !auctionEnd} onClose={() => closeModal(false)} >
        <Paper className={classes.modal}>
          <Typography align="center" variant="h6"> Reveal Bid </Typography>
          {[...Array(numReveals)].map((_, idx) => <RevealBidsComponent key={idx} idx={idx} />)}
          <Button className={{[classes.smallbutton]: true, [classes.addRevealEntry]: true}} variant="contained" color="secondary" onClick={addRevealEntry}> Add </Button>
          <br/> <br/>
          <Button className={classes.smallbutton} variant="contained" color="primary" onClick={revealBid}> Confirm Payment </Button>
          <Button className={classes.smallbutton} variant="contained" color="default" onClick={() => closeModal(false)}> Close </Button>
        </Paper>
      </Modal>

    </>
  );
}

export default UserOnAuction
