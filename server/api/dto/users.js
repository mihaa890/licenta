const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    address: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    profilePictureHash: {
        type: String
    },
    bio: {
        type: String,
    },
    location: {
        type: String
    },
    friends: {
        type: Array,
    },
    messages: {
        type: Array,
        items: {
            senderId: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'User'
            },
            receiverId: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'User'
            },
            message: {
                type: String,
                required: true
            },
            timestamp: {
                type: Date,
                default: Date.now
            }
        }
    },
    calls:{
        type: Array,
        items: {
            senderId: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'User'
            },
            senderUsername :{
                type: String,
                required: true
            },
            receiverId: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'User'
            },
            receiverUsername :{
                type: String,
                required: true
            },
            callType: {
                type: String,
                required: true
            },
            answer: {
                type: Boolean,
                required: true
            },
            timestamp: {
                type: Date,
                default: Date.now
            }
    }
},
    createdAt: {
        type: Date,
        default: Date.now
    },
    socket_id: {
        type: String
    },
    status: {
        type: String,
        enum: ["Online", "Offline"]
    }
});

const User = mongoose.model('User', userSchema);

module.exports = {
    User
}