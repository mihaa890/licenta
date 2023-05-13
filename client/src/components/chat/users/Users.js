import React, { useEffect, useState } from "react";
import {
    Avatar,
    Button,
    Grid,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Typography,
    ButtonGroup,
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    CircularProgress,
} from "@mui/material";
import { useParams } from "react-router-dom";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import noRequests from "../../../assets/animations/no-requests.json"
import Animation from "../../reusable/Animation";

const STATUS = {
    PENDING: "pending",
    ACCEPTED: "accepted",
    REJECTED: "rejected",
};

const Users = () => {
    const [allUsers, setAllUsers] = useState([]);
    const [userDetails, setUserDetails] = useState(null);
    const [friendRequestsSent, setFriendRequestsSent] = useState([]);
    const [friendRequestsReceived, setFriendRequestsReceived] = useState([]);

    const [loading, setLoading] = useState(false);
    const [friendDetails, setFriendDetails] = useState(null);
    const [pageMyRequests, setPageMyRequests] = useState(1);
    const [pages, setTotalPages] = useState(1);
    const [page, setPage] = useState(1);
    const { id } = useParams();


    const handleGetAllUsers = async (page, limit) => {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/users?page=${page}&limit=${limit}`);
        const { data: users, pagination } = await response.json();

        const usersWithProfilePicture = await Promise.all(
            users.map(async (user) => {
                if (!user.profilePictureHash) return user;
                const profilePicture = `https://cloudflare-ipfs.com/ipfs/${user.profilePictureHash}`;
                return { ...user, profilePicture };
            })
        );

        setAllUsers(usersWithProfilePicture);
        setTotalPages(pagination.totalPages);
        setPage(page);
    };


    const handleAddFriend = async (userId, friendId) => {
        try {
            setLoading(true);
            const response = await fetch(
                `${process.env.REACT_APP_BASE_URL}/api/friends/${userId}`,
                {
                    method: "POST",
                    body: JSON.stringify({ friendId }),
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.ok) {
                const updatedUser = await response.json();
                setAllUsers((prevUsers) =>
                    prevUsers.map((user) =>
                        user._id === updatedUser._id ? updatedUser : user
                    )
                );
                setLoading(false);
                await getMyRequests();
                return updatedUser;
            } else {
                console.error(response.error);
            }
        } catch (error) {
            console.error(error);
        }
    };


    const handleAcceptOrRejectFriendRequest = async (friendRequestId, status) => {
        try {
            setLoading(true);
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/friends/${id}`, {
                method: "PUT",
                body: JSON.stringify({ friendId: friendRequestId, status }),
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                await getMyRequests();
            } else {
                console.log("Error:", response.statusText);
            }
            setLoading(false);
        } catch (error) {
            console.error(error);
        }
    };


    const getMyRequests = async () => {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/friends/requests/${id}`);
        const data = await response.json();
        console.log(data)

        setFriendRequestsReceived(data.requestsThatIHaveReceived);
        setFriendRequestsSent(data.requestsThatIHaveSent);
    };

    useEffect(() => {
        handleGetAllUsers(1, 5);
        getMyRequests();
    }, [pages, pageMyRequests]);


    const defaultUserIcon = (user) => {
        return (
            <Box
                sx={{
                    width: "50px",
                    height: "50px",
                    backgroundColor: `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(
                        Math.random() * 256
                    )}, ${Math.floor(Math.random() * 256)})`,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#FFFFFF",
                }}
            >
                <span
                    sx={{
                        color: "#FFFFFF",
                        fontSize: "20px",
                    }}
                >

                    {user?.username.charAt(0)}
                </span>
            </Box>
        );
    };
    const handleUserDetailsModalOpen = (user) => {
        setUserDetails(user);
    };

    const handleUserDetailsModalClose = () => {
        setUserDetails(null);
    };

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
                <Typography variant="h6">All Users</Typography>
                <div>
                    {allUsers.length > 0 ? (
                        <List>
                            {allUsers.map((user) => {
                                return (
                                    <ListItem key={user._id} alignItems="center">
                                        <ListItemAvatar>
                                            <IconButton onClick={() => handleUserDetailsModalOpen(user)}>
                                                {user.profilePictureHash ? (
                                                    <Avatar sx={{
                                                        width: "50px",
                                                        height: "50px",
                                                    }}
                                                        src={user.profilePicture} />
                                                ) : (
                                                    defaultUserIcon(user)
                                                )}
                                            </IconButton>
                                        </ListItemAvatar>
                                        <ListItemText primary={user.username} />
                                        <Button
                                            disabled={user._id === id}
                                            variant="contained"
                                            color="primary"
                                            style={{ textTransform: "capitalize" }}
                                            onClick={() => handleAddFriend(id, user._id)}
                                        >
                                            {loading ? (
                                                <CircularProgress size={24} color="inherit" />
                                            ) : friendRequestsSent.find((request) => request.friendId === user._id) ? (
                                                <span>Pending</span>
                                            ) : (
                                                <span>Add Friend</span>
                                            )}
                                        </Button>

                                    </ListItem>
                                );
                            })}
                        </List>
                    ) : (
                        <Typography variant="body1">There are no users to display.</Typography>
                    )}
                    <Stack spacing={2}>
                        {pages > 1 && <Pagination
                            count={pages}
                            page={page}
                            onChange={(event, value) => handleGetAllUsers(value)}
                        />}
                    </Stack>
                </div>
            </Grid>
            <Grid item xs={12} md={6}>
                <Typography variant="h6">My Friend Requests</Typography>
                <div>
                    {friendRequestsReceived.length !== 0 ? (
                        <TableContainer component={Paper} sx={{
                            maxHeight: "400px",
                            overflowY: "scroll",
                        }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>User</TableCell>
                                        <TableCell sx={{
                                            textAlign: "center"
                                        }}>Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {friendRequestsReceived.map((friendRequest) => {
                                        return (
                                            <TableRow key={`${friendRequest.requestId}-key`}>
                                                <TableCell component="th" scope="row">
                                                    <IconButton onClick={() => handleUserDetailsModalOpen(friendRequest)}>
                                                        {friendRequest.profilePictureHash ? (
                                                            <Avatar sx={{
                                                                width: "50px",
                                                                height: "50px",
                                                            }} src={`https://cloudflare-ipfs.com/ipfs/${friendRequest.profilePictureHash}`} />
                                                        ) : (
                                                            defaultUserIcon(friendRequest)
                                                        )}
                                                    </IconButton>
                                                    {friendRequest.username}
                                                </TableCell>
                                                <TableCell sx={{
                                                    textAlign: "center"
                                                }}>
                                                    {loading ? (
                                                        <CircularProgress size={24} color="inherit" />
                                                    ) : (
                                                        <ButtonGroup variant="text">
                                                            <Button
                                                                color="primary"
                                                                onClick={() =>
                                                                    handleAcceptOrRejectFriendRequest(
                                                                        friendRequest.friendId,
                                                                        STATUS.ACCEPTED
                                                                    )
                                                                }
                                                            >
                                                                Accept
                                                            </Button>
                                                            <Button
                                                                color="secondary"
                                                                onClick={() =>
                                                                    handleAcceptOrRejectFriendRequest(
                                                                        friendRequest.friendId,
                                                                        STATUS.REJECTED
                                                                    )
                                                                }
                                                            >
                                                                Reject
                                                            </Button>
                                                        </ButtonGroup>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    ) : (
                        <Box sx={{
                            width: "50%",
                            margin: "0 auto",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                        }}>
                            <Animation animation={noRequests} />
                            <Typography variant="body1">You have no friend requests.</Typography>
                        </Box>
                    )}
                </div>
            </Grid>

            <Dialog open={userDetails !== null} onClose={handleUserDetailsModalClose}>
                {userDetails && (
                    <>
                        <DialogTitle>{userDetails.username}</DialogTitle>
                        <DialogContent>
                            {userDetails.profilePictureHash
                                ? <Avatar src={`https://cloudflare-ipfs.com/ipfs/${userDetails.profilePictureHash}`} sx={{ width: "100px", height: "100px" }} />
                                : defaultUserIcon(userDetails)}
                            <DialogContentText>
                                <strong>Location: </strong> {userDetails.location}
                            </DialogContentText>
                            <DialogContentText>
                                <strong>Address: </strong> {userDetails.address}
                            </DialogContentText>
                            <DialogContentText>
                                <strong>Bio: </strong> {userDetails.bio}
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleUserDetailsModalClose}>Close</Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </Grid>
    );
};

export default Users;



