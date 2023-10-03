import { Box, Divider, Typography } from '../utils/Imports';

const StatsCount = ({ sx = {}, postCount, followerCount, followingCount }) => {
    return (
        <>
            <Divider sx={{ mt: 2 }} />
            <Box
                display="flex"
                gap={2}
                sx={{ justifyContent: 'center', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', textAlign: 'center', ...sx }}
            >
                <Typography component='p' fontSize='inherit'>
                    <Typography component='span' fontSize='inherit'>
                        {postCount} &nbsp;
                    </Typography>
                    <Typography color="GrayText" component='span' fontSize='inherit'>
                        Posts
                    </Typography>
                </Typography>

                <Typography component='p' fontSize='inherit'>
                    <Typography component='span' fontSize='inherit'>
                        {followerCount} &nbsp;
                    </Typography>
                    <Typography color="GrayText" component='span' fontSize='inherit'>
                        Followers
                    </Typography>
                </Typography>

                <Typography component='p' fontSize='inherit'>
                    <Typography component='span' fontSize='inherit'>
                        {followingCount} &nbsp;
                    </Typography>
                    <Typography color="GrayText" component='span' fontSize='inherit'>
                        Following
                    </Typography>
                </Typography>
            </Box>
            <Divider sx={{ mb: 1 }} />
        </>
    );
};

export default StatsCount;