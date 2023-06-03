import { Box, Stack } from "@mui/material";
import { useSelector } from "react-redux";
import chatNoData from '../../assets/animations/chat-no-messages.json'
import Animation from "../reusable/Animation";
import { AnimationContainer } from "./users/Chats.style";
import { useState } from "react";
import ChattingWith from "./users/ChattingWith";
import { generateRGBColor } from "../reusable/utils";
import { useChatTheme } from "./settings/ThemeProvider";

const Chats = () => {

    const friends = useSelector(state => state.friends);
    const [selectedChat, setSelectedChat] = useState(null);
    const { theme } = useChatTheme();

    const handleSelectChat = (friend) => {
        setSelectedChat(friend);
    }
    return (
        <>
            <Box>
                <Stack
                    direction={{ xs: 'row', sm: 'row' }}
                    spacing={{ xs: 1, sm: 1, md: 2 }}
                >
                    <Box sx={{
                        width: '300px',
                        backgroundColor: theme.palette.mode === 'light' ? '#F8FAFF' : '#000',
                    }}>
                        <h3 style={{
                            color: theme.palette.text.primary,
                        }}>Chats</h3>
                        {friends.length === 0 ? (
                            <Box
                                sx={{
                                    padding: "10px",
                                    textAlign: "center",
                                    marginTop: "20px",
                                    borderRadius: "5px",
                                }}
                            >
                                <span
                                    style={{
                                        color: theme.palette.text.primary,
                                        fontSize: "15px",
                                    }}
                                >
                                    No friends yet
                                </span>
                            </Box>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }} >
                                {friends.map(friend => {
                                    return (
                                        <Box
                                            key={friend.username}
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                padding: '10px 10px',
                                                borderRadius: '10px',
                                                backgroundColor: theme.palette.mode === 'light' ? '#F8FAFF' : '#000',
                                                cursor: 'pointer',
                                                '&:hover': {
                                                    backgroundColor: theme.palette.mode === 'light' ? '#E8F0FE' : '#111',
                                                }
                                            }}
                                            onClick={() => handleSelectChat(friend)}

                                        >
                                            <Box sx={{
                                                position: 'relative'
                                            }}>
                                                <Box
                                                    sx={{
                                                        position: 'absolute',
                                                        backgroundColor: friend.socket_id ? '#76D45E' : '#ccc',
                                                        width: '10px',
                                                        height: '10px',
                                                        borderRadius: '50%',
                                                        right: '15px',
                                                        bottom: '2px',
                                                    }}
                                                />
                                                {friend.profilePictureHash ?
                                                    <img
                                                        src={`https://cloudflare-ipfs.com/ipfs/${friend.profilePictureHash}`}
                                                        alt="profile"
                                                        style={{
                                                            width: '50px',
                                                            height: '50px',
                                                            borderRadius: '50%',
                                                            objectFit: 'cover',
                                                            marginRight: '10px'
                                                        }}
                                                    />
                                                    :
                                                    <Box
                                                        sx={{
                                                            width: '50px',
                                                            height: '50px',
                                                            backgroundColor: generateRGBColor(friend.username),
                                                            borderRadius: '50%',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            marginRight: '10px'
                                                        }}
                                                    >
                                                        <span
                                                            style={{
                                                                color: '#fff',
                                                                fontSize: '20px'
                                                            }}
                                                        >
                                                            {friend.username.charAt(0)}
                                                        </span>

                                                    </Box>
                                                }
                                            </Box>
                                            <Box>
                                                <h4
                                                    style={{
                                                        fontSize: '16px',
                                                        fontWeight: 'bold',
                                                        margin: '0',
                                                        color: theme.palette.mode === 'light' ? '#000' : '#d4d4d4'
                                                    }}
                                                >
                                                    {friend.username}
                                                </h4>
                                                <p
                                                    style={{
                                                        fontSize: '14px',
                                                        margin: '0',
                                                        color: theme.palette.mode === 'light' ? '#000' : '#d4d4d4'
                                                    }}
                                                >
                                                    {friend.socket_id ? 'Online' : 'Offline'}
                                                </p>
                                            </Box>
                                        </Box>
                                    )
                                })}
                            </div>
                        )}
                    </Box>

                    <Box sx={{ width: '100%', backgroundColor: theme.palette.mode === 'light' ? '#fff' : '#121212'}}>
                        {selectedChat ?
                            <ChattingWith friend={selectedChat} />
                            :
                            <AnimationContainer>
                                <Animation animation={chatNoData} id="chat-no-messages" />
                                <span style={{
                                    color: theme.palette.text.primary,
                                }}>
                                    Select a chat to start messaging
                                </span>
                            </AnimationContainer>
                        }
                    </Box>

                </Stack>
            </Box>
        </>
    )
}

export default Chats;