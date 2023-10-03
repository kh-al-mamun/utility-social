import { Box, Typography } from '../utils/Imports';

const ProfileBio = ({ sx = {}, displayName, bio, website }) => {
    return (
        <Box
            sx={{ ...sx }}
        >
            <Typography fontSize={18} textTransform="capitalize">
                {displayName}
            </Typography>

            <Typography color="GrayText" marginTop={.5}>
                {bio}
            </Typography>

            <Typography
                color="GrayText"
                marginTop={.5}
                sx={{
                    "&:hover": {color: "Highlight"}
                }}
            >
                <a href={website} target='_blank' rel='noreferrer' style={{ color: 'inherit' }}>{website}</a>
            </Typography>
        </Box>
    );
};

export default ProfileBio;