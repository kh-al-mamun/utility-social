import { Box, CardActions, CardMedia, Divider, IconButton, Paper, Typography, useMediaQuery } from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import NotesRoundedIcon from '@mui/icons-material/NotesRounded';
import ShareRoundedIcon from '@mui/icons-material/ShareRounded';
import HTMLEllipsis from 'react-lines-ellipsis/lib/html';
import UserCard from "./UserCard";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import FollowSuggestion from "./FollowSuggestion";
import OptionsDialog from "./OptionsDialog";
import AddComment from "./AddComment";
import LikePostButton from "./LikePostButton";
import SavePostButton from "./SavePostButton";
import { useInView } from "react-intersection-observer";
import timeAgo from "../../utils/timeAgo";
import { useQuery } from "@apollo/client";
import { COMMENTS_BY_POST_ID } from "../../queries/posts";

const modalViewStyles = { my: 5, display: 'grid', gridTemplateColumns: { md: '2fr 1.2fr' } }

const FeedPost = ({ post, postIndex, modalView = false }) => {
    const { ref, inView } = useInView({threshold: .7});
    const [fullCaption, setFullCaption] = useState(false);
    const [showAllComments, setShowAllComments] = useState(false);
    const [showOptionsDialog, setOptionsDialog] = useState(false);
    const isBigScreen = useMediaQuery(theme => theme.breakpoints.up('md'));
    const { _id, caption, media, likes, user, created_at, userId: authorId } = post;
    const { data, loading: loading_comments, error: error_comments, refetch, startPolling, stopPolling } = useQuery(COMMENTS_BY_POST_ID, {
        variables: { postId: _id },
    });
    const likesCount = likes?.length;
    const comments = data?.commentsByPostId || [];
    useEffect(() => {
        if (caption && caption.length < 51) setFullCaption(true)
    }, [caption])

    // keep refetching comments if only the post is inView
    useEffect(() => {
        if(inView) startPolling(15000) // every 15seconds
        else stopPolling();
    }, [inView, startPolling, stopPolling])

    return (
        <>
            <Paper
                sx={(isBigScreen && modalView) ? { ...modalViewStyles, height: '85vh' } :
                    modalView ? { ...modalViewStyles } : { my: 10 }}
                style={postIndex === 0 ? { marginTop: '0px' } : null}
                ref={ref}
            >
                {/* post header when not in modalView*/}
                {
                    !modalView && (
                        <Box display="flex" justifyContent="space-between" alignItems="center" gap={2} p={1.8}>
                            <UserCard user={user} />
                            <IconButton onClick={() => setOptionsDialog(true)} aria-label="settings" edge="end">
                                <MoreVertIcon />
                            </IconButton>
                            {/* Options dialog */}
                            <OptionsDialog
                                open={showOptionsDialog}
                                onClose={() => setOptionsDialog(false)}
                                postId={_id}
                                authorId={authorId}
                                username={user.username}
                            />
                        </Box>
                    )
                }

                {/* post images */}
                <Box
                    className="micro-scrollbar"
                    sx={
                        (isBigScreen && modalView) ?
                            { m: .5, mr: 0, display: 'grid', placeItems: 'center', borderRight: '1px solid #292323', maxHeight: '84vh', overflow: 'auto' } :
                            (!isBigScreen && modalView) ?
                                { m: .5, mr: 0, maxHeight: '70vh', overflow: 'auto'  } :
                                modalView ? {m: .5, mr: 0} :
                                { maxHeight: '84vh', overflow: 'auto' }
                    }
                >
                    {/* <CardMedia component="img" image={media[0].url} /> */}
                    {media.map(img => <CardMedia key={img.asset_id} component='img' image={img.url}/>)}
                </Box>

                {/* post body */}
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    {/* post header on modal view */}
                    {
                        modalView && (
                            <>
                                <Box display="flex" justifyContent="space-between" alignItems="center" gap={2} p={1.8}>
                                    <UserCard user={user} />
                                    <IconButton onClick={() => setOptionsDialog(true)} aria-label="settings" edge="end">
                                        <MoreVertIcon />
                                    </IconButton>
                                    {/* Options dialog */}
                                    <OptionsDialog
                                        open={showOptionsDialog}
                                        onClose={() => setOptionsDialog(false)}
                                        postId={_id}
                                        authorId={authorId}
                                        username={user.username}
                                    />
                                </Box>
                                <Divider />
                            </>
                        )
                    }
                    {/* action buttons - like, save, share */}
                    <CardActions sx={{ pb: 0 }}>
                        <Box px={.7}>
                            <LikePostButton likes={likes} postId={_id} authorId={authorId} />
                            {!modalView && <Link to={`/social/p/${_id}`}>
                                <IconButton size="large">
                                    <NotesRoundedIcon fontSize="inherit" />
                                </IconButton>
                            </Link>}
                            <IconButton size="large">
                                <ShareRoundedIcon fontSize="inherit" />
                            </IconButton>
                        </Box>
                        <SavePostButton postId={_id} />
                    </CardActions>

                    {/* likes and creation time -visual */}
                    <Typography variant="subtitle2" px={1.8} pb={1} display="flex" gap={2} justifyContent="space-between" color="gray">
                        {likesCount < 2 ? `${likesCount} like` : `${likesCount} likes`}
                        <span>{timeAgo(created_at)}</span>
                    </Typography>

                    <Box sx={{ maxHeight: '500px', overflowX: 'hidden', overflowY: 'auto' }}>
                        {/* caption with ellipsis */}
                        <Typography component="div" variant="body2" px={1.8}>
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
                                        <button
                                            onClick={() => setFullCaption(true)}
                                            style={showMoreBtnStyles}
                                        >
                                            expand
                                        </button>
                                    </>
                            }
                        </Typography>

                        {/* display comments */}
                        <Box px={1.8} mt={3}>
                            {
                                loading_comments ?
                                    <p style={{ color: 'gray', fontSize: '12px' }}>Loading comments...</p> :
                                    error_comments ?
                                        <p>Error fetching comments</p> :
                                        (showAllComments && comments) ?
                                            comments.map(comment => <Comment key={comment._id} comment={comment} />) :
                                            (!showAllComments && comments) ?
                                                comments.slice(0, 1).map(comment => <Comment key={comment._id} comment={comment} />) :
                                                null
                            }
                        </Box>

                        {/* show all comments button */}
                        <Box px={1.8}>
                            {
                                (comments.length > 1 && !showAllComments) ?
                                    <button style={showMoreBtnStyles} onClick={() => setShowAllComments(prev => !prev)}>
                                        View all {comments.length} comments
                                    </button> :
                                    (comments.length === 0 && !loading_comments) ?
                                        <p style={{ ...showMoreBtnStyles, cursor: 'auto' }}>No comments yet</p> :
                                        null
                            }
                        </Box>
                    </Box>

                    {/* post footer/add comment */}
                    <Box mt={'auto'}>
                        <Divider sx={{ mt: 2 }} />
                        <AddComment postId={_id} refetch={refetch} />
                    </Box>
                </Box>
            </Paper>

            {/* shows follow suggestion on feed post after second feed */}
            {postIndex === 1 && <FollowSuggestion />}
        </>
    );
};

const Comment = ({ comment }) => {
    const { user: commentAuthor, caption, created_at } = comment;

    return (
        <Box>
            <Typography mb={1.5} color="GrayText">
                <Link
                    to={`/social/profile/${commentAuthor.username}`}
                    style={commentUserNameStyle}
                >
                    {commentAuthor.displayName} {" "}
                </Link>
                <Typography component="span" variant="body1" color="#b5b5bb">
                    {caption}
                </Typography>
                <br />
                {timeAgo(created_at)}
            </Typography>
        </Box>
    )
}


const showMoreBtnStyles = {
    background: 'transparent',
    color: 'inherit',
    opacity: .7,
    border: 'transparent',
    cursor: 'pointer',
    fontSize: 'inherit',
    fontFamily: 'inherit',
    padding: '0px'
}

const commentUserNameStyle = {
    textDecoration: 'none',
    fontWeight: '500',
    color: '#a0a0ee',
    fontSize: '1rem',
    opacity: .8
}

export default FeedPost;