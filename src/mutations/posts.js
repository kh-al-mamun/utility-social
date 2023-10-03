import { gql } from "@apollo/client";

export const ADD_POST = gql`
    mutation AddPost($newPost: post!) {
        addPost(newPost: $newPost) {
            code
            insertedId
            message
            success
        }
    }
`;

export const DELETE_POST = gql`
    mutation DeletePost($userId: ID!, $postId: ID!) {
        deletePost(userId: $userId, postId: $postId) {
            code
            success
            message
            postDeleted
            likesDeleted
            commentsDeleted
            notificationDeleted
        }
    }
`;

export const UNLIKE_POST = gql`
    mutation UnlikePost($likeId: ID!, $postLikerId: ID!, $postId: ID, $senderId: ID!, $type: NotificationTypes!) {
        unlikePost(likeId: $likeId, postLikerId: $postLikerId) {
            code
            deletedCount
            message
            success
        }
        deleteNotification(postId: $postId, senderId: $senderId, type: $type) {
            code
            success
            message
            deletedCount
        }
    }
`;

export const LIKE_POST = gql`
    mutation LikePost($postId: ID!, $postLikerId: ID!, $created_at: Date!, $newNotification: notification!) {
        likePost(postId: $postId, postLikerId: $postLikerId, created_at: $created_at) {
            code
            insertedId
            message
            success
            like {
                _id
                postId
                postLikerId
                created_at
            }
        }
        sendNotification(newNotification: $newNotification) {
            code
            success
            message
            insertedId
        }
    }
`;

export const SAVE_POST = gql`
    mutation SavePost($postToSave: savePost!) {
        savePost(postToSave: $postToSave) {
            code
            success
            message
            insertedId
        }
    }
`;


export const REMOVE_SAVED_POST = gql`
    mutation RemoveSavedPost($postId: ID!, $userId: ID!) {
        removeSavedPost(postId: $postId, userId: $userId) {
            code
            success
            message
            deletedCount
        }
    }
`;

export const IS_POST_ALREADY_SAVED = gql`
    query Query($postId: ID!, $userId: ID!) {
        isPostAlreadySaved(postId: $postId, userId: $userId)
    }
`;

export const ADD_COMMENT = gql`
    mutation AddComment($userId: ID!, $newComment: comment!) {
        addComment(userId: $userId, newComment: $newComment) {
            code
            success
            message
            insertedId
            comment {
                _id
                caption
                created_at
                postId
                user {
                    displayName
                    username
                    image
                }
            }
        }
    }
`;

export const RESET_NOTIFICATION = gql`
    mutation ResetNotifications($userId: ID!) {
        resetNotifications(userId: $userId) {
            code
            success
            message
            modifiedCount
        }
    }
`;
