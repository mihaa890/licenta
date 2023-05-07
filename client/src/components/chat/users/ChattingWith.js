import React, { Fragment, useMemo, useRef } from 'react';
import { Avatar, Box, Button, Fab, IconButton, Modal, TextField, Typography } from '@mui/material';
import { IoCallOutline } from 'react-icons/io5'
import { BsCameraVideo } from 'react-icons/bs'
import { BiDotsVerticalRounded } from 'react-icons/bi'
import { useState } from 'react';
import { useEffect } from 'react';
import { useChatContext } from '../ChatContextProvider.';
import { ChatInput } from './Chats.style';
import { IoIosAttach } from 'react-icons/io'
import EmojiPicker from 'emoji-picker-react';
import { GrEmoji } from 'react-icons/gr'
import Draggable from 'react-draggable';
import moment from 'moment';
import { cid as isCid } from "is-ipfs"

const ChattingWith = ({ friend }) => {
    const { socket, senderId, initVideoCall } = useChatContext();
    const [myMessages, setMyMessages] = useState([]);
    const [currentMessage, setCurrentMessage] = useState('');
    const chatContainerRef = useRef(null);
    const [fileUrl, setFileUrl] = useState({
        url: '',
        type: '',
        name: ''
    });
    const [file, setFile] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [openEmoji, setOpenEmoji] = useState(false);
    const [openInfo, setOpenInfo] = useState(false);
    const emojiRef = useRef();
    const [loading, setLoading] = useState(false);


    const getChatMessages = async () => {
        const messagesResponse = await fetch(`${process.env.REACT_APP_BASE_URL}/api/messages/${senderId}?friendId=${friend._id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const rawMessages = await messagesResponse.json();

        const _myMessages = rawMessages.map((message) => {
            return {
                receiverId: message.receiverId,
                senderId: message.senderId,
                message: message.message,
                timestamp: message.timestamp,
            };
        });

        setMyMessages(_myMessages);
    }

    useEffect(() => {
        setMyMessages([]);
        getChatMessages();

        if (socket) {
            socket?.on('message', (data) => {
                setMyMessages((prevMessages) => [...prevMessages, { senderId: data.senderId, message: data.message }]);
            });

        }
    }, [friend, socket]);

    const handleSendMessage = (e) => {
        e.preventDefault();

        if (currentMessage.trim() !== '') {
            const data = {
                senderId,
                receiverId: friend._id,
                message: currentMessage
            };

            socket?.emit('message', data);

            setMyMessages((prevMessages) => [...prevMessages, { senderId: data.senderId, message: data.message }]);
            setCurrentMessage('');
        }
    };

    const handleFileChange = (event) => {
        event.preventDefault();

        const fileType = event.target.files[0].type.split('/')[0];
        const fileName = event.target.files[0].name;

        setFile(event.target.files[0]);
        setFileUrl({
            url: URL.createObjectURL(event.target.files[0]),
            type: fileType,
            name: fileName
        });
        setOpenModal(true);

    };

    const handleSendFile = async (event) => {
        event.preventDefault();

        const fileType = file.type.split('/')[0];
        const reader = new FileReader();

        reader.onloadend = () => {
            setLoading(true);
            socket?.emit('sendFile', {
                senderId,
                receiverId: friend._id,
                file: {
                    type: fileType,
                    data: reader.result.split(',')[1],
                    filename: file.name
                },
            });
            setOpenModal(false);

            socket?.emit('fileSentSuccessfully', (data) => {
                if (data.status === 'success') {
                    setLoading(false);
                    console.log(data.message);
                } else {
                    console.error('Error occurred during file transfer:', data.message);
                }
            });

        };
        reader.readAsDataURL(file);
    };

    const onClick = (emojiData) => {
        setCurrentMessage(currentMessage + emojiData.emoji);
    }


    const handleClose = () => setOpenModal(false);


    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [myMessages]);

    const groupMessagesByDay = (messages) => {
        const groupedMessages = messages.reduce((grouped, message) => {
            const date = new Date(message.timestamp).toLocaleDateString();
            if (!grouped[date]) {
                grouped[date] = [];
            }
            grouped[date].push(message);
            return grouped;
        }, {});

        return groupedMessages;
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (emojiRef.current && !emojiRef.current.contains(event.target)) {
                setOpenEmoji(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [emojiRef]);


    const isSameWeek = (date1, date2) => {
        const weekStart1 = new Date(date1);
        weekStart1.setDate(date1.getDate() - date1.getDay());
        const weekStart2 = new Date(date2);
        weekStart2.setDate(date2.getDate() - date2.getDay());
        return weekStart1.toLocaleDateString() === weekStart2.toLocaleDateString();
    };

    const getFriendlyDate = (date) => {
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);

        const isToday = date.toLocaleDateString() === today.toLocaleDateString();
        const isYesterday = date.toLocaleDateString() === yesterday.toLocaleDateString();
        const isInCurrentWeek = isSameWeek(date, today);

        if (isToday) {
            return "Today";
        } else if (isYesterday) {
            return "Yesterday";
        } else if (!isInCurrentWeek) {
            return date.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
        } else {
            return date.toLocaleDateString('en-US', { weekday: 'long' });
        }
    };

    const handleOpenInfo = () => {
        setOpenInfo(!openInfo);
    };


    const groupedMessages = useMemo(() => {
        return groupMessagesByDay(myMessages);
    }, [myMessages]);


    return (
        loading
            ? <div className="loader">Loading.....</div>
            : <div
                style={{
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    height: 'calc(100vh - 120px)',
                    boxSizing: 'border-box',
                    border: '1px solid #ccc',
                    borderRadius: '10px',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '12px',
                        backgroundColor: '#F8FAFF',
                        borderBottom: '1px solid #4B4B4B',
                    }}
                >
                    <Avatar

                        style={{
                            marginRight: '12px',
                            cursor: 'pointer',
                        }}
                        onClick={handleOpenInfo}
                        src={friend.profilePictureHash === undefined ? " " : `https://cloudflare-ipfs.com/ipfs/${friend.profilePictureHash}`}
                    />
                    <div
                        style={{
                            fontWeight: 'bold',
                            fontSize: '18px',
                        }}
                    >
                        {friend.username}
                    </div>
                    <div
                        style={{
                            marginLeft: 'auto',
                            display: 'flex',
                        }}
                    >
                        <IconButton
                            style={{
                                padding: '6px',
                            }}
                            onClick={() => initVideoCall({ friend, audioOnly: true })}
                        >
                            <IoCallOutline />
                        </IconButton>
                        <IconButton
                            style={{
                                padding: '6px',
                            }}
                            onClick={() => initVideoCall({ friend })}
                        >
                            <BsCameraVideo />
                        </IconButton>
                        <IconButton
                            style={{
                                padding: '6px',
                            }}
                        >
                            <BiDotsVerticalRounded />
                        </IconButton>
                    </div>
                    {openInfo && (
                        <div
                            style={{
                                position: 'absolute',
                                right: 0,
                                top: 0,
                                width: '300px',
                                height: '100%',
                                backgroundColor: '#f0f0f0',
                                padding: '20px',
                                boxSizing: 'border-box',
                                overflowY: 'auto',
                            }}
                        >
                            <h3>User Details</h3>
                            {/* Afișați aici detalii despre utilizator */}
                        </div>
                    )}
                </div>
                <div ref={chatContainerRef}
                    style={{
                        flexGrow: 1,
                        padding: '12px',
                        overflowY: 'scroll'
                    }}
                >
                    {
                        Object.entries(groupedMessages).map(([date, messagesByDate], index) => {
                            const friendlyDate = getFriendlyDate(new Date(date));

                            return (
                                <Fragment key={index}>
                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            width: '100%',
                                            margin: '12px 0',
                                        }}
                                    >   <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignContent: 'center',
                                            alignItems: 'center',
                                            textAlign: 'center',
                                            backgroundColor: '#ccc',
                                            borderRadius: '50px',
                                            padding: '3px 12px',
                                            fontSize: '12px',
                                            fontWeight: 'bold',
                                        }}
                                    >
                                            {friendlyDate}
                                        </div>
                                    </div>
                                    {messagesByDate.map((message, index) => {

                                        let content = message.message;
                                        let isImage = false;
                                        let isFile = false;


                                        // Check if the message is an image
                                        if (isCid(message.message.hash) && message.message.type === 'image') {
                                            content = <img style={{ maxWidth: '300px' }} src={`https://cloudflare-ipfs.com/ipfs/${message.message.hash}`} alt="image" />;
                                            isImage = true;
                                        } else if (isCid(message.message.hash) && message.message.type !== 'image') {
                                            const fileExtension = message.message.type
                                            if (fileExtension) {
                                                content = message.message.hash;
                                                isFile = true;
                                            }
                                        }

                                        return (
                                            <div
                                                key={index}
                                                style={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: message.senderId === senderId ? 'flex-end' : 'flex-start',
                                                    marginBottom: '12px',
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        padding: '6px 12px',
                                                        borderRadius: '12px',
                                                        backgroundColor: message.senderId === senderId ? '#5B96F7' : '#00D100',
                                                        color: '#fff',
                                                        maxWidth: '50%',
                                                        wordBreak: 'break-word',
                                                    }}
                                                >
                                                    {isImage ? (
                                                        content
                                                    ) : isFile ? (
                                                        <a style={{
                                                            color: '#fff',

                                                        }}

                                                            href={`https://cloudflare-ipfs.com/ipfs/${message.message.hash}`} download>
                                                            {message.message.filename}
                                                        </a>
                                                    ) : (
                                                        content
                                                    )}
                                                </div>
                                                <div
                                                    style={{
                                                        fontSize: '12px',
                                                        color: '#ccc',
                                                        marginTop: '6px',
                                                    }}
                                                >
                                                    {moment(message.timestamp).format('LT')}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </Fragment>
                            )
                        })
                    }

                </div>
                <form
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '12px',
                        borderTop: '1px solid #ccc',
                    }}
                    onSubmit={handleSendMessage}
                >
                    <ChatInput
                        placeholder="Type your message here"
                        value={currentMessage}
                        onChange={(e) => setCurrentMessage(e.target.value)}
                    />


                    <label htmlFor="send-file">
                        <input
                            style={{ display: "none" }}
                            id="send-file"
                            name="send-file"
                            type="file"
                            onChange={(e) => handleFileChange(e)}
                        />
                        <Fab
                            size="small"
                            component="span"
                            aria-label="add"
                            variant="extended"
                            style={{
                                margin: '0 5px',
                                backgroundColor: '#1976d2',
                                color: '#fff',
                            }}
                        >
                            <IoIosAttach />
                        </Fab>
                    </label>
                    <Modal
                        open={openModal}
                        onClose={handleClose}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >

                        <div style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '50%',
                            height: '50%',
                            backgroundColor: '#fff',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '10px',
                            outline: 'none',
                            padding: '12px',
                        }}>
                            <div id="modal-modal-title">
                                <h2>File Preview</h2>
                            </div>
                            {fileUrl && fileUrl.type === 'image'
                                ? <img id="modal-modal-description"
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        maxWidth: '30%',
                                        objectFit: 'contain',
                                        borderRadius: '12px',
                                        marginTop: '12px',

                                    }}
                                    src={fileUrl.url}
                                    alt="file-name" />
                                : <div id="modal-modal-description"
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        width: '50%',
                                        borderRadius: '12px',
                                        marginTop: '12px',
                                        backgroundColor: '#ccc',
                                        padding: '12px',
                                        fontSize: '12px',
                                        fontWeight: 'bold',
                                    }}
                                >
                                    {fileUrl && fileUrl.name}
                                </div>


                            }
                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginTop: '12px',
                                gap: '12px',
                            }}>
                                <Button
                                    type="submit"
                                    style={{
                                        fontWeight: 'bold',
                                        marginTop: '12px',
                                    }}
                                    variant="contained"
                                    color="primary"
                                    onClick={(e) => handleSendFile(e)}
                                >
                                    Send File
                                </Button>
                                <Button
                                    type="submit"
                                    style={{
                                        fontWeight: 'bold',
                                        marginTop: '12px',
                                        backgroundColor: '#ff0000',
                                    }}
                                    variant="contained"
                                    color="primary"
                                    onClick={() => {
                                        setOpenModal(false);
                                    }}
                                >
                                    Cancel
                                </Button>
                            </Box>

                        </div>


                    </Modal>


                    <IconButton sx={{
                        position: 'relative',
                    }}
                        onClick={() => setOpenEmoji(!openEmoji)}
                    >
                        <GrEmoji />
                    </IconButton>


                    {openEmoji && <Draggable>
                        <Box ref={emojiRef} sx={{
                            position: 'absolute',
                            top: '7rem',
                            right: '1rem'

                        }}>
                            <EmojiPicker onEmojiClick={onClick} />
                        </Box>
                    </Draggable>

                    }

                    <Button
                        type="submit"
                        style={{
                            fontWeight: 'bold',
                        }}
                        variant="contained"
                        color="primary"
                    >
                        Send
                    </Button>

                </form>
            </div>
    );
};

export default ChattingWith;
