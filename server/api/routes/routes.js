const express = require('express');
const router = express.Router();
const multer  = require('multer');
const os = require('os');
const upload = multer({ dest: os.tmpdir() });

//controllers
const {register, login, getUsers, getUserBy, isAddressAlreadyRegistered, updateUserProfile} = require('../controller/users-controller');
const {getAllFriends, addFriend, approveOrReject, getFriendRequests} = require('../controller/friends-controller');
const {getAllMessages, getAllCalls} = require('../controller/messages-controller');

//routes
//user routes
router.post('/register', register);
router.get('/address/:address', isAddressAlreadyRegistered);
router.post('/login', login);
router.get('/users', getUsers);
router.get('/users/:id', getUserBy);
router.put('/users/:id', upload.single('file'), updateUserProfile)


//friends routes
router.post('/friends/:id', addFriend);
router.get('/friends/:id', getAllFriends);
router.put('/friends/:id', approveOrReject);
router.get('/friends/requests/:id', getFriendRequests);


router.get('/messages/:id', getAllMessages);
router.get('/calls/:id', getAllCalls);



module.exports = router;