import { useRef } from 'react'
import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client'
import LensEmbed from '@/components/LensEmbed'
import useResizeObserver from '@react-hook/resize-observer'
import { GET_PUBLICATION } from '@/queries/get-publication'
import { GET_PUBLICATIONS } from '@/queries/get-publications'
import { Maybe, Publication, PublicationQueryRequest } from '@/types/lens'

const EmbedPage = () => {
	const containerRef = useRef<HTMLDivElement>(null)
	useResizeObserver(containerRef, entry => {
		window.parent.postMessage(
			{
				t: 'lensembed',
				u: window.location.toString(),
				h: entry.contentRect.height,
				w: entry.contentRect.width,
			},
			'*'
		)
		window.parent.postMessage(
			JSON.stringify({
				src: window.location.toString(),
				context: 'iframe.resize',
				height: entry.contentRect.height,
			}),
			'*'
		)
	})

	const {
		query: { id, mini = false, cta = false, theme },
	} = useRouter()

	const publicationData = useQuery<{ publication?: Maybe<Publication> }, PublicationQueryRequest>(GET_PUBLICATION, {
		variables: { publicationId: id },
		skip: id?.includes("-") === false,
	})

	const publicationsData = useQuery(GET_PUBLICATIONS, {
			variables: { profileId: id },
			skip: id?.includes("-"),
	})

	return (
		<div ref={containerRef} className={`${theme == 'light' ? '' : 'dark'} min-w-[400px] md:min-w-[500px]`}>
			{id?.includes("-") ?
				<LensEmbed publication={publicationData?.data?.publication} isMini={mini as boolean} cta={cta as boolean} />
				: publicationsData?.data?.publications?.items?.map((publication: Publication, index: number) => {
					return <LensEmbed publication={publication} isMini={mini as boolean} cta={cta as boolean} key={index} />
				})}
		</div>
	)
}

export default EmbedPage
