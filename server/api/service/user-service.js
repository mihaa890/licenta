const { User } = require('../dto/users');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const { create } = require('ipfs-http-client');

const auth =
    "Basic " + Buffer.from("2NoetfRT5dxtls23ivXQcQKbbPs" + ":" + "23620ae62365ab129d76d7d78b82e63e").toString("base64");

const ipfs = create({
    host: "ipfs.infura.io",
    port: 5001,
    protocol: "https",
    headers: {
        authorization: auth,
    },
});

const _createUser = async (address, username, password) => {

    const isTaken = await __isUsernameTaken(username);
    if (isTaken) throw new Error('Username is already taken');

    if (password.length < 6) throw new Error('Password must be at least 6 characters long');

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await new User({
        address: address,
        username: username,
        password: hashedPassword
    });
    await user.save();

    const _user = {
        address: user.address,
        username: user.username,
        _id: user._id,
        createdAt: user.createdAt
    };
    return _user;
}


const _signin = async (address) => {
    try {
        const user = await User.findOne({ address });

        if (!user) throw new Error('User not found');

        return user;

    } catch (err) {
        throw new Error(err.message);
    }
}

const _setUserProfilePicture = async (id, file) => {
    try {
        const buffer = await new Promise((resolve, reject) => {
            fs.readFile(file.path, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(Buffer.from(data));
                }
            });
        });

        const _file = await ipfs.add(buffer);
        const profilePictureHash = _file.cid.toString();

        const user = await User.findOneAndUpdate(
            { _id: id },
            { profilePictureHash: profilePictureHash }
        );

        return user;
    } catch (error) {
        console.error(error);
    }
}

const _updateUserProfile = async (id, username, location, bio, file) => {
    const user = await User.findById(id);
    if (!user) throw new Error('User not found');

    try {
        if (file) {
            const updatedUser = await _setUserProfilePicture(id, file);
            return updatedUser;
        } else {
            if (username) user.username = username;
            if (location) user.location = location;
            if (bio) user.bio = bio;

            await user.save();
            return user;
        }
    } catch (error) {
        console.error(error);
    }
}


const _getAllUsers = async (page, limit) => {
    const skip = (page - 1) * limit;
    const users = await User.find()
        .select("-password")
        .select("-messages")
        .select("-calls")
        .skip(skip)
        .limit(limit);
    const count = await User.countDocuments();
    const totalPages = Math.ceil(count / limit);

    return {
        data: users,
        pagination: {
            total: count,
            totalPages,
            currentPage: page,
        },
    };
};


const _getUserById = async (id) => {
    const user = await User.findById(id).select('-password');
    return user;
}

const _isAddressAlreadyRegistered = async (address) => {

    const existingUser = await User.findOne({ address });
    return {
        isRegistered: !!existingUser,
        existingUser: existingUser
    }
}


const __isUsernameTaken = async (username) => {
    const existingUser = await User.findOne({ username });
    return !!existingUser;
}



module.exports = {
    _createUser,
    _signin,
    _getAllUsers,
    _getUserById,
    _isAddressAlreadyRegistered,
    _updateUserProfile,
    ipfs
}