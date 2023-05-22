import {  useState } from "react";
import contract from "../../../abis/contracts/MoneyTransfer.sol/MoneyTransfer.json";
import { Alert, AlertTitle, Button, Fade, Modal, TextField } from "@mui/material";
import { FaEthereum } from "react-icons/fa";
import { parseEther } from "viem";
import {  usePublicClient, useWalletClient } from "wagmi";


const MoneyTransfer = ({ friendAddress }) => {
    const walletClient = useWalletClient();
    const publicClient = usePublicClient();

    const [transferValue, setTransferValue] = useState("");
    const [openModal, setOpenModal] = useState(false);
    const [openAlert, setOpenAlert] = useState(false);
    const [alertError, setAlertError] = useState({
        message: "",
        isShown: false,
    });
    const [error, setError] = useState("");

    const handleTransfer = () => {
        setOpenModal(true);
    };

    const handleSend = async () => {
        if (!/^\d+(\.\d+)?$/.test(transferValue)) {
            setError("Invalid transfer amount. Please enter a valid number.");
            return;
        }

        setError("");

        try {
            const {request } = await publicClient.simulateContract({
                account : walletClient.data.account.address,
                address : process.env.REACT_APP_CONTRACT_ADDRESS,
                abi : contract.abi,
                functionName : 'transfer',
                args : [friendAddress],
                value: parseEther(transferValue)
            })

            await walletClient.data.writeContract(request)

            setOpenAlert(true);
        } catch (error) {
            console.error("Transfer failed:", error);
            setAlertError({
                message: error.reason,
                isShown: true,
            });
        }

        setTimeout(() => {
            setOpenAlert(false);
            setAlertError({ message: "", isShown: false });
        }, 5000);

        setOpenModal(false);
    };
    console.log({
        pl: process.env.REACT_APP_CONTRACT_ADDRESS,
        inCUR: contract.abi
    })

    return (
        <div>
            <Button variant="contained" onClick={handleTransfer} sx={{ textTransform: 'capitalize' }}>
                Transfer
            </Button>

            <Modal open={openModal} onClose={() => setOpenModal(false)}>
                <div style={{ margin: "auto", marginTop: 200, width: 400, padding: 20, backgroundColor: "white" }}>
                    <TextField
                        label="Transfer Amount"
                        placeholder="Enter amount to transfer in ETH"
                        value={transferValue}
                        onChange={(e) => setTransferValue(e.target.value)}
                        fullWidth
                        error={!!error}
                        helperText={error}
                    />
                    <Button variant="contained" onClick={handleSend} sx={{ marginTop: 1, textTransform: 'capitalize' }}>
                        Send
                    </Button>
                </div>
            </Modal>
            {openAlert &&
                <Fade in={openAlert} timeout={1000}>
                    <Alert severity="success" sx={{
                        position: 'absolute',
                        bottom: '10px',
                        right: '10px',
                        margin: 'auto',
                        width: '700px',
                        zIndex: 1000

                    }}
                        onClose={() => setOpenAlert(false)}>
                        <AlertTitle>
                            <strong>Transfer Successful!</strong>
                        </AlertTitle>
                        <p style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}
                        >
                            You have successfully transferred {transferValue} <FaEthereum /> to {friendAddress}
                        </p>
                    </Alert>
                </Fade>
            }

            {alertError.isShown &&
                <Fade in={alertError.isShown} timeout={1000}>
                    <Alert severity="error" sx={{
                        position: 'absolute',
                        bottom: '10px',
                        right: '10px',
                        margin: 'auto',
                        width: '700px',
                        zIndex: 1000

                    }}
                        onClose={() => setAlertError({ message: "", isShown: false })}>
                        <AlertTitle>
                            <strong>Transfer Failed!</strong>
                        </AlertTitle>
                        <p style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}
                        >
                            {alertError.message}
                        </p>
                    </Alert>
                </Fade>
            }


        </div>
    );
};

export default MoneyTransfer;
