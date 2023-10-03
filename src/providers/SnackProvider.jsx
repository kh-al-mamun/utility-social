import { createContext, useCallback, useState } from "react";
import { Alert, Snackbar, useMediaQuery } from "@mui/material";

export const SnackContext = new createContext({})

const SnackProvider = ({ children }) => {
    const isUnderMd = useMediaQuery(theme => theme.breakpoints.down('md'));
    const [snack, setSnack] = useState({});

    // const makeSnack = (text, type) => {
    //     setSnack({
    //         open: true,
    //         type: type,
    //         text: text,
    //     })
    // }

    const makeSnack = useCallback((text, type='info', options) => {
        setSnack({
            open: true,
            type: type,
            text: text,
            duration: options?.duration || null,
        })
    }, [])

    const closeSnack = () => {
        setSnack(prev => ({
            ...prev,
            open: false,
        }))
    }

    let position = { vertical: 'bottom', horizontal: 'right' }
    if (isUnderMd) position = { vertical: 'bottom', horizontal: 'center' }

    const contextValue = {
        makeSnack,
    }

    return (
        <SnackContext.Provider value={contextValue}>
            <>
                {children}
                <Snackbar
                    open={snack.open}
                    onClose={closeSnack}
                    anchorOrigin={position}
                    autoHideDuration={snack.duration || snack.type === 'error' ? 5000 : 3000}
                >
                    <Alert
                        severity={snack.type}
                        sx={{ minWidth: '300px', border: 1 }}
                    >
                        {snack.text}
                    </Alert>
                </Snackbar>
            </>
        </SnackContext.Provider>
    );
};

export default SnackProvider;



/**
 * Usages Information:
 * 
 * This component creates a context
 * 
 * Thus it requires that you import this component
 * in your layout/root/higher order component and wrap
 * the contents with this component.
 * 
 * Then you can import its context in any of your
 * own component and destruct makeSnack function. 
 * Contents outside of this component will not be able
 * to use makeSnack function.
 * 
 * makeSnack(text, type) accepts two parameters at this moment.
 * text: is the message string
 * type: is the type string, eg. info, error, success
 * 
 * 
 * [CAN ONLY BE USED WITH MATERIAL UI CORE]
 */