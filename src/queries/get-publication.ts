import { gql } from '@apollo/client'
import { FRAGMENT_COMMENT_FIELDS, FRAGMENT_MIRROR_FIELDS, FRAGMENT_POST_FIELDS } from './fragments'

export const GET_PUBLICATION = gql`
	${FRAGMENT_POST_FIELDS}
	${FRAGMENT_COMMENT_FIELDS}
	${FRAGMENT_MIRROR_FIELDS}
	query Publication($publicationId: InternalPublicationId!) {
		publication(request: { publicationId: $publicationId }) {
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
	}
`
