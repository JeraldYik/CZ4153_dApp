import {
  makeStyles, Button, Typography, Paper, TextField, FormControlLabel, Modal, Card
} from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';
import ToggleButton from '@material-ui/lab/ToggleButton';
import Web3 from 'web3';
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

function UserOnAuction({ domain, bidIncrement, bidEndTime, revealEndTime, auctFactInstance, userAccounts }) {
  const [openBidModal, setOpenBidModal] = useState(false);
  const [openRevealModal, setOpenRevealModal] = useState(false);
  const [domainSelected, setDomainSelected] = useState('');

  const [bidAmountCommit, setBidAmountCommit] = useState('');
  const [isFakeCommit, setIsFakeCommit] = useState(false);
  const [saltCommit, setSaltCommit] = useState('');
  const [commitDeposit, setCommitDeposit] = useState('');
  const [committed, setCommitted] = useState(false);

  const [bidAmountReveal, setBidAmountReveal] = useState('');
  const [isFakeReveal, setIsFakeReveal] = useState(false);
  const [saltReveal, setSaltReveal] = useState('');
  const [revealedBids, setRevealedBids] = useState([]);
  const [revealedFakes, setRevealedFakes] = useState([]);
  const [revealedSalts, setRevealedSalts] = useState([]);

  const [admin, setAdmin] = useState(false);
  const [endAuction, setEndAuction] = useState(false);

  const classes = useStyles();

  const handleBidding = useCallback((e) => {
    let domain = e.currentTarget.value;
    domain = domain.replace(/\0/g, '');
    setDomainSelected(domain);
    setOpenBidModal(true);
  });

  const handleRevealing = useCallback((e) => {
    let domain = e.currentTarget.value;
    domain = domain.replace(/\0/g, '');
    setDomainSelected(domain);
    setOpenRevealModal(true);
  });

  const commitBid = useCallback(() => {
    const digits = /^[0-9]*$/;
    if (digits.test(parseInt(bidAmountCommit))) {
      console.log(`submitting bid for ${domainSelected} with bid amount ${bidAmountCommit}, fake ${isFakeCommit}, salt ${saltCommit}, deposit ${commitDeposit}`);
      auctFactInstance.methods.bidHash(bidAmountCommit*Math.pow(10,9), isFakeCommit, Web3.utils.fromAscii(saltCommit))
        .call()
        .then(blindBid =>
          auctFactInstance.methods.commitBid(domainSelected, blindBid)
          .send({ from: userAccounts[0], value: Web3.utils.toWei(commitDeposit, 'ether') }))
          .then(() => {
            alert('Commit success');
            closeBidModal(true);
            setCommitted(true);
          }).then(() => {
            window.location.reload(false);
          }).catch((error) => {console.log(error); })
    } else {
      alert("Invalid input. Please try again");
    }
  });

  const addRevealBid = useCallback(() => {
      const newRevealedBids = revealedBids;
      const newRevealedFakes = revealedFakes;
      const newRevealedSalts = revealedSalts;
      newRevealedBids.push(bidAmountReveal*Math.pow(10,9));
      newRevealedFakes.push(isFakeReveal);
      newRevealedSalts.push(saltReveal);
      setRevealedBids(newRevealedBids);
      setRevealedFakes(newRevealedFakes);
      setRevealedSalts(newRevealedSalts);
      console.log(revealedBids);
      console.log(revealedFakes);
      console.log(revealedSalts);
  });

  const revealBids = useCallback(() => {
    const receipt = auctFactInstance.methods.revealBid(domainSelected, revealedBids, revealedFakes, revealedSalts)
      .send({ from: userAccounts[0] })
      .then(() => {
        alert("Reveal Submitted!");
        closeRevealModal();
        console.log(receipt);
      }).then(() => {
        window.location.reload(false);
      }).catch((error) => {console.log(error); })
    });


  const closeBidModal = useCallback((success) => {
    setOpenBidModal(false);
    if (!success) {
      setDomainSelected('');
      if (!committed) {
        setBidAmountCommit(0);
        setIsFakeCommit(false);
        setSaltCommit('');
      } else {
        setBidAmountReveal(0);
        setIsFakeReveal(0);
        setSaltReveal('');
      }
    }
  });

  const closeRevealModal = useCallback(() => {
    setOpenRevealModal(false);
  });


return (
    <>
      <Paper key={domain} className={classes.detailComponent} elevation={2}>
        <Typography align="left" variant="h4">Domain: {domain}</Typography>
        <Typography align="left" variant="h6">Bid Increment: {bidIncrement}</Typography>
        <Typography align="left" variant="h6">Bid End Time: {bidEndTime.toString()}</Typography>
        <Typography align="left" variant="h6">Reveal End Time: {revealEndTime.toString()}</Typography>
        <Button className={classes.bidButton} variant="outlined" color="primary" value={domain} onClick={handleBidding}>Commit bid for this Domain</Button>
        <Button className={classes.bidButton} variant="outlined" color="primary" value={domain} onClick={handleRevealing}>Reveal bid for this Domain</Button>

      </Paper>
      <Modal open={openBidModal} onClose={() => closeBidModal(false)} >
        <Paper className={classes.modal}>
          <Typography align="center" variant="h6"> Commit Bid </Typography>
          <TextField label="Bid Amount (in Eth)" type="text" className={classes.textField} value={bidAmountCommit} onChange={(event) => setBidAmountCommit(event.target.value)} />
          <TextField label="Set Salt" type="text" className={classes.textField} value={saltCommit} onChange={(event) => setSaltCommit(event.target.value)} />
          <ToggleButton value="check" selected={isFakeCommit} className={classes.toggle} onChange={(event) => setIsFakeCommit(event.target.selected)}>
            <p>Fake</p><CheckIcon className={classes.checkicon}/>
          </ToggleButton>
          <TextField label="Deposit" type="text" className={classes.textField} value={commitDeposit} onChange={(event) => setCommitDeposit(event.target.value)} />
          <br/> <br/>
          <Button className={classes.smallbutton} variant="contained" color="primary" onClick={commitBid}> Confirm Payment </Button>
          <Button className={classes.smallbutton} variant="contained" color="default" onClick={() => closeBidModal(false)}> Close </Button>
        </Paper>
      </Modal>
      <Modal open={openRevealModal} onClose={() => closeRevealModal()} >
        <Paper className={classes.modal}>
          <Typography align="center" variant="h6"> Reveal Bid </Typography>
          <TextField label="Pay Domain (in Eth)" type="text" className={classes.textField} value={bidAmountReveal} onChange={(event) => setBidAmountReveal(event.target.value)} />
          <TextField label="Set Salt" type="text" className={classes.textField} value={saltReveal} onChange={(event) => setSaltReveal(event.target.value)} />
          <ToggleButton value="check" selected={isFakeReveal} className={classes.toggle} onChange={(event) => setIsFakeReveal(event.target.selected)}>
            <p>Fake</p><CheckIcon className={classes.checkicon}/>
          </ToggleButton>
          <br/> <br/>
          <Button className={classes.smallbutton} variant="contained" color="primary" onClick={addRevealBid}> Add reveal bid </Button>
          <Button className={classes.smallbutton} variant="contained" color="primary" onClick={revealBids}> Confirm Reveals </Button>
          <Button className={classes.smallbutton} variant="contained" color="default" onClick={() => closeRevealModal()}> Close </Button>
        </Paper>
      </Modal>

    </>
  );
}

export default UserOnAuction
