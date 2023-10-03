import { Box } from "@mui/material";
import FollowSuggestion from "../components/shared/FollowSuggestion";
import ExploreGrid from "../components/social-explore/ExploreGrid";
import MyHelmet from "../components/shared/MyHelmet";

const ExplorePage = () => {
    return (
        <Box>
            <MyHelmet titled="Explore" />
            {/* follow suggestions, will not be rendered in small screen */}
            <FollowSuggestion
                alterHeadline
                paperStyles={{ px: 3, border: 'none' }}
            /> <br /> <br />

            {/* explore grid */}
            <ExploreGrid />
        </Box>
    );
};

export default ExplorePage;