import { Box, Card, CardContent, Typography, Avatar, Pagination, Stack } from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FiPhoneOutgoing, FiPhoneIncoming, FiPhoneMissed } from 'react-icons/fi';
import { BsCameraVideo } from 'react-icons/bs';
import { AiFillAudio } from 'react-icons/ai'
import { useChatTheme } from "../settings/ThemeProvider";


const Calls = () => {
  const { id } = useParams();
  const [calls, setCalls] = useState([]);
  const [pages, setPages] = useState();
  const [page, setPage] = useState(1);
  const { theme } = useChatTheme();

  const getAllCalls = async (page, limit) => {
    const response = await fetch(`/api/calls/${id}?page=${page}&limit=${limit}`);
    const data = await response.json();

    setCalls(data.calls);
    setPages(data.pagination.totalPages)
    setPage(page);
  };

  useEffect(() => {
    getAllCalls(1, 4);

  }, [id]);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const callsElements = calls.map((call) => (
    <Card
      key={`${call.senderUsername}-${call.timestamp}`}
      sx={{
        marginBottom: "16px",
        backgroundColor: call.answer && theme.palette.mode === 'dark'
          ? "rgba(0, 0, 0, 0.04)"
          : !call.answer && theme.palette.mode === 'dark'
            ? "#7d2525"
            : call.answer && theme.palette.mode === 'light'
              ? "rgba(0, 0, 0, 0.04)"
              : "#FFEBEE",
        borderColor: call.answer ? "rgba(0, 0, 0, 0.12)" : "#E57373",
      }}
    >
      <CardContent>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "8px",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Avatar
              src={call.senderProfilePicture}
              alt={call.senderUsername}
              sx={{ marginRight: "8px" }}
            />
            <Typography variant="subtitle1">{call.senderUsername}</Typography>
          </Box>
          <Typography variant="body2">{formatDate(call.timestamp)}</Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: call.answer && theme.palette.mode === 'dark'
                ? '#d4d4d4'
                : !call.answer && theme.palette.mode === 'dark'
                  ? 'd4d4d4'
                  : '#000000'

            }}
          >
            {call.senderUsername} called {call.receiverUsername}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: call.answer && theme.palette.mode === 'dark'
                ? '#d4d4d4'
                : !call.answer && theme.palette.mode === 'dark'
                  ? 'red'
                  : !call.answer && theme.palette.mode === 'light'
                    ? 'red'
                    : '#000000'

            }}
          >
            {call.answer ? "Accepted" : "Missed"}
          </Typography>

          {call.callType === 'video' ? <BsCameraVideo /> : <AiFillAudio />}
          {
            call.answer
              ? <Fragment>
                {
                  call.senderId === id ? (
                    <FiPhoneOutgoing style={{ color: "green" }} />
                  ) : (
                    <FiPhoneIncoming style={{ color: "blue" }} />
                  )
                }
              </Fragment>
              : <FiPhoneMissed style={{ color: "red" }} />
          }
        </Box>
      </CardContent>
    </Card>
  ));

  return (
    <Box>
      <Typography variant="h5" sx={{
        color: theme.palette.mode === 'dark' ? '#d4d4d4' : '#000000',
      }}>Calls</Typography>
      {callsElements.length > 0 ? (
        callsElements
      ) : (
        <Typography variant="body1" sx={{
          color: theme.palette.mode === 'dark' ? '#d4d4d4' : '#000000',
        }}>No calls</Typography>
      )}
      <Stack spacing={2} sx={{
        marginTop: "2rem",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}>
        {pages > 1 && <Pagination
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
          count={pages}
          page={page}
          onChange={(event, value) => getAllCalls(value, 4)}
        />}
      </Stack>

    </Box>
  );
};
export default Calls;