import LazyImage from '@/components/LazyImage'
import { useGlobal } from '@/lib/global'
import SmartLink from '@/components/SmartLink'
import { useRouter } from 'next/router'

/**
 * 改造版：侧边栏“Top Favorite”模块 (完美对齐 + 默认折叠 + 去除留白版)
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
    // 简化结构，直接把 details 作为外层容器
    <details className="w-full group">
      
      {/* 🌟 修复 1：去掉了所有自定义的字号和颜色代码，让它完全继承原生样式，与 Notice 百分百一致 */}
      <summary className="mb-2 px-1 flex flex-nowrap items-center justify-between cursor-pointer list-none outline-none [&::-webkit-details-marker]:hidden">
        <div>
          <i className="mr-2 fas fa-thumbtack" />
          Top Favorite
        </div>
        <i className="fas fa-chevron-down text-xs text-gray-500 transition-transform duration-300 group-open:rotate-180" />
      </summary>

      {/* 🌟 修复 2：去掉了导致多余留白的 mt-2 */}
      <div className="overflow-y-auto pr-2" style={{ maxHeight: '24.5rem' }}>
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
              // 🌟 修复 2 补充：加入 last:pb-0，让最后一篇文章贴合底部，消除缝隙
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
