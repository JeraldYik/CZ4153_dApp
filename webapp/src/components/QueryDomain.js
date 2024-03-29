import {
  makeStyles, Button, Typography, Paper, TextField, Slider, Modal
} from '@material-ui/core';
import React, {useState, useCallback, useMemo} from "react";
import Web3 from 'web3';

const useStyles = makeStyles(() => ({
  root: {
    width: '100%',
    margin: '0.5em',
    padding: '10px',
    textAlign: 'center',
  },
  button: {
    width: '45%',
    margin: '0.35em',
    padding: '5px',
  },
  bidbutton: {
    width: '85%',
    margin: '0.5em',
    padding: '10px',
  },
  smallbutton: {
    width: '50%',
    margin: '0.5em',
    marginLeft: '100px',
    padding: '10px',
  },
  modal: {
    position: 'absolute',
    width: 400,
    top: '50%',
    left: '50%',
    padding: '10px',
    transform: 'translate(-50%,-50%)',
  },
  textField: {
    width: '80%',
    marginBottom: '0.5em',
  },
}));

function QueryDomain({ auctFactInstance, regInstance, regAddr, auctionDomainsList, accountAddress }) {
  const classes = useStyles();

  // Remove Null Characters from Domains List
  const auctionTrimDomainsList = useMemo(() => trimDomainsList(auctionDomainsList), [auctionDomainsList]);

  function trimDomainsList(auctionDomainsList) {
    const array = []
    if (auctionDomainsList) {
      for (var i = 0 ; i < auctionDomainsList.length ; i++) {
        var temp = auctionDomainsList[i];
        temp = temp.replace(/\0/g, '');
        array.push(temp);
      }
    } return array;
  }
  // State Var for querying
  const [queried, setQueried] = useState(0);
  const [queryInput, setQueryInput] = useState('');
  const [queryResult, setQueryResult] = useState('');
  const [canRegister, setCanRegister] = useState(false);
  const [domOrAddr, setDomOrAddr] = useState('');
  // State Var for paying
  const [openModalOne, setOpenModalOne] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(0);
  // State Var for starting auction
  const [openModalTwo, setOpenModalTwo] = useState(false);
  const [bidTime, setBidTime] = useState(60);
  const [revealTime, setRevealTime] = useState(60);
  const [bidIncrement, setBidIncrement] = useState(0.5);

  const handleAllQuery = useCallback((queryInput, queryChoice) => {
    queryInput = queryInput.toLowerCase();
    if(/^[a-zA-Z0-9- ]*$/.test(queryInput) === false) {
      alert('Your domain name contains illegal characters.');
    } else { setQueryInput(queryInput); };

    if (regInstance) {
      if (queryChoice === 1) {
        setQueried(1);
        setDomOrAddr('address');
        regInstance.methods.queryDomainOwner(queryInput)
          .call()
          .then((result) => {
            setQueryResult(result);
          });
      } else if (queryChoice === 2) {
        setQueried(2);
        setDomOrAddr('address');
        if (auctionTrimDomainsList.includes(queryInput)) { setCanRegister(false); }
        regInstance.methods.queryDomainPayableAddr(queryInput)
          .call()
          .then((result) => {
            setQueryResult(result);
          });
      } else if (queryChoice === 3) {
        setQueried(3);
        setDomOrAddr('domain');
        if (Web3.utils.isAddress(queryInput)) {
          regInstance.methods.queryDomainFromOwner(queryInput)
            .call()
            .then((result) => {
              setQueryResult(result);
            });
        } else (alert("That is not a valid address!"));
      } else if (queryChoice === 4) {
        setQueried(4);
        setDomOrAddr('domain');
        if (Web3.utils.isAddress(queryInput)) {
          regInstance.methods.queryDomainFromOwner(queryInput)
            .call()
            .then((result) => {
              setQueryResult(result);
            });
        } else (alert("That is not a valid address!"));
      }
    }

    if (queryResult === '') {
      if (queryChoice === 1 || queryChoice === 2) {
        if (auctionTrimDomainsList.includes(queryInput)) {
          setCanRegister(false);
        } else { setCanRegister(true); }
      }
    }

  }, [regInstance, queryResult, auctionTrimDomainsList]);

  const payDomain = useCallback((paymentAmount, queryResult) => {
    paymentAmount = paymentAmount.toString();
    queryResult = queryResult.toString();
    alert("You're paying " + paymentAmount + " Ether to " + queryResult + ".ntu !")
    if (regInstance) {
      regInstance.methods
          .payDomainPayableAddr(queryResult)
          .send({ from: accountAddress, value: Web3.utils.toWei(paymentAmount, 'ether') })
          .then(() => {
            window.location.reload(false);
          })
          .catch((error) => {console.log(error); });
    }
  }, [regInstance, accountAddress])

  const startAuction = useCallback((queryInput, bidIncrement, bidTime, revealTime) => {
    queryInput = queryInput.toString();
    bidIncrement = bidIncrement.toString();
    bidTime = bidTime.toString();
    revealTime = revealTime.toString();
    alert("You're registering the domain: " + queryInput);
    alert("Bidding Increment: " + bidIncrement + " Eth, Bidding Time: " + bidTime + "s, Reveal Time: " + revealTime + "s");
    if (auctFactInstance) {
      auctFactInstance.methods
            .createAuction(bidIncrement*(Math.pow(10,9)), bidTime, revealTime, queryInput)
            .send({ from: accountAddress, value: Web3.utils.toWei('100000', 'gwei') })
            .then((address) => {
              window.location.reload(false);
            })
            .catch((error) => { console.log(error); });
    }
  }, [auctFactInstance, accountAddress]);

  const handleOpenModalOne = useCallback(() => {
    setOpenModalOne(true);
  }, [setOpenModalOne]);

  const handleCloseModalOne = useCallback(() => {
    setOpenModalOne(false);
  }, [setOpenModalOne]);

  const handleOpenModalTwo = useCallback(() => {
    setOpenModalTwo(true);
  }, [setOpenModalTwo]);

  const handleCloseModalTwo = useCallback(() => {
    setOpenModalTwo(false);
  }, [setOpenModalTwo]);

  const handleBidIncrement = useCallback((event, value) => {
    setBidIncrement(value);
    }, [setBidIncrement]);

  const handleBidTime = useCallback((event, value) => {
    setBidTime(value);
  }, [setBidTime]);

  const handleRevealTime = useCallback((event, value) => {
    setRevealTime(value);
  }, [setRevealTime]);

  return (
    <>
      <Paper className={classes.root} elevation={2}>

        <Typography align="center" variant="h3"> ~ DDNS Queries Manager ~ </Typography>
        <br />
        <TextField id="query-input" label="Type Domain or Address Here" type="text" className={classes.textField} onChange={ (event) => {setQueryInput(event.target.value)}}/>
        <br /><br />
        <Button className={classes.button} variant="outlined" color="primary" onClick={() => handleAllQuery(queryInput, 1)}>Find Domain's Owner</Button>
        <Button className={classes.button} variant="outlined" color="primary" onClick={() => handleAllQuery(queryInput, 2)}>Find Domain's Registered Address</Button>
        <br /><br />
        <Button className={classes.button} variant="outlined" color="primary" onClick={() => handleAllQuery(queryInput, 3)}>Query Owner's Domains</Button>
        <Button className={classes.button} variant="outlined" color="primary" onClick={() => handleAllQuery(queryInput, 4)}>Query Register Address Domain</Button>
        <br /><br />
        {(queried === 1 || queried === 2) && (queryResult !== '') && (domOrAddr === 'address') && <Typography align="center" variant="h5"> Address: {queryResult} </Typography>}
        {(queried === 3 || queried === 4) && (queryResult === '') && (domOrAddr === 'domain') && <Typography align="center" variant="h5"> Domain Not Found! </Typography>}

        {(queryResult !== '') && (domOrAddr === 'domain') && <Typography align="center" variant="h5"> Domain Name: {queryResult} </Typography>}
        {(queryResult !== '') && (domOrAddr === 'domain') && <Button className={classes.bidbutton} variant="contained" color="primary" onClick={() => handleOpenModalOne()}> Pay this Domain! </Button>}
        <Modal
        open={openModalOne}
        onClose={() => handleCloseModalOne()}
        >
        <Paper className={classes.modal}>
        <TextField id="payment-input" label="Pay Domain (in Eth)" type="text" className={classes.textField} onChange={ (event) => {setPaymentAmount(event.target.value)}}/>
        <br/> <br/>
        <Button className={classes.smallbutton} variant="contained" color="primary" onClick={() => payDomain(paymentAmount, queryResult)}> Confirm Payment </Button>
        </Paper>
        </Modal>

        {(queried === 1 || queried === 2) && (queryResult === '') && (canRegister === false) && <Typography align="center" variant="h5"> Domain is currently on auction! </Typography>}
        {((queried === 1 || queried === 2) && queryResult === '') && (canRegister === true) && <Typography align="center" variant="h5"> Domain is available! </Typography>}
        {(queried === 1 || queried === 2) && (queryResult === '') && (canRegister === true) && <Button className={classes.bidbutton} variant="contained" color="primary" onClick={() => handleOpenModalTwo()}> Start an Auction for this Domain! </Button>}
        <Modal
        open={openModalTwo}
        onClose={() => handleCloseModalTwo()}
        >
        <Paper className={classes.modal}>
        <Typography align="center" variant="h5"> Bid Increments(in Ether): </Typography>
        <br/> <br/>
        <Slider id="bid-increment" defaultValue={0.5} step={0.1} marks min={0.2} max={3} valueLabelDisplay="on" onChange={handleBidIncrement}></Slider>
        <Typography align="center" variant="h5"> Bidding Time(in seconds): </Typography>
        <br/> <br/>
        <Slider defaultValue={60} step={5} min={30} max={180} valueLabelDisplay="on" onChange={handleBidTime}></Slider>
        <Typography align="center" variant="h5"> Reveal Time(in seconds): </Typography>
        <br/> <br/>
        <Slider defaultValue={60} step={5} min={30} max={180} valueLabelDisplay="on" onChange={handleRevealTime}></Slider>
        <Button className={classes.smallbutton} variant="contained" color="primary" onClick={() => startAuction(queryInput, bidIncrement, bidTime, revealTime)}> Start Auction Now! </Button>
        </Paper>
        </Modal>
      </Paper>
    </>
  );
}

export default QueryDomain
