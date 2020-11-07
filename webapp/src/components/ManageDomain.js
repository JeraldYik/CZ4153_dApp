import {
  makeStyles, Button, Typography, Paper, TextField, Slider, Modal
} from '@material-ui/core';
import React, {useState, useCallback} from "react";
import Web3 from 'web3';
import { useGetWeb3 } from '../hooks/useGetWeb3';
import useGetAccounts from '../hooks/useGetAccounts';

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

function ManageDomain({ userAccounts, web3, regInstance }) {
  const classes = useStyles();

  const [ownedDomains, setOwnedDomains] = useState([]);
  const [regDomains, setRegDomains] = useState([]);

  const handleQuery = useCallback(() => {
    if(regInstance) {
      regInstance.methods.queryDomainFromOwner(userAccounts[0])
      .call()
      .then((result) => {
        alert(result);
        setOwnedDomains(result);
      });
    }
    console.log(regDomains);
  }, [userAccounts, web3, regInstance, ownedDomains]);

  return (
    <>
      <Paper className={classes.root} elevation={2}>
      <Typography align="center" variant="h3"> ~ Manage Your Domains ~ </Typography>
      <br/>
      {(userAccounts) && <Button className={classes.button} variant="contained" color="primary" onClick={() => handleQuery()}>Find My Domains!</Button>}

      </Paper>
    </>
  );
}

export default ManageDomain
