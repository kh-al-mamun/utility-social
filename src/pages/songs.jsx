import { useQuery } from "@apollo/client";
import { GET_SONGS } from "../queries/songs";
import { createContext, useReducer } from "react";
import SongLayout from "../components/songs/SongLayout";
import playPauseReducer from "../reducers/playPauseReducer";
import useUser from "../hooks/useUser";
import MyHelmet from "../components/shared/MyHelmet";

export const SongContext = new createContext({ currentSong: { song: {}, isPlaying: false } });

const SongMain = () => {
    const { userInfo, userInfoLoading } = useUser();
    const { data = {}, loading, error } = useQuery(GET_SONGS, {
        variables: { userId: userInfo?._id },
        skip: !userInfo || userInfoLoading,
    });

    let defaultSong = data.songs?.find(song => song.inQueue === true);
    if(!defaultSong) defaultSong = data.songs?.[0]
    if(!defaultSong) defaultSong = {
        id: "just-a-random-tone",
        title: "Mind Relaxing instruments ringtone",
        artist: "Lofi",
        url: "https://youtu.be/80rxzGseGJk?si=voiFIKHnSi42DXA9",
        thumbnail: "https://img.youtube.com/vi/80rxzGseGJk/0.jpg",
        duration: 30,
    }

    const [currentSongState, dispatchCurrentSong] = useReducer(playPauseReducer, {
        song: defaultSong,
        isPlaying: false
    })


    const songContextData = {
        songsLoading: loading,
        songsError: error,
        songs: data.songs || [],
        queuedSongs: data.songs?.filter(song => song.inQueue === true) || [],
        currentSong: currentSongState,
        dispatchCurrentSong
    }

    return (
        <SongContext.Provider value={songContextData}>
            <MyHelmet titled={"Songs"}/>
            <SongLayout />
        </SongContext.Provider>
    );
};

export default SongMain;