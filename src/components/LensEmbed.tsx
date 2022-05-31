import Image from 'next/image'
import { format } from 'date-fns'
import String from '@/utils/string'
import OpenGraph from './OpenGraph'
import Autolinker from 'autolinker'
import LensProfile from './LensProfile'
import { Publication } from '@/types/lens'
import Skeleton from 'react-loading-skeleton'
import LensterIcon from './Icons/LensterIcon'
import { FC, useEffect, useMemo, useState } from 'react'
import { Controlled as Zoom } from 'react-medium-image-zoom'

const LensEmbed: FC<{
	publication?: Publication
	className?: string
	cta?: boolean
	isMini?: boolean
	level?: number
}> = ({ publication, className = '', isMini = false, cta = false, level = 0 }) => {
	const [showMore, setShowMore] = useState<boolean>(false)

	useEffect(() => {
		setShowMore(publication?.metadata?.content?.length > 450)
	}, [publication?.metadata?.content])

	const links = useMemo(() => {
		if (!publication?.metadata?.content) return

		return Autolinker.parse(publication.metadata.content, { email: false, phone: false, sanitizeHtml: true }).map(
			match => ({ url: match.getMatchedText(), text: match.getAnchorText() })
		)
	}, [publication?.metadata?.content])

	const endsWithLink = useMemo(() => {
		if (!links) return

		return publication.metadata.media.length > 0
			? null
			: links.find(link => publication.metadata.content.endsWith(link.url))
	}, [publication?.metadata?.content, publication?.metadata?.media, links])

	const linkifiedPost = useMemo(
		() =>
			Autolinker.link(new String(publication?.metadata?.content).replaceAll(endsWithLink?.url, '').toString(), {
				replaceFn: match => {
					if (
						match.getType() == 'mention' &&
						// @ts-ignore
						match.getServiceName() == 'tiktok'
					) {
						// @ts-ignore
						return `<a href="https://open.withlens.app/profile/${match.getMention()}" target="_blank" rel="noreferrer" class="underline">@${match.getMention()}</a>`
					}
				},
				mention: 'tiktok',
				hashtag: 'twitter',
				sanitizeHtml: true,
				className: 'underline',
			}),
		[publication?.metadata?.content, endsWithLink?.url]
	)

	return (
		<div className={`max-w-xl not-prose ${className}`}>
			{publication?.__typename == 'Mirror' && (
				<div className="py-1.5 px-2 border border-b-0 border-gray-700 rounded-xl rounded-br-none rounded-bl-none flex items-center justify-between bg-gray-800">
					<div className="flex items-center justify-center space-x-2">
						<LensProfile profile={publication.profile} className="-mr-1" isMini hideName />
						<p className="block text-gray-500 text-sm">mirrored this post</p>
					</div>
					<a
						href={`https://open.withlens.app/post/${publication.id}`}
						target="_blank"
						className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-blue-500"
						rel="noreferrer"
					>
						<LensterIcon className="w-5 h-5" />
					</a>
				</div>
			)}
			<div
				className={`border ${isMini ? 'py-3 px-3' : 'py-4 px-6'} border-gray-700 bg-gray-800 rounded-xl ${
					publication?.__typename == 'Mirror' ? 'rounded-tr-none rounded-tl-none' : ''
				}`}
			>
				<div className="flex justify-between">
					<LensProfile
						profile={
							publication?.__typename == 'Mirror' ? publication?.mirrorOf?.profile : publication?.profile
						}
						isMini={isMini}
						className="mb-3"
					/>
					{!['Comment', 'Mirror'].includes(publication?.__typename) && !isMini && (
						<a
							href={publication ? `https://open.withlens.app/post/${publication.id}` : null}
							target="_blank"
							className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-violet-500"
							rel="noreferrer"
						>
							<LensterIcon className="w-5 h-5" />
						</a>
					)}
				</div>
				<div className="flex flex-wrap justify-start items-start flex-1 -mt-1.5">
					<div className="w-full my-1">
						<p
							className={`text-gray-300 whitespace-pre-line ${isMini ? 'text-sm lg:text-base' : ''} ${
								showMore
									? 'line-clamp-5 text-transparent bg-clip-text bg-gradient-to-b from-gray-300 to-gray-900'
									: ''
							}`}
						>
							{publication ? (
								<span dangerouslySetInnerHTML={{ __html: linkifiedPost }} />
							) : (
								<Skeleton count={3} width="100%" />
							)}
							{showMore && endsWithLink && (
								<OpenGraph renderIf="no_preview" url={endsWithLink.url}>
									{endsWithLink.text}
								</OpenGraph>
							)}
						</p>
						{showMore && (
							<button
								type="button"
								className="my-2 block text-sm font-bold text-gray-200"
								onClick={() => setShowMore(!showMore)}
							>
								Show more
							</button>
						)}
						{endsWithLink && (
							<OpenGraph renderIf={showMore ? 'preview' : null} url={endsWithLink.url}>
								{endsWithLink.text}
							</OpenGraph>
						)}
						{publication?.metadata?.media?.length > 0 && (
							<div className="mt-2 rounded-lg">
								<div className="h-64 object-cover relative rounded-lg overflow-hidden flex items-center space-x-1 border border-gray-700">
									{publication.metadata.media.map(({ original: media }) =>
										media.mimeType.startsWith('video/') ? (
											<div key={media.url} className="relative flex-1 object-cover h-64">
												<video
													src={media.url}
													className="object-cover w-full h-full"
													autoPlay
													controls
													playsInline
													loop
												/>
											</div>
										) : (
											<LensImage key={media.url} media={media} />
										)
									)}
								</div>
							</div>
						)}
						{publication?.__typename == 'Comment' && level < 1 && (
							<LensEmbed
								className="mt-2"
								publication={publication.commentOn}
								level={level + 1}
								isMini={true}
							/>
						)}
					</div>
				</div>
				{!isMini && (
					<a
						href={publication ? `https://open.withlens.app/post/${publication.id}` : null}
						target="_blank"
						className="mt-2 text-sm text-gray-500 hover:underline"
						rel="noreferrer"
					>
						{publication ? (
							format(new Date(publication.createdAt), 'hh:mm a')
						) : (
							<Skeleton width={40} inline />
						)}{' '}
						·{' '}
						{publication ? (
							format(new Date(publication.createdAt), 'LLL d, yyyy')
						) : (
							<Skeleton width={40} inline />
						)}
					</a>
				)}
				{cta && (
					<a
						href={`https://open.withlens.app/post/${publication?.id}`}
						target="_blank"
						className="mt-2 py-1 px-2 border border-gray-600 rounded-full flex items-center justify-center w-full hover:bg-white/5 transition"
						rel="noreferrer"
					>
						<div className="flex items-center space-x-2">
							<p className="font-semibold text-sm text-violet-400">View on Lens</p>
						</div>
					</a>
				)}
			</div>
		</div>
	)
}

const LensImage = ({ media }) => {
	const [isZoomed, setZoomed] = useState(false)

	return (
		<Zoom
			isZoomed={isZoomed}
			onZoomChange={setZoomed}
			zoomMargin={10}
			overlayBgColorEnd="rgba(0, 0, 0, 0.95)"
			overlayBgColorStart="rgba(0, 0, 0, 0)"
			wrapStyle={{
				position: 'relative',
				flex: '1 1 0%',
				height: '16rem',
				objectFit: 'cover',
			}}
		>
			<Image alt="" layout="fill" objectFit={isZoomed ? 'contain' : 'cover'} src={media.url} priority />
		</Zoom>
	)
}

export default LensEmbed
