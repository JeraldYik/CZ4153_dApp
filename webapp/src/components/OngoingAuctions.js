import {
  makeStyles, Button, Typography, Paper, TextField, FormControlLabel, Modal, Card
} from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';
import ToggleButton from '@material-ui/lab/ToggleButton';
import web3 from 'web3';
import React, {useState, useEffect, useCallback} from "react";

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
  textField: {
    width: '80%',
    marginBottom: '0.5em',
  },
  toggle: {
    whiteSpace: 'nowrap',
    overflow: 'auto'
  },
  checkicon: {
    display: 'inline-block'
  }
}));

/**
 * Ongoing Auction - List of ongoing auctions, 
 * click on them opens modal to bid before reveal time, 
 * modal changes to reveal after reveal time. 
 * After auction ended, the button to bid/reveal is disabled and the button to withdraw is enabled.
 */

function OngoingAuctions({ auctionDetailsList, auctFactInstance }) {
  const [auctionDetails, setAuctionDetails] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [domainSelected, setDomainSelected] = useState('');
  const [bidAmount, setBidAmount] = useState('');
  const [isFake, setIsFake] = useState(false);
  const [salt, setSalt] = useState('');
  const classes = useStyles();

  const handleBidding = (e) => {
    let domain = e.currentTarget.value;
    domain = domain.replace(/\0/g, '');
    setDomainSelected(domain);
    setOpenModal(true);
  };

  const handleBidAmountChange = (e) => {
    setBidAmount(e.target.value);
  }

  const handleFakeChange = () => {
    setIsFake(!isFake);
  }

   const handleSaltChange = (e) => {
    setSalt(e.target.value);
  }

  const commitBid = () => {
    const digits = /^[0-9]*$/;
    if (digits.test(parseInt(bidAmount))) {
      console.log(`submit bid for ${domainSelected} with bid amount ${bidAmount}, fake ${isFake}, salt ${salt}`);
      auctFactInstance.methods.bidHash(bidAmount, isFake, web3.utils.fromAscii(salt))
        .call()
        .then(blindBid => 
          auctFactInstance.methods.commitBid(domainSelected, blindBid)
          .call()
          .catch(err => console.log(err)))
        .catch(err => console.log(err));
      alert('Commit success');
    } else {
      alert("Invalid input. Please try again");
    }
  };

  const closeModal = () => {
    setOpenModal(false);
    setDomainSelected('');
    setBidAmount(0);
  }

  useEffect(() => {
    const createAuctionDetails = (domain, bidIncrement, bidEndTime, revealEndTime) => (
      <Paper key={domain} className={classes.detailComponent} elevation={2}>
        <Typography align="left" variant="h4">Domain: {domain}</Typography>
        <Typography align="left" variant="h6">Bid Increment: {bidIncrement}</Typography>
        <Typography align="left" variant="h6">Bid End Time: {bidEndTime.toString()}</Typography>
        <Typography align="left" variant="h6">Reveal End TIme: {revealEndTime.toString()}</Typography>
        <Button className={classes.bidButton} variant="outlined" color="primary" value={domain} onClick={handleBidding}>Bid for this Domain</Button>
      </Paper>
    );
    const temp = [];
    Object.keys(auctionDetailsList).map((domain, idx) => {
      const values = auctionDetailsList[domain];
      temp.push(createAuctionDetails(domain, values.bidIncrement, values.bidEndTime, values.revealEndTime))
    })
    setAuctionDetails(temp);
  }, []);

return (
    <>
      <Typography align="center" variant="h3"> ~ Ongoing Auctions ~ </Typography>
      {auctionDetails}
      <Modal open={openModal} onClose={closeModal} >
        <Paper className={classes.modal}>
          <TextField label="Pay Domain (in Eth)" type="text" className={classes.textField} value={bidAmount} onChange={handleBidAmountChange} />
          <TextField label="Set Salt" type="text" className={classes.textField} value={salt} onChange={handleSaltChange} />
          <ToggleButton value="check" selected={isFake} className={classes.toggle} onChange={handleFakeChange}>
            <p>Fake</p><CheckIcon className={classes.checkicon}/> 
          </ToggleButton>
          <br/> <br/>
          <Button className={classes.smallbutton} variant="contained" color="primary" onClick={commitBid}> Confirm Payment </Button>
        </Paper>
      </Modal>
    </>
  );
}

export default OngoingAuctions
