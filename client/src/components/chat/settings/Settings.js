import React, { useState } from 'react';
import ThemeContext, { useChatTheme } from './ThemeProvider';
import { Switch, FormControlLabel, IconButton, Box, Divider, Dialog, DialogTitle, Button, DialogActions } from '@mui/material';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { useNavigate, useParams } from 'react-router-dom';

const Settings = () => {
  const { id } = useParams();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useChatTheme();

  const handleDeleteAccount = () => {
    setOpenDeleteDialog(true);
  };

  const handleThemeChange = () => {
    const updatedMode = theme.palette.mode === 'light' ? 'dark' : 'light';
    toggleTheme(updatedMode);
  };

  const handleDeleteConfirm = () => {
    fetch(`/api/users/${id}`, {
      method: 'DELETE',
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
        if (data) {
          localStorage.removeItem('theme');
          navigate('/');
        }
      })
      .catch((error) => console.error(error));

    setOpenDeleteDialog(false);
  };

  const handleDeleteCancel = () => {
    setOpenDeleteDialog(false);
  };


  return (
    <div>
      <h3 style={{ color: theme.palette.text.primary }}>Chat Settings</h3>
      <FormControlLabel
        style={{ color: theme.palette.text.primary }}
        control={<Switch checked={theme.palette.mode === 'dark'} onChange={handleThemeChange} />}
        label="Do you want to switch to dark mode?"
      />
      <IconButton onClick={handleThemeChange} color="primary">
        {theme.palette.mode === 'dark' ? '🌙' : '☀️'}
      </IconButton>

      <Box mt={4}>
        <Divider />
      </Box>

      <h3 style={{ color: theme.palette.text.primary, marginTop: '1rem' }}>Account Settings</h3>
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
      }}>
        <IconButton onClick={handleDeleteAccount} color="error">
          <RiDeleteBin6Line />
        </IconButton>
        <p style={{ color: theme.palette.text.primary }}>Delete your account</p>
      </Box>

      <Dialog open={openDeleteDialog} onClose={handleDeleteCancel}>
        <DialogTitle>Are you sure you want to delete your account?</DialogTitle>
        <DialogActions>
          <Button sx={{
            textTransform: 'capitalize',
            fontSize: '1.1rem',
          }} onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button sx={{
            textTransform: 'capitalize',
            fontSize: '1.1rem',
          }} onClick={handleDeleteConfirm} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )

};
export default Settings;
