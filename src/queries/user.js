import { gql } from "@apollo/client";

export const GET_USER = gql`
    query GetUser($userId: ID, $email: String) {
        user(userId: $userId, email: $email) {
            _id
            firstName
            lastName
            displayName
            email
            username
            image
            created_at
            bio
            website
            phone
            last_notification_checked
            followingAggregate {
                count
                following {
                    profileId
                }
            }
            savedPosts {
                _id
                created_at
                postId
                    post {
                        _id
                        created_at
                        likesAggregate {
                            count
                        }
                        commentsAggregate {
                            count
                        }
                        media {
                            url
                            width
                            height
                            type
                        }
                    }
                }
        }
    }
`;

export const SEARCH_USERS = gql`
    query SearchUsers($userId: ID!, $keyword: String!) {
        searchUsers(userId: $userId, keyword: $keyword) {
            _id
            displayName
            username
            image
        }
    }
`;

export const IS_USERNAME_TAKEN = gql`
    query IsUsernameTaken($username: String) {
        isUsernameTaken(username: $username)
    }
`;

export const GET_EMAIL_FROM_USERNAME = gql`
    query GetEmailFromUsername($username: String) {
        getEmailFromUsername(username: $username) {
            email
        }
    }
`;

export const GET_PUBLIC_PROFILE = gql`
    query PublicProfile($username: String!) {
        publicProfile(username: $username) {
            _id
            username
            displayName
            bio
            phone
            website
            image
            followerCount
            followingCount
            posts {
            _id
            created_at
                media {
                    url
                    width
                    height
                    type
                }
                likesAggregate {
                    count
                }
                commentsAggregate {
                    count
                }
            }
        }
    }
`;

export const FOLLOW_SUGGESTION = gql`
    query FollowSuggestion($userId: ID!) {
        followSuggestion(userId: $userId) {
            _id
            displayName
            image
            username
        }
    }
`;