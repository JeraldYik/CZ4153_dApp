import {
  makeStyles, Button, Typography, Paper, TextField, Slider, Modal
} from '@material-ui/core';
import React, {useState, useCallback} from "react";
import Web3 from 'web3';

function OngoingAuctions({ auctionInstances, auctionAddressesList, auctionDomainsList }) {
  console.log(auctionInstances);
  console.log(auctionAddressesList);
  console.log(auctionDomainsList);

  // This method doesn't work
  const auctionTrimDomainsList = [];
  for (var i = 0 ; i < auctionDomainsList.length ; i++) {
    var temp = auctionDomainsList[i];
    temp = temp.trim();
    auctionTrimDomainsList.push(temp);
  }
  console.log(auctionTrimDomainsList);

  return (
    <>
      <Typography align="center" variant="h3"> ~ Ongoing Auctions ~ </Typography>
    </>
  );
}

export default OngoingAuctions
