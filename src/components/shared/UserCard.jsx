import { Avatar, Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const UserCard = ({ user, avatarSize = 40, flexDirection = "row" }) => {
    const { username, image, displayName } = user;

    return (
        <Box display="flex" gap={2} alignItems="center" justifyContent="center" flexDirection={flexDirection}>
            <Link
                to={`/social/profile/${username}`}
            >
                <Avatar
                    alt=""
                    src={image}
                    sx={{ width: avatarSize, height: avatarSize }}
                />
            </Link>

            <Link
                to={`/social/profile/${username}`}
                style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column' }}
            >
                <Typography
                    variant="h6"
                    color="textSecondary"
                    fontSize={18}
                >
                    {username}
                </Typography>
                <Typography
                    variant="p"
                    color="GrayText"
                    fontSize={15.5}
                >
                    {displayName}
                </Typography>
            </Link>
        </Box>
    );
};

export default UserCard;