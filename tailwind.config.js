/** @type {import('tailwindcss/tailwind-config').TailwindConfig} */
module.exports = {
	content: ['./src/**/*.{js,ts,jsx,tsx}'],
	darkMode: 'class',
	theme: {
		extend: {
			boxShadow: {
				inset: 'inset 1px 1px 2px 0 rgb(0 0 0 / 10%)',
			},
		},
	},
	plugins: [require('@tailwindcss/line-clamp')],
}
