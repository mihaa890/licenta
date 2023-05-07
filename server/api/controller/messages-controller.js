const {_getAllMessages, _getAllCalls} = require('../service/messages-service.js');

const getAllMessages = async (req, res) => {
    _getAllMessages(req, res).then(messages => res.status(200).json(messages))
        .catch(err => res.status(500).json({message: err.message}));
}

const getAllCalls = async (req, res) => {
    const userId = req.params.id;
    _getAllCalls(userId).then(calls => res.status(200).json(calls))
        .catch(err => res.status(500).json({message: err.message}));
}



module.exports = {
    getAllMessages,
    getAllCalls
}