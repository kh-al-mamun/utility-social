import React from "react";
import { Container, Dialog, DialogContent, IconButton, Slide } from "@mui/material";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import FeedPost from "./FeedPost";
import { useQuery } from "@apollo/client";
import { GET_POST } from "../../queries/posts";
import FeedPostSkeleton from "../utils/FeedPostSkeleton";
import ErrorFetchingData from "../utils/ErrorFetchingData";

const GridPostModal = ({ open, handleClose, postId }) => {
    const { data = {}, loading, error } = useQuery(GET_POST, { variables: { postId } });

    return (
        <Dialog
            fullScreen
            open={open}
            onClose={handleClose}
            TransitionComponent={Transition}
        >
            <IconButton onClick={handleClose} sx={{ borderRadius: '0px' }}>
                <KeyboardArrowDownIcon />
            </IconButton>
            <DialogContent>
                <Container>
                    {
                        loading ?
                            <FeedPostSkeleton /> :
                            error ?
                                <ErrorFetchingData error={error}/> :
                                <FeedPost post={data.post} postIndex={0} modalView />
                    }
                </Container>
            </DialogContent>
        </Dialog>
    );
};

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default GridPostModal;