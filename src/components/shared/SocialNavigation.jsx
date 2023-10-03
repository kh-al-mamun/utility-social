import { Badge, Box, Dialog, IconButton, Slide } from "@mui/material";
import ExploreOutlinedIcon from '@mui/icons-material/ExploreOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import WifiChannelIcon from '@mui/icons-material/WifiChannel';
import CloseIcon from '@mui/icons-material/Close';
import HomeIcon from '@mui/icons-material/Home';
import PostAddIcon from '@mui/icons-material/PostAdd';
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import HiddenDown from "../utils/HiddenDown";
import Search from "./Search";
import NotificationTooltip from "../socialNotification/NotificationTooltip";
import AddPost from "./AddPost";
import { useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_NOTIFICATIONS } from "../../queries/posts";
import useUser from "../../hooks/useUser";

const SocialNavigation = ({ onClick, ml = "auto" }) => { //onClick is for handle close menu function from navbar
    const location = useLocation();
    const navigate = useNavigate();
    const { _id, last_notification_checked } = useUser();
    const [showAddPost, setShowAddPost] = useState(false);
    const { data = {} } = useQuery(GET_NOTIFICATIONS, {
        variables: {
            receiverId: _id,
            lastChecked: last_notification_checked,
        },
        pollInterval: 30000,
    });

    const notifications = data.notifications || [];

    return (
        <Box display="flex" justifyContent="center" alignItems="center" flexGrow={1} gap={3} onClick={onClick}>
            <HiddenDown breakpoint="md">
                <Search />
            </HiddenDown>

            <Box display="flex" gap={1.3} mr={2} ml={ml}>
                <HiddenDown breakpoint="md">
                    <IconButton
                        onClick={() => setShowAddPost(true)}
                        size="large"
                        color="secondary"
                        title="Add a post"
                        sx={{ p: 0, "&:hover": { color: '#FFA726' } }}
                    >
                        <PostAddIcon fontSize="large" />
                    </IconButton>
                </HiddenDown>

                <NavLinkBtn to={'/social'} title="Social">
                    <HomeIcon fontSize="large" />
                </NavLinkBtn>

                <NavLinkBtn to={'/social/explore'} title="Explore">
                    <ExploreOutlinedIcon fontSize="large" />
                </NavLinkBtn>

                {/* opens new Notifications in a tooltip for large screen */}
                <HiddenDown breakpoint="md">
                    <NotificationTooltip notifications={notifications}>
                        <Badge color="secondary" badgeContent={notifications.length}>
                            <IconButton
                                onClick={() => navigate('/social/notification')}
                                size="large"
                                color="inherit"
                                sx={{ p: 0, opacity: location.pathname.includes('notification') ? .9 : .5 }}
                            >
                                <FavoriteBorderOutlinedIcon fontSize="large" />
                            </IconButton>
                        </Badge>
                    </NotificationTooltip>
                </HiddenDown>

                {/* take directly to Notification page on small screen */}
                <HiddenDown breakpoint="md" up>
                    <NavLinkBtn to={'/social/notification'}>
                        <Badge color="secondary" badgeContent={notifications.length}>
                            <FavoriteBorderOutlinedIcon fontSize="large" />
                        </Badge>
                    </NavLinkBtn>
                </HiddenDown>

                <NavLinkBtn to={'/'} title="Utility Home">
                    <WifiChannelIcon fontSize="large" />
                </NavLinkBtn>
            </Box>

            {/* Add post modal */}
            <HiddenDown breakpoint="md">
                <Dialog
                    open={showAddPost}
                    // onClose={() => setShowAddPost(false)}
                    TransitionComponent={Slide}
                >
                    <Box width={500} position="relative">
                        <AddPost closeDialog={() => setShowAddPost(false)}/>
                        <IconButton
                            onClick={() => setShowAddPost(false)}
                            color="warning"
                            title="Close"
                            sx={{ position: 'absolute', top: 0, right: 0 }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </Dialog>
            </HiddenDown>
        </Box>
    );
};


const NavLinkBtn = ({ to, children, title }) => {
    return (
        <NavLink
            to={to}
            end={true}
            style={({ isActive }) => isActive ? ({ opacity: '.9', color: 'inherit' }) : ({ opacity: '.5', color: 'inherit' })}
        >
            <IconButton
                size="large"
                color="inherit"
                title={title}
                sx={{ p: 0 }}
            >
                {children}
            </IconButton>
        </NavLink>
    );
};


export default SocialNavigation;