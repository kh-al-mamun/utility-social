import { useMutation } from "@apollo/client";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { ADD_REPORT } from "../mutations/reports";
import useUser from "../hooks/useUser";
import useSnack from "../hooks/useSnack";

const ReportAProblemPage = () => {
    const { _id } = useUser();
    const { makeSnack } = useSnack();
    const [message, setMessage] = useState('');
    const [AddReport, { loading, error }] = useMutation(ADD_REPORT);

    const handleAddReport = async () => {
        const newReport = {
            userId: _id,
            created_at: Date.now(),
            type: 'BUG',
            media: [],
            message,

        }
        const result = await AddReport({
            variables: {
                userId: _id,
                newReport,
            }
        })
        if (result.data && result.data.addReport.insertedId) {
            makeSnack(result.data.addReport.message, 'success', { duration: 10000 });
            setMessage('');
        } else if (error) {
            makeSnack(error.message, 'error')
        }
    }

    return (
        <Box
            maxWidth={500}
            mx="auto"
        >
            <Box>
                <Typography variant="subtitle1" color="GrayText">Report a problem</Typography>
                <Typography variant="body1" color="GrayText" fontSize={12}>
                    Describe the problem as clearly and as descriptively as you can.
                </Typography>
            </Box>
            <TextField
                id="bio"
                type="text"
                variant="outlined"
                size='medium'
                fullWidth
                multiline
                rows={10}
                placeholder="Write here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                inputProps={{
                    className: 'editor-input',
                }}
                sx={{ mt: 3, mb: 2 }}
            />
            <Button
                variant="contained"
                color="secondary"
                type="submit"
                fullWidth
                disabled={message.length < 50 || loading}
                onClick={handleAddReport}
            >
                Submit
            </Button>
        </Box>
    );
};

export default ReportAProblemPage;