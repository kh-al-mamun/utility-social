import { Box, useMediaQuery } from "@mui/material";
import AddSong from "./AddSong";
import SongList from "./SongList";
import QueuedSongList from "./QueuedSongList";
import SongPlayer from "./SongPlayer";

const SongLayout = () => {
    const isUnderMD = useMediaQuery(theme => theme.breakpoints.down('md'));
    const mobileStyle_Player = {
        position: 'fixed',
        bottom: '0',
        left: '0',
        right: '0',
        opacity: '.97'
    }

    return (
        <Box
            maxWidth="1170px"
            margin="0 auto"
            display="grid"
            position="relative"
            mb={2}
            sx={{
                gridTemplateColumns: {xs: '1fr', md: '3fr 2fr'},
                gap: {xs: '2rem', md: '2.5rem', lg: '3.5rem'},
            }}
        >
            <Box
                sx={{pb: isUnderMD ? '15rem' : ''}}
            >
                <AddSong />
                {/* <SongList songs={data.songs} loading={loading} error={error}/> */}
                <SongList />
                {/* {isUnderMD && <QueuedSongList queuedSongs={queuedSongs}/>} */}
                {isUnderMD && <QueuedSongList />}
            </Box>
            <Box style={isUnderMD ? mobileStyle_Player : null}>
                <SongPlayer />
                {/* {!isUnderMD && <QueuedSongList queuedSongs={queuedSongs}/>} */}
                {!isUnderMD && <QueuedSongList />}
            </Box>
        </Box>
    );
};

export default SongLayout;