import { Dialog, DialogActions, DialogTitle, Zoom } from "@mui/material";
import { Button, Box, Divider, Avatar } from "../utils/Imports";
import { useParams } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { UNFOLLOW_USER } from "../../mutations/user";
import useUser from "../../hooks/useUser";
import ErrorFetchingData from "../utils/ErrorFetchingData";
import { GET_PUBLIC_PROFILE } from "../../queries/user";

const UnFollowWarningDialog = ({ image, profileId, open, handleClose }) => {
    const { username } = useParams();
    const { _id, refetch } = useUser();
    const [UnFollowUser, { loading, error }] = useMutation(UNFOLLOW_USER);

    const handleUnfollowUser = async () => {
        await UnFollowUser({
            variables: {
                userId: _id,
                profileId,
                // for deleting notification
                senderId: _id,
                receiverId: profileId,
                type: 'FOLLOW',
            },
            refetchQueries: [GET_PUBLIC_PROFILE]
        })
        refetch();
        if(!error) handleClose();
    }

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            TransitionComponent={Zoom}
        >
            <Box>
                <Avatar src={image} sx={{ width: 100, height: 100, margin: '1rem auto 0' }} />
                <DialogTitle fontSize={17} letterSpacing={1}>
                    Are you sure to Unfollow {username} ?
                    {error && <ErrorFetchingData error={error} message="Some error occurred"/>}
                </DialogTitle>
                <Divider />
                <DialogActions>
                    <Button color="info" fullWidth disabled={loading} onClick={handleClose}>Cancel</Button>
                    <Button color="warning" fullWidth disabled={loading} onClick={handleUnfollowUser}>UnFollow</Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
};

export default UnFollowWarningDialog;