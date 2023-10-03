import { TextField } from "@mui/material";
import { Box, Typography } from "../utils/Imports";
import isMobilePhone from "validator/lib/isMobilePhone";

const EditProfilePhone = ({ boxSettings, register, defaultValue, errors }) => {
    return (
        <Box sx={{ ...boxSettings }}>
            <Typography component="label" htmlFor={'phone'} textAlign="end" mt={1} sx={{ fontSize: { xs: 14, md: 18 } }}>
                Phone
            </Typography>
            <TextField
                fullWidth
                id="phone"
                type="text"
                variant="outlined"
                size='small'
                placeholder="Bangladesh only (+88)"
                defaultValue={defaultValue}
                inputProps={{
                    className: 'editor-input',
                }}
                {...register('phone', {
                    validate: value => value ? (isMobilePhone(value, "bn-BD") || 'Not a valid BD phone number!') : true
                })}
                error={Boolean(errors.phone)}
                helperText={errors.phone && errors.phone.message}
            />
        </Box>
    );
};

export default EditProfilePhone;