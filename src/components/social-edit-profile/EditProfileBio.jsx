import { TextField } from "@mui/material";
import { Box, Typography } from "../utils/Imports";

const EditProfileBio = ({ boxSettings, register, defaultValue, errors }) => {
    return (
        <Box sx={{ ...boxSettings }}>
            <Typography component="label" htmlFor={'bio'} textAlign="end" mt={1} sx={{ fontSize: { xs: 14, md: 18 } }}>
                Bio
            </Typography>
            <TextField
                id="bio"
                type="text"
                variant="outlined"
                size='medium'
                fullWidth
                multiline
                rows={4}
                defaultValue={defaultValue}
                inputProps={{
                    className: 'editor-input',
                }}
                {...register('bio', {
                    maxLength: {value: 250, message: "Maximum 250 characters"}
                })}
                error={Boolean(errors.bio)}
                helperText={errors.bio && errors.bio.message}
            />
        </Box>
    );
};

export default EditProfileBio;