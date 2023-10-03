import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { Alert, Divider, InputAdornment } from "@mui/material";
import MyHelmet from "../components/shared/MyHelmet";
import { useState } from "react";
import { useForm } from "react-hook-form";
import isEmail from 'validator/lib/isEmail';
import { useApolloClient } from "@apollo/client";
import { GET_EMAIL_FROM_USERNAME } from "../queries/user";
import GoogleSignIn from "../components/sign-in/GoogleSignIn";

export default function SignIn() {
    const client = useApolloClient();
    const { logIn, accountCreated, setAccountCreated, setLoading } = useAuth();
    const { register, watch, handleSubmit, formState: { isValid, errors, isSubmitting } } = useForm();
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/'

    // handle when users click Sign In button
    const onFormSubmit = async (data) => {
        let email;
        setErrorMessage('');
        const input = data.input.trim();
        const password = data.password;

        if (!input || !password) {
            alert("All fields are required!");
            return;
        }

        try {
            // get user's Email from server if user provides Username instead of Email
            if (!isEmail(input)) {
                const response = await client.query({
                    query: GET_EMAIL_FROM_USERNAME,
                    variables: { username: input }
                })
                const data = response.data.getEmailFromUsername;
                if (data) {
                    email = data.email;
                } else {
                    setErrorMessage('Username or password was incorrect!');
                    return;
                }
            }
            else {
                email = input;
            }

            // finally login with Email and password
            const userCredential = await logIn(email, password);
            if (userCredential && userCredential.user) {
                setAccountCreated(false);
                navigate(from, { replace: true })
            }
        }
        catch (error) {
            if (error.message.includes('wrong-password')) {
                setErrorMessage('Username or password was incorrect!')
            }else if(error.message.includes('INVALID_PASSWORD')) {
                setErrorMessage("This account does not have a password set. Try sign in with google")
            } else {
                setErrorMessage(error.message)
            }
        }
        finally {
            setLoading(false); // from authContext //
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <MyHelmet titled="Sign-in" />
            {accountCreated && <Alert severity="success"> Account created, now login. </Alert>}
            {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
            <Box
                sx={{
                    marginTop: 5,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>
                <Box
                    component="form"
                    noValidate
                    onSubmit={handleSubmit(onFormSubmit)}
                    sx={{ mt: 3 }}
                >
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                {...register('input', {
                                    required: "Email/Username is required"
                                })}
                                error={Boolean(errors.input)}
                                helperText={errors.input && errors.input.message}
                                fullWidth
                                label="Email or Username"
                                autoComplete="email"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                {...register('password', {
                                    required: "Password is required",
                                    minLength: { value: 6, message: "Minimum six characters" }
                                })}
                                error={Boolean(errors.password)}
                                helperText={errors.password && errors.password.message}
                                InputProps={{
                                    endAdornment: Boolean(watch('password')) && <InputAdornment position="end">
                                        <Button onClick={() => setShowPassword(prev => !prev)} color="info" sx={{ textTransform: 'none' }}>
                                            {showPassword ? "Hide" : "Show"}
                                        </Button>
                                    </InputAdornment>
                                }}
                                type={showPassword ? "text" : "password"}
                                fullWidth
                                label="Password"
                                autoComplete="new-password"
                            />
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="secondary"
                        disabled={!isValid || isSubmitting}
                        sx={{ mt: 3, mb: 1 }}
                    >
                        Sign In
                    </Button>
                    <Grid container justifyContent="flex-end">
                        <Grid item display="flex" gap="7px">
                            <Typography variant="body1" fontSize={14} sx={{ opacity: '.8' }}>
                                Do not have an account?
                            </Typography>
                            <Link to={"/sign-up"} variant="body1" color="secondary" style={{ textDecoration: 'none' }}>
                                <Typography variant="body1" color="secondary" fontSize={14} fontWeight={600}>
                                    Sign up
                                </Typography>
                            </Link>
                        </Grid>
                    </Grid>

                    {/* Sign in with Google */}
                    <Divider sx={{ my: 2 }}>OR</Divider>
                    <GoogleSignIn from={from} />
                </Box>
            </Box>
        </Container>
    );
}


// {
//     "error": {
//         "code": 400,
//             "message": "INVALID_PASSWORD",
//                 "errors": [
//                     {
//                         "message": "INVALID_PASSWORD",
//                         "domain": "global",
//                         "reason": "invalid"
//                     }
//                 ]
//     }
// }