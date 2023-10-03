import { Alert, Box, Card, CardActions, CardContent, CardMedia, CircularProgress, IconButton, LinearProgress, Typography } from "@mui/material";
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import PauseRoundedIcon from '@mui/icons-material/PauseRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import { useMutation } from "@apollo/client";
import { DELETE_SONG, TOGGLE_SONG } from "../../mutations/songs";
import processToggleSongMutation from "../../mutations/sharedMutationFunctions/toggleSong";
import { useContext } from "react";
import { SongContext } from "../../pages/songs";

const SongList = () => {
    const { songs, songsLoading, songsError } = useContext(SongContext);

    return (
        <Box
            display="flex"
            flexDirection="column"
            gap="1.2rem"
            marginTop={4}
        >
            {songsLoading && <CircularProgress color="secondary" style={{ margin: '0 auto' }} />}
            {songsError && <Alert severity="error">Error fetching data. Error: {songsError?.message}</Alert>}
            {songs?.length === 0 && <Typography color="secondary">Add some song to start.</Typography>}
            {songs?.map(song => <SongCard key={song._id} song={song} />)}
        </Box>
    );
};


const SongCard = ({ song }) => {
    const { _id, title, artist, thumbnail, inQueue, duration, userId } = song;
    const { currentSong, dispatchCurrentSong } = useContext(SongContext);
    const [DeleteSong, { loading: deleteLoading, error: deleteError }] = useMutation(DELETE_SONG);
    const [ToggleSong, { loading: toggleLoading, error: toggleError }] = useMutation(TOGGLE_SONG);

    const handleTogglePlay = (button) => {
        if (button === 'play') {
            dispatchCurrentSong({ type: "SET_SONG", payload: { song } })
            dispatchCurrentSong({ type: "PLAY" })
        }
        else if (button === 'pause') {
            dispatchCurrentSong({ type: "PAUSE" })
        }
    }

    const handleDeleteSong = async () => {
        try {
            await DeleteSong({
                variables: { songId: _id, userId },
                update: cache => {
                    cache.modify({
                        fields: {
                            songs(existingSongs, { readField }) {
                                return existingSongs.filter(songRef => _id !== readField('_id', songRef))
                            }
                        }
                    })
                }
            })
        } catch (error) {
            console.log(error.message);
        }
    }

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
        <Box position="relative">
            {(deleteLoading || toggleLoading) && <LinearProgress color="secondary" sx={{ position: 'absolute', top: '0', width: '100%' }} />}
            {(deleteError || toggleError) && <Alert severity="error">Some error occurred! Please try again.</Alert>}
            <Card
                style={{ display: 'grid', minHeight: '115px' }}
                sx={{ gridTemplateColumns: { xs: '1.5fr 3.3fr', md: '1fr 3.8fr' } }}
            >
                <CardMedia
                    component="img"
                    sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                    image={thumbnail}
                    alt="Thumbnail image"
                />

                <Box sx={{ display: { sm: 'flex' }, gap: '1rem', justifyContent: 'space-between' }}>
                    <CardContent>
                        <Typography variant="h6" component="h2" gutterBottom>
                            {title}
                        </Typography>
                        <Typography variant="body1" component="p" color="secondary">
                            {duration && new Date(duration * 1000).toISOString().substring(14, 19)}
                        </Typography>
                        <Typography variant="body1" component="p" color="secondary">
                            {artist}
                        </Typography>
                    </CardContent>

                    <CardActions>
                        {
                            (currentSong && currentSong.isPlaying && currentSong.song._id === _id) ?
                                <IconButton
                                    onClick={() => handleTogglePlay('pause')}
                                    size="small"
                                    title="Play"
                                >
                                    <PauseRoundedIcon />
                                </IconButton> :
                                <IconButton
                                    onClick={() => handleTogglePlay('play')}
                                    size="small"
                                    title="Play"
                                >
                                    <PlayArrowRoundedIcon />
                                </IconButton>
                        }

                        <IconButton
                            onClick={handleToggleSong}
                            size="small"
                            title={inQueue ? "Remove from queue" : "Add to queue"}
                            color={inQueue ? "secondary" : ""}
                        >
                            <SaveRoundedIcon />
                        </IconButton>

                        <IconButton
                            onClick={handleDeleteSong}
                            size="small"
                            title="Delete song"
                            color="error"
                        >
                            <ClearRoundedIcon />
                        </IconButton>
                    </CardActions>
                </Box>
            </Card>
        </Box>
    )
}

export default SongList;