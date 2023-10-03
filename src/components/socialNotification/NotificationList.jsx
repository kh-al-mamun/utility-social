import { Avatar, Box, Button, Divider, List, ListItem, ListItemAvatar, ListItemText, Typography } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import { FollowBtn } from "../social-feed/FeedSideSuggestions";
import timeAgo from "../../utils/timeAgo";

const NotificationList = ({ notifications }) => {
    return (
        <Box>
            <List>
                {
                    notifications.map((data, i) => <NotificationListItem key={i} data={data} />)
                }
            </List>
            <Link to={'/social/notification'}>
                <Button variant="text" color="info" fullWidth>
                    Show all
                </Button>
            </Link>
        </Box>
    );
};

const NotificationListItem = ({ data }) => {
    const { type, sender, senderId, post, created_at } = data;

    return (
        <React.Fragment>
            <ListItem sx={{ display: 'grid', gridTemplateColumns: '45px 200px 80px', gap: 1, px: 1 }}>
                <ListItemAvatar>
                    <Link to={`/social/profile/${sender.username}`}>
                        <Avatar alt={sender?.displayName} src={sender?.image} />
                    </Link>
                </ListItemAvatar>
                <ListItemText
                    primary={<Link
                        to={`/social/profile/${sender.username}`}
                        style={fluidLink}
                    >
                        {sender?.displayName}
                    </Link>}
                    secondary={
                        <React.Fragment>
                            <Typography
                                sx={{ display: 'inline' }}
                                component="span"
                                variant="subtitle2"
                                color="text.secondary"
                            >
                                {type === 'LIKE' && `Liked your post. ${timeAgo(created_at)}`}
                                {type === 'FOLLOW' && `Started following you. ${timeAgo(created_at)}`}
                                {/* <br /> */}
                                {/* <span style={{opacity: '.6'}}>{timeAgo(created_at)}</span> */}
                            </Typography>
                            {/* additional texts... */}
                        </React.Fragment>
                    }
                />
                {type === 'FOLLOW' && <FollowBtn profileId={senderId} />}
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
        </React.Fragment>
    )
}

const fluidLink = { textDecoration: 'none', color: 'inherit' }

export default NotificationList;