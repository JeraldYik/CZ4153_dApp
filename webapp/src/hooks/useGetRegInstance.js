import { useEffect, useState } from 'react';

function useGetRegInstance({ web3, contract, auctFactInstance }) {
  const [regAddr, setRegAddr] = useState(null);
  const [regInstance, setRegInstance] = useState(null);

  useEffect(() => {
    if (auctFactInstance) {
      auctFactInstance.methods.registryAddr()
        .call()
        .then((address) => {
          setRegAddr(address);
        });
    }
  }, [auctFactInstance]);

  useEffect(() => {
    if (web3) {
      web3.eth.net.getId().then(() => {
        const inst = new web3.eth.Contract(
          contract.abi,
          regAddr,
        );
        setRegInstance(inst);
      });
    }
  }, [web3, contract]);

  return { regInstance, regAddr };
}

// useEffect(() => {
//   if (web3 && contractAddresses) {
//     web3.eth.net.getId().then(() => {
//       const temp = [];
//       contractAddresses.forEach((address) => {
//         const inst = new web3.eth.Contract(
//           contract.abi,
//           address,
//         );
//         temp.push(inst);
//       });
//       setAuctions(temp);
//     });
//   }
// }, [web3, contract, contractAddresses]);
// return auctions;

export default useGetRegInstance;
