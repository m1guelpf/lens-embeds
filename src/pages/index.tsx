import Head from 'next/head'
import Image from 'next/image'
import copy from 'copy-to-clipboard'
import bgImage from '@images/bg.png'
import cardImage from '@images/card.jpg'
import { FC, useEffect, useMemo, useRef, useState } from 'react'

const Home: FC = () => {
	const iframeRef = useRef<HTMLIFrameElement>(null)
	const [copied, setCopied] = useState<boolean>(false)
	const [url, setURL] = useState<string>('')
	const [postType, setPostType] = useState<number>(1)

	useEffect(() => {
		setURL(new URLSearchParams(window.location.search).get('url') ?? '')
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const postId = useMemo<string | null>(() => {
		if (postType == 1) {
			const match = url?.match(/(0x\w*-0x\w*)/i)
			if (!match) return

			return match[0]
		} else if (postType == 2) {
			const match = url?.match(/(0x\w*)/i)
			if (!match) return
			console.log(match[0])

			return match[0]
		}
	}, [url, postType])

	const embedCode = useMemo(() => {
		if (!postId) return

		return `<span id="lens-embed" data-post-id="${postId}" data-post-type="${postType}" /><script src="https://embed.withlens.app/script.js"></script>`
	}, [postId, postType])

	const copyToClipboard = () => {
		copy(embedCode)
		setCopied(true)
		setTimeout(() => setCopied(false), 1000)
	}

	useEffect(() => {
		const onMessage = ({ data }: MessageEvent) => {
			if (data?.t != 'lensembed') return

			const iframe = [...document.getElementsByTagName('iframe')].find(frame => frame.src == data.u)

			iframe.width = data.w
			iframe.height = data.h
		}

		window.addEventListener('message', onMessage)
	}, [])

	const meta = {
		title: 'Easily embed Lens posts anywhere',
		description:
			'One-click embeds for all your links posts, mirrors & comments. Bring your content anywhere, effortlessly!',
		image: `https://embed.withlens.app${cardImage.src}`,
	}

	return (
		<>
			<Head>
				<title>{meta.title}</title>
				<meta name="title" content={meta.title} />
				<meta name="description" content={meta.description} />

				<meta property="og:type" content="website" />
				<meta property="og:url" content="https://embeds.withlens.app" />
				<meta property="og:title" content={meta.title} />
				<meta property="og:description" content={meta.description} />
				<meta property="og:image" content={meta.image} />

				<meta property="twitter:card" content="summary_large_image" />
				<meta property="twitter:url" content="https://embeds.withlens.app" />
				<meta property="twitter:title" content={meta.title} />
				<meta property="twitter:description" content={meta.description} />
				<meta property="twitter:image" content={meta.image} />
			</Head>
			<div>
				<div
					className={`${
						postId ? 'md:h-[20vh]' : 'h-[95.5vh]'
					} flex flex-col items-center justify-center transition-all py-6 px-4 md:px-0 relative overflow-hidden`}
				>
					<div className="absolute inset-0 -z-10 h-screen">
						<Image src={bgImage} placeholder="blur" layout="fill" className="object-cover" alt="" />
					</div>
					<p
						className={`${
							postId ? 'text-black' : 'text-white'
						} text-4xl font-extralight mb-4 text-center transition`}
					>
						What would you like to embed?
					</p>
					<select className={`${
							postId ? 'bg-black text-gray-300 shadow' : 'text-gray-600 shadow'
						} w-full max-w-lg rounded p-3 font-extralight `}
						style={{
							marginBottom: 10,
							height: 50
						}}
						onChange= {(e) => {
							setPostType(Number(e.target.value))
							setURL('')
						}}>
						<option value={1}>Post</option>
						<option value={2}>Timeline</option>
					</select>
					<input
						className={`${
							postId ? 'bg-black text-gray-300 shadow' : 'text-gray-600 shadow'
						} w-full max-w-lg rounded p-3 font-extralight `}
						placeholder={postType == 1 ? 'Enter a Lenster URL' : 'Eneter a Lenster profile id'}
						type="url"
						value={url}
						onChange={event => setURL(event.target.value)}
						required
					/>
					{(url != 'https://lenster.xyz/posts/0xf5-0x17' && url != '0x2cb8') && (
						<button
							className={`${postId ? 'text-black/60' : 'text-white/70'} underline mt-2 transition`}
							onClick={() => {
								postType == 1?
									setURL('https://lenster.xyz/posts/0xf5-0x17') :
									setURL('0x2cb8')
							}}
						>
							or try an example
						</button>
					)}
				</div>
				<div className={`flex flex-col items-center justify-around h-full p-4 md:px-0 bg-white`}>
					{postId && (
						<>
							<div className="space-y-4">
								<p className="text-xl font-extralight text-center">
									To embed this post on your website, just paste the code below!
								</p>
								<div className="relative rounded overflow-hidden max-w-sm md:max-w-none mx-auto">
									<code
										onClick={copyToClipboard}
										className="block w-full border p-2 font-sans shadow-inset text-xs md:text-sm text-gray-500 cursor-pointer hover:bg-gray-200 transition duration-300 whitespace-nowrap"
									>
										{embedCode}
									</code>
									<button
										onClick={copyToClipboard}
										className="absolute inset-y-0 right-0 py-1 px-4 bg-violet-400 text-white flex items-center justify-center text-sm md:text-base"
									>
										{copied ? 'Copied!' : 'Copy Code'}
									</button>
								</div>
							</div>
							<div className="mt-4">
								<iframe
									ref={iframeRef}
									src={`/embed/${postId}`}
									frameBorder="0"
									allowFullScreen
								></iframe>
							</div>
						</>
					)}
					<div className="md:absolute mt-2 md:mt-0 bottom-3 inset-x-0 flex items-center justify-center">
						<p>
							Built by{' '}
							<a
								className="font-medium"
								href="https://lenster.xyz/u/m1guelpf.lens"
								target="_blank"
								rel="noreferrer"
							>
								@m1guelpf.lens
							</a>
						</p>
					</div>
				</div>
			</div>
		</>
	)
}

export default Home
