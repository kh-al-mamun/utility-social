import { Box, Button, CircularProgress } from "@mui/material";
import MyHelmet from "../components/shared/MyHelmet";
import HiddenDown from "../components/utils/HiddenDown";
import FeedSideSuggestions from "../components/social-feed/FeedSideSuggestions";
import UserCard from "../components/shared/UserCard";
import React, { useEffect, useState } from "react";
import FeedPostSkeleton from "../components/utils/FeedPostSkeleton";
import AddPost from "../components/shared/AddPost";
import { useApolloClient, useQuery } from "@apollo/client";
import { GET_FEED } from "../queries/posts";
import useUser from "../hooks/useUser";
import LoadingSpinner from "../components/utils/LoadingSpinner";
import RefreshIcon from '@mui/icons-material/Refresh';
import { useInView } from "react-intersection-observer";
import ErrorFetchingData from "../components/utils/ErrorFetchingData";
import NotFollowingAnyone from "../components/social-feed/NotFollowingAnyone";
// import FeedPost from "../components/shared/FeedPost";
const FeedPost = React.lazy(() => import("../components/shared/FeedPost"))

const SocialFeed2 = () => {
    const { ref, inView } = useInView();
    const client = useApolloClient();
    const { _id, userInfo, followingAggregate } = useUser();
    const [noMorePost, setNoMorePost] = useState(false);
    const { data = {}, loading, error, refetch, fetchMore } = useQuery(GET_FEED, {
        variables: { userId: _id }
    });
    const notFollowing = followingAggregate.following.length === 0;

    useEffect(() => {
        if (!inView || !data.feedPosts || noMorePost || notFollowing) return;
        const lastPostCreatedAt = data.feedPosts.feeds[data.feedPosts.feeds.length - 1]?.created_at;
        fetchMore({
            variables: { userId: _id, createdAt: lastPostCreatedAt },
            updateQuery: (prev, { fetchMoreResult }) => {
                if (fetchMoreResult.feedPosts.length === 0) setNoMorePost(true);
                return {feed: [...prev.feedPosts.feeds, ...fetchMoreResult.feedPosts.feeds]}
            }
        })
    }, [data, inView, fetchMore, _id, noMorePost, notFollowing, client])

    return (
        <Box sx={{ display: { md: 'grid' }, gridTemplateColumns: '4fr 2fr', gap: 5 }}>
            <MyHelmet titled="Feed" />
            {/* feeds */}
            <Box sx={{ width: '100%', overflow: 'hidden' }}>
                <HiddenDown breakpoint="md" up>
                    <AddPost /> <br />
                </HiddenDown>
                <Button onClick={() => refetch()} sx={{ mb: 2, px: 0, display: 'flex', gap: 1 }}>
                    <RefreshIcon />
                    Refresh Feed
                </Button>
                {
                    error ? <ErrorFetchingData /> :
                        loading ? <LoadingSpinner /> :
                            notFollowing ? <NotFollowingAnyone /> :
                                data.feedPosts.feeds.map((post, i) => <React.Suspense key={i} fallback={<FeedPostSkeleton />}>
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


export default SocialFeed2;