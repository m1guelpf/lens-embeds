import { FC } from 'react'
import LensterIcon from './Icons/LensterIcon'

const LensLoader: FC<{ isMini?: boolean }> = ({ isMini = false }) => {
	return (
		<div className={`max-w-xl border ${isMini ? 'py-3 px-3' : 'py-4 px-6'} border-gray-700 bg-gray-800 rounded-xl`}>
			<div className="flex justify-between">
				<div className="flex items-center mb-3">
					<div
						style={{ width: isMini ? 25 : 40, height: isMini ? 25 : 40 }}
						className="rounded-full bg-white/60"
					/>
					<div className="ml-3 space-y-2">
						<div className="h-4 w-24 bg-white/60 rounded" />
						<div className="h-3 w-16 bg-white/60 rounded" />
					</div>
				</div>
				{!isMini && (
					<a
						href={`https://lenster.xyz/`}
						target="_blank"
						className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-violet-500"
						rel="noreferrer"
					>
						<LensterIcon className="w-5 h-5" />
					</a>
				)}
			</div>
		</div>
	)
}

export default LensLoader
