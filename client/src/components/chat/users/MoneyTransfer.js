import {  useContract } from "wagmi";
import contract from "../../../abis/contracts/MoneyTransfer.sol/MoneyTransfer.json"
import { useEffect } from "react";
import { usePublicClient } from 'wagmi'

const MoneyTransfer = () => {

    // const publicClient = usePublicClient()


    // const _contract = useContract({
    //     address: process.env.REACT_APP_CONTRACT_ADDRESS,
    //     abi: contract.abi,
    //     signerOrProvider: publicClient

    // });

    // const handleTransfer = async () => {
    //     const tx = await _contract.transfer("0x5B38Da6a701c568545dCfcB03FcB875f56beddC4", 1000);
    //     console.log(tx);
    // }


    // useEffect(() => {

    //     if () {
    //         console.log(_contract);
    //     }
    // }, [_contract])



    return (
        <div>
            <h1>Money Transfer</h1>
            {/* <button onClick={handleTransfer}>Transfer</button> */}
        
        </div>
    );
}

export default MoneyTransfer;