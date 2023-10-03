import { gql } from "@apollo/client";

export const ADD_SONG = gql`
    mutation AddSong($input: song!) {
    addSong(input: $input) {
        code
        success
        message
        insertedId
        song {
            _id
            title
            artist
            duration
            inQueue
            userId
        }
    }
}
`;

export const TOGGLE_SONG = gql`
    mutation ToggleSong($songId: ID!) {
    toggleSong(songId: $songId) {
        acknowledged
        message
        success
        modifiedCount
    }
}
`

export const DELETE_SONG = gql`
    mutation DeleteSong($songId: ID!, $userId: ID!) {
        deleteSong(songId: $songId, userId: $userId) {
            code
            success
            deletedId
            message
        }
    }
`