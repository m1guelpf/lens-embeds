import metascraper from 'metascraper'
import getTitle from 'metascraper-title'
import getImage from 'metascraper-image'
import { LinkPreview } from '@/types/preview'
import getDescription from 'metascraper-description'

const client = metascraper([getTitle(), getDescription(), getImage()])

export const getMeta = async (url: string): Promise<LinkPreview> => {
	const { html, baseUrl } = await fetch(url as string, { headers: { 'User-Agent': 'Twitterbot/1.0' } }).then(
		async res => ({
			baseUrl: res.url,
			html: await res.text(),
		})
	)

	return { ...(await client({ html, url: baseUrl })), url: url as string }
}
