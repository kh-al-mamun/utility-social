import { Alert, Snackbar, useMediaQuery } from "@mui/material";

const MySnack = ({ open, onClose, message, type, duration=3000 }) => {
    const isUnderMd = useMediaQuery(theme => theme.breakpoints.down('md'));

    let position = { vertical: 'bottom', horizontal: 'right' }
    if(isUnderMd) position = { vertical: 'top', horizontal: 'center' }

    

    return (
        <Snackbar
            open={open}
            onClose={onClose}
            anchorOrigin={position}
            autoHideDuration={duration}
        >
            <Alert
                severity={type}
                sx={{ minWidth: '300px', border: 1 }}
            >
                {message}
            </Alert>
        </Snackbar>
    );
};

export default MySnack;