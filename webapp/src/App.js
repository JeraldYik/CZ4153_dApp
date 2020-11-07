import React, { useState } from "react";
import './App.css';
import {
  makeStyles, Paper, Button, Typography, Container
} from '@material-ui/core';

import AuctionFactory from './contracts/AuctionFactory.json';
import BlindAuction from './contracts/BlindAuction.json';
import Registry from './contracts/Registry.json';

import { useGetWeb3 } from './hooks/useGetWeb3';
import useGetAccounts from './hooks/useGetAccounts';
import useGetAuctFactInstance from './hooks/useGetAuctFactInstance';
import useGetRegInstance from './hooks/useGetRegInstance';
import useGetAuctionAddressList from './hooks/useGetAuctionAddressList';
import useGetAuctionDomainList from './hooks/useGetAuctionDomainList'
import useGetAuctionInstances from './hooks/useGetAuctionInstances';
import useGetAuctionDetailsList from './hooks/useGetAuctionDetailsList';

import QueryDomain from './components/QueryDomain.js';
import ManageDomain from './components/ManageDomain.js';
import OngoingAuctions from './components/OngoingAuctions';

const useStyles = makeStyles(() => ({
  root: {
    width: '70%',
    margin: '0.5em',
    padding: '10px',
    textAlign: 'center',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%,-50%)',
    maxHeight: '100%',
    overflow: 'auto'
  },
  button: {
    width: '70%',
    margin: '10px',
  },
  container: {
    width: '90%',
    marginRight: '6%',
    padding: '10px',
  }
}));

const App = () => {
  const classes = useStyles();

  const web3 = useGetWeb3();
  const userAccounts = useGetAccounts({ web3 });
  const { auctFactInstance, auctFactAddr } = useGetAuctFactInstance({ web3, contract: AuctionFactory });
  const { regInstance, regAddr } = useGetRegInstance({ web3, auctFactInstance, contract: Registry });
  const auctionAddressesList = useGetAuctionAddressList({ auctFactInstance });
  const auctionDomainsList = useGetAuctionDomainList({ auctFactInstance });
  const auctionDetailsList = useGetAuctionDetailsList({ auctFactInstance, auctionAddressesList, auctionDomainsList });
  const auctionInstances = useGetAuctionInstances({ web3, contractAddresses: auctionAddressesList, contract: BlindAuction });

  const [currentPage, setCurrentPage] = useState('');

  const handlePageChange = (page) => {
    setCurrentPage(page);
  }

  window.ethereum.on('accountsChanged', function (accounts) {
    window.location.reload(false);
  })

  return (
    <Paper className={classes.root} elevation={2}>
      <Typography align="center" variant="h3"> Welcome to DDNS dApp </Typography>
      <br />
      <Typography align="center" variant="h5">Bank Contract Address: {auctFactAddr}</Typography>
      <br />
      <Typography align="center" variant="h5">Registry Contract Address: {regAddr}</Typography>
      <hr />
      <div>
        <Typography align="center" variant="h6">Your Wallet: {userAccounts}</Typography>
        <br />
        <Button className={classes.button} variant="contained" color="primary" onClick={() => handlePageChange("Ongoing Auctions")}>Ongoing Auctions</Button>
        <br />
        <Button className={classes.button} variant="contained" color="primary" onClick={() => handlePageChange("Query Domain")}>Query Domain</Button>
        <br />
        <Button className={classes.button} variant="contained" color="primary" onClick={() => handlePageChange("Manage Domains")}>Manage Domains</Button>
        <br />
      </div>
      <Container className={classes.container}>
        {(currentPage === 'Ongoing Auctions') && <OngoingAuctions auctionDetailsList={auctionDetailsList} auctFactInstance={auctFactInstance} userAccounts={userAccounts} auctionInstances={auctionInstances}/>}
        {(currentPage === 'Query Domain') && <QueryDomain auctFactInstance={auctFactInstance} regInstance={regInstance} regAddr={regAddr} accountAddress={userAccounts?.[0]}/>}
        {(currentPage === 'Manage Domains') && <ManageDomain userAccounts={userAccounts} web3={web3} regInstance={regInstance}/>}
      </Container>
    </Paper>
  );
}

export default App;
