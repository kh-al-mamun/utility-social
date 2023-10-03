import { gql } from "@apollo/client";

export const GET_POST = gql`
    query GetPost($postId: ID!) {
        post(postId: $postId) {
            _id
            userId
            caption
            media {
                asset_id
                url
                width
                height
                type
                format
            }
            created_at
            location
            likes {
                _id
                postLikerId
            }
            # comments {
            #     _id
            #     caption
            #     created_at
            #     userId
            #     user {
            #         displayName
            #         username
            #         image
            #         }
            # }
            user {
                username
                displayName
                image
            }
        }
    }
`;

export const COMMENTS_BY_POST_ID = gql`
    query CommentsByPostId($postId: ID!) {
        commentsByPostId(postId: $postId) {
            _id
            caption
            created_at
            user {
                displayName
                image
                username
            }
            userId
        }
    }
`;

export const GET_FEED_POSTS = gql`
    query FeedPosts($userId: ID!, $createdAt: Int64) {
        feedPosts(userId: $userId, createdAt: $createdAt) {
            _id
            userId
            caption
            created_at
            location
            media {
                asset_id
                url
                width
                height
                type
                format
            }
            likes {
                _id
                postId
                postLikerId
                created_at
            }
            user {
                displayName
                image
                username
            }
        }
    }
`;

export const GET_PUBLIC_POSTS_LIST = gql`
    query PublicPostsList($username: String!) {
        publicProfile(username: $username) {
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
                user {
                    displayName
                    image
                    username
                }
            }
        }
    }
`;

export const GET_EXPLORE_GRID_POST_LIST = gql`
    query ExploreGridPosts($userId: ID!) {
        exploreGridPosts(userId: $userId) {
            _id
            media {
                format
                height
                width
                url
                type
                asset_id
            }
            likesAggregate {
                count
            }
            commentsAggregate {
                count
            }
        }
    }
`;

export const GET_NOTIFICATIONS = gql`
    query Notifications($receiverId: ID!, $lastChecked: Int64) {
        notifications(receiverId: $receiverId, lastChecked: $lastChecked) {
            _id
            created_at
            senderId
            post {
            _id
                media {
                    url
                    width
                    height
                    type
                }
            }
            type
            sender {
                displayName
                image
                username
            }
        }
    }
`;