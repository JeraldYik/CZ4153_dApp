import { useEffect, useState } from 'react';

function useGetAuctionAddressList({ auctFactInstance }) {

  const [auctionAddressList, setAuctionAddressList] = useState([]);

  useEffect(() => {
    console.log(auctFactInstance)
    if (auctFactInstance) {
      console.log('in here');
      auctFactInstance.methods.allAuctionsAddr()
        .call()
        .then((addresses) => {
          console.log('then in here')
          setAuctionAddressList(addresses);
          console.log(addresses);
        })
        .catch((error) => console.log(error));
    }
  }, [auctFactInstance]);

  return auctionAddressList;
}

export default useGetAuctionAddressList;
