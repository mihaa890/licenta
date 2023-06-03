import { AiFillEdit } from "react-icons/ai";
import { IconContainer, ProfileBio, ProfileContainer, ProfileImage, ProfileImageContainer, ProfileLocation, ProfileTitle, ProfileUsername } from "./UpdateProfile.style";

import { Button, CircularProgress } from '@mui/material';
import {  useState } from "react";
import { useChatTheme } from "../settings/ThemeProvider";

const UpdateProfile = ({ username, location, bio, profileImageSrc, handleSelectImage, handleUpdateProfile, handleOnChange }) => {
    const [loading, setLoading] = useState(false);
    const { theme } = useChatTheme();

    const handleUpdateProfileClick = async () => {
        setLoading(true);
        await handleUpdateProfile();
        setLoading(false);
    };

    return (
        <ProfileContainer theme={theme} >
            <ProfileTitle theme={theme}>Your Profile</ProfileTitle>
            <ProfileImageContainer>
                <ProfileImage src={profileImageSrc} alt="Profile" />
                <IconContainer theme={theme}>
                    <AiFillEdit style={{
                        color: theme.palette.text.primary,
                    }} />
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
            <ProfileUsername theme={theme} defaultValue={username} placeholder="Username" name="username" onChange={handleOnChange} />
            <ProfileLocation theme={theme} placeholder="location" name="location" defaultValue={location} onChange={handleOnChange} />
            <ProfileBio theme={theme} placeholder="bio" defaultValue={bio} name="bio" onChange={handleOnChange} />
            <Button
                variant="contained"
                onClick={handleUpdateProfileClick}
                disabled={loading}
                style={{
                    marginTop: '16px',
                    textTransform: "capitalize",
                    backgroundColor: theme.palette.mode === 'dark' ? '#7289da' : theme.palette.primary.main,
                    color: theme.palette.mode === 'dark' ? '#e4e8ec' : '#fff',
                }}
            >
                {loading ? <CircularProgress size={24} /> : 'Update Profile'}
            </Button>

        </ProfileContainer>
    );
};

export default UpdateProfile;