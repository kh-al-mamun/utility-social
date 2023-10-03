import { Alert, FormControlLabel, FormGroup, Switch, TextField } from "@mui/material";
import { Box, Typography, Button } from "../utils/Imports";
import { useForm } from "react-hook-form";
import useSnack from "../../hooks/useSnack";
import useAuth from "../../hooks/useAuth";
import { useState } from "react";

const ChangePassword = () => {
    const { user } = useAuth();
    const { makeSnack } = useSnack();
    const { changePassword } = useAuth();
    const [show, setShow] = useState(false);
    const { register, handleSubmit, formState: { isSubmitting, isValid, isDirty, errors } } = useForm();

    const handleChangePassword = async (input) => {
        const { password, confirmPassword } = input;
        if (password !== confirmPassword) {
            makeSnack("Passwords does not match", "error");
            return;
        }
        try {
            await changePassword(password);
            makeSnack("Password changed", "success");
        } catch (error) {
            makeSnack(error.message, "error");
        }
    }

    const passwordUpdatedAt = user?.reloadUserInfo?.passwordUpdatedAt;

    return (
        <Box component="form" onSubmit={handleSubmit(handleChangePassword)}>
            {passwordUpdatedAt &&
                <Alert severity="info">
                    Password last changed at {new Date(passwordUpdatedAt).toLocaleString()}
                </Alert>
            }

            <Box sx={{ ...boxSettings }}>
                <Box></Box>
                <Box>
                    <Typography variant="subtitle1" color="GrayText">Change Password</Typography>
                    <Typography variant="body1" color="GrayText" fontSize={12}>
                        You must be recently signed in to be able to change your password.
                    </Typography>
                </Box>
            </Box>

            <Box sx={{ ...boxSettings }}>
                <Typography component="label" textAlign="end" mt={1} sx={{ fontSize: { xs: 14, md: 18 } }}>
                    New Password
                </Typography>
                <TextField
                    fullWidth
                    type={show ? 'text' : 'password'}
                    size='small'
                    variant="outlined"
                    inputProps={{
                        className: 'editor-input',
                    }}
                    {...register('password', {
                        required: "New password is required",
                        minLength: { value: 6, message: "Minimum 6 characters" },
                    })}
                    error={Boolean(errors.password)}
                    helperText={errors.password && errors.password.message}
                />
            </Box>
            <Box sx={{ ...boxSettings }}>
                <Typography component="label" textAlign="end" mt={1} sx={{ fontSize: { xs: 14, md: 18 } }}>
                    Confirm Password
                </Typography>
                <TextField
                    fullWidth
                    type={show ? 'text' : 'password'}
                    size='small'
                    variant="outlined"
                    inputProps={{
                        className: 'editor-input',
                    }}
                    {...register('confirmPassword', {
                        required: "Confirm password is required",
                        minLength: { value: 6, message: "Minimum 6 characters" },
                    })}
                    error={Boolean(errors.confirmPassword)}
                    helperText={errors.confirmPassword && errors.confirmPassword.message}
                />
            </Box>

            <Box sx={{ ...boxSettings, mt: 1 }}>
                <Box></Box>
                <FormGroup>
                    <FormControlLabel
                        label="Show password"
                        control={(
                            <Switch
                                checked={show}
                                onChange={() => setShow(prev => !prev)}
                            />
                        )}
                    />
                </FormGroup>
            </Box>
            <Box sx={{ ...boxSettings, mt: 1 }}>
                <Box></Box>
                <Button
                    disabled={!isValid || isSubmitting || !isDirty}
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

export default ChangePassword;