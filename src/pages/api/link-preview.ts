import { getMeta } from '@/lib/metadata'
import { LinkPreview } from '@/types/preview'
import type { NextApiRequest, NextApiResponse } from 'next'

const handler = async ({ query: { url } }: NextApiRequest, res: NextApiResponse<LinkPreview | ''>) => {
	res.setHeader('Cache-Control', 'max-age=0, s-maxage=86400, stale-while-revalidate')
	if (!url) return res.status(404).send('')

	try {
		res.status(200).json(await getMeta(url as string))
	} catch {
		res.status(404).send('')
	}
}

export default handler
