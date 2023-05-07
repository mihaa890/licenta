const { Friend } = require('../dto/friends');
const { User } = require('../dto/users');


const _getFriendRequests = async (req, res) => {
    const userId = req.params.id;
    const friendRequests = await User.find({ friends: { $elemMatch: { friendId: userId, status: 'pending' } } })
        .select("-password")
        .select("-messages")
        .select("-calls");
    return friendRequests;
}

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
        { $addToSet: { friends: { friendId, status: 'pending' } } },
        { new: true }
    );

    await User.findByIdAndUpdate(
        friendId,
        { $addToSet: { friends: { friendId: userId, status: 'pending' } } },
        { new: true }
    );


    return user;
}



const _approveOrReject = async (req, res) => {
    const userId = req.params.id;
    const friendId = req.body.friendId;
    const status = req.body.status;

    const friend = await Friend.findOneAndUpdate({ user: userId, friend: friendId }, { status });
    return friend;
}

module.exports = {
    _getAllFriends,
    _addFriend,
    _approveOrReject,
    _getFriendRequests
}