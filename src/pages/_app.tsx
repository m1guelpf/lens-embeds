import { SWRConfig } from 'swr'
import apollo from '@/lib/apollo'
import 'tailwindcss/tailwind.css'
import { ApolloProvider } from '@apollo/client'
import 'react-medium-image-zoom/dist/styles.css'
import 'react-loading-skeleton/dist/skeleton.css'
import { localStorageProvider } from '@/utils/swr'
import { SkeletonTheme } from 'react-loading-skeleton'

const App = ({ Component, pageProps }) => {
	return (
		<ApolloProvider client={apollo}>
			<SWRConfig
				value={{
					provider: localStorageProvider,
					revalidateIfStale: false,
					revalidateOnFocus: false,
					shouldRetryOnError: false,
					fetcher: url => fetch(url).then(res => res.json()),
				}}
			>
				<SkeletonTheme baseColor="#ffffff30" highlightColor="#ffffff40" width={100}>
					<Component {...pageProps} />
				</SkeletonTheme>
			</SWRConfig>
		</ApolloProvider>
	)
}

export default App
