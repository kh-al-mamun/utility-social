import { gql } from "@apollo/client";

export const ADD_REPORT = gql`
    mutation AddReport($userId: ID!, $newReport: report!) {
        addReport(userId: $userId, newReport: $newReport) {
            code
            insertedId
            message
            success
        }
    }
`;