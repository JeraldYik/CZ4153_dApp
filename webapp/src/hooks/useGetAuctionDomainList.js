import { useEffect, useState } from 'react';
import Web3 from 'web3';

function useGetAuctionDomainList({ auctFactInstance }) {

  const [auctionDomainList, setAuctionDomainList] = useState([]);

  useEffect(() => {
    if (auctFactInstance) {
      auctFactInstance.methods.allAuctionsDomain()
        .call()
        .then((domainsInHex) => {
          const domains = domainsInHex.map(Web3.utils.hexToAscii);
          setAuctionDomainList(domains);
        });
    }
  }, [auctFactInstance]);

  return auctionDomainList;
}

export default useGetAuctionDomainList;
