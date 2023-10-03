import { CircularProgress, InputAdornment, TextField } from "@mui/material";
import { Box, Typography, Button } from "../utils/Imports";
import { useForm } from "react-hook-form";
import useUser from "../../hooks/useUser";
import { useApolloClient, useMutation } from "@apollo/client";
import { UPDATE_USER } from "../../mutations/user";
import { GET_USER } from "../../queries/user";
import useSnack from "../../hooks/useSnack";
import baseUrl from "../../baseUrl";

const ChangeUsername = () => {
    const { makeSnack } = useSnack();
    const client = useApolloClient();
    const { _id, username } = useUser();
    const [UpdateUser, { loading }] = useMutation(UPDATE_USER);
    const { register, handleSubmit, formState: { errors, isValid, isValidating, isSubmitting } } = useForm({ mode: 'all' });

    const handleUsernameChange = async (input) => {
        try {
            const result = await UpdateUser({
                variables: {
                    userId: _id,
                    updatedDoc: {username: input.username.toLowerCase()}
                },
                refetchQueries: [GET_USER]
            })
            if (result.data && result.data.updateUser) {
                makeSnack(result.data.updateUser.message, "success");
                setTimeout(() => window.location.reload(), 1500);
                client.resetStore();
            }
        } catch (error) {
            makeSnack(error.message, "error")
        }
    }

    return (
        <Box component="form" onSubmit={handleSubmit(handleUsernameChange)}>
            <Box sx={{ ...boxSettings }}>
                <Box></Box>
                <Box>
                    <Typography variant="subtitle1" color="GrayText">Change Username</Typography>
                    <Typography variant="body1" color="GrayText" fontSize={12}>
                        To keep consistency across the app, username is stored at lowercase format.
                    </Typography>
                </Box>
            </Box>
            <Box sx={{ ...boxSettings }}>
                <Typography component="label" htmlFor={'username'} textAlign="end" mt={1} sx={{ fontSize: { xs: 14, md: 18 } }}>
                    New Username
                </Typography>
                <TextField
                    fullWidth
                    id="username"
                    type="text"
                    variant="outlined"
                    size='small'
                    placeholder={username}
                    inputProps={{
                        className: 'editor-input',
                    }}
                    InputProps={{
                        endAdornment: isValidating && <ProgressIcon />
                    }}
                    {...register('username', {
                        required: "Username is required",
                        minLength: { value: 5, message: "Minimum 5 characters" },
                        maxLength: { value: 15, message: "Maximum 15 characters" },
                        pattern: { value: /^[a-zA-Z0-9_.]*$/, message: 'Letters, Numbers, _ and .' },
                        validate: {
                            isTaken: async (value) => {
                                const res = await fetch(`${baseUrl}/jwt/is-username-taken/${value.toLowerCase() || 'none-'}`);
                                const data = await res.json();
                                return !data.isUsernameTaken || "Username is already taken"
                            }
                        }
                    })}
                    error={Boolean(errors.username)}
                    helperText={errors.username && errors.username.message}
                />
            </Box>
            <Box sx={{ ...boxSettings }}>
                <Box></Box>
                <Button
                    disabled={!isValid || isSubmitting || isValidating || loading}
                    variant="contained"
                    color="secondary"
                    type="submit"
                >
                    Submit
                </Button>
            </Box>
        </Box>
    );
};

const ProgressIcon = () => {
    return <InputAdornment position="end">
        <CircularProgress size={25} />
    </InputAdornment>
}

const boxSettings = {
    display: 'grid',
    gap: { xs: 2, sm: 4 },
    gridTemplateColumns: '1.4fr 4fr',
    mt: 3
}

export default ChangeUsername;