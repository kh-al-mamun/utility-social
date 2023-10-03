import { TextField } from "@mui/material";
import { Box, Typography } from "../utils/Imports";

const EditProfileName = ({ boxSettings, register, defaultValue, errors }) => {
    return (
        <Box sx={{ ...boxSettings }}>
            <Typography component="label" htmlFor={'name'} textAlign="end" mt={1} sx={{ fontSize: { xs: 14, md: 18 } }}>
                Name
            </Typography>
            <TextField
                fullWidth
                id="name"
                type="text"
                variant="outlined"
                size='small'
                defaultValue={defaultValue}
                inputProps={{
                    className: 'editor-input',
                }}
                {...register('displayName', {
                    required: 'Name is required',
                    maxLength: { value: 25, message: "Maximum 25 characters" },
                    validate: {
                        onlySpaces: value => !(value.trim().length < 3) || 'Minimum three characters'
                    }
                })}
                error={Boolean(errors.displayName)}
                helperText={errors.displayName && errors.displayName.message}
            />
        </Box>
    );
};

export default EditProfileName;