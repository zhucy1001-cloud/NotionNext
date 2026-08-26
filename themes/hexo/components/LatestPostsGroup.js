import LazyImage from '@/components/LazyImage'
import { useGlobal } from '@/lib/global'
import SmartLink from '@/components/SmartLink'
import { useRouter } from 'next/router'

/**
 * 改造版：侧边栏“Top Favorite”模块 (终极像素级对齐版)
 */
const LatestPostsGroup = (props) => {
  const { posts, latestPosts, siteInfo } = props
  const currentPath = useRouter().asPath
  const { locale } = useGlobal()

  // 严格只捕捉打上了 '置顶' 标签的文章
  const sourcePosts = posts || latestPosts || []
  const favoritePosts = sourcePosts.filter(post => 
    post?.tags && post.tags.includes('置顶')
  )

  if (!favoritePosts || favoritePosts.length === 0) {
    return <></>
  }

  return (
    <details className="w-full group">
      
      {/* 🌟 终极修复：
          1. 移除 mb-2：解决折叠状态下底部留白过多、垂直不居中的问题。
          2. 移除 px-1，新增 p-0 m-0：强制抹除 summary 的所有默认偏移，实现与 Notice 的完美左对齐。
      */}
      <summary className="flex flex-nowrap items-center justify-between cursor-pointer list-none outline-none p-0 m-0 [&::-webkit-details-marker]:hidden">
        <div>
          <i className="mr-2 fas fa-thumbtack" />
          Top Favorite
        </div>
        <i className="fas fa-chevron-down text-xs text-gray-500 transition-transform duration-300 group-open:rotate-180" />
      </summary>

      {/* 🌟 补充调整：将留白转移到这里 (新增 mt-3)，保证展开后标题与列表有适当的呼吸空间 */}
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
