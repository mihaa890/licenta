const { User } = require('../dto/users');
const { ipfs } = require('../service/user-service');

const io = require('socket.io')({
    cors: {
        origin: "http://dejawo.go.ro:3000",
        methods: ["GET", "POST"],
        credentials: true
    }
});

io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // Listen for 'join' event
    socket.on('join', async (userId) => {
        // Update user's socket_id in the database
        console.log("JOINED!!", userId, socket.id)
        await User.findByIdAndUpdate(userId, { socket_id: socket.id, status: 'Online' });
    });

    // Listen for 'message' event
    socket.on('message', async (data) => {
        const { senderId, receiverId, message } = data;

        await User.findByIdAndUpdate(senderId, {
            $push: { messages: { senderId, receiverId, message, timestamp: Date.now() } }
        });

        await User.findByIdAndUpdate(receiverId, {
            $push: { messages: { senderId, receiverId, message, timestamp: Date.now() } }
        });

        const receiver = await User.findById(receiverId);

        // If receiver is online, send message to their socket
        if (receiver && receiver.socket_id) {
            io.to(receiver.socket_id).emit('message', { senderId, message });
        }
    });

    socket.on("fileSentSuccessfully" , async (data) => {
        io.to(data.senderId).emit('fileSentSuccessfully', { status: 'success', message: 'File sent successfully.' });
    })


    socket.on("sendFile", async (data) => {
        const { senderId, receiverId, file } = data;

        const fileType = file.type;
        const fileData = file.data;

        const fileBuffer = Buffer.from(fileData, 'base64');

        const _file = await ipfs.add(fileBuffer);
        const fileHash = _file.cid.toString();

        await User.findByIdAndUpdate(senderId, {
            $push: { messages: { senderId, receiverId, message: { type: fileType, hash: fileHash, filename: file.filename }, timestamp: Date.now() } }

        });

        await User.findByIdAndUpdate(receiverId, {
            $push: { messages: { senderId, receiverId, message: { type: fileType, hash: fileHash, filename: file.filename }, timestamp: Date.now() } }
        });

        const receiver = await User.findById(receiverId);

        // If receiver is online, send message to their socket
        if (receiver && receiver.socket_id) {
            io.to(receiver.socket_id).emit('sendFile', { senderId, file: { type: fileType, hash: fileHash, filename: file.filename } });
            io.to(senderId).emit('fileSentSuccessfully', { status: 'success', message: 'File sent successfully.' });
        }

    });


    socket.emit("me", socket.id)

    socket.on("callUser", async (data, senderId, receiverId ) => {
        console.log("CALL USER",  senderId, receiverId)
        io.to(data.userToCall).emit("callUser", { signal: data.signalData, from: data.from, name: data.name }, senderId, receiverId)

        const sender = await User.findById(senderId);
        const receiver = await User.findById(receiverId);

        await User.findByIdAndUpdate(senderId, {
            $push: { calls: { senderId: senderId, senderUsername : sender.username,  receiverId: receiverId, receiverUsername : receiver.username,  callType: data.callType, answer: data.answer,  timestamp: Date.now() } }
        });

        await User.findByIdAndUpdate(receiverId, {
            $push: { calls: { senderId: senderId, senderUsername : sender.username,  receiverId: receiverId, receiverUsername : receiver.username, callType: data.callType,answer: data.answer,  timestamp: Date.now() } }
        });

    });

    socket.on("answerCall", (data) => {
        io.to(data.to).emit("callAccepted", data.signal)
    })

    socket.on("endCall", (data) => {
        io.to(data.to).emit("callEnded", { to: data.from })
    })

    // Listen for 'disconnect' event
    socket.on('disconnect', async () => {
        console.log(`Socket disconnected: ${socket.id}`);

        // Update user's status in the database
        await User.findOneAndUpdate({ socket_id: socket.id }, { status: 'Offline', socket_id: null });
    });
});

io.listen(3001);


const _getAllMessages = async (req, res) => {
    const userId = req.params.id;
    const friendId = req.query.friendId;

    const user = await User.findById(userId);
    const messages = user.messages.filter(m =>
        (m.senderId.toString() === friendId && m.receiverId.toString() === userId) ||
        (m.senderId.toString() === userId && m.receiverId.toString() === friendId)
    )

    return messages;
}

const _getAllCalls = async (req, res) => {
    const userId = req;

    const _user = await User.findById(userId);
    const calls = _user.calls;

    return calls;

}

module.exports = {
    _getAllMessages,
    _getAllCalls
}
