const {_getAllFriends, _addFriend, _approveOrReject, _getFriendRequests} = require('../service/friends-service.js');


const addFriend = async (req, res) => {
    _addFriend(req, res).then(friend => res.status(200).json(friend))
        .catch(err => res.status(500).json({message: err.message}));
}

const getAllFriends = async (req, res) => {
    _getAllFriends(req, res).then(friends => res.status(200).json(friends))
        .catch(err => res.status(500).json({message: err.message}));
}

const approveOrReject = async (req, res) => {
    console.log("approveOrReject")
    _approveOrReject(req, res).then(friend => res.status(200).json(friend))
        .catch(err => res.status(500).json({message: err.message}));
}

const getFriendRequests = async (req, res) => {
    _getFriendRequests(req, res).then(friends => res.status(200).json(friends))
        .catch(err => res.status(500).json({message: err.message}));
}


module.exports = {
    addFriend,
    getAllFriends,
    approveOrReject,
    getFriendRequests
}



