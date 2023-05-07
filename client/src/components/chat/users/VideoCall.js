import { Box, Button, FormControl,  MenuItem, Select } from "@mui/material";
import {  useEffect, useRef, useState } from "react";
import Draggable from "react-draggable";
import Peer from 'simple-peer';
import * as process from "process";
import { useParams } from "react-router-dom";

const VideoCall = ({ sounds, me, socket, call, isIncoming, onClose }) => {
    const [state, setState] = useState({
        stream: null,
        callAccepted: false,
        callEnded: false,
    });

    const [filter, setFilter] = useState('none');

    const {id: senderId} = useParams();

    const filters = [
        {
            label: 'None',
            value: 'none'
        },
        {
            label: 'Grayscale',
            value: 'grayscale(100%)'
        },
        {
            label: 'Sepia',
            value: 'sepia(100%)'
        },
        {
            label: 'Invert',
            value: 'invert(100%)'
        },
        {
            label: 'Brightness',
            value: 'brightness(200%)'
        },
        {
            label: 'Contrast',
            value: 'contrast(200%)'
        },
        {
            label: 'Saturate',
            value: 'saturate(200%)'
        }
    ]

    window.process = process;

    const myVideo = useRef()
    const userVideo = useRef()
    const connectionRef = useRef()

    const callUser = (id) => {
        sounds.callingAudio.play();

        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream: state.stream
        })

        peer.on("signal", (data) => {
            socket.emit("callUser", {
                userToCall: id,
                signalData: data,
                from: me,
                name : me,
                callType: 'video',
                answer: false
            }, senderId, call.friend._id )
        })

        peer.on("stream", (stream) => {
            userVideo.current.srcObject = stream
        })

        socket.on("callAccepted", (signal) => {
            setState(prevState => ({ ...prevState, callAccepted: true }))
            setTimeout(() => { peer.signal(signal) }, 500)
        })

        connectionRef.current = peer

    }

    const answerCall = () => {
        setState(prevState => ({ ...prevState, callAccepted: true }))

        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream: state.stream
        })

        peer.on("signal", (data) => {
            socket.emit("answerCall", { signal: data, to: call.friend.socket_id })
        })

        peer.on("stream", (stream) => {
            userVideo.current.srcObject = stream
        })

        peer.signal(call.signal)
        connectionRef.current = peer
    }

    const leaveCall = () => {

        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream: state.stream
        })

        state.stream?.getTracks().forEach(function (track) {
            track.stop();
        });

        setState(prevState => ({
            ...prevState,
            callEnded: true,
            stream: null,
        }))

        peer.on("close", () => {
            setState(prevState => ({
                ...prevState,
                callEnded: true,
                stream: null,
            }))
            socket.emit("endCall", { to: call.caller })
        })
    
        if(connectionRef.current) {
            connectionRef.current.destroy();
            peer.destroy();
        }


        onClose();
    }

    useEffect(() => {
        if (!state.callAccepted && !state.callEnded) {
            if (isIncoming) {
                console.log('playing calling sound...')
                sounds.callingAudio.play();
            }
        } else {
            console.log('ending calling sound...')
            sounds.callingAudio.pause();
        }
    }, [
        state.callAccepted,
        state.callEnded
    ])

    useEffect(() => {
        if (state.stream) {
            myVideo.current.srcObject = state.stream
        }

    }, [state.stream])


    useEffect(() => {
        navigator
            .mediaDevices
            .getUserMedia({ video: true, audio: true })
            .then((stream) => {
                setState(prevState => ({ ...prevState, stream: stream }))
            })

    }, [])

    const applyVideoFilter = async (videoElement, filter) => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;
      
        const drawVideoFrame = () => {
          ctx.filter = filter;
          ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
          requestAnimationFrame(drawVideoFrame);
        };
      
        requestAnimationFrame(drawVideoFrame);
      
        const stream = canvas.captureStream();
        const audioTracks = videoElement.srcObject.getAudioTracks();
        audioTracks.forEach((track) => stream.addTrack(track));
      
        return stream;
      };
      

      const updateTransmittedVideoStream = async (newStream) => {
        if (state.callAccepted && !state.callEnded) {
          const videoTrack = newStream.getVideoTracks()[0];
          const sender = connectionRef.current._pc.getSenders().find((sender) => sender.track.kind === "video");
          sender.replaceTrack(videoTrack);
        }
      };
    

      const handleChange = async (event) => {
        setFilter(event.target.value);
        const videoElement = myVideo.current;
        const newStream = await applyVideoFilter(videoElement, event.target.value);
        updateTransmittedVideoStream(newStream);
      };
      

    const handleAddFilter = (filter) => {
        const _video = document.querySelector('video');

        if (_video) {
            _video.style.filter = filter;
        }

    }


    return <Draggable>
        <Box sx={{
            position: 'absolute',
            zIndex: '1',
            borderRadius: '10px',
            minWidth: '30rem',
            minHeight: '20rem',
            backgroundColor: '#000',
            right: '10px',
            top: '10px',
        }}>
            <Box>
                <div className="video-container">
                    <div className="video">
                        {state.stream && <video playsInline muted ref={myVideo} autoPlay style={{ maxWidth: "300px" }} />}
                    </div>
                    <div className="video">
                        {state.callAccepted && !state.callEnded ?
                            <video playsInline ref={userVideo} autoPlay style={{ maxWidth: "300px" }} /> :
                            null}
                    </div>
                </div>
            </Box>

            <div className="call-button">
                {state.callAccepted && !state.callEnded ? (
                    <div>
                        <Button
                            sx={{
                                padding: '0.6rem 2rem',
                                backgroundColor: 'red',
                                color: 'white',
                                position: 'absolute',
                                bottom: '10px',
                                left: '70%',
                                transform: 'translateX(-50%)'
                            }}
                            variant="contained"
                            onClick={leaveCall}>
                            End Call
                        </Button>
                        <FormControl sx={{
                            backgroundColor: 'white',
                            bottom: '0',
                        }}>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={filter}
                                label="Filter"
                                onChange={handleChange}
                            >
                                {filters.map((filter, index) => (
                                    <MenuItem key={index} value={filter.value} onClick={() => handleAddFilter(filter.value)}>{filter.label}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>

                ) : (
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-end',
                        justifyItems: 'flex-end',
                    }}>
                        <Button
                            sx={{
                                backgroundColor: 'turquoise',
                                color: 'white',
                                bottom: '0x',
                            }}
                            aria-label="call"
                            onClick={() => callUser(call.friend.socket_id)}>
                            Call
                        </Button>

                        <Button
                            sx={{
                                backgroundColor: 'red',
                                color: 'white',
                                bottom: '0',
                            }}
                            aria-label="call"
                            onClick={leaveCall}>
                            Close
                        </Button>

                    </div>

                )}
                {call.friend.socket_id}
            </div>

            <div>
                {isIncoming && !state.callAccepted ? (
                    <div className="caller">
                        <h1 style={{ color: '#fff' }}>{call.friend.username} is calling...</h1>
                        <Button variant="contained" color="primary" onClick={answerCall}>
                            Answer
                        </Button>
                    </div>
                ) : null}
            </div>

        </Box>
    </Draggable>

    //TODO sa schimb modelul de users (save o lista de friends) partial facut
    //TODO redirectionare catre dashboard in alt fel fata de cum e acuma 
    //TODO nu poti accesa chat u daca nu esti conectat
    //TODO paginare lista de users
    //TODO trimite documente/poze +  ( textarea in loc de input) aprox bine 
    //TODO salvare in db toate apeluri facute 
    //TODO refactorizare partea de add/approve/reject friend request
}

export default VideoCall;