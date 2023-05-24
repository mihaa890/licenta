import { useState, createContext, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { io } from 'socket.io-client';
import VideoCall from "./users/VideoCall";
import callingSound from "../../assets/audio/face-time-calling.mp3";

const composedSounds = (() => {
    const callingAudio = new Audio(callingSound);
    callingAudio.loop = true;

    return {
        callingAudio
    }
})()

const ChatContext = createContext({});
export const WS_SERVER = "http://localhost:3001";

const ChatContextProvider = ({ children }) => {
    const { id: senderId } = useParams();
    const [context, setContext] = useState({
        socket: null,
        me: null,
        outgoingVideoCall: null,
        incomingVideoCall: null,
        sounds: composedSounds

    });

    const initVideoCall = (opts) => {
        setContext((prevContext) => ({
            ...prevContext,
            outgoingVideoCall: opts,
        }));
    }

    useEffect(() => {
        const socket = io(WS_SERVER);

        socket.on("me", (id) => {
            console.log("set my id", id)
            setContext((prevContext) => ({ ...prevContext, me: id }));
        })

        socket.on("callUser", (data) => {
            setContext((prevContext) => ({
                ...prevContext,
                incomingVideoCall: {
                    friend: {
                        username: data.name,
                        socket_id: data.from,
                    },
                    callEvent: data.callEvent,
                    audioOnly: data.callEvent.callType,
                    signal: data.signal
                }
            }));
        })

        setContext((prevContext) => ({
            ...prevContext,
            socket,
            senderId
        }));

        socket.emit('join', senderId);

        return () => {
            if (context.socket) {
                context.socket.disconnect();
            }
        };
    }, []);

    const contextValue = {
        ...context,
        initVideoCall
    }

    const currentCall = context.outgoingVideoCall || context.incomingVideoCall;
    const isIncomingCall = !!context.incomingVideoCall && !context.outgoingVideoCall;

    return <ChatContext.Provider value={contextValue}>
        {
            context.socket
            && currentCall
            && <VideoCall
                sounds={context.sounds}
                me={context.me}
                socket={context.socket}
                call={currentCall}
                isIncoming={isIncomingCall}
                signal={isIncomingCall && currentCall.signal}
                onClose={() => setContext((prevContext) => ({ ...prevContext, outgoingVideoCall: null, incomingVideoCall: null }))}
            />

        }
        {children}
    </ChatContext.Provider>
}

export const useChatContext = () => {
    const context = useContext(ChatContext);

    if (!context) {
        throw new Error('This component must be inside ChatContextProvider');
    }

    return context;
}


export default ChatContextProvider;
