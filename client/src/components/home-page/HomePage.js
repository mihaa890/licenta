import { Button, ContentContainer, ContentWrapper, Description, Title, Input, Form, Label, ErrorWrapper } from "./HomePage.style";
import Animation from "../reusable/Animation";
import chat from '../../assets/animations/chat.json';
import { useEffect, useState } from "react";
import { useAccount, useWalletClient } from "wagmi";
import Modal from "../modal/Modal";
import { useNavigate } from "react-router-dom";
import { Alert, AlertTitle, Typography } from "@mui/material";
import { useDispatch } from "react-redux";
import { addUser } from "../redux/userReducer";


const HomePage = () => {
    const title = "Chat with your friends and family";
    const { isConnected, address } = useAccount();
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [existingUser, setExistingUser] = useState(false);
    const [newUser, setNewUser] = useState(false);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);

    const [error, setError] = useState(null);

    const [showModal, setShowModal] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [successfullyCreated, setSuccessfullyCreated] = useState(false);
    

    const handleGetStarted = () => {
        if (isConnected) {
            if (!existingUser?.existingUser?._id) {
                setShowModal(true);
            } else {
                navigate(`/dashboard/${existingUser?.existingUser?._id}`);
            }
        } else {
            setOpenModal(true);
        }
    };


    const handleCreateAccount = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                `${process.env.REACT_APP_BASE_URL}/api/register`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        address: address,
                        username,
                        password,
                    }),
                }
            );
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message);
            }

            const data = await response.json();
            setNewUser(data);
            dispatch(addUser(data))

            setShowModal(false);
            setLoading(false);
            setSuccessfullyCreated(true);
            setError(null);
        } catch (error) {
            setLoading(false);
            setError(error.message);
        }
    };

    useEffect(() => {
        const checkAddressExists = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/address/${address}`);
                const data = await response.json();
                setExistingUser(data);
            } catch (error) {
                console.error(error);
            }
        };

        checkAddressExists();
    }, [address]);

    const handleContinue = () => {
        navigate(`/dashboard/${newUser?._id}`);
    };


    return (
        <ContentWrapper>
            <ContentContainer>
                <Title>
                    {title.split(" ").slice(0, -2).join(" ")}
                    <span>{title.split(" ").slice(-2).join(" ")}</span>
                </Title>
                <Description>
                    Create your account and start chatting with your friends instantly!
                </Description>
                <Button onClick={handleGetStarted}>Get Started</Button>
            </ContentContainer>
            <Animation animation={chat} id="chat-animation" />
            {showModal && (
                <Modal
                    title="Create Account"
                    onClose={() => setShowModal(false)}
                    actions={[
                        {
                            label: loading ? "Loading..." : "Create Account",
                            onClick: handleCreateAccount,
                            disabled: !username || !password || loading,
                        },
                    ]}
                >
                    <Form>
                        <Label htmlFor="username">Username</Label>
                        <Input type="text" id="username" onChange={(e) => setUsername(e.target.value)} />
                        <Label htmlFor="password">Password</Label>
                        <Input type="password" id="password" onChange={(e) => setPassword(e.target.value)} />
                    </Form>
                    {error && <ErrorWrapper>{error}</ErrorWrapper>}
                </Modal>
            )}
            {openModal && (
                <Alert sx={{
                    position: "absolute",
                    bottom: "10px",
                    right: "0",
                    transform: "translateY(-50%)",
                    maxWidth: "500px"
                }} severity="warning" onClose={() => setOpenModal(false)}>
                    <AlertTitle>Warning</AlertTitle>
                    <Typography>
                        Oops! You need to connect your wallet to continue.
                    </Typography>
                </Alert>
            )}

            {successfullyCreated && (
                <Alert sx={{
                    position: "absolute",
                    bottom: "10px",
                    right: "0",
                    transform: "translateY(-50%)",
                    maxWidth: "500px"
                }} severity="success" onClose={() => setSuccessfullyCreated(false)}>
                    <AlertTitle>Success</AlertTitle>
                    <Typography>
                        Your account was successfully created!
                    </Typography>
                    <Typography>
                        Click <a href="#" onClick={handleContinue}>here</a> to continue.
                    </Typography>
                </Alert>
            )}
        
        </ContentWrapper>
    );
};

export default HomePage;