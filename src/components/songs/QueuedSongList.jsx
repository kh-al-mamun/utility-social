import { Avatar, Box, CardActions, IconButton, Typography } from "@mui/material";
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import { useMutation } from "@apollo/client";
import { TOGGLE_SONG } from "../../mutations/songs";
import processToggleSongMutation from "../../mutations/sharedMutationFunctions/toggleSong";
import { useContext } from "react";
import { SongContext } from "../../pages/songs";

const QueuedSongList = () => {
    const { queuedSongs } = useContext(SongContext)

    return (
        <Box marginTop={4} mb={2}>
            <Typography variant="body1" component="h2" gutterBottom>
                QUEUE {`(${queuedSongs.length})`}
            </Typography>
            <Box>
                {queuedSongs.map(song => <QueueCard key={song._id} song={song} />)}
            </Box>
        </Box>
    );
};


const QueueCard = ({ song }) => {
    const { _id, title, artist, thumbnail, inQueue } = song;
    const [ToggleSong, { loading: toggleLoading }] = useMutation(TOGGLE_SONG);

    const handleToggleSong = async () => {
        try {
            // first param is the Mutation function
            // second param is the variable object
            // third param is the mutated data object
            // ***the fragment definition is still static, to change mutated data keys, define it first in fragment***
            await processToggleSongMutation(ToggleSong, { songId: _id }, { inQueue: !inQueue })
        }
        catch (error) {
            alert(error.message)
        }
    }

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '2rem',
                p: 1,
                my: 1,
            }}
        >
            <Box
                display="flex"
                alignItems="center"
                gap="1rem"
            >
                <Avatar src={thumbnail} sx={{ width: 50, height: 50 }} />
                <Box>
                    <Typography variant="body1" component="h4" title={title}>
                        {title.length > 30 ? `${title.slice(0, 30)}...` : title}
                    </Typography>
                    <Typography variant="subtitle2" color="secondary" component="p" title={artist}>
                        {artist.length > 30 ? `${artist.slice(0, 30)}...` : artist}
                    </Typography>
                </Box>
            </Box>

            <CardActions>
                <IconButton
                    onClick={handleToggleSong}
                    disabled={toggleLoading}
                    title="Remove from queue"
                >
                    <DeleteRoundedIcon color={toggleLoading ? "disabled" : "error"} />
                </IconButton>
            </CardActions>
        </Box>
    )
}

export default QueuedSongList;