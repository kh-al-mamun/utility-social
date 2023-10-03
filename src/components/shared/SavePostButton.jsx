import { IconButton } from "@mui/material";
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import useUser from "../../hooks/useUser";
import { useMutation, useQuery } from "@apollo/client";
import { IS_POST_ALREADY_SAVED, REMOVE_SAVED_POST, SAVE_POST } from "../../mutations/posts";
import useSnack from "../../hooks/useSnack";
import { useEffect } from "react";

const SavePostButton = ({ postId }) => {
    const { _id, refetch } = useUser();
    const { makeSnack } = useSnack();
    const { data = {}, loading, error } = useQuery(IS_POST_ALREADY_SAVED, { variables: { postId, userId: _id } });
    const [SavePost, { loading: loading_save, error: error_save }] = useMutation(SAVE_POST, { refetchQueries: [IS_POST_ALREADY_SAVED] });
    const [RemoveSavedPost, { loading: loading_remove, error: error_remove }] = useMutation(REMOVE_SAVED_POST, { refetchQueries: [IS_POST_ALREADY_SAVED] });

    useEffect(() => {
        if (error_save, error_remove) {
            makeSnack(error_save.message || error_remove.message, 'error')
        }
    }, [error_remove, error_save, makeSnack])

    const toggleSave = async () => {
        if (loading || error) return;
        // remove from save
        if (data.isPostAlreadySaved) {
            await RemoveSavedPost({
                variables: {
                    postId,
                    userId: _id,
                }
            })
            refetch();
        }

        // save post
        else {
            await SavePost({
                variables: {
                    postToSave: {
                        postId,
                        userId: _id,
                        created_at: Date.now(),
                    }
                }
            })
            refetch();
        }
    }

    return (
        <IconButton
            onClick={() => toggleSave()}
            disabled={loading || Boolean(error) || loading_save || loading_remove}
            edge="end"
            size="large"
            sx={{ ml: "auto" }}
        >
            {
                data.isPostAlreadySaved ?
                    <BookmarkIcon fontSize="inherit" /> :
                    <BookmarkBorderIcon fontSize="inherit" />
            }
        </IconButton>
    )
}

export default SavePostButton;