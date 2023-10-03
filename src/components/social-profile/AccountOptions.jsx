import { Dialog, Slide } from "@mui/material";
import { Button, Box, Divider, Link } from "../utils/Imports";
import useAuth from "../../hooks/useAuth";
import useSnack from "../../hooks/useSnack";

const AccountOptions = ({ open, handleClose }) => {
    const { logOut } = useAuth();
    const {makeSnack} = useSnack();

    const yetToImplement = () => makeSnack('Not supported at current version.')

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            TransitionComponent={Slide}
        >
            <Box display="grid" flexDirection="column" component="div" sx={{ width: { xs: 280, md: 380 } }}>
                <Link to={'/social/account/edit/password'}>
                    <Button color="success" fullWidth sx={btnSx}>
                        Change Password
                    </Button>
                </Link>
                <Divider />

                <Link to={`/social/notification`}>
                    <Button color="secondary" fullWidth sx={btnSx}>
                        Notifications
                    </Button>
                </Link>
                <Divider />

                <Link to={`https://ahmedwakil66.github.io/craftawesome/`} target="_blank" rel="noreferrer">
                    <Button color="secondary" fullWidth sx={btnSx}>
                        Apps and Websites
                    </Button>
                </Link>
                <Divider />

                <Button color="secondary" fullWidth sx={btnSx} onClick={yetToImplement}>
                    Privacy and Security
                </Button>
                <Divider />

                <Link to={`/social/report-a-problem`}>
                    <Button color="secondary" fullWidth sx={btnSx}>
                        Report a Problem
                    </Button>
                </Link>
                <Divider />

                <Button
                    onClick={() => logOut()}
                    color="secondary"
                    sx={btnSx}
                >
                    Log Out
                </Button>
                <Divider />

                <Button onClick={handleClose} color="secondary" sx={btnSx}>
                    Cancel
                </Button>
            </Box>
        </Dialog>
    );
};

const btnSx = { py: 1.5, textTransform: 'none', fontSize: 17.5 }
export default AccountOptions;