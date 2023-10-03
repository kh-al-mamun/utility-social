import { gql } from "@apollo/client";

const GET_TODOS = gql`
    query getTodos($userId: ID!, $status: AllowedStatus) {
        todos(userId: $userId, status: $status) {
            _id
            title
            description
            status
            timeInitiated
            timeEnded
            userId
        }
    }
`

export {GET_TODOS};