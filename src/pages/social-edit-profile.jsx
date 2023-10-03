import { Box, Button, Drawer, List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import HiddenDown from "../components/utils/HiddenDown";

const EditProfilePage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [showDrawerOnMobile, setShowDrawerOnMobile] = useState(false);
    const handleDrawerToggle = () => setShowDrawerOnMobile(prev => !prev);
    const handleSelected = (path, toggle) => {
        navigate(path);
        if (toggle) handleDrawerToggle();
    };

    return (
        <Box sx={{
            display: { xs: 'block', md: 'grid' },
            gridTemplateColumns: '1fr 3fr',
            border: '1px solid #2E2E2E',
            borderRadius: '2px',
            minHeight: '50vh'
        }}>
            {/* Parament drawer: Only for larger screen */}
            <HiddenDown breakpoint="md">
                <Drawer
                    variant="permanent"
                    PaperProps={{ sx: { position: 'static' } }}
                >
                    <DrawerItems handleSelected={handleSelected} path={location.pathname}/>
                </Drawer>
            </HiddenDown>

            {/* OnCall drawer: for smaller screen */}
            <HiddenDown breakpoint="md" up>
                <Button
                    //this button will open drawer
                    onClick={handleDrawerToggle}
                    variant="contained"
                    color="secondary"
                    fullWidth
                >
                    Show all settings
                </Button>
                <Drawer
                    variant="temporary"
                    open={showDrawerOnMobile}
                    onClose={handleDrawerToggle}
                >
                    <DrawerItems handleSelected={handleSelected} path={location.pathname} toggle />
                </Drawer>
            </HiddenDown>

            {/* Outlet: to render necessary component (settings) */}
            <Box p={3}>
                <Outlet></Outlet>
            </Box>
        </Box>
    );
};

const DrawerItems = ({ handleSelected, path, toggle }) => {
    const pathEnding = path.split('/')[path.split('/').length - 1];

    return (
        <List disablePadding>
            {navItems.map((nav, i) => (
                <ListItem key={i} disablePadding onClick={() => handleSelected(nav.path, toggle)}>
                    <ListItemButton selected={pathEnding === nav.select}>
                        <ListItemText primary={nav.title} />
                    </ListItemButton>
                </ListItem>
            ))}
        </List>
    )
}

const navItems = [
    { title: "Edit Profile", path: '', select: 'edit' },
    { title: "Change Password", path: 'password', select: 'password' },
    { title: "Change Username", path: 'username', select: 'username' },
    { title: "Change Email", path: 'email', select: 'email' },
]

export default EditProfilePage;