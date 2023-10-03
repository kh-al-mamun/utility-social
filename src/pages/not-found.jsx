import { AppBar, Box, Toolbar, Typography } from "@mui/material";
import MyHelmet from "../components/shared/MyHelmet";
import WifiChannelIcon from '@mui/icons-material/WifiChannel';
import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <Box textAlign="center">
            <MyHelmet titled={"Page not found"} />
            <AppBar position="static">
                <Link to={'/'} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <Toolbar >
                        <WifiChannelIcon />
                        <Typography
                            variant="h6"
                            noWrap
                            sx={{
                                ml: 1.5,
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                letterSpacing: '.05rem',
                                color: 'inherit',
                                textDecoration: 'none',
                            }}
                        >
                            Utility Social
                        </Typography>
                    </Toolbar></Link>
            </AppBar>

            <Box p={1}>
                <Typography variant="h5" sx={{ marginTop: { xs: 7, md: 12 }, opacity: .8 }}>
                    Sorry, this page isn{"'"}t available.
                </Typography>

                <Typography variant="body1" marginTop={3}>
                    <Typography sx={{ opacity: .8 }} component='span'>
                        The link you followed may be broken, or the page may have been removed.
                    </Typography>
                    <Link to={'/'} style={{ textDecoration: 'none' }}>
                        {" "}
                        <Typography variant="subtitle1" color='primary' component={'span'}>
                            Go back to Utility Social.
                        </Typography>
                    </Link>
                </Typography>
            </Box>
        </Box>
    );
};

export default NotFound;