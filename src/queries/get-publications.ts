import { gql } from '@apollo/client'
import { FRAGMENT_COMMENT_FIELDS, FRAGMENT_MIRROR_FIELDS, FRAGMENT_POST_FIELDS } from './fragments'

export const GET_PUBLICATIONS = gql`
    ${FRAGMENT_POST_FIELDS}
    ${FRAGMENT_COMMENT_FIELDS}
    ${FRAGMENT_MIRROR_FIELDS}
    query Publications($profileId: ProfileId!) {
        publications(request: {
            profileId: $profileId,
            publicationTypes: [POST, COMMENT, MIRROR],
            limit: 10
        }) {
            items {
                __typename 
                ... on Post {
                  ...PostFields
                }
                ... on Comment {
                  ...CommentFields
                }
                ... on Mirror {
                  ...MirrorFields
                }
              }
              pageInfo {
                prev
                next
                totalCount
              }
            }
    }
`