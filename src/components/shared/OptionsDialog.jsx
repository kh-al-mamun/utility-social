import { Box, Button, Dialog, Divider, Zoom } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import useSnack from "../../hooks/useSnack";
import baseUrl from "../../baseUrl";
import useUser from "../../hooks/useUser";
import { useMutation } from "@apollo/client";
import { UNFOLLOW_USER } from "../../mutations/user";
import DeletePostDialog from "./DeletePostDialog";
import { useState } from "react";
import { GET_PUBLIC_PROFILE, GET_USER } from "../../queries/user";

const OptionsDialog = ({ open, onClose, postId, authorId, username }) => {
    const location = useLocation();
    const { makeSnack } = useSnack();
    const { _id: currentUserId, followingAggregate } = useUser();
    const [UnFollowUser, { loading: loading_unfollow, error: error_unfollow }] = useMutation(UNFOLLOW_USER);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const isAlreadyFollowing = followingAggregate.following.some(f => f.profileId === authorId);
    const isPostRoute = location.pathname.includes('/p/');
    const isOwner = authorId === currentUserId;

    const handleCopyLink = async () => {
        try {
            const linkToCopy = `${baseUrl}/social/p/${postId}`;
            navigator.clipboard.writeText(linkToCopy);
            const copiedLink = await navigator.clipboard.readText();
            if (copiedLink === linkToCopy) {
                makeSnack('Link copied to clipboard.', 'success');
                onClose();
            }
        } catch (error) {
            makeSnack(error.message, 'error');
        }
    }

    const handleUnfollowUser = async () => {
        await UnFollowUser({
            variables: {
                userId: currentUserId,
                profileId: authorId,
                // for deleting notification
                senderId: currentUserId,
                receiverId: authorId,
                type: 'FOLLOW',
            },
            refetchQueries: [GET_PUBLIC_PROFILE, GET_USER]
        })
        if (!error_unfollow) onClose();
    }

    return (
        <Dialog
            open={open}
            onClose={onClose}
            TransitionComponent={Zoom}
        >
            <Box display="grid" flexDirection="column" component="div" sx={{ width: { xs: 280, md: 380 } }}>
                <Button onClick={handleCopyLink} color="warning" sx={btnSx}>
                    Copy Link
                </Button>
                <Divider />

                {
                    isAlreadyFollowing && <>
                        <Button
                            onClick={handleUnfollowUser}
                            disabled={loading_unfollow}
                            sx={btnSx}
                            color="warning"
                        >
                            Unfollow
                        </Button>
                        <Divider />
                    </>
                }

                {
                    isOwner && <>
                        <Button
                            onClick={() => setShowDeleteDialog(true)}
                            sx={btnSx}
                            color="warning"
                        >
                            Delete post
                        </Button>
                        <DeletePostDialog
                            userId={currentUserId}
                            postId={postId}
                            open={showDeleteDialog}
                            handleClose={() => setShowDeleteDialog(false)}
                        />
                        <Divider />
                    </>
                }

                <Link to={isPostRoute ? `/social/profile/${username}` : `/social/p/${postId}`}>
                    <Button color="secondary" fullWidth sx={btnSx}>
                        Go to {isPostRoute ? 'profile' : 'post'}
                    </Button>
                </Link>
                <Divider />

                <Button color="secondary" sx={btnSx}>
                    Share
                </Button>
                <Divider />

                <Button onClick={onClose} color="secondary" sx={btnSx}>
                    Cancel
                </Button>
            </Box>
        </Dialog>
    );
};

const btnSx = { py: 1.5, textTransform: 'none', fontSize: 17.5 }

export default OptionsDialog;