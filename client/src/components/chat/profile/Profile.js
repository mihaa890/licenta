import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import defaultUserImage from "../../../assets/user-icon-bg.gif";
import UpdateProfile from "./UpdateProfile";
import { ProfileContainer } from "./Profile.style";
import { useDispatch } from "react-redux";
import { addFriend } from "../../redux/friendReducer";
import { Alert, AlertTitle } from "@mui/material";

const Profile = () => {
  const [user, setUser] = useState({
    username: '',
    location: null,
    bio: '',
    profilePictureHash: '',
  });
  const [imageSrc, setImageSrc] = useState(defaultUserImage);
  const [file, setFile] = useState(null);
  const { id } = useParams();
  const dispatch = useDispatch();
  const [success, setSuccess] = useState(false);

  const handleUpdateProfile = async () => {
    const form = new FormData();
    form.append('file', file);
    form.append('username', user.username);
    form.append('location', user.location);
    form.append('bio', user.bio);
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'PUT',
        body: form,
      });
      const data = await response.json();
      const profileImage = `https://cloudflare-ipfs.com/ipfs/${data.profilePictureHash}`;
      setUser({
        ...data,
        profilePictureHash: data.profilePictureHash,
      });
      setImageSrc(profileImage);
      setSuccess(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSelectImage = (event) => {
    const fileInput = event.target.files[0];
    setFile(fileInput);
    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result);
    };
    reader.readAsDataURL(fileInput);
  };

  const handleOnChange = (event) => {
    const { name, value } = event.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  const getAllFriends = async () => {
    const response = await fetch(`/api/friends/${id}`);
    const data = await response.json();
    dispatch(addFriend(data));
  };

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await fetch(`/api/users/${id}`);
        const data = await response.json();
        setUser(data);

        setImageSrc(
          data?.profilePictureHash
            ? `https://cloudflare-ipfs.com/ipfs/${data.profilePictureHash}`
            : defaultUserImage
        );
      } catch (error) {
        console.error(error);
      }
    };
    getUser();
    getAllFriends();
  }, [id]);

  return (
    <>
      <ProfileContainer>
        <UpdateProfile
          username={user?.username}
          location={user?.location || ''}
          bio={user?.bio || ''}
          profileImageSrc={imageSrc}
          handleSelectImage={handleSelectImage}
          handleOnChange={handleOnChange}
          handleUpdateProfile={handleUpdateProfile}
        />
      </ProfileContainer>
      {success && (
        <Alert sx={{
          position: "absolute",
          bottom: "2px",
          right: "10px",
          width: "350px",
          borderRadius: "0",
        }}
          onClose={() => setSuccess(false)}>

          <AlertTitle>Success</AlertTitle>
          Profile updated successfully
        </Alert>
      )
      }
    </>

  );
};

export default Profile;
