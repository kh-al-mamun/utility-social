import { gql } from "@apollo/client";

async function processToggleSongMutation(ToggleSong, variables, data) {
    return await ToggleSong({
        variables: { ...variables },
        update: cache => {
            cache.writeFragment({
                id: `Song:${variables.songId}`,
                fragment: gql`
                    fragment MySong_ToggleInQueue on Song {
                        inQueue
                    }
                `,
                data: { ...data }
            })
        }
    })
}

export default processToggleSongMutation;