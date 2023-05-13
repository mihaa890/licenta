import { Box, Card, CardContent, Typography, Avatar } from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FiPhoneOutgoing, FiPhoneIncoming, FiPhoneMissed } from 'react-icons/fi';

const Calls = () => {
  const { id } = useParams();
  const [calls, setCalls] = useState([]);
  console.log(calls)
  useEffect(() => {
    const getAllCalls = async () => {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/calls/${id}`);
      const data = await response.json();
      setCalls(data);
    };

    getAllCalls();
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
        backgroundColor: call.answer ? "white" : "#FFEBEE",
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
            sx={{ color: call.answer ? "rgba(0, 0, 0, 0.6)" : "#F44336" }}
          >
            {call.senderUsername} called {call.receiverUsername}
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: call.answer ? "rgba(0, 0, 0, 0.6)" : "#F44336" }}
          >
            {call.answer ? "Accepted" : "Missed"}
          </Typography>
          {/* Adaugă pictograma corespunzătoare în funcție de tipul de apel */}
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
      <Typography variant="h5">Calls</Typography>
      {callsElements.length > 0 ? (
        callsElements
      ) : (
        <Typography variant="body1">No calls</Typography>
      )}
    </Box>
  );
};
export default Calls;