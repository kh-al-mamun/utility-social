import { useMutation } from "@apollo/client";
import { Box, Button, Input } from "@mui/material";
import { useEffect, useState } from "react";
import { ADD_COMMENT } from "../../mutations/posts";
import useUser from "../../hooks/useUser";
import useSnack from "../../hooks/useSnack";

const AddComment = ({ postId, refetch }) => {
    const { _id } = useUser();
    const { makeSnack } = useSnack();
    const [comment, setComment] = useState('');
    const [AddComment, { loading, error }] = useMutation(ADD_COMMENT);

    useEffect(() => {
        if(error) makeSnack(error.message)
    }, [error, makeSnack])

    const handleAddComment = async () => {
        if (comment.trim().length === 0) return;
        const variables = {
            userId: _id,
            newComment: {
                postId,
                userId: _id,
                created_at: Date.now(),
                caption: comment,
            }
        }
        await AddComment({
            variables,
            // update: (cache, {data: {addComment}}) => {
            //     console.log('comment data', addComment);
            //     cache.modify({
            //         id: `Post:${postId}`,
            //         fields: {
            //             comments(existingComments) {
            //                 cache.writeFragment({
            //                     id: `Post:${postId}`,
            //                     fragment: gql`
            //                         fragment ADD_MY_COMMENT on Post {
            //                             comments {
            //                                 _id,
            //                                 userId,
            //                                 created_at,
            //                                 caption,
            //                                 user,
            //                             }
            //                         }
            //                     `,
            //                     data: [...existingComments, addComment.comment]
            //                 })
            //             }
            //         }
            //     })
            // }
        })
        if (!error) {
            setComment('')
        }
        refetch()
    }

    return (
        <Box p={1.8} sx={{ display: 'flex' }}>
            <Input
                onInput={(e) => setComment(e.target.value)}
                placeholder="Write a comment"
                disableUnderline
                multiline
                fullWidth
                value={comment}
                maxRows={2}
            />
            <Button
                onClick={handleAddComment}
                disabled={comment.trim().length === 0 || loading }
                sx={{ marginRight: '-15px' }}
            >
                Post
            </Button>
        </Box>
    )
}

export default AddComment;