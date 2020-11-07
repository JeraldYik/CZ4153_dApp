import {
  makeStyles, Button, Typography, Paper, TextField, Slider, Modal, Table, Card
} from '@material-ui/core';
import React, {useState, useEffect, useCallback} from "react";

function OngoingAuctions({ auctionInstances, auctionAddressesList, auctionDomainsList }) {
  console.log(auctionInstances);
  console.log(auctionAddressesList);
  console.log(auctionDomainsList);

  const [auctionTrimDomainsList, setAuctionTrimDomainsList] = useState([]);

  useEffect(() => {
    const _auctionTrimDomainsList = [];
    for (var i = 0 ; i < auctionDomainsList.length ; i++) {
      var temp = auctionDomainsList[i];
      temp = temp.replace(/\0/g, '');
      _auctionTrimDomainsList.push(temp);
    }
    setAuctionTrimDomainsList(_auctionTrimDomainsList);
  }, []);

return (
    <>
      <Typography align="center" variant="h3"> ~ Ongoing Auctions ~ </Typography>
      {auctionTrimDomainsList.map(domain => {
        return <Typography key={domain} align="center" variant="h5">{domain}</Typography>
      })} 
    </>
  );
}

export default OngoingAuctions
