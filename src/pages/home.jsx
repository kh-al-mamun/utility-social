import { Box, Typography } from "@mui/material";
import MyImageButton from "../components/shared/ImageButton";
import MyHelmet from "../components/shared/MyHelmet";

const Home = () => {

    return (
        <Box>
            <MyHelmet />
            <Typography variant="h4" component="h1" textAlign="center">
                Welcome!
            </Typography>
            <br /> <br />
            <Box>
                <MyImageButton />
            </Box>
        </Box>
    );
};

export default Home;