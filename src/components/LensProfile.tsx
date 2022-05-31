import { FC } from 'react'
import LensAvatar from './LensAvatar'
import verified from '@/data/verified'
import { Profile } from '@/types/lens'
import Skeleton from 'react-loading-skeleton'

const LensProfile: FC<{ profile?: Profile; isMini?: boolean; hideName?: boolean; className?: string }> = ({
	profile,
	isMini = false,
	hideName = false,
	className = '',
}) => (
	<div className={`flex items-center ${className}`}>
		<a
			className="mr-2 flex items-center justify-center"
			href={`https://open.withlens.app/profile/${profile?.handle}`}
			target="_blank"
			rel="noreferrer"
		>
			<LensAvatar profile={profile} width={isMini ? 25 : 40} height={isMini ? 25 : 40} className="rounded-full" />
		</a>
		<a
			href={`https://open.withlens.app/profile/${profile?.handle}`}
			target="_blank"
			rel="noreferrer"
			className={`${isMini ? 'flex items-center space-x-2' : 'space-y-1'}`}
		>
			{!hideName && (
				<div className="flex items-center space-x-1 leading-none">
					<span className={`font-semibold text-gray-100 hover:underline`}>
						{profile?.name ?? profile?.handle ?? <Skeleton width={150} />}
					</span>
					{verified.includes(profile?.id) && (
						<svg
							className="ml-1 w-4 h-4 text-violet-400"
							fill="currentColor"
							viewBox="0 0 24 24"
							aria-label="Verified account"
						>
							<g>
								<path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z"></path>
							</g>
						</svg>
					)}
				</div>
			)}
			<span className={`${hideName ? 'font-medium text-gray-300' : 'text-gray-500'} text-sm block`}>
				{profile ? `@${profile.handle}` : <Skeleton width={65} />}
			</span>
		</a>
	</div>
)

export default LensProfile
