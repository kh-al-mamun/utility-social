import { Alert, Box, Button, Dialog, DialogActions, DialogTitle, Divider, Zoom } from "@mui/material";
import ErrorFetchingData from "../utils/ErrorFetchingData";
import { useMutation } from "@apollo/client";
import { DELETE_POST } from "../../mutations/posts";
import useSnack from "../../hooks/useSnack";
import { GET_USER } from "../../queries/user";

const DeletePostDialog = ({ open, handleClose, userId, postId }) => {
    const {makeSnack} = useSnack();
    const [DeletePost, { loading, error }] = useMutation(DELETE_POST);

    const handelDeletePost = async () => {
        await DeletePost({
            variables: {
                userId,
                postId,
            },
            refetchQueries: [GET_USER]
        })
        if(!error) {
            handleClose();
            makeSnack('Post deleted', 'success');
            setTimeout(() => window.location.reload(), 500);
        }
    }

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            TransitionComponent={Zoom}
        >
            <Box>
                <DialogTitle fontSize={17} letterSpacing={1}>
                    <p style={{textAlign: 'center'}}>Are you sure?</p>
                    <Alert severity="warning">
                        <u>Warning:</u> This post and all its associated likes and comments will be permanently deleted.
                        If any user have saved this post in the past, that will also be removed.
                        <u>This process can not be undone.</u>
                    </Alert>
                    {error && <ErrorFetchingData error={error} message="Some error occurred" />}
                </DialogTitle>
                <Divider />
                <DialogActions>
                    <Button color="info" fullWidth disabled={loading} onClick={handleClose}>Cancel</Button>
                    <Button color="warning" fullWidth disabled={loading} onClick={handelDeletePost}>Delete</Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
};

export default DeletePostDialog;