// copied from: https://swr.vercel.app/docs/advanced/cache#localstorage-based-persistent-cache
export const localStorageProvider = () => {
	// When initializing, we restore the data from `localStorage` into a map.
	const map = new Map(JSON.parse(getFromLocalStorage('swr-cache') || '[]'))

	// Before unloading the app, we write back all the data into `localStorage`.
	registerEvent('beforeunload', () => {
		const appCache = JSON.stringify(Array.from(map.entries()))
		localStorage.setItem('swr-cache', appCache)
	})

	// We still use the map for write & read for performance.
	return map
}

const getFromLocalStorage = (key: string) => {
	if (typeof window === 'undefined') return null

	return localStorage.getItem(key)
}

const registerEvent = (key: string, fn: () => any) => {
	if (typeof window === 'undefined') return

	window.addEventListener(key, fn)
}
