import { AiFillEdit } from "react-icons/ai";
import { IconContainer, ProfileBio, ProfileContainer, ProfileImage, ProfileImageContainer, ProfileLocation, ProfileTitle, ProfileUsername, UpdateButton } from "./UpdateProfile.style";

import { Button, CircularProgress } from '@mui/material';
import { useState } from "react";

const UpdateProfile = ({ username, location, bio, profileImageSrc, handleSelectImage, handleUpdateProfile, handleOnChange }) => {
    const [loading, setLoading] = useState(false);

    const handleUpdateProfileClick = async () => {
        setLoading(true);
        await handleUpdateProfile();
        setLoading(false);
    };

    return (
        <ProfileContainer>
            <ProfileTitle>Your Profile</ProfileTitle>
            <ProfileImageContainer>
                <ProfileImage src={profileImageSrc} alt="Profile" />
                <IconContainer>
                    <AiFillEdit />
                    <label htmlFor="imageInput">Edit your profile picture</label>
                    <input
                        type="file"
                        id="imageInput"
                        accept=".jpg,.jpeg,.png,.gif"
                        onChange={handleSelectImage}
                        style={{ display: 'none' }}
                    />
                </IconContainer>
            </ProfileImageContainer>
            <ProfileUsername defaultValue={username}  placeholder="Username" name="username" onChange={handleOnChange} />
            <ProfileLocation placeholder="location" name="location" defaultValue={location} onChange={handleOnChange} />
            <ProfileBio placeholder="bio" defaultValue={bio} name="bio" onChange={handleOnChange} />
            <Button
                variant="contained"
                onClick={handleUpdateProfileClick}
                disabled={loading}
                style={{ marginTop: '16px', textTransform: "capitalize" }}
            >
                {loading ? <CircularProgress size={24} /> : 'Update Profile'}
            </Button>

        </ProfileContainer>
    );
};

export default UpdateProfile;