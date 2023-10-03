import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { Alert, CircularProgress, InputAdornment } from "@mui/material";
import { useMutation } from "@apollo/client";
import { STORE_USER } from "../mutations/user";
import MyHelmet from "../components/shared/MyHelmet";
import isEmail from 'validator/lib/isEmail';
import { useForm } from "react-hook-form";
import baseUrl from "../baseUrl";

export default function SignUp() {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors, isValid, touchedFields, isValidating } } = useForm({ mode: "onBlur" });
    const { createAccount, logOut, setAccountCreated, setLoading } = useAuth();
    const [StoreUser, { error: storeUserError, loading }] = useMutation(STORE_USER);

    // handle when users click Sign Up button
    const onFormSubmit = async (data) => {
        // trimming, incase user puts extra spaces
        const firstName = data.firstName.trim();
        const lastName = data.lastName.trim();
        const email = data.email.trim().toLowerCase();
        const username = data.username.toLowerCase();
        const password = data.password;

        if (!firstName || !lastName || !email || !password || !username) {
            alert("All fields are required!");
            return;
        }

        try {
            // initiate sign in with Email & Password
            const userCredential = await createAccount(email, password);

            // if success, store new user in the database
            if (userCredential && userCredential.user) {
                const result = await StoreUser({
                    variables: {
                        input: {
                            email, firstName, lastName, username,
                            displayName: firstName + " " + lastName,
                            image: 'https://ucarecdn.com/e89645b6-e6f8-41fd-aa29-2f4b36659a50/profilepic.png',
                            created_at: Date.now(),
                        }
                    }
                })
                if (result?.data?.storeUser?.insertedId) {
                    await logOut();
                    setAccountCreated(true);
                    navigate('/sign-in', { replace: true });
                }
            }
        }
        catch (error) {
            alert(error.message)
        }
        finally {
            setLoading(false); // from authContext //
        }
    };


    return (
        <Container component="main" maxWidth="xs">
            <MyHelmet titled="Sign-up" />
            {storeUserError && <Alert severity="error">{storeUserError.message}</Alert>}
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
                    Sign up
                </Typography>
                <Box
                    component="form"
                    noValidate
                    onSubmit={handleSubmit(onFormSubmit)}
                    sx={{ mt: 3 }}
                >
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            {/* First Name */}
                            <TextField
                                {...register('firstName', {
                                    required: "First name is required",
                                    minLength: { value: 2, message: "Minimum 2 characters" },
                                    maxLength: { value: 15, message: "Maximum 15 characters" },
                                })}
                                error={Boolean(errors.firstName)}
                                helperText={errors.firstName && errors.firstName.message}
                                InputProps={{
                                    endAdornment: (!errors.firstName && touchedFields.firstName) && <ValidIcon />
                                }}
                                fullWidth
                                autoFocus
                                autoComplete="given-name"
                                label="First Name"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            {/* Last Name */}
                            <TextField
                                {...register('lastName', {
                                    required: "Last name is required",
                                    minLength: { value: 2, message: "Minimum 2 characters" },
                                    maxLength: { value: 15, message: "Maximum 15 characters" },
                                })}
                                error={Boolean(errors.lastName)}
                                helperText={errors.lastName && errors.lastName.message}
                                InputProps={{
                                    endAdornment: (!errors.lastName && touchedFields.lastName) && <ValidIcon />
                                }}
                                fullWidth
                                label="Last Name"
                                autoComplete="family-name"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            {/* Username */}
                            <TextField
                                {...register('username', {
                                    required: "Username is required",
                                    minLength: { value: 5, message: "Minimum 5 characters" },
                                    maxLength: { value: 15, message: "Maximum 15 characters" },
                                    pattern: { value: /^[a-zA-Z0-9_.]*$/, message: 'Letters, Numbers, _ and .' },
                                    validate: async (value) => {
                                        const res = await fetch(`${baseUrl}/jwt/is-username-taken/${value}`);
                                        const data = await res.json();
                                        return !data.isUsernameTaken || "Username is already taken";
                                    }
                                })}
                                error={Boolean(errors.username)}
                                helperText={errors.username && errors.username.message}
                                InputProps={{
                                    endAdornment: (!errors.username && touchedFields.username) ? <ValidIcon /> : isValidating ? <ProgressIcon /> : null
                                }}
                                fullWidth
                                label="Username"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            {/* Email */}
                            <TextField
                                {...register('email', {
                                    required: "Email is required",
                                    validate: (inputValue) => isEmail(inputValue) || "Insert a valid email"
                                })}
                                error={Boolean(errors.email)}
                                helperText={errors.email && errors.email.message}
                                InputProps={{
                                    endAdornment: (!errors.email && touchedFields.email) && <ValidIcon />
                                }}
                                fullWidth
                                label="Email Address"
                                autoComplete="email"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            {/* Password */}
                            <TextField
                                {...register('password', {
                                    required: "Password is required",
                                    minLength: { value: 6, message: "Minimum 6 characters" },
                                })}
                                error={Boolean(errors.password)}
                                helperText={errors.password && errors.password.message}
                                InputProps={{
                                    endAdornment: (!errors.password && touchedFields.password) && <ValidIcon />
                                }}
                                fullWidth
                                label="Password"
                                type="password"
                                autoComplete="new-password"
                            />
                        </Grid>
                    </Grid>
                    <Button
                        disabled={!isValid || loading}
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="secondary"
                        sx={{ mt: 2, mb: 1, gap: 1.5, height: '40px' }}
                    >
                        <span>Sign Up</span> 
                    </Button>
                    <Grid container justifyContent="flex-end">
                        <Grid item display="flex" gap="7px">
                            <Typography variant="body1" fontSize={14} sx={{ opacity: '.8' }}>
                                Already have an account?
                            </Typography>
                            <Link to={"/sign-in"} variant="body1" color="secondary" style={{textDecoration: 'none'}}>
                                <Typography variant="body1" color="secondary" fontSize={14} fontWeight={600}>
                                    Sign in
                                </Typography>
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    );
}


const ValidIcon = () => {
    return <InputAdornment position="end">
        <CheckCircleOutlineIcon sx={{ color: '#8aa278' }} />
    </InputAdornment>
}

const ProgressIcon = () => {
    return <InputAdornment position="end">
        <CircularProgress size={25} />
    </InputAdornment>
}