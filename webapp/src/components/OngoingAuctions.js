import {
  makeStyles, Container, Typography, Paper, TextField, Slider, Modal, Table, Card
} from '@material-ui/core';
import React, {useState, useEffect, useCallback} from "react";

const useStyles = makeStyles(() => ({
  detailComponent: {
    margin: '0.5em',
    padding: '20px',
    border: '1px solid #EEEEEE'
  }
}));

function OngoingAuctions({ auctionDetailsList }) {
  console.log(auctionDetailsList);

  const [auctionDetails, setAuctionDetails] = useState([]);
  const classes = useStyles();

  useEffect(() => {
    const createAuctionDetails = (domain, bidIncrement, bidEndTime, revealEndTime) => (
      <Container key={domain} className={classes.detailComponent}>
        <Typography align="left" variant="h4">Domain: {domain}</Typography>
        <Typography align="left" variant="h6">Bid Increment: {bidIncrement}</Typography>
        <Typography align="left" variant="h6">Bid End Time: {bidEndTime.toString()}</Typography>
        <Typography align="left" variant="h6">Reveal End TIme: {revealEndTime.toString()}</Typography>
      </Container>
    );
    const temp = [];
    Object.keys(auctionDetailsList).map(domain => {
      const values = auctionDetailsList[domain];
      temp.push(createAuctionDetails(domain, values.bidIncrement, values.bidEndTime, values.revealEndTime))
    })
    setAuctionDetails(temp);
  }, []);


return (
    <>
      <Typography align="center" variant="h3"> ~ Ongoing Auctions ~ </Typography>
      {auctionDetails}
    </>
  );
}

export default OngoingAuctions
