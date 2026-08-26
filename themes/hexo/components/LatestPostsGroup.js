import LazyImage from '@/components/LazyImage'
import { useGlobal } from '@/lib/global'
import SmartLink from '@/components/SmartLink'
import { useRouter } from 'next/router'

/**
 * 改造版：侧边栏“Top Favorite”模块 (完美对齐 + 默认折叠版)
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
    <div className="w-full">
      {/* 🌟 核心改动 1：使用 details 标签实现原生折叠，不加 open 属性即为“默认折叠” */}
      <details className="group">
        
        {/* 🌟 核心改动 2：summary 作为点击头部。加入了 px-1，彻底与底部的 Notice 保持像素级对齐 */}
        {/* [&::-webkit-details-marker]:hidden 用于隐藏某些浏览器自带的丑陋三角形 */}
        <summary className="mb-2 px-1 flex flex-nowrap items-center justify-between cursor-pointer list-none outline-none [&::-webkit-details-marker]:hidden">
          <div className="text-sm font-normal text-gray-600 dark:text-gray-200 flex items-center">
            <i className="mr-2 fas fa-thumbtack" />
            Top Favorite
          </div>
          {/* 新增细节：右侧的小箭头，当面板展开时会自动旋转 180 度 */}
          <i className="fas fa-chevron-down text-xs text-gray-400 transition-transform duration-300 group-open:rotate-180" />
        </summary>

        {/* 展开后的列表内容区，保持原有的 6 条适配高度 */}
        <div className="overflow-y-auto pr-2 mt-2" style={{ maxHeight: '24.5rem' }}>
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
                // 增加了 group/item 以便内部分离 hover 效果
                className={'py-2 flex items-center justify-between group/item cursor-pointer border-b border-gray-200 dark:border-gray-800 last:border-0'}
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
    </div>
  )
}
export default LatestPostsGroup
