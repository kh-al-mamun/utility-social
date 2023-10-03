import { Avatar, Box, Divider, List, ListItem, ListItemAvatar, ListItemText, Typography } from "@mui/material";
import { GET_NOTIFICATIONS } from "../queries/posts";
import { useMutation, useQuery } from "@apollo/client";
import useUser from "../hooks/useUser";
import { Link } from "react-router-dom";
import { FollowBtn } from "../components/social-feed/FeedSideSuggestions";
import timeAgo from "../utils/timeAgo";
import LoadingSpinner from "../components/utils/LoadingSpinner";
import { RESET_NOTIFICATION } from "../mutations/posts";
import { useEffect } from "react";
import ErrorFetchingData from "../components/utils/ErrorFetchingData";

const NotificationPage = () => {
    const { _id, refetch } = useUser();
    const { data = {}, loading, error } = useQuery(GET_NOTIFICATIONS, { variables: { receiverId: _id } });
    const [ResetNotification] = useMutation(RESET_NOTIFICATION);

    useEffect(() => {
        (async () => {
            if (data.notifications) {
                await ResetNotification({
                    variables: { userId: _id }
                });
                refetch();
            }
        })()
    }, [ResetNotification, _id, data, refetch])

    return (
        <Box>
            <Typography
                color="textSecondary"
                variant="subtitle2"
                component="h2"
                fontSize={18}
                mb={3}
            >
                All notifications
            </Typography>

            {
                error ? <ErrorFetchingData /> :
                    loading ? <LoadingSpinner /> :
                        <List sx={{
                            maxWidth: 500,
                            mx: 'auto'
                        }}>
                            {data.notifications?.map((data, i) => <NotificationListItem key={i} data={data} />)}
                        </List>
            }

        </Box>
    );
};


const NotificationListItem = ({ data }) => {
    const { type, sender, senderId, post, created_at } = data;

    return (
        <>
            <ListItem sx={{ display: 'grid', gridTemplateColumns: '60px 1fr 80px', px: 1 }}>
                <ListItemAvatar>
                    <Link to={`/social/profile/${sender.username}`}>
                        <Avatar alt={sender?.displayName} src={sender?.image} sx={{ width: 45, height: 45 }} />
                    </Link>
                </ListItemAvatar>
                <ListItemText
                    primary={<Link to={`/social/profile/${sender.username}`} style={fluidLink}>{sender?.displayName}</Link>}
                    secondary={
                        <>
                            <Typography
                                sx={{ display: 'inline' }}
                                component="span"
                                variant="body2"
                                color="text.secondary"
                            >
                                {type === 'LIKE' && `Liked your post. ${timeAgo(created_at)}`}
                                {type === 'FOLLOW' && `Started following you. ${timeAgo(created_at)}`}
                            </Typography>
                            {/* additional texts... */}
                        </>
                    }
                />
                {type === 'FOLLOW' && <FollowBtn variant="outlined" profileId={senderId}/>}
                {(type === 'LIKE' || type === 'COMMENT') && (
                    <Link to={`/social/p/${post._id}`} style={fluidLink}>
                        <img
                            alt=""
                            src={post?.media[0]?.url}
                            style={{ width: '100%' }}
                        />
                    </Link>
                )}
            </ListItem>
            <Divider variant="middle" component="li" />
        </>
    )
}

const fluidLink = { textDecoration: 'none', color: 'inherit', display: 'block', marginLeft: 'auto' }

export default NotificationPage;