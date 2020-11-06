import {
  Button, makeStyles, Modal, Typography, Paper, TextField, Grid, MenuItem, Select, FormControl, InputLabel, Input, Chip,
} from '@material-ui/core';
import React, {useState, useCallback} from "react";
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

function QueryDomain({ auctFactInstance, regInstance, regAddr, accountAddress }) {
  const classes = useStyles();
  const [queryInput, setQueryInput] = useState('');
  const [queryResult, setQueryResult] = useState('');
  const [canRegister, setCanRegister] = useState(false);
  const [intervalTime, setIntervalTime] = useState(0);
  const [bidIncrement, setBidIncrement] = useState(0);
  const [startAuctFee, setStartAuctFee] = useState(1);

  const handleAllQuery = useCallback((queryInput, queryChoice) => {
    if (regInstance) {
      if (queryChoice === 1) {
        regInstance.methods.queryDomainOwner(queryInput)
          .call()
          .then((result) => {
            setQueryResult(result);
          })
          .catch((error) => { console.log(error); });
      } else if (queryChoice === 2) {
        regInstance.methods.queryDomainPayableAddr(queryInput)
          .call()
          .then((result) => {
            setQueryResult(result);
            setCanRegister(true);
          });
      } else if (queryChoice === 3) {
          regInstance.methods.queryDomainFromOwner(queryInput)
            .call()
            .then((result) => {
              setQueryResult(result);
            })
            .catch((error) => { console.log(error); });
      } else if (queryChoice === 4) {
        regInstance.methods.queryDomainFromOwner(queryInput)
          .call()
          .then((result) => {
            setQueryResult(result);
          })
          .catch((error) => { console.log(error); });
      }
    }
    if (true) {
      console.log("Hello");
    }
  }, [regInstance]);

  const startAuction = useCallback(() => {
    if (auctFactInstance) {
      auctFactInstance.methods
            .createAuction(5,30,30,"CX4153")
            .send({ from: accountAddress, value: Web3.utils.toWei(startAuctFee.toString(), 'ether') })
            .then((address) => {
              window.location.reload(false);
            })
            .catch((error) => { console.log(error); });
    }
  }, [auctFactInstance]);

  return (
    <>
      <Paper className={classes.root} elevation={2}>
        <Typography align="center" variant="h3">Welcome to Auction dDNS dApp Query</Typography>
        <br />
        <TextField id="query-input" label="Type Domain or Address Here" type="text" className={classes.textField} onChange={ (event) => {setQueryInput(event.target.value)}}/>
        <br />
        <Button className={classes.button} variant="outlined" color="primary" onClick={() => handleAllQuery(queryInput, 1)}>Find Domain's Owner</Button>
        <Button className={classes.button} variant="outlined" color="primary" onClick={() => handleAllQuery(queryInput, 2)}>Find Domain's Registered Address</Button>
        <br />
        <Button className={classes.button} variant="outlined" color="primary" onClick={() => handleAllQuery(queryInput, 3)}>Query Owner's Domains</Button>
        <Button className={classes.button} variant="outlined" color="primary" onClick={() => handleAllQuery(queryInput, 4)}>Query Register Address Domain</Button>
        <br />
        {(queryResult !== '') && <Typography align="center" variant="h3" value={queryResult} />}
        {(canRegister === true) && <Button className={classes.button} variant="outlined" color="primary" value="Test"/>}
      </Paper>

    </>
  );
}

export default QueryDomain
