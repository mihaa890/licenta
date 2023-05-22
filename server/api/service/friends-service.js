const { User } = require('../dto/users');

const _getFriendRequests = async (req, res) => {
    const userId = req.params.id;
    const user = await User.findById(userId);

    const requestsThatIHaveSent = [];
    const requestsThatIHaveReceived = [];

    for (let sentRequest of user.friendRequestsSent) {
        const friend = await User.findById(sentRequest.receiverId);
        const request = {
            requestId: sentRequest._id,
            friendId: sentRequest.receiverId,
            username: friend.username,
            address : friend.address,
            profilePictureHash: friend.profilePictureHash,
            location : friend.location,
            bio: friend.bio,
            timestamp: sentRequest.timestamp
        };
        console.log(friend)
        requestsThatIHaveSent.push(request);
    }

    for (let receivedRequest of user.friendRequestsReceived) {
        const friend = await User.findById(receivedRequest.senderId);
        const request = {
            requestId: receivedRequest._id,
            friendId: receivedRequest.senderId,
            username: friend.username,
            address : friend.address,
            profilePictureHash: friend.profilePictureHash,
            location : friend.location,
            bio: friend.bio,
            timestamp: receivedRequest.timestamp
        };
        requestsThatIHaveReceived.push(request);
    }

    return {
        requestsThatIHaveSent,
        requestsThatIHaveReceived
    };
};

  
const _getAllFriends = async (req, res) => {
    const userId = req.params.id;
    const user = await User.findById(userId);

    const friends = user.friends.filter(friend => friend.status === 'accepted');

    const friendIds = friends.map(friend => friend.friendId);

    const allFriends = await User.find({ _id: { $in: friendIds } })
      .select("-password")
      .select("-messages")
      .select("-calls");

    return allFriends;
};



const _addFriend = async (req, res) => {
    const userId = req.params.id;
    const friendId = req.body.friendId;

    if (userId === friendId) {
        return;
    }

    const user = await User.findByIdAndUpdate(
        userId,
        { $addToSet: { friendRequestsSent: { receiverId: friendId, status : 'pending', timestamp: Date.now() } } },
        { new: true }
    );

    await User.findByIdAndUpdate(
        friendId,
        { $addToSet: { friendRequestsReceived: { senderId: userId, status : 'pending', timestamp: Date.now() } } },
        { new: true }
    );

    return user;
};

const _approveOrReject = async (req, res) => {
    const userId = req.params.id;
    const friendId = req.body.friendId;
    const status = req.body.status;

    const user = await User.findByIdAndUpdate(
        userId,
        { $pull: { friendRequestsReceived: { senderId: friendId } } },
        { new: true }
    );

    await User.findByIdAndUpdate(
        friendId,
        { $pull: { friendRequestsSent: { receiverId: userId } } },
        { new: true }
    );

    if (status === 'accepted') {
        user.friends.push({ friendId, status: 'accepted' });
        await user.save();

        const friend = await User.findById(friendId);
        friend.friends.push({ friendId: userId, status: 'accepted' });
        await friend.save();
    }

    return user;
};


const _deleteFriend = async (req, res) => {
    const userId = req.params.id;
    const friendId = req.body.friendId;

    const user = await User.findByIdAndUpdate(
        userId,
        { $pull: { friends: { friendId } } },
        { new: true }
    );

    await User.findByIdAndUpdate(
        friendId,
        { $pull: { friends: { friendId: userId } } },
        { new: true }
    );

    return user;
};



module.exports = {
    _getAllFriends,
    _addFriend,
    _approveOrReject,
    _getFriendRequests,
    _deleteFriend
}