import { createContext, useEffect, useState } from "react";
import { GoogleAuthProvider, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateEmail, updatePassword } from "firebase/auth";
import auth from "../../firebase.config";
import baseUrl from "../baseUrl";
import { Alert, Box, Typography } from "@mui/material";
import { useApolloClient } from "@apollo/client";

export const AuthContext = new createContext(null);
const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
    const client = useApolloClient();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isServerAwake, setIsServerAwake] = useState(false);
    const [accountCreated, setAccountCreated] = useState(false);

    const createAccount = async (email, password) => {
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password);
    }

    const logIn = (email, password) => {
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password)
    }

    const logOut = () => signOut(auth);

    const signInWithGoogle = () => {
        return signInWithPopup(auth, googleProvider)
    }

    const changeEmail = (newEmail) => {
        return updateEmail(auth.currentUser, newEmail)
    }

    const changePassword = (newPassword) => {
        return updatePassword(auth.currentUser, newPassword)
    }

    useEffect(() => {
        async function checkServerStatus() {
            const response = await fetch(baseUrl);
            const server = await response.json();
            if (server && server.status === 'awake') {
                setIsServerAwake(true);
            } else {
                checkServerStatus();
            }
        }
        checkServerStatus()
    }, [])

    useEffect(() => {
        const unSub = onAuthStateChanged(auth, user => {
            setUser(user);
            if(!user) client.resetStore();
            (async () => {
                try {
                    if (user) {
                        const response = await fetch(`${baseUrl}/jwt`, {
                            method: 'POST',
                            credentials: 'include',
                            headers: {
                                'content-type': 'application/json'
                            },
                            body: JSON.stringify({ user: { email: user.email } })
                        })
                        const data = await response.json();
                        if (!data || !data.success) {
                            await logOut();
                        } else {
                            localStorage.setItem('token-UuSs', data.token);
                            localStorage.setItem('tokenId-UuSs', data.tokenId);
                        }
                    }
                }
                finally {
                    setLoading(false);
                }
            })()
        })
        return unSub;
    }, [])

    const authInfo = {
        user,
        loading,
        setLoading,
        createAccount,
        signInWithGoogle,
        changeEmail,
        changePassword,
        logIn,
        logOut,
        isServerAwake,
        accountCreated,
        setAccountCreated,
    }

    if (!isServerAwake) return <ServerCheckingMessage />

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

const ServerCheckingMessage = () => {
    return (
        <Box
            height="100vh"
            width="100vw"
            display="flex"
            flexDirection="column"
            gap={1}
            justifyContent="center"
            alignItems="center"
            margin="-10px"
            sx={{ background: `url('https://ucarecdn.com/f028b0cb-f49a-4188-bc02-b78e7f6e2b94/') center/cover no-repeat` }}
        >
            <Alert severity="info">Checking server status. This may take a while!</Alert>
            <Typography color="" fontSize={14}>Please Reload, if this message persists for too long.</Typography>
        </Box>
    )
}

export default AuthProvider;