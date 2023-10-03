import { gql } from "@apollo/client";

export const GET_SONGS = gql`
    query getSongs($userId: ID!, $inQueue: Boolean) {
        songs(userId: $userId, inQueue: $inQueue) {
            _id
            title
            url
            thumbnail
            artist
            created_at
            inQueue
            duration
            userId
        }
    }
`