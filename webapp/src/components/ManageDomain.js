import {
  makeStyles, Button, Typography, Paper, TextField, Modal, Table, TableContainer, TableHead, TableBody, TableCell, TableRow
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
  title: {
    height: '85%',
    margin: '0.5em',
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
  const [ownedDomainsRowState, setOwnedDomainsRowState] = useState([]);
  const [regDomainsRowState, setRegDomainsRowState] = useState([]);

  function createData(domainName) {
    return { domainName };
  }

  const handleQuery = useCallback(() => {
    if(regInstance) {
      regInstance.methods.queryDomainFromOwner(userAccounts[0])
      .call()
      .then((result) => {
        setOwnedDomains(result);
      });
      regInstance.methods.queryDomainFromPayableAddr(userAccounts[0])
      .call()
      .then((result) => {
        setRegDomains(result);
      });
    }
    if (ownedDomains || regDomains) {
      var ownedDomainsRow = [];
      var regDomainsRow = [];
      for (var i=0; i < ownedDomains.length; i++) {
        var owntemp = createData(ownedDomains[i])
        ownedDomainsRow.push(owntemp);
      }
      for (var j=0; j < regDomains.length; j++) {
        var regtemp = createData(regDomains[j])
        regDomainsRow.push(regtemp);
      }
      setOwnedDomainsRowState(ownedDomainsRow);
      setRegDomainsRowState(regDomainsRow);
    }
  }, [userAccounts, web3, regInstance, ownedDomains]);



  return (
    <>
      <Paper className={classes.root} elevation={2}>
      <Typography align="center" variant="h3"> ~ Manage Your Domains ~ </Typography>
      <br/>
      {(userAccounts) && <Button className={classes.button} variant="contained" color="primary" onClick={() => handleQuery()}>Find My Domains!</Button>}
      </Paper>

      {(ownedDomainsRowState) &&
      <TableBody>
          {ownedDomainsRowState.map((row) => (
            <TableRow key={row.domainName}>
              <TableCell component="th" scope="row">
                {row.domainName}
              </TableCell>
              <TableCell value={row.domainName} align="center">
                <Button>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      }





    </>
  );
}

export default ManageDomain
