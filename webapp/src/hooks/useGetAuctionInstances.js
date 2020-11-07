import { useEffect, useState } from 'react';

function useGetAuctionInstances({ web3, contractAddresses, contract }) {
  const [auctions, setAuctions] = useState([]);

  useEffect(() => {
    if (web3 && contractAddresses) {
      web3.eth.net.getId().then(() => {
        const temp = [];
        contractAddresses.forEach((address) => {
          const inst = new web3.eth.Contract(
            contract.abi,
            address,
          );
          temp.push(inst);
        });
        setAuctions(temp);
      });
    }
  }, [web3, contract, contractAddresses]);
  console.log(contractAddresses)
  return auctions;
}

export default useGetAuctionInstances;
