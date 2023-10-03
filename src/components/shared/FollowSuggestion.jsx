import { Card, Paper, Typography } from "@mui/material";
import LoadingSpinner from "../utils/LoadingSpinner";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import UserCard from "./UserCard";
import { FollowBtn } from "../social-feed/FeedSideSuggestions";
import { useQuery } from "@apollo/client";
import { FOLLOW_SUGGESTION } from "../../queries/user";
import useUser from "../../hooks/useUser";
import ErrorFetchingData from "../utils/ErrorFetchingData";

const FollowSuggestion = ({ alterHeadline = false, paperStyles = {} }) => {
    const { _id } = useUser();
    const { data, loading, error } = useQuery(FOLLOW_SUGGESTION, { variables: { userId: _id }, fetchPolicy: 'no-cache' });

    return (
        <Paper variant="outlined" sx={{ px: 4, py: 2, ...paperStyles }}>
            <Typography
                color="textSecondary"
                variant="subtitle2"
                component="h2"
                fontSize={alterHeadline ? 18 : 15}
                ml={alterHeadline ? -3 : -2}
                mb={3}
            >
                {alterHeadline ? "Discover people" : "Suggestions for you"}
            </Typography>
            {
                error ? <ErrorFetchingData /> :
                    loading ? (
                        <LoadingSpinner />
                    ) : (
                        <Slider {...sliderSettings} >
                            {data.followSuggestion.map(person => <FollowSuggestionsItem key={person._id} person={person} />)}
                        </Slider>
                    )
            }
        </Paper>
    );
};

const FollowSuggestionsItem = ({ person }) => {
    return (
        <Card sx={{ display: "flex", flexDirection: "column", gap: 3, alignItems: "center", py: 2, mx: 1 }}>
            <UserCard user={person} avatarSize={60} flexDirection="column" />
            <FollowBtn profileId={person._id} />
        </Card>
    )
}

// Settings for the react-slick Slider
const sliderSettings = {
    arrows: true,
    infinite: false,
    dots: false,
    swipeToSlide: true,
    touchMove: true,
    touchThreshold: 1000,
    speed: 700,
    slidesToShow: 3,
    slidesToScroll: 1,
    centerPadding: "25px",
    responsive: [
        {
            breakpoint: 700,
            settings: {
                slidesToScroll: 2,
                slidesToShow: 2,
            }
        },
        {
            breakpoint: 500,
            settings: {
                slidesToScroll: 1,
                slidesToShow: 1,
            }
        },
    ]
}

export default FollowSuggestion;