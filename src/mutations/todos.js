import { gql } from "@apollo/client"

const ADD_TODO = gql`
    mutation AddTodo($input: todo!) {
    addTodo(input: $input) {
        code
        success
        message
        insertedId
  }
}
`;

const TOGGLE_TODO = gql`
    mutation ToggleTodo($todoId: ID!) {
        toggleTodo(todoId: $todoId) {
            acknowledged
            modifiedCount
            upsertedId
            success
            message
  }
}
`;

const UPDATE_TODO = gql`
    mutation UpdateTodo($todoId: ID!, $userId: ID!, $input: updatedDoc) {
    updateTodo(todoId: $todoId, userId: $userId input: $input) {
        acknowledged
        modifiedCount
        success
        message
    }
}
`

const DELETE_TODO = gql`
    mutation DeleteTodo($todoId: ID!, $userId: ID!) {
    deleteTodo(todoId: $todoId, userId: $userId) {
        code
        success
        deletedId
        message
    }
}
`


export { ADD_TODO, TOGGLE_TODO, UPDATE_TODO, DELETE_TODO }