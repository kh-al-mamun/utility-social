import { Box, Button, CircularProgress, Paper, Typography } from "@mui/material";
import UserCard from "../shared/UserCard";
import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { FOLLOW_USER, UNFOLLOW_USER } from "../../mutations/user";
import useSnack from "../../hooks/useSnack";
import { FOLLOW_SUGGESTION, GET_PUBLIC_PROFILE } from "../../queries/user";
import useUser from "../../hooks/useUser";
import ErrorFetchingData from "../utils/ErrorFetchingData";

const FeedSideSuggestions = ({ side = false }) => {
    const { _id } = useUser();
    const { data, loading, error } = useQuery(FOLLOW_SUGGESTION, { variables: { userId: _id }, fetchPolicy: 'no-cache' });

    return (
        <Paper sx={{ p: 1.5 }}>
            <Typography
                variant="h6"
                gutterBottom
                color="textSecondary"
                mb={2}
            >
                Suggestions for you
            </Typography>

            {
                error ? <ErrorFetchingData /> :
                    loading ?
                        <CircularProgress
                            disableShrink
                            color="secondary"
                            size={30}
                            sx={{ margin: '0 auto', display: 'block' }}
                        /> :
                        data.followSuggestion.map(person => <SideSuggestionList key={person._id} person={person} side={side} />)
            }
        </Paper>
    );
};


const SideSuggestionList = ({ person }) => {
    return (
        <Box
            my={1.5}
            display="flex"
            justifyContent="space-between"
        >
            <UserCard user={person} />
            <FollowBtn
                profileId={person._id}
                followVariant="text"
                followingVariant="text"
            />
        </Box>
    )
}

export const FollowBtn = ({ profileId, followVariant = "contained", followingVariant = "outline" }) => {
    const { makeSnack } = useSnack();
    const { _id: userId, refetch, followingAggregate } = useUser();
    const isAlreadyFollowing = followingAggregate.following.map(f => f.profileId).some(f_id => f_id === profileId);
    const [following, setFollowing] = useState(isAlreadyFollowing);
    const [FollowUser, { loading, error }] = useMutation(FOLLOW_USER);
    const [UnFollowUser, { loading: loading_unfollow, error: error_unfollow }] = useMutation(UNFOLLOW_USER);

    const handleFollowUser = async () => {
        await FollowUser({
            variables: {
                newFollow: {
                    created_at: Date.now(),
                    userId,
                    profileId,
                },
                newNotification: {
                    senderId: userId,
                    receiverId: profileId,
                    created_at: Date.now(),
                    type: 'FOLLOW'
                }
            },
            refetchQueries: [GET_PUBLIC_PROFILE]
        })
        if (error) makeSnack(error.message, 'error');
        else {
            refetch();
            setFollowing(true)
        }
    }

    const handleUnfollowUser = async () => {
        await UnFollowUser({
            variables: {
                userId,
                profileId,
                // for deleting notification
                senderId: userId,
                receiverId: profileId,
                type: 'FOLLOW',
            },
            refetchQueries: [GET_PUBLIC_PROFILE]
        })
        if (error_unfollow) makeSnack(error_unfollow.message, 'error');
        else {
            refetch();
            setFollowing(false)
        }
    }


    return (
        <Button
            onClick={following ? handleUnfollowUser : handleFollowUser}
            variant={following ? followingVariant : followVariant}
            sx={{ textTransform: 'none' }}
            disabled={loading || loading_unfollow}
            color="info"
        >
            {following ? "Following" : "Follow"}
        </Button>
    )
}

export default FeedSideSuggestions;