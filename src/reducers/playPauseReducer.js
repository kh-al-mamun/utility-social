const playPauseReducer = (state, action) => {
    switch (action.type) {
        case "PLAY": {
            return {...state, isPlaying: true};
        }
        case "PAUSE": {
            return {...state, isPlaying: false};
        }
        case "SET_SONG": {
            return {...state, song: action.payload.song}
        }
        default:
            return state;
    }
}

export default playPauseReducer;