import { Box, Button, CardActions, CardMedia, Divider, IconButton, Input, Paper, Typography } from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import NotesRoundedIcon from '@mui/icons-material/NotesRounded';
import ShareRoundedIcon from '@mui/icons-material/ShareRounded';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import HTMLEllipsis from 'react-lines-ellipsis/lib/html'
import UserCard from "../shared/UserCard";
import { Link } from "react-router-dom";
import { useState } from "react";

const FeedPost = ({ post }) => {
    const { _id, caption, likes, media, user, comments } = post;
    const [fullCaption, setFullCaption] = useState(false);

    return (
        <Paper sx={{ mb: 10 }}>
            {/* post header */}
            <Box display="flex" justifyContent="space-between" alignItems="center" gap={2} p={1.8}>
                <UserCard user={user} />
                <IconButton aria-label="settings" edge="end">
                    <MoreVertIcon />
                </IconButton>
            </Box>

            {/* post images */}
            <Box>
                <CardMedia component="img" image={media} />
            </Box>

            {/* post body */}
            <Box>
                {/* action buttons */}
                <CardActions>
                    <Box px={.7}>
                        <LikeButton />
                        <Link to={`/social/p/${_id}`}>
                            <IconButton size="large">
                                <NotesRoundedIcon fontSize="inherit" />
                            </IconButton>
                        </Link>
                        <IconButton size="large">
                            <ShareRoundedIcon fontSize="inherit" />
                        </IconButton>
                    </Box>
                    <SaveButton />
                </CardActions>

                {/* likes */}
                <Typography variant="subtitle2" px={1.8}>
                    {likes < 2 ? `${likes} like` : `${likes} likes`}
                </Typography>

                {/* caption with ellipsis TODO: set actual userId */}
                <Typography component="div" variant="body2" px={1.8}>
                    <Link
                        to={`/social/profile/userId`}
                        style={commentUserNameStyle}
                    >
                        {user?.name} {" "}
                    </Link>
                    {
                        fullCaption ?
                            <Typography
                                dangerouslySetInnerHTML={{ __html: caption }}
                                component="span"
                            /> :
                            <>
                                <HTMLEllipsis
                                    unsafeHTML={caption}
                                    maxLine='2'
                                    ellipsis='...'
                                    basedOn='letters'
                                    component="span"
                                    style={{ display: 'inline-block' }}
                                />
                                {" "}
                                <button
                                    onClick={() => setFullCaption(true)}
                                    style={showMoreBtnStyles}
                                >
                                    expand
                                </button>
                            </>
                    }
                </Typography>

                {/* show all comments button */}
                <Box px={1.8}>
                    {
                        comments.length > 0 ?
                            <button style={showMoreBtnStyles}>
                                View all {comments.length} comments
                            </button> :
                            <p style={{ ...showMoreBtnStyles, cursor: 'auto' }}>No comments yet</p>
                    }
                </Box>

                {/* display comments TODO: put commentator's userId and name */}
                <Box px={1.8}>
                    <Typography mb={1}>
                        <Link
                            to={`/social/profile/userId`}
                            style={commentUserNameStyle}
                        >
                            Name here {" "}
                        </Link>
                        <Typography component="span" variant="body2">
                            comment content goes here
                        </Typography>
                    </Typography>
                </Box>
            </Box>

            {/* post footer/add comment */}
            <Divider sx={{ mt: 2 }} />
            <AddPost />
        </Paper>
    );
};


const AddPost = () => {
    const [comment, setComment] = useState('');

    return (
        <Box p={1.8} sx={{ display: { md: 'flex' } }}>
            <Input
                onInput={(e) => setComment(e.target.value)}
                placeholder="Write a comment"
                disableUnderline
                multiline
                fullWidth
                value={comment}
                maxRows={3}
            />
            <Button
                disabled={comment.trim().length === 0}
                sx={{ marginRight: '-15px' }}
            >
                Post
            </Button>
        </Box>
    )
}

const LikeButton = () => {
    const [liked, setLiked] = useState(false);
    const toggleLike = async (current) => {
        setLiked(!current)
    }

    return (
        <IconButton onClick={() => toggleLike(liked)} edge="start" size="large">
            {
                liked ?
                    <FavoriteIcon fontSize="inherit" /> :
                    <FavoriteBorderIcon fontSize="inherit" />
            }
        </IconButton>
    )
}

const SaveButton = () => {
    const [saved, setSaved] = useState(false);
    const toggleSave = async (current) => {
        setSaved(!current)
    }

    return (
        <IconButton onClick={() => toggleSave(saved)} edge="end" size="large" sx={{ ml: "auto" }}>
            {
                saved ?
                    <BookmarkIcon fontSize="inherit" /> :
                    <BookmarkBorderIcon fontSize="inherit" />
            }
        </IconButton>
    )
}

const showMoreBtnStyles = {
    background: 'transparent',
    color: 'inherit',
    opacity: .7,
    border: 'transparent',
    cursor: 'pointer',
    fontSize: 'inherit',
    fontFamily: 'inherit'
}

const commentUserNameStyle = {
    textDecoration: 'none',
    fontWeight: '600',
    color: 'inherit',
    fontSize: '1rem',
    opacity: .8
}

export default FeedPost;