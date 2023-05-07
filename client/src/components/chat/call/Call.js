import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Calls = () => {

    const { id } = useParams();
    const [calls, setCalls] = useState([]);


    useEffect(() => {
        const getAllCalls = async () => {
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/calls/${id}`);
            const data = await response.json();
            setCalls(data);
        }

        getAllCalls();
    }, [id])


    console.log(calls)


    return (
        <Box>
            <Typography variant="h5">Calls</Typography>
            <Box>
                {calls.map(call => (
                    <Box key={call._id}>
                        <Typography>{call.senderUsername}</Typography>
                        <Typography>{call.answer}</Typography>
                    </Box>
                ))}
            </Box>
        </Box>

    )

}

export default Calls;