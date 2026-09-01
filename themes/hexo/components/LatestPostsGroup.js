import LazyImage from '@/components/LazyImage'
import { useGlobal } from '@/lib/global'
import SmartLink from '@/components/SmartLink'
import { useRouter } from 'next/router'

const LatestPostsGroup = (props) => {
  const { posts, latestPosts, siteInfo } = props
  const currentPath = useRouter().asPath
  const { locale } = useGlobal()

  const sourcePosts = posts || latestPosts || []
  const favoritePosts = sourcePosts.filter(post => 
    post?.tags && post.tags.includes('置顶')
  )

  if (!favoritePosts || favoritePosts.length === 0) {
    return <></>
  }

  return (
    <details className="w-full group">
      <summary className="flex flex-nowrap items-center justify-between cursor-pointer list-none outline-none p-0 m-0 [&::-webkit-details-marker]:hidden">
        {/* 与 Notice 完全相同的图标定宽和对齐逻辑 */}
        <div className="font-bold flex items-center text-base text-gray-800 dark:text-gray-100 tracking-wide">
          <span className="w-5 inline-flex items-center justify-center mr-2 text-blue-500">
            <i className="fas fa-thumbtack text-base" />
          </span>
          <span>Top Favorite</span>
        </div>
        <i className="fas fa-chevron-down text-xs text-gray-500 transition-transform duration-300 group-open:rotate-180" />
      </summary>

      <div className="overflow-y-auto pr-2 mt-3" style={{ maxHeight: '24.5rem' }}>
        {favoritePosts.map(post => {
          const headerImage = post?.pageCoverThumbnail
            ? post.pageCoverThumbnail
            : siteInfo?.pageCover
          const selected = currentPath === post?.href

          return (
            <SmartLink
              key={post.id}
              title={post.title}
              href={post?.href}
              passHref
              className={'py-2 flex items-center justify-between group/item cursor-pointer border-b border-gray-200 dark:border-gray-800 last:border-0 last:pb-0'}
            >
              <div className={'flex-1 pr-3 overflow-hidden ' + (selected ? 'text-indigo-400' : 'text-gray-600 dark:text-gray-300')}>
                <div className='line-clamp-2 text-sm group-hover/item:text-indigo-400 transition-colors duration-200'>
                  {post.title}
                </div>
                <div className='text-xs text-gray-400 mt-0.5'>
                  {post.lastEditedDay}
                </div>
              </div>

              <div className='w-12 h-12 overflow-hidden relative shrink-0 rounded-xl shadow-sm'>
                <LazyImage
                  alt={post?.title}
                  src={`${headerImage}`}
                  className='object-cover w-full h-full group-hover/item:scale-110 transition-transform duration-500'
                />
              </div>
            </SmartLink>
          )
        })}
      </div>
    </details>
  )
}

export default LatestPostsGroup
