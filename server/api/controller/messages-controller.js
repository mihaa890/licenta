const {_getAllMessages, _getAllCalls, _deleteAllMessagesByUserIdAndFriendId} = require('../service/messages-service.js');

const getAllMessages = async (req, res) => {
    _getAllMessages(req, res).then(messages => res.status(200).json(messages))
        .catch(err => res.status(500).json({message: err.message}));
}

const getAllCalls = async (req, res) => {
    const userId = req.params.id;
    const page = req.query.page;
    const limit = req.query.limit;

    _getAllCalls(userId, page, limit).then(calls => res.status(200).json(calls))
        .catch(err => res.status(500).json({message: err.message}));
}


const deleteAllMessagesByUserIdAndFriendId = async (req, res) => {
    _deleteAllMessagesByUserIdAndFriendId(req, res).then(result => res.status(200).json(result))
        .catch(err => res.status(500).json({message: err.message}));
}


module.exports = {
    getAllMessages,
    getAllCalls,
    deleteAllMessagesByUserIdAndFriendId
}