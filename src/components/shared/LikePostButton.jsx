import { IconButton } from "@mui/material";
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import useUser from "../../hooks/useUser";
import { gql, useMutation } from "@apollo/client";
import { LIKE_POST, UNLIKE_POST } from "../../mutations/posts";
import useSnack from "../../hooks/useSnack";
import { useEffect } from "react";

const LikePostButton = ({ postId, likes = [], authorId }) => {
    const { _id } = useUser();
    const { makeSnack } = useSnack();
    const isAlreadyLiked = likes.find(like => like.postLikerId === _id);
    const [LikePost, { loading, error }] = useMutation(LIKE_POST);
    const [UnlikePost, { loading: loading_unlike, error: error_unlike }] = useMutation(UNLIKE_POST);

    // show error message if error happens
    useEffect(() => {
        if (error || error_unlike) {
            makeSnack(error.message || error_unlike.message, 'error')
        }
    }, [error, error_unlike, makeSnack])

    const toggleLike = async () => {
        // unlike mutation & notification delete
        if (isAlreadyLiked) {
            await UnlikePost({
                variables: {
                    likeId: isAlreadyLiked?._id,
                    postLikerId: _id,
                    postId, //to remove notification
                    senderId: _id, //to remove notification
                    type: 'LIKE', //to remove notification
                },
                update: cache => {
                    cache.evict({ id: `Like:${isAlreadyLiked._id}` });
                    cache.gc();
                }
            })
        }

        // like mutation & send notification
        else {
            await LikePost({
                variables: {
                    postId,
                    postLikerId: _id,
                    created_at: Date.now(),
                    newNotification: { //to send notification
                        postId,
                        senderId: _id,
                        receiverId: authorId,
                        created_at: Date.now(),
                        type: "LIKE",
                    }
                },
                update: (cache, { data: { likePost } }) => {
                    cache.modify({
                        id: `Post:${postId}`,
                        fields: {
                            likes(existingLikes) {
                                cache.writeFragment({
                                    id: `Post:${postId}`,
                                    fragment: gql`
                                        fragment AddLike on Post {
                                            likes {
                                                _id,
                                                postLikerId
                                            }
                                        }
                                    `,
                                    data: {
                                        likes: [...existingLikes, likePost.like]
                                    }
                                })
                            }
                        }
                    })
                }
            })
        }
    }

    return (
        <IconButton
            onClick={() => toggleLike()}
            disabled={loading || loading_unlike}
            edge="start"
            size="large"
        >
            {
                isAlreadyLiked ?
                    <FavoriteIcon fontSize="inherit" /> :
                    <FavoriteBorderIcon fontSize="inherit" />
            }
        </IconButton>
    )
}

export default LikePostButton;