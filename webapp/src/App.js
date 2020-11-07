import React, {useState, useEffect} from "react";
import User from './components/User';
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

import QueryDomain from './components/QueryDomain.js';
import ManageDomain from './components/ManageDomain.js';
import OngoingAuctions from './components/OngoingAuctions.js';

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
  const web3 = useGetWeb3();
  const classes = useStyles();
  const userAccounts = useGetAccounts({ web3 });
  const { auctFactInstance, auctFactAddr } = useGetAuctFactInstance({ web3, contract: AuctionFactory });
  const { regInstance, regAddr } = useGetRegInstance({ web3, auctFactInstance, contract: Registry });
  const auctionAddressesList = useGetAuctionAddressList({ auctFactInstance });
  const auctionDomainsList = useGetAuctionDomainList({ auctFactInstance });
  const auctionInstances = useGetAuctionInstances({ web3, contractAddresses: auctionAddressesList, contract: BlindAuction });

  const [domainName, setDomainName] = useState('');
  const [ownerAddr, setOwnerAddr] = useState('');
  const [currentPage, setCurrentPage] = useState('');
  const [query, setQuery] = useState(0);
  const [queryResult, setQueryResult] = useState('');
  const [queryReceipt, setQueryReceipt] = useState('');

  const handlePageChange = (page) => {
    setCurrentPage(page);
  }

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
        {(currentPage === 'Ongoing Auctions') && <OngoingAuctions auctionInstances={auctionInstances} auctionAddressesList={auctionAddressesList} auctionDomainsList={auctionDomainsList}/>}
        {(currentPage === 'Query Domain') && <QueryDomain auctFactInstance={auctFactInstance} regInstance={regInstance} regAddr={regAddr} accountAddress={userAccounts?.[0]}/>}
        {(currentPage === 'Manage Domains') && <ManageDomain/>}
      </Container>
    </Paper>
  );
}

export default App;
