import { useState } from "react";
import FavoriteIcon from '@mui/icons-material/Favorite';
import ModeCommentIcon from '@mui/icons-material/ModeComment';
import { Box, Typography } from "@mui/material";
import GridPostModal from "./GridPostModal";

// Although GridPost receives a post through props
// That post does not contain all the information
// Thus it passes only the postId to GridPostModal
// So that GridPostModal can fetch full information.
// This is to reduce initial data size when displaying 
// all the posts of a user in a Grid view.
const GridPost = ({ post }) => {
    const [open, setOpen] = useState(false);
    const [showOverlay, setShowOverlay] = useState(false);

    const handleClose = () => {
        setOpen(false);
    }

    if(!post) return null;

    return (
        <>
            <Box
                sx={{ 
                    position: 'relative', 
                    display: 'grid', 
                    placeItems: 'center', 
                    border: '1px solid #292323',  
                    overflow: 'hidden',
                    height: {xs: 200, md: 300}
                }}
                onMouseEnter={() => setShowOverlay(true)}
                onMouseLeave={() => setShowOverlay(false)}
            >
                <img src={post.media[0].url} alt="" width="100%" />
                {showOverlay && <div
                    onClick={() => setOpen(true)}
                    style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        top: '0',
                        left: '0',
                        background: 'rgba(0, 0, 0, .5)',
                        display: 'flex',
                        justifyContent: 'space-evenly',
                        alignItems: 'center',
                        cursor: 'pointer'
                    }}
                >
                    <Typography
                        display="flex"
                        alignItems="center"
                        variant="subtitle2"
                        fontSize={18}
                        gap={.8}
                    >
                        <span>{post.likesAggregate.count}</span>
                        <FavoriteIcon />
                    </Typography>

                    <Typography
                        display="flex"
                        alignItems="center"
                        variant="subtitle2"
                        fontSize={18}
                        gap={.8}
                    >
                        <span>{post.commentsAggregate.count}</span>
                        <ModeCommentIcon />
                    </Typography>
                </div>}
            </Box>
            <GridPostModal open={open} handleClose={handleClose} postId={post._id}/>
        </>
    );
};

export default GridPost;