import { gql } from "@apollo/client";

export const STORE_USER = gql`
    mutation StoreUser($input: user!) {
        storeUser(input: $input) {
            code
            success
            message
            insertedId
            user {
                _id
                firstName
                lastName
                displayName
                email
            }
    }
}
`
export const UPDATE_USER = gql`
    mutation UpdateUser($userId: ID!, $updatedDoc: updateUser!) {
        updateUser(userId: $userId, updatedDoc: $updatedDoc) {
            code
            success
            message
            modifiedCount
        }
    }
`;

export const FOLLOW_USER = gql`
    mutation FollowUser($newFollow: follow!, $newNotification: notification!) {
        followUser(newFollow: $newFollow) {
            code
            success
            message
            insertedId
            # following {
            #     _id
            #     userId
            #     profileId
            # }
        }
        sendNotification(newNotification: $newNotification) {
            code
            success
            message
            insertedId
        }
    }
`;

export const UNFOLLOW_USER = gql`
    mutation UnFollowUser($userId: ID!, $profileId: ID!, $receiverId: ID, $senderId: ID!, $type: NotificationTypes!) {
        unFollowUser(userId: $userId, profileId: $profileId) {
            code
            success
            message
            deletedCount
        }
        deleteNotification(receiverId: $receiverId, senderId: $senderId, type: $type) {
            code
            success
            message
            deletedCount
        }
    }
`;
