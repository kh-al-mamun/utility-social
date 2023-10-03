import { Box, Button, IconButton, Typography, Link } from '../utils/Imports';
import SettingsIcon from '@mui/icons-material/Settings';
import HiddenDown from '../utils/HiddenDown';
import { useState } from 'react';
import AccountOptions from './AccountOptions';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import UnFollowWarningDialog from './UnFollowWarningDialog';
import { useMutation } from '@apollo/client';
import { FOLLOW_USER } from '../../mutations/user';
import useUser from '../../hooks/useUser';
import useSnack from '../../hooks/useSnack';
import { GET_PUBLIC_PROFILE, GET_USER } from '../../queries/user';

const SideUsername = ({ username, isOwner, profileId, isAlreadyFollowing, image }) => {
    const [showOptionsDialog, setOptionsDialog] = useState(false);

    return (
        <>
            <Box
                display="flex"
                alignItems="center"
                sx={{ gap: { xs: .5, sm: 1, md: 2 } }}
            >
                <Typography
                    component="h1"
                    sx={{
                        fontSize: { xs: '1.3rem', sm: '1.8rem', md: '2.2rem' }
                    }}
                >
                    {username}
                </Typography>

                <HiddenDown breakpoint='md'>
                    <EditProfileOrFollowButton
                        isOwner={isOwner}
                        profileId={profileId}
                        isAlreadyFollowing={isAlreadyFollowing}
                        image={image}
                    />
                </HiddenDown>

                {isOwner && (
                    <IconButton size='large' onClick={() => setOptionsDialog(true)}>
                        <SettingsIcon fontSize='inherit' />
                    </IconButton>
                )}
            </Box>

            <HiddenDown breakpoint='md' up>
                <EditProfileOrFollowButton
                    isOwner={isOwner}
                    profileId={profileId}
                    isAlreadyFollowing={isAlreadyFollowing}
                    image={image}
                    fullWidth
                />
            </HiddenDown>

            <AccountOptions open={showOptionsDialog} handleClose={() => setOptionsDialog(false)} />
        </>
    );
};


const EditProfileOrFollowButton = ({ isOwner, isAlreadyFollowing, profileId, image, fullWidth = false }) => {
    const { _id } = useUser();
    const { makeSnack } = useSnack();
    const [showUnFollowDialog, setUnFollowDialog] = useState(false);
    const [FollowUser, { loading, error }] = useMutation(FOLLOW_USER);
    const handleFollowUser = async () => {
        await FollowUser({
            variables: {
                newFollow: {
                    created_at: Date.now(),
                    userId: _id,
                    profileId,
                },
                newNotification: {
                    senderId: _id,
                    receiverId: profileId,
                    created_at: Date.now(),
                    type: 'FOLLOW'
                },
            },
            refetchQueries: [GET_PUBLIC_PROFILE, GET_USER]
        })
        if (error) makeSnack(error.message, 'error');
    }

    if (!isOwner) {
        return (
            <Box display='flex' gap={1}>
                <Button
                    onClick={() => { isAlreadyFollowing ? setUnFollowDialog(true) : handleFollowUser() }}
                    endIcon={isAlreadyFollowing && <KeyboardArrowDownIcon />}
                    sx={{ textTransform: 'none', mt: {xs: .3, md: 0} }}
                    disabled={loading}
                    variant='outlined'
                    color='info'
                >
                    {isAlreadyFollowing ? 'UnFollow' : 'Follow'}
                </Button>
                <UnFollowWarningDialog
                    image={image}
                    profileId={profileId}
                    open={showUnFollowDialog}
                    handleClose={() => setUnFollowDialog(false)}
                />
            </Box>
        )
    }

    return (
        <Button
            variant='outlined'
            color='info'
            sx={{ height: '35px' }}
            fullWidth={fullWidth}
            style={{ marginTop: fullWidth ? '7px' : '0px' }}
        >
            <Link to={'/social/account/edit'} style={{ color: 'inherit', textDecoration: 'none' }}>
                Edit Profile
            </Link>
        </Button>
    )
}

export default SideUsername;