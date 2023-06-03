const { _createUser, _signin, _getAllUsers, _getUserById, _isAddressAlreadyRegistered, _updateUserProfile, _deleteUserById } = require('../../api/service/user-service');

const register = (req, res) => {
    const { address, username, password } = req.body;
    _createUser(address, username, password)
        .then(user => res.status(200).json(user))
        .catch(err => res.status(500).json({ message: err.message }));
}

const login = (req, res) => {
    const { address } = req.body;
    _signin(address)
        .then((user) => res.status(200).json(user))
        .catch(err => res.status(500).json({ message: err.message }));
}

const getUsers = (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;

    _getAllUsers(page, limit)
        .then((users) => res.status(200).json(users))
        .catch((err) => res.status(500).json({ message: err.message }));
};


const getUserBy = (req, res) => {
    _getUserById(req.params.id).then(user => res.status(200).json(user))
}

const isAddressAlreadyRegistered = (req, res) => {
    const { address } = req.params;
    _isAddressAlreadyRegistered(address)
        .then(isRegistered => res.status(200).json(isRegistered))
        .catch(err => res.status(500).json({ message: err.message }));
}


const updateUserProfile = (req, res) => {
    const { id } = req.params;
    const { username, location, bio } = req.body;
    console.log(req.body)
    _updateUserProfile(id, username, location, bio, req.file)
        .then(user => res.status(200).json(user))
        .catch(err => res.status(500).json({ message: err.message }));
}

const deleteUserById = (req, res) => {
    const { id } = req.params;
    _deleteUserById(id)
        .then(user => res.status(200).json(user))
        .catch(err => res.status(500).json({ message: err.message }));
}



module.exports = {
    register,
    login,
    getUsers,
    getUserBy,
    isAddressAlreadyRegistered,
    updateUserProfile,
    deleteUserById
}