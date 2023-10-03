import { Box, Button, CircularProgress } from "@mui/material";
import MyHelmet from "../components/shared/MyHelmet";
import HiddenDown from "../components/utils/HiddenDown";
import FeedSideSuggestions from "../components/social-feed/FeedSideSuggestions";
import UserCard from "../components/shared/UserCard";
import React, { useEffect, useState } from "react";
import FeedPostSkeleton from "../components/utils/FeedPostSkeleton";
import AddPost from "../components/shared/AddPost";
import { useQuery } from "@apollo/client";
import { GET_FEED_POSTS } from "../queries/posts";
import useUser from "../hooks/useUser";
import LoadingSpinner from "../components/utils/LoadingSpinner";
import RefreshIcon from '@mui/icons-material/Refresh';
import { useInView } from "react-intersection-observer";
import ErrorFetchingData from "../components/utils/ErrorFetchingData";
import NotFollowingAnyone from "../components/social-feed/NotFollowingAnyone";
import useSnack from "../hooks/useSnack";
const FeedPost = React.lazy(() => import("../components/shared/FeedPost"))

const SocialFeed = () => {
    const { makeSnack } = useSnack();
    const { ref, inView } = useInView();
    const { _id, userInfo, followingAggregate } = useUser();
    const [feedPosts, setFeedPosts] = useState([]);
    const [noMorePost, setNoMorePost] = useState(false);
    const { data = {}, loading, error, refetch, fetchMore } = useQuery(GET_FEED_POSTS, {
        variables: { userId: _id },
    });
    const notFollowing = followingAggregate.following.length === 0;

    useEffect(() => {
        if (data.feedPosts) setFeedPosts(data.feedPosts)
    }, [data])

    useEffect(() => {
        if (!inView || !data.feedPosts || noMorePost || notFollowing) return;
        const lastPostCreatedAt = feedPosts[feedPosts.length - 1]?.created_at;
        fetchMore({
            variables: { userId: _id, createdAt: lastPostCreatedAt },
            updateQuery: (prev, { fetchMoreResult }) => {
                if (fetchMoreResult.feedPosts.length === 0) setNoMorePost(true);
                setFeedPosts(prev => [...prev, ...fetchMoreResult.feedPosts])
            }
        })
    }, [data, inView, fetchMore, _id, feedPosts, noMorePost, notFollowing]);

    return (
        <Box sx={{ display: { md: 'grid' }, gridTemplateColumns: '4fr 2fr', gap: 5 }}>
            <MyHelmet titled="Feed" />
            {/* feeds */}
            <Box sx={{ width: '100%', overflow: 'hidden' }}>
                <HiddenDown breakpoint="md" up>
                    <AddPost /> <br />
                </HiddenDown>
                <Button
                    sx={{ mb: 2, px: 0, display: 'flex', gap: 1 }}
                    onClick={() => {
                        refetch();
                        makeSnack('Refetching... please wait', 'info', {duration: 7000});
                    }}
                >
                    <RefreshIcon />
                    Refresh Feed
                </Button>
                {
                    error ? <ErrorFetchingData /> :
                        loading ? <LoadingSpinner /> :
                            notFollowing ? <NotFollowingAnyone /> :
                                feedPosts.map((post, i) => <React.Suspense key={i} fallback={<FeedPostSkeleton />}>
                                    <FeedPost post={post} postIndex={i} />
                                </React.Suspense>)
                }

                {!loading && !noMorePost && !notFollowing &&
                    <CircularProgress
                        disableShrink
                        color="secondary"
                        size={30}
                        ref={ref}
                        sx={{ margin: '0 auto 16px', display: 'block' }}
                    />
                }

                {noMorePost && !notFollowing && <p style={{ color: 'gray', textAlign: 'center' }}>You have reached the end.</p>}
            </Box>

            {/* suggestions sidebar */}
            <HiddenDown breakpoint="md">
                <Box>
                    <UserCard avatarSize={50} user={userInfo} /> <br />
                    <FeedSideSuggestions side />
                </Box>
            </HiddenDown>
        </Box>
    );
};


export default SocialFeed;