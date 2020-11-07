import {
  makeStyles, Button, Typography, Paper, TextField, FormControlLabel, Modal, Card
} from '@material-ui/core';
import UserOnAuction from './UserOnAuction';
import React, {useState, useEffect, useCallback} from "react";

/**
 * Ongoing Auction - List of ongoing auctions, 
 * click on them opens modal to bid before reveal time, 
 * modal changes to reveal after reveal time. 
 * After auction ended, the button to bid/reveal is disabled and the button to withdraw is enabled.
 */

function OngoingAuctions({ auctionDetailsList, auctFactInstance }) {
  const [auctionDetails, setAuctionDetails] = useState(null);

  useEffect(() => {
    const temp = [];
    Object.keys(auctionDetailsList).map(domain => {
      const values = auctionDetailsList[domain];
      temp.push(<UserOnAuction key={domain} domain={domain} bidIncrement={values.bidIncrement} bidEndTime={values.bidEndTime} revealEndTime={values.revealEndTime} auctFactInstance={auctFactInstance} />)
    })
    setAuctionDetails(temp);
  }, [])

return (
  <>
    <Typography align="center" variant="h3"> ~ Ongoing Auctions ~ </Typography>
    {auctionDetails}
  </>
  );
}

export default OngoingAuctions
