import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseOutlinedIcon from '@mui/icons-material/PauseOutlined';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import RepeatRoundedIcon from '@mui/icons-material/RepeatRounded';
import { Slider, Stack } from '@mui/material';
import { useContext, useEffect, useRef, useState } from 'react';
import { SongContext } from '../../pages/songs';
import ReactPlayer from 'react-player';
import { VolumeDown, VolumeUp } from '@mui/icons-material';

export default function SongPlayer() {
    const theme = useTheme();
    const reactPlayerRef = useRef();
    const { currentSong, dispatchCurrentSong, queuedSongs } = useContext(SongContext);
    const { _id, title, artist, thumbnail, url, duration } = currentSong.song;

    const [played, setPlayed] = useState(0);
    const [volume, setVolume] = useState(.5);
    const [seeking, setSeeking] = useState(false);
    const [repeatOn, setRepeatOn] = useState(false);
    const [playedSeconds, setPlayedSeconds] = useState(0);
    const [positionInQueue, setPositionInQueue] = useState(0);

    useEffect(() => {
        setPositionInQueue(queuedSongs.findIndex(song => song._id === _id))
    }, [_id, queuedSongs])

    useEffect(() => {
        if (!repeatOn) {
            const nextSong = queuedSongs[positionInQueue + 1];
            if (played === 1 && nextSong) {
                setPlayed(0);
                dispatchCurrentSong({ type: "SET_SONG", payload: { song: nextSong } });
            } else if (played === 1 && !nextSong) {
                dispatchCurrentSong({ type: "PAUSE" })
            }
        }

    }, [dispatchCurrentSong, played, repeatOn, queuedSongs, positionInQueue])

    const handleTogglePlay = () => {
        dispatchCurrentSong(currentSong.isPlaying ? { type: "PAUSE" } : { type: "PLAY" })
    }

    const handleProgressChange = (event, newValue) => {
        setPlayed(newValue);
    }

    const handleSeekMouseDown = () => {
        setSeeking(true);
    }

    const handleSeekMouseUp = () => {
        setSeeking(false);
        reactPlayerRef.current.seekTo(played);
    }

    const handlePrevNextSong = (button) => {
        const playableSong = button === 'prev' ? queuedSongs[positionInQueue - 1] : queuedSongs[positionInQueue + 1];
        if (playableSong) {
            dispatchCurrentSong({ type: "SET_SONG", payload: { song: playableSong } })
        }
    }

    const handleVolumeChange = (event, newValue) => {
        setVolume(newValue / 100);
    }

    return (
        <>
            <Card sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                    <CardContent sx={{ flex: '1 0 auto', pb: 1, maxWidth: { xs: '250px', sm: '270px' } }}>
                        <Typography component="div" variant="h6" title={title}>
                            {title.length > 37 ? `${title.slice(0, 37)}...` : title}
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary" component="div" title={artist}>
                            {artist.length > 20 ? `${artist.slice(0, 20)}...` : artist}
                        </Typography>
                    </CardContent>

                    <Typography variant="subtitle1" component="p" color="secondary" sx={{ ml: 2 }}>
                        {new Date(playedSeconds * 1000).toISOString().substring(14, 19)} of &nbsp;
                        {new Date(duration * 1000).toISOString().substring(14, 19)}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 0 }}>
                        <IconButton onClick={() => handlePrevNextSong('prev')} aria-label="previous" title='Previous song'>
                            {theme.direction === 'rtl' ? <SkipNextIcon /> : <SkipPreviousIcon />}
                        </IconButton>
                        <IconButton onClick={handleTogglePlay} aria-label="play/pause" title='Play/Pause'>
                            {currentSong.isPlaying ? <PauseOutlinedIcon sx={{ height: 38, width: 38 }} /> : <PlayArrowIcon sx={{ height: 38, width: 38 }} />}
                        </IconButton>
                        <IconButton onClick={() => handlePrevNextSong('next')} aria-label="next" title='Next song'>
                            {theme.direction === 'rtl' ? <SkipPreviousIcon /> : <SkipNextIcon />}
                        </IconButton>
                        <IconButton onClick={() => setRepeatOn(prev => !prev)} aria-label="repeat" sx={{ marginLeft: 'auto' }} title='Repeat current song' color={`${repeatOn ? 'primary' : ''}`}>
                            <RepeatRoundedIcon />
                        </IconButton>
                    </Box>

                    <Slider
                        value={played}
                        onChange={handleProgressChange}
                        onMouseDown={handleSeekMouseDown}
                        onMouseUp={handleSeekMouseUp}
                        aria-label="Seek"
                        min={0}
                        max={1}
                        step={.01}
                        color="secondary"
                        sx={{ mx: 2, maxWidth: '90%' }}
                    />
                </Box>

                <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center" >
                    <Box display="flex" flexDirection="column" justifyContent="space-between" alignItems="center" height="80%" p={1}>
                        <IconButton onClick={() => setVolume(1)}>
                            <VolumeUp />
                        </IconButton>
                        <Slider
                            onChange={handleVolumeChange}
                            value={volume * 100}
                            aria-label="Volume"
                            orientation='vertical'
                            sx={{ ml: 0, p: 0, height: '50%', color: 'rgb(117, 129, 187)' }}
                        />
                        <IconButton onClick={() => setVolume(0)}>
                            <VolumeDown />
                        </IconButton>
                    </Box>
                </Stack>

                <CardMedia
                    component="img"
                    sx={{ width: { xs: '30%', sm: '30%' }, objectFit: 'cover' }}
                    image={thumbnail || "https://ucarecdn.com/b61ed5f3-0aa5-4e96-a52f-a002d4768f0c/-/resize/300x/"}
                    alt=""
                />
            </Card>

            {/* hidden */}
            <ReactPlayer
                ref={reactPlayerRef}
                onProgress={({ played, playedSeconds }) => {
                    if (!seeking) {
                        setPlayed(played);
                        setPlayedSeconds(playedSeconds)
                    }
                }}
                onEnded={() => {
                    setPlayed(1);
                }}
                volume={volume}
                url={url}
                playing={currentSong.isPlaying}
                loop={repeatOn}
                hidden
            />
        </>

    );
}