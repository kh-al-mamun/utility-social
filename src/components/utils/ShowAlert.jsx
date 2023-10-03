//FLAG: incomplete
import { Button } from '@mui/material';
import React, { useRef, useState } from 'react';
import { Alert, Snackbar } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const ShowAlert = ({alert: boolean}) => {
    const [alert, setAlert] = useState(boolean);
    const count = useRef(0)
    count.current = count.current +1
    console.log('count', count)

    const handleClose = () => {
        setAlert(false)
    }

    const action = (
        <React.Fragment>
            <Button color="secondary" size="small" onClick={handleClose}>
                UNDO
            </Button>
            <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={handleClose}
            >
                <CloseIcon fontSize="small" />
            </IconButton>
        </React.Fragment>
    );

    return (
        <Snackbar open={alert} autoHideDuration={2000} action={action} onClose={handleClose}>
            <Alert severity="success" sx={{ width: '100%' }}>
                Success!
                {/* <IconButton
                    size="small"
                    aria-label="close"
                    color="inherit"
                    onClick={handleClose}
                >
                    <CloseIcon fontSize="small" />
                </IconButton> */}
            </Alert>
        </Snackbar>
    );
};

export default ShowAlert;