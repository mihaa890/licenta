import React, { useState, useEffect, useContext } from 'react';
import { FiUsers } from 'react-icons/fi';
import { IoCallOutline } from 'react-icons/io5';
import { AiOutlineUser } from 'react-icons/ai';
import { BiMessageSquareDots } from 'react-icons/bi';
import { CiSettings } from 'react-icons/ci';
import { Box, IconButton } from '@mui/material';
import Profile from './profile/Profile';
import Chats from './Chats';
import Users from './users/Users';
import Settings from './settings/Settings';
import ChatContextProvider from './ChatContextProvider.';
import Calls from './call/Call';
import { useAccount } from 'wagmi';
import { useNavigate } from 'react-router-dom';
import { useChatTheme } from './settings/ThemeProvider';

const ChatDashboard = () => {
  const [selectedTab, setSelectedTab] = useState('Profile');
  const { address } = useAccount();
  const navigate = useNavigate();
  const { theme } = useChatTheme();

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch(`/api/address/${address}`);
        const data = await response.json();

        if (data.existingUser) {
          navigate(`/dashboard/${data.existingUser?._id}`);
        } else {
          navigate(`/`);
        }
      } catch (error) {
        console.error(error);
      }
    })();
  }, [address, navigate]);

  const tabs = [
    {
      id: 'Profile',
      label: <AiOutlineUser />,
      content: <Profile />,
    },
    {
      id: 'Chats',
      label: <BiMessageSquareDots />,
      content: <Chats />,
    },
    {
      id: 'Users',
      label: <FiUsers />,
      content: <Users />,
    },
    {
      id: 'Calls',
      label: <IoCallOutline />,
      content: <Calls />,
    },
    {
      id: 'Settings',
      label: <CiSettings />,
      content: <Settings />,
    },
  ];

  return (
    <ChatContextProvider>
      <Box
        sx={{
          display: 'flex',
          height: 'calc(100vh - 82px)',
          width: '100%',
          backgroundColor: theme.palette.background.paper,
          boxShadow: '0px 0px 2px rgba(0, 0, 0.25)',
          padding: '10px 0px',
        }}
      >
        <Box
          sx={{
            width: '75px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            gap: '15px',
            padding: '10px 10px',
            borderRight: '1px solid #e0e0e0',
          }}
        >
          {tabs.map((tab) => (
            <IconButton
              key={tab.id}
              sx={{
                width: '75%',
                borderRadius: '5px',
                backgroundColor:
                  tab.id === selectedTab
                    ? (theme.palette.mode === 'light' ? theme.palette.primary.main : '#fff') : 'transparent',
                color:
                  tab.id === selectedTab
                    ? (theme.palette.mode === 'light' ? theme.palette.background.paper : '#000') : theme.palette.text.primary,
                '&:hover': {
                  backgroundColor:
                    tab.id === selectedTab
                      ? (theme.palette.mode === 'light' ? theme.palette.primary.main : '#e0e0e0') : 'transparent',
                },
              }}
              onClick={() => setSelectedTab(tab.id)}
            >
              {tab.label}
            </IconButton>
          ))}
        </Box>
        <Box
          sx={{
            width: 'calc(100% - 75px)',
            padding: '16px',
          }}
        >
          {tabs.find((tab) => tab.id === selectedTab)?.content}
        </Box>
      </Box>
    </ChatContextProvider>
  );
};

export default ChatDashboard;
