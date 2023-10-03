import { TextField } from "@mui/material";
import { Box, Typography } from "../utils/Imports";
import isURL from "validator/lib/isurl";

const EditProfileWebsite = ({ boxSettings, register, defaultValue, errors }) => {
    return (
        <Box sx={{ ...boxSettings }}>
            <Typography component="label" htmlFor={'website'} textAlign="end" mt={1} sx={{ fontSize: { xs: 14, md: 18 } }}>
                Website
            </Typography>
            <TextField
                fullWidth
                id="website"
                type="text"
                variant="outlined"
                size='small'
                defaultValue={defaultValue}
                inputProps={{
                    className: 'editor-input',
                }}
                {...register('website', {
                    validate: value => {
                        if(value) {
                            return isURL(value, {
                                protocols: ['http', 'https'],
                                require_protocol: true,
                            }) || "Invalid URL format!"
                        }
                    }
                })}
                error={Boolean(errors.website)}
                helperText={errors.website && errors.website.message}
            />
        </Box>
    );
};

export default EditProfileWebsite;