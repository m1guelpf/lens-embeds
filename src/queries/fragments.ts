import { gql } from '@apollo/client'

export const FRAGMENT_MEDIA_FIELDS = gql`
	fragment MediaFields on Media {
		url
		mimeType
	}
`

export const FRAGMENT_PROFILE_FIELDS = gql`
	${FRAGMENT_MEDIA_FIELDS}
	fragment ProfileFields on Profile {
		id
		name
		bio
		attributes {
			displayType
			traitType
			key
			value
		}
		metadata
		isDefault
		handle
		picture {
			... on NftImage {
				contractAddress
				tokenId
				uri
				verified
			}
			... on MediaSet {
				original {
					...MediaFields
				}
			}
		}
		coverPicture {
			... on NftImage {
				contractAddress
				tokenId
				uri
				verified
			}
			... on MediaSet {
				original {
					...MediaFields
				}
			}
		}
		ownedBy
		dispatcher {
			address
		}
		stats {
			totalFollowers
			totalFollowing
			totalPosts
			totalComments
			totalMirrors
			totalPublications
			totalCollects
		}
		followModule {
			... on FeeFollowModuleSettings {
				type
				amount {
					asset {
						name
						symbol
						decimals
						address
					}
					value
				}
				recipient
			}
			... on ProfileFollowModuleSettings {
				type
			}
			... on RevertFollowModuleSettings {
				type
			}
		}
	}
`

export const FRAGMENT_PUBLICATION_STATS_FIELDS = gql`
	fragment PublicationStatsFields on PublicationStats {
		totalAmountOfMirrors
		totalAmountOfCollects
		totalAmountOfComments
	}
`

export const FRAGMENT_METADATA_OUTPUT_FIELDS = gql`
	${FRAGMENT_MEDIA_FIELDS}
	fragment MetadataOutputFields on MetadataOutput {
		name
		description
		content
		media {
			original {
				...MediaFields
			}
		}
		attributes {
			displayType
			traitType
			value
		}
	}
`

export const FRAGMENT_ERC20_FIELDS = gql`
	fragment Erc20Fields on Erc20 {
		name
		symbol
		decimals
		address
	}
`

export const FRAGMENT_COLLECT_MODULE_FIELDS = gql`
	${FRAGMENT_ERC20_FIELDS}
	fragment CollectModuleFields on CollectModule {
		__typename
		... on FreeCollectModuleSettings {
			type
		}
		... on FeeCollectModuleSettings {
			type
			amount {
				asset {
					...Erc20Fields
				}
				value
			}
			recipient
			referralFee
		}
		... on LimitedFeeCollectModuleSettings {
			type
			collectLimit
			amount {
				asset {
					...Erc20Fields
				}
				value
			}
			recipient
			referralFee
		}
		... on LimitedTimedFeeCollectModuleSettings {
			type
			collectLimit
			amount {
				asset {
					...Erc20Fields
				}
				value
			}
			recipient
			referralFee
			endTimestamp
		}
		... on RevertCollectModuleSettings {
			type
		}
		... on TimedFeeCollectModuleSettings {
			type
			amount {
				asset {
					...Erc20Fields
				}
				value
			}
			recipient
			referralFee
			endTimestamp
		}
	}
`

export const FRAGMENT_POST_FIELDS = gql`
	fragment PostFields on Post {
		id
		profile {
			...ProfileFields
		}
		stats {
			...PublicationStatsFields
		}
		metadata {
			...MetadataOutputFields
		}
		createdAt
		collectModule {
			...CollectModuleFields
		}
		referenceModule {
			... on FollowOnlyReferenceModuleSettings {
				type
			}
		}
		appId
	}
`

export const FRAGMENT_MIRROR_BASE_FIELDS = gql`
	${FRAGMENT_PROFILE_FIELDS}
	${FRAGMENT_PUBLICATION_STATS_FIELDS}
	${FRAGMENT_METADATA_OUTPUT_FIELDS}
	${FRAGMENT_COLLECT_MODULE_FIELDS}
	fragment MirrorBaseFields on Mirror {
		id
		profile {
			...ProfileFields
		}
		stats {
			...PublicationStatsFields
		}
		metadata {
			...MetadataOutputFields
		}
		createdAt
		collectModule {
			...CollectModuleFields
		}
		referenceModule {
			... on FollowOnlyReferenceModuleSettings {
				type
			}
		}
		appId
	}
`

export const FRAGMENT_COMMENT_BASE_FIELDS = gql`
	${FRAGMENT_PROFILE_FIELDS}
	${FRAGMENT_PUBLICATION_STATS_FIELDS}
	${FRAGMENT_METADATA_OUTPUT_FIELDS}
	${FRAGMENT_COLLECT_MODULE_FIELDS}
	fragment CommentBaseFields on Comment {
		id
		profile {
			...ProfileFields
		}
		stats {
			...PublicationStatsFields
		}
		metadata {
			...MetadataOutputFields
		}
		createdAt
		collectModule {
			...CollectModuleFields
		}
		referenceModule {
			... on FollowOnlyReferenceModuleSettings {
				type
			}
		}
		appId
	}
`

export const FRAGMENT_COMMENT_MIRROR_OF_FIELDS = gql`
	${FRAGMENT_COMMENT_BASE_FIELDS}
	${FRAGMENT_POST_FIELDS}
	${FRAGMENT_MIRROR_BASE_FIELDS}
	fragment CommentMirrorOfFields on Comment {
		...CommentBaseFields
		mainPost {
			... on Post {
				...PostFields
			}
			... on Mirror {
				...MirrorBaseFields
			}
		}
	}
`

export const FRAGMENT_COMMENT_FIELDS = gql`
	${FRAGMENT_COMMENT_BASE_FIELDS}
	${FRAGMENT_POST_FIELDS}
	${FRAGMENT_MIRROR_BASE_FIELDS}
	${FRAGMENT_COMMENT_MIRROR_OF_FIELDS}
	fragment CommentFields on Comment {
		...CommentBaseFields
		commentOn {
			... on Comment {
				...CommentBaseFields
			}
			... on Post {
				...PostFields
			}
			... on Mirror {
				...MirrorBaseFields
				mirrorOf {
					... on Post {
						...PostFields
					}
					... on Comment {
						...CommentMirrorOfFields
					}
				}
			}
		}
		mainPost {
			... on Post {
				...PostFields
			}
			... on Mirror {
				...MirrorBaseFields
				mirrorOf {
					... on Post {
						...PostFields
					}
					... on Comment {
						...CommentMirrorOfFields
					}
				}
			}
		}
	}
`

export const FRAGMENT_MIRROR_FIELDS = gql`
	${FRAGMENT_MIRROR_BASE_FIELDS}
	${FRAGMENT_POST_FIELDS}
	${FRAGMENT_COMMENT_FIELDS}
	fragment MirrorFields on Mirror {
		...MirrorBaseFields
		mirrorOf {
			... on Post {
				...PostFields
			}
			... on Comment {
				...CommentFields
			}
		}
	}
`
