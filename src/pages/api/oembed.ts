import type { NextApiRequest, NextApiResponse } from 'next'

const handler = async ({ query: { format = 'json', url } }: NextApiRequest, res: NextApiResponse) => {
	res.setHeader('Cache-Control', 'max-age=0, s-maxage=86400, stale-while-revalidate')

	if (!url) return res.status(404).send('Not Found')
	if (format != 'json') return res.status(501).send('Not Implemented')

	const postId = (() => {
		const match = (url as string).match(/(0x\w*-0x\w*)/i)
		if (!match) return

		return match[0]
	})()
	if (!postId) return res.status(404).send('')

	res.status(200).json({
		type: 'rich',
		version: '1.0',
		provider_name: 'Lens Embed',
		provider_url: 'https://embed.withlens.app/',
		html: `<iframe src="https://embed.withlens.app/embed/${postId}" frameBorder="0" />`,
		width: '600',
		height: '600',
	})
}

export default handler
