import { Typography } from "@mui/material";

const ErrorFetchingData = ({error, message="Error fetching data"}) => {
    return (
        <Typography
            color="error"
            variant="subtitle1"
        >
            {message}! Error: {error?.message}
        </Typography>
    );
};

export default ErrorFetchingData;