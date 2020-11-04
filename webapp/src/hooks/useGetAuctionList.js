import { useEffect, useState } from 'react';

function useGetAuctionAddressesList({ auctFactInstance }) {

  const [auctionAddressList, setAuctionAddressList] = useState([]);

  useEffect(() => {
    if (auctFactInstance) {
      auctFactInstance.methods.allAuctionsAddr()
        .call()
        .then((addresses) => {
          setAuctionAddressList(addresses);
        });
    }
  }, [auctFactInstance]);

  return auctionAddressList;
}

export default useGetAuctionAddressesList;
