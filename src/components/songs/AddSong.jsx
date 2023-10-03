import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, InputAdornment, LinearProgress, TextField } from "@mui/material";
import LinkTwoToneIcon from '@mui/icons-material/LinkTwoTone';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { useMutation } from "@apollo/client";
import { ADD_SONG } from "../../mutations/songs";
import { GET_SONGS } from "../../queries/songs";
import useUser from "../../hooks/useUser";

const AddSong = () => {
    const { userInfo } = useUser();
    const [url, setUrl] = useState('');
    const [playable, setPlayable] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [validThumb, setValidThumb] = useState(false);
    const [song, setSong] = useState({
        title: '',
        artist: '',
        duration: 0,
        thumbnail: ''
    })

    const [AddSong, {loading, error}] = useMutation(ADD_SONG, {refetchQueries: [GET_SONGS]});

    const handleCloseDialog = () => {
        setDialogOpen(false)
    }

    const handleOnSubmit = async(event) => {
        event.preventDefault();
        const {title, artist, duration, thumbnail} = song;
        const result = await AddSong({
            variables: {
                input: {
                    title: title || null,
                    artist: artist || null,
                    duration: duration || null,
                    thumbnail: validThumb ? thumbnail : "https://ucarecdn.com/b61ed5f3-0aa5-4e96-a52f-a002d4768f0c/-/resize/300x/",
                    url,
                    created_at: Date.now(),
                    inQueue: false,
                    userId: userInfo._id
                }
            }
        })
    
        if(result.data?.addSong?.insertedId) {
            setDialogOpen(false);
            setUrl('');
        }
    }

    const handleEditSong = ({ player }) => {
        const nestedPlayer = player?.player?.player;
        let songData;
        if (nestedPlayer.getVideoData) {
            songData = getYouTubeInfo(nestedPlayer)
        }
        setSong({ ...songData, url });
    }

    const getYouTubeInfo = (player) => {
        const duration = player.getDuration();
        const { video_id, author, title } = player.getVideoData();
        return {
            // video_id,
            title,
            duration,
            artist: author,
            thumbnail: `https://img.youtube.com/vi/${video_id}/0.jpg`,
        }
    }

    const handleChangeInfo = (event) => {
        const {name, value} = event.target;
        setSong(prevSong => ({
            ...prevSong,
            [name]: value
        }))
    }

    const checkInputError = (name) => {
        return error?.graphQLErrors[0].message?.includes(name)
    }

    useEffect(() => {
        const isPlayable = ReactPlayer.canPlay(url);
        setPlayable(isPlayable);
    }, [url])

    return (
        <>
            {/* add song dialog modal */}
            <Dialog
                component="form"
                onSubmit={handleOnSubmit}
                open={dialogOpen}
                onClose={(_, reason) => {
                    if (reason === 'backdropClick' || reason == 'escapeKeyDown') {
                        setDialogOpen(false)
                    }
                }}
            >
                {loading && <LinearProgress color="secondary"/>}
                {error && <Alert severity="error" color="secondary">Some error occurred, please try again later.</Alert>}
                <DialogTitle align="center">Review Information</DialogTitle>
                <DialogContent>
                    <img
                        onLoad={() => setValidThumb(true)}
                        onError={() => setValidThumb(false)}
                        src={song.thumbnail}
                        style={{ borderRadius: '10px', display: 'block', margin: '1rem auto', maxWidth: '100%', maxHeight: '300px', minHeight: '150px' }}
                        alt="Song thumbnail"
                    />
                    <TextField
                        onInput={handleChangeInfo}
                        value={song.title}
                        fullWidth
                        margin="dense"
                        name="title"
                        variant="standard"
                        color="secondary"
                        label="Title"
                        error={checkInputError("title")}
                        helperText={checkInputError("title") && "This field is required"}
                    />
                    <TextField
                        onInput={handleChangeInfo}
                        value={song.artist}
                        fullWidth
                        margin="dense"
                        name="artist"
                        variant="standard"
                        color="secondary"
                        label="Artist"
                        error={checkInputError("artist")}
                        helperText={checkInputError("artist") && "This field is required"}
                    />
                    <TextField
                        onInput={handleChangeInfo}
                        value={song.thumbnail}
                        fullWidth
                        margin="dense"
                        name="thumbnail"
                        variant="standard"
                        color="secondary"
                        label="Thumbnail URL"
                        error={!validThumb}
                        helperText={!validThumb && "Insert a valid image link or leave empty for default"}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} variant="text" size="large" color="error">Cancel</Button>
                    <Button type="submit" variant="outlined" size="large" color="secondary">Confirm</Button>
                </DialogActions>
            </Dialog>

            {/* Add song url input */}
            <Grid container sx={{ gap: { xs: 1, sm: 0 } }}>
                <Grid item xs={12} sm={9.75}>
                    <TextField
                        onInput={event => setUrl(event.target.value)}
                        value={url} //iMportant
                        fullWidth
                        name="link"
                        variant="outlined"
                        color="secondary"
                        label="Paste Song's Youtube URL"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <LinkTwoToneIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={2.25}>
                    <Button
                        onClick={() => setDialogOpen(true)}
                        disabled={!playable}
                        fullWidth
                        variant="outlined"
                        color="secondary"
                        type="submit"
                        startIcon={<AddTwoToneIcon />}
                        sx={{ height: '100%' }}
                    >
                        Add
                    </Button>
                </Grid>
            </Grid>

            {/* hidden */}
            <ReactPlayer url={url} onReady={handleEditSong} hidden/>
        </>
    );
};

export default AddSong;