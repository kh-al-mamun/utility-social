import { Box, Typography } from "@mui/material";
import FeedPost from "../components/shared/FeedPost";
import { Link, useParams } from "react-router-dom";
import LoadingSpinner from "../components/utils/LoadingSpinner";
import GridPost from "../components/shared/GridPost";
import { useQuery } from "@apollo/client";
import { GET_POST, GET_PUBLIC_POSTS_LIST } from "../queries/posts";
import FeedPostSkeleton from "../components/utils/FeedPostSkeleton";
import ErrorFetchingData from "../components/utils/ErrorFetchingData";

const SocialPostPage = () => {
    const { postId } = useParams();
    const { data = {}, loading, error } = useQuery(GET_POST, { variables: { postId } });

    if (loading) return <FeedPostSkeleton />
    if(error) return <ErrorFetchingData error={error}/>

    return (
        <Box>
            <FeedPost post={data.post} postIndex={0} modalView />

            <Typography
                color="textSecondary"
                variant="subtitle2"
                component="h2"
                fontSize={18}
                mb={3}
            >
                More post from &nbsp;
                <Typography
                    component="span"
                    color="HighlightText"
                    fontSize={18}
                >
                    <Link to={`/social/profile/${data.post.user.username}`} style={{ color: "inherit", textDecoration: 'none' }}>
                        @{data.post.user.username}
                    </Link>
                </Typography>
            </Typography>

            <MorePostsFromUser username={data.post.user.username} currentPostId={postId}/>
        </Box>
    );
};

const MorePostsFromUser = ({ username, currentPostId }) => {
    const { data = {}, loading, error } = useQuery(GET_PUBLIC_POSTS_LIST, { variables: { username } })

    if(loading) return <LoadingSpinner />
    if(error) return <ErrorFetchingData error={error}/>
    const morePosts = data.publicProfile.posts.filter(post => post._id !== currentPostId);

    return (
        <Box
            component="article"
            display="grid"
            mb={2}
            sx={{ gap: { xs: 2, md: 3 }, gridTemplateColumns: { xs: '1fr 1fr', md: '1fr 1fr 1fr' } }}
        >
            {
                loading ? <LoadingSpinner sx={{ margin: '3rem auto' }} /> :
                   morePosts.map(post => <GridPost key={post._id} post={post} />)
            }
        </Box>
    )
}

export default SocialPostPage;