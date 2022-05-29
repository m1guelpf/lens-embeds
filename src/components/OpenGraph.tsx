import useSWR from 'swr'
import { FC, ReactNode } from 'react'
import { LinkPreview } from '@/types/preview'

const OpenGraph: FC<{
	url: string
	children: string | ReactNode | ReactNode[]
	renderIf?: 'preview' | 'no_preview'
}> = ({ url, children, renderIf }) => {
	const { data, error } = useSWR<LinkPreview>(() => url && `/api/link-preview?url=${url}`)
	const isLoading = !data && !error

	if (error) {
		if (renderIf == 'preview') return null

		return (
			<a className="text-gray-300 underline" href={url} target="_blank" rel="noreferrer">
				{children}
			</a>
		)
	}
	if (renderIf == 'no_preview') return null

	return (
		<figure
			className={`rounded-lg max-w-lg mx-auto shadow-card bg-white dark:bg-gray-800 opengraph overflow-hidden relative not-prose !my-0 group ${
				isLoading ? '' : 'border border-gray-700'
			}`}
		>
			{isLoading ? (
				<div className="py-16 px-8 flex items-center justify-center">
					<svg
						className="w-6 h-6 animate-spin text-black dark:text-white text-opacity-40"
						stroke="currentColor"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
					>
						<circle
							fill="none"
							strokeWidth="2"
							strokeLinecap="round"
							strokeDasharray="32"
							cx="12"
							cy="12"
							r="10"
						></circle>
						<circle
							fill="none"
							strokeWidth="2"
							strokeLinecap="round"
							cx="12"
							cy="12"
							r="10"
							opacity="0.25"
						></circle>
					</svg>
				</div>
			) : (
				<a className="block" href={url} target="_blank" rel="noreferrer">
					<div>
						{data.image && (
							<div className="pb-[50%] relative border-b dark:border-gray-700">
								{/* eslint-disable-next-line @next/next/no-img-element */}
								<img
									className="object-cover absolute inset-0 h-full w-full"
									src={data.image}
									alt={data.title}
								/>
							</div>
						)}
						<div className="py-2 px-3 space-y-0.5 group-hover:bg-gray-900 group-hover:bg-opacity-10 transition duration-300">
							<p className="text-gray-500 text-sm">{new URL(data.url).hostname}</p>
							<p className="text-gray-800 dark:text-gray-200 font-medium break-words text-base">
								{data.title}
							</p>
							<p className="text-gray-400 dark:text-gray-500 text-sm">{data.description}</p>
						</div>
					</div>
				</a>
			)}
		</figure>
	)
}

export default OpenGraph
