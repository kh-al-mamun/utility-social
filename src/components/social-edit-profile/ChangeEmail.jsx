import { useForm } from "react-hook-form";
import { Box, Typography, Button } from "../utils/Imports";
import { Alert, TextField } from "@mui/material";
import useSnack from "../../hooks/useSnack";
import useUser from "../../hooks/useUser";
import isEmail from 'validator/lib/isEmail';
import useAuth from "../../hooks/useAuth";
import { useApolloClient, useMutation } from "@apollo/client";
import { UPDATE_USER } from "../../mutations/user";

const ChangeEmail = () => {
    const { makeSnack } = useSnack();
    const { _id, email } = useUser();
    const client = useApolloClient();
    const { changeEmail } = useAuth();
    const [UpdateUser, { loading }] = useMutation(UPDATE_USER);
    const { register, handleSubmit, formState: { errors, isValid, isValidating, isSubmitting } } = useForm({ mode: 'onBlur' });

    const handleEmailChange = async (input) => {
        const newEmail = input.email.toLowerCase();
        if (email === newEmail) {
            makeSnack("This is your current email!", "info");
            return;
        }
        try {
            await changeEmail(newEmail);
            const result = await UpdateUser({
                variables: {
                    userId: _id,
                    updatedDoc: { email: newEmail }
                }
            })
            if (result.data && result.data.updateUser) {
                makeSnack("Email changed", "success");
                setTimeout(() => window.location.reload(), 1500);
                client.resetStore();
            }
        } catch (error) {
            console.log(error);
            makeSnack(error.message, "error")
        }
    }

    return (
        <Box component="form" onSubmit={handleSubmit(handleEmailChange)}>
            <Alert severity="error">
                Experimental feature! Use at your own risk.
            </Alert>
            <Box sx={{ ...boxSettings }}>
                <Box></Box>
                <Box>
                    <Typography variant="subtitle1" color="GrayText">Change Email</Typography>
                    <Typography variant="body1" color="GrayText" fontSize={12}>
                        You must be recently signed in to be able to change your Email.
                    </Typography>
                </Box>
            </Box>
            <Box sx={{ ...boxSettings }}>
                <Typography component="label" htmlFor={'email'} textAlign="end" mt={1} sx={{ fontSize: { xs: 14, md: 18 } }}>
                    New Email
                </Typography>
                <TextField
                    fullWidth
                    id="email"
                    type="text"
                    variant="outlined"
                    size='small'
                    placeholder={email}
                    inputProps={{
                        className: 'editor-input',
                    }}
                    {...register('email', {
                        required: "Email is required",
                        validate: (inputValue) => isEmail(inputValue) || "Insert a valid email"
                    })}
                    error={Boolean(errors.email)}
                    helperText={errors.email && errors.email.message}
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


const boxSettings = {
    display: 'grid',
    gap: { xs: 2, sm: 4 },
    gridTemplateColumns: '1.4fr 4fr',
    mt: 3
}

export default ChangeEmail;