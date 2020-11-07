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

function UserOnAuction({ domain, bidIncrement, bidEndTime, revealEndTime, auctFactInstance }) {
  const [openModal, setOpenModal] = useState(false);
  const [domainSelected, setDomainSelected] = useState('');
  const [bidAmountCommit, setBidAmountCommit] = useState('');
  const [isFakeCommit, setIsFakeCommit] = useState(false);
  const [saltCommit, setSaltCommit] = useState('');
  const [committed, setCommitted] = useState(false);
  const [bidAmountReveal, setBidAmountReveal] = useState('');
  const [isFakeReveal, setIsFakeReveal] = useState(false);
  const [saltReveal, setSaltReveal] = useState('');
  const [revealedBids, setRevealedBids] = useState([]);
  const [revealedFakes, setRevealedFakes] = useState([]);
  const [revealedSalts, setRevealedSalts] = useState([]);

  const [admin, setAdmin] = useState(false);
  const [deposit, setDeposit] = useState(0);
  const [endAuction, setEndAuction] = useState(false);

  const classes = useStyles();

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

  // const commitBid = useCallback(() => {
  //   const digits = /^[0-9]*$/;
  //   if (digits.test(parseInt(bidAmount))) {
  //     console.log(`submit bid for ${domainSelected} with bid amount ${bidAmount} Gwei, fake ${isFake}, salt ${salt}`);
  //     auctFactInstance.methods.bidHash(bidAmount*Math.pow(10,9), isFake, web3.utils.fromAscii(salt))
  //       .call()
  //       .then(blindBid =>
  //         auctFactInstance.methods.commitBid(domainSelected, blindBid)
  //         .send({ from: userAccounts[0], value: deposit })
  //         .catch(err => console.log(err)))
  //       .catch(err => console.log(err));
  //     alert('Commit success');
  //   } else {
  //     alert("Invalid input. Please try again");
  //   }
  // }, [domainSelected, bidAmount, isFake, salt, deposit]);


  const commitBid = () => {
    const digits = /^[0-9]*$/;
    if (digits.test(parseInt(bidAmountCommit))) {
      console.log(`submitting bid for ${domainSelected} with bid amount ${bidAmountCommit}, fake ${isFakeCommit}, salt ${saltCommit}`);
      auctFactInstance.methods.bidHash(bidAmountCommit*Math.pow(10,9), isFakeCommit, web3.utils.fromAscii(saltCommit))
        .call()
        .then(blindBid =>
          auctFactInstance.methods.commitBid(domainSelected, blindBid)
          .send({ from: userAccounts[0] })
          .then(() => {
            alert('Commit success');
            closeModal(true);
            setCommitted(true);
          })
          .catch(err => console.log(err)))
        .catch(err => console.log(err));

    } else {
      alert("Invalid input. Please try again");
    }
  };

  const handleBidAmountRevealChange = (e) => {
    setBidAmountReveal(e.target.value);
  }

  const handleFakeRevealChange = () => {
    setIsFakeReveal(!isFakeCommit);
  }

   const handleSaltRevealChange = (e) => {
    setSaltReveal(e.target.value);
  }

  const revealBid = () => {
    const digits = /^[0-9]*$/;
    if (!digits.test(parseInt(bidAmountReveal)) || saltReveal !== saltCommit || isFakeReveal !== isFakeCommit) {
      alert("Please ensure your reveal bid fake and salt values are matching your commit!")
    } else {
      console.log(`submitting bid for ${domainSelected} with bid amount ${bidAmountCommit}, fake ${isFakeCommit}, salt ${saltCommit}`);
      const newRevealedBids = [...revealedBids, bidAmountReveal];
      const newRevealedFakes = [...revealedFakes, isFakeReveal];
      const newRevealedSalts = [...revealedSalts, saltReveal];
      setRevealedBids(newRevealedBids);
      setRevealedFakes(newRevealedFakes);
      setRevealedSalts(newRevealedSalts);
      auctFactInstance.methods.revealBid(domainSelected, newRevealedBids, newRevealedFakes, newRevealedSalts)
        .call()
        .then(() => {
          alert('Reveal success');
          closeModal(true);
        })
        .catch(err => console.log(err));
    }
  };

  const closeModal = (success) => {
    setOpenModal(false);
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
  }

  const handleEndAuction(){}

return (
    <>
      <Paper key={domain} className={classes.detailComponent} elevation={2}>
        <Typography align="left" variant="h4">Domain: {domain}</Typography>
        <Typography align="left" variant="h6">Bid Increment: {bidIncrement}</Typography>
        <Typography align="left" variant="h6">Bid End Time: {bidEndTime.toString()}</Typography>
        <Typography align="left" variant="h6">Reveal End TIme: {revealEndTime.toString()}</Typography>
        <Button className={classes.bidButton} variant="outlined" color="primary" value={domain} onClick={handleBidding} disabled={committed}>Commit bid for this Domain</Button>
        <Button className={classes.bidButton} variant="outlined" color="primary" value={domain} onClick={handleBidding} disabled={!committed}>Reveal bid for this Domain</Button>
        <Button className={classes.bidButton} variant="outlined" color="primary" value={domain} onClick={handleEndAuction} disabled={admin}>End this Auction</Button>
      </Paper>
      <Modal open={openModal && !committed} onClose={() => closeModal(false)} >
        <Paper className={classes.modal}>
          <Typography align="center" variant="h6"> Commit Bid </Typography>
          <TextField label="Pay Domain (in Eth)" type="text" className={classes.textField} value={bidAmountCommit} onChange={handleBidAmountCommitChange} />
          <TextField label="Set Salt" type="text" className={classes.textField} value={saltCommit} onChange={handleSaltCommitChange} />
          <ToggleButton value="check" selected={isFakeCommit} className={classes.toggle} onChange={handleFakeCommitChange}>
            <p>Fake</p><CheckIcon className={classes.checkicon}/>
          </ToggleButton>
          <TextField label="Set Salt" type="text" className={classes.textField} value={deposit} onChange={handleDepositChange} />
          <br/> <br/>
          <Button className={classes.smallbutton} variant="contained" color="primary" onClick={commitBid}> Confirm Payment </Button>
          <Button className={classes.smallbutton} variant="contained" color="default" onClick={() => closeModal(false)}> Close </Button>
        </Paper>
      </Modal>
      <Modal open={openModal && committed} onClose={() => closeModal(false)} >
        <Paper className={classes.modal}>
          <Typography align="center" variant="h6"> Reveal Bid </Typography>
          <TextField label="Pay Domain (in Eth)" type="text" className={classes.textField} value={bidAmountReveal} onChange={handleBidAmountRevealChange} />
          <TextField label="Set Salt" type="text" className={classes.textField} value={saltReveal} onChange={handleSaltRevealChange} />
          <ToggleButton value="check" selected={isFakeReveal} className={classes.toggle} onChange={handleFakeRevealChange}>
            <p>Fake</p><CheckIcon className={classes.checkicon}/>
          </ToggleButton>
          <br/> <br/>
          <Button className={classes.smallbutton} variant="contained" color="primary" onClick={revealBid}> Confirm Payment </Button>
          <Button className={classes.smallbutton} variant="contained" color="default" onClick={() => closeModal(false)}> Close </Button>
        </Paper>
      </Modal>

    </>
  );
}

export default UserOnAuction
