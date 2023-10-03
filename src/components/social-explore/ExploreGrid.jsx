import { Box, Typography } from "@mui/material";
import LoadingSpinner from "../utils/LoadingSpinner";
import GridPost from "../shared/GridPost";
import { useQuery } from "@apollo/client";
import { GET_EXPLORE_GRID_POST_LIST } from "../../queries/posts";
import useUser from "../../hooks/useUser";
import ErrorFetchingData from "../utils/ErrorFetchingData";

const ExploreGrid = () => {
    const { _id } = useUser();
    const { data, loading, error } = useQuery(GET_EXPLORE_GRID_POST_LIST, { variables: { userId: _id } })

    return (
        <Box>
            <Typography
                color="textSecondary"
                variant="subtitle2"
                component="h2"
                fontSize={18}
                mb={3}
            >
                Explore
            </Typography>

            {
                error ? <ErrorFetchingData /> :
                    loading ? <LoadingSpinner sx={{ margin: '3rem auto' }} /> :
                        <Box
                            component="article"
                            display="grid"
                            sx={{ gap: { xs: 2, md: 3 }, gridTemplateColumns: { xs: '1fr 1fr', md: '1fr 1fr 1fr' } }}
                        >
                            {data.exploreGridPosts.map(post => <GridPost key={post._id} post={post} />)}
                        </Box>
            }
        </Box>
    );
};


export default ExploreGrid;