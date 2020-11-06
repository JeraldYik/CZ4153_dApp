import React, {useState, useEffect} from "react";
import User from './components/User';
import Web3 from 'web3'
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
import useGetAuctionAddressesList from './hooks/useGetAuctionList';
import useGetAuctionInstances from './hooks/useGetAuctionInstances';

import QueryDomain from './components/QueryDomain.js';
import ManageDomain from './components/ManageDomain.js';
import OngoingAuctions from './components/OngoingAuctions.js';
import PayDomain from './components/PayDomain.js';

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
    width: '40%',
    margin: '10px',
  },
  container: {
    width: '90%',
    marginRight: '6%',
    padding: '10px',
  }
}));
// import {
//   ContractAddress,
//   Testnet,
//   populateUserAddresses,
//   createAuction,
//   cancelAuction,
//   getUserAddress,
//   endAuction
// } from "./auctionFactory.js"

const App = () => {
  const web3 = useGetWeb3();
  const classes = useStyles();
  const userAccounts = useGetAccounts({ web3 });
  const { auctFactInstance, auctFactAddr } = useGetAuctFactInstance({ web3, contract: AuctionFactory });
  const { regInstance, regAddr } = useGetRegInstance({ web3, auctFactInstance, contract: Registry });
  const auctionAddressesList = useGetAuctionAddressesList({ auctFactInstance });
  const auctionInstances = useGetAuctionInstances({ web3, contractAddresses: auctionAddressesList, contract: BlindAuction });

  const [domainName, setDomainName] = useState('');
  const [ownerAddr, setOwnerAddr] = useState('');
  const [currentPage, setCurrentPage] = useState('');
  const [query, setQuery] = useState(0);
  const [queryResult, setQueryResult] = useState('');
  const [queryReceipt, setQueryReceipt] = useState('');
  // const [created, setCreated] = useState(false);
  // const [canceled, setCanceled] = useState(false);
  // const [users, setUsers] = useState([]);
  // const [auctions, setAuctions] = useState([]);
  // const [winner, setWinner] = useState('');
  //
  // const NUM_USERS = 2;
  // const BID_INCREMENT = 10;
  // const BIDDING_TIME = 100;
  // const REVEAL_TIME = 1;
  //
  // useEffect(() => {
  //   const _populateUserAddresses = async () => {
  //     await populateUserAddresses();
  //     setIsUserAddressSet(true);
  //   };
  //   _populateUserAddresses();
  // }, []);
  //
  // useEffect(() => {
  //   setOwnerAddr(getUserAddress(0));
  //   const _users = [];
  //   for (var i=1; i<=NUM_USERS; i++) {
  //     _users.push(<User index={i} address={getUserAddress(i)}/>);
  //   }
  //   setUsers(_users);
  // }, [isUserAddressSet])

  //
  const handleDomainNameChange = (e) => {
    setDomainName(e.target.value);
  }
  //
  const handlePageChange = (page) => {
    setCurrentPage(page);
  }
  // const handleCreateAuction = async () => {
  //   const newAuction = await createAuction(BID_INCREMENT, BIDDING_TIME, REVEAL_TIME, domainName);
  //   setAuctions([...auctions, newAuction]);
  //   setCreated(true);
  // }
  //
  // const handleCancelAuction = async () => {
  //   const canceled = await cancelAuction(domainName, ownerAddr);
  //   if (canceled) {
  //     setCanceled(true);
  //     setDomainName('');
  //     setCreated(false);
  //   }
  // }
  //
  // const handleEndAuction = async () => {
  //   const topBidder = await endAuction(domainName);
  //   setWinner(topBidder);
  //   setCanceled(true);
  // }

  return (
    <Paper className={classes.root} elevation={2}>
      <Typography align="center" variant="h3"> Welcome to Auction dDNS dApp </Typography>
      <br />
      <Typography align="center" variant="h5">Bank Contract Address: {auctFactAddr}</Typography>
      <br />
      <Typography align="center" variant="h5">Registry Contract Address: {regAddr}</Typography>
      <hr />
      <div>
        <Typography align="center" variant="h6">Your Wallet: {userAccounts}</Typography>
        <br />
        <Button className={classes.button} variant="outlined" color="primary" onClick={() => handlePageChange("Ongoing Auctions")}>Ongoing Auctions</Button>
        <Button className={classes.button} variant="outlined" color="primary" onClick={() => handlePageChange("Query Domain")}>Query Domain</Button>
        <br />
        <Button className={classes.button} variant="outlined" color="primary" onClick={() => handlePageChange("Pay a Domain")}>Pay a Domain</Button>
        <Button className={classes.button} variant="outlined" color="primary" onClick={() => handlePageChange("Manage Domains")}>Manage Domains</Button>
        <br />
      </div>
      <Container className={classes.container}>
        {(currentPage === 'Ongoing Auctions') && <OngoingAuctions/>}
        {(currentPage === 'Query Domain') && <QueryDomain auctFactInstance={auctFactInstance} regInstance={regInstance} regAddr={regAddr} accountAddress={userAccounts?.[0]}/>}
        {(currentPage === 'Pay a Domain') && <PayDomain/>}
        {(currentPage === 'Manage Domains') && <ManageDomain/>}
      </Container>
    </Paper>
  );
}

export default App;
