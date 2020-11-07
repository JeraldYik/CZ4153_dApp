import { useEffect, useState } from 'react';
import Web3 from 'web3';

function useGetAuctionDomainList({ auctFactInstance, auctionAddressesList, auctionDomainsList }) {

  const [auctionDetailsList, setAuctionDetailsList] = useState({});

  useEffect(() => {
    if (auctFactInstance && auctionDomainsList && auctionAddressesList) {
      const temp = {}
      auctionDomainsList.map((domain, idx) => {
        domain = domain.replace(/\0/g, '');
        auctFactInstance.methods.getAuctionDetails(domain)
          .call()
          .then((details) => {
            temp[domain] = {
              address: auctionAddressesList[idx],
              bidIncrement: details[0],
              bidEndTime: new Date(details[1] * 1000),
              revealEndTime: new Date(details[2] * 1000)
            }
          })
          .catch(err => console.log(err));
        })
        setAuctionDetailsList(temp);
    }
  }, [auctFactInstance, auctionAddressesList, auctionDomainsList]);

  return auctionDetailsList;
}

export default useGetAuctionDomainList;
