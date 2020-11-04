import { useEffect, useState } from 'react';

function useGetAuctFactInstance({ web3, contract }) {
  const [auctFactInstance, setAuctFactInstance] = useState(null);
  const [auctFactAddr, setAuctFactAddr] = useState(null);

  useEffect(() => {
    if (web3) {
      web3.eth.net.getId().then((netId) => {
        const deployedNetwork = contract.networks[netId];
        const instAddr = deployedNetwork.address;
        const inst = new web3.eth.Contract(
          contract.abi,
          deployedNetwork && deployedNetwork.address,
        );
        setAuctFactInstance(inst);
        setAuctFactAddr(instAddr);
      });
    }
  }, [web3, contract]);

  return { auctFactInstance, auctFactAddr };
}

export default useGetAuctFactInstance;
