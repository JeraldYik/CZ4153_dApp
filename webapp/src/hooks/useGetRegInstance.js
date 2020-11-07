import { useEffect, useState } from 'react';

function useGetRegInstance({ web3, auctFactInstance, contract }) {
  const [regAddr, setRegAddr] = useState(null);
  const [regInstance, setRegInstance] = useState(null);

  useEffect(() => {
    if (auctFactInstance && web3) {
      auctFactInstance.methods.registryAddr()
        .call()
        .then((address) => {
        const inst = new web3.eth.Contract(
          contract.abi,
          address,
        );
        setRegAddr(address);
        setRegInstance(inst);
        });
    }
  }, [auctFactInstance, web3, contract]);
  return { regInstance, regAddr };
}

export default useGetRegInstance;
