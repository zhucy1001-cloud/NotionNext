import LazyImage from '@/components/LazyImage'
import { useGlobal } from '@/lib/global'
import SmartLink from '@/components/SmartLink'
import { useRouter } from 'next/router'

/**
 * 改造版：侧边栏“Top Favorite”模块 (紧凑 UI + 风格统一完美适配版)
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
    <>
      {/* 1. 标题风格统一：移除加粗，调整为 text-sm 大小，使其与 Notice 完全一致 */}
      <div className='mb-2 px-1 flex flex-nowrap justify-between text-sm text-gray-600 dark:text-gray-200'>
        <div>
          <i className='mr-2 fas fa-thumbtack' />
          Top Favorite
        </div>
      </div>
      
      {/* 2. 精准高度控制：24.5rem (刚好完美容纳 6 条 py-2 + h-12 的紧凑数据) */}
      <div className='overflow-y-auto pr-2' style={{ maxHeight: '24.5rem' }}>
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
              // 3. 紧凑排版：py-3 改为 py-2，让列表间距更小
              className={'py-2 flex items-center justify-between group cursor-pointer border-b border-gray-200 dark:border-gray-800 last:border-0'}
            >
              
              {/* 左侧文字区 */}
              <div className={'flex-1 pr-3 overflow-hidden ' + (selected ? 'text-indigo-400' : 'text-gray-600 dark:text-gray-300')}>
                {/* 标题 */}
                <div className='line-clamp-2 text-sm group-hover:text-indigo-400 transition-colors duration-200'>
                  {post.title}
                </div>
                {/* 日期间距改小：mt-1 改为 mt-0.5 */}
                <div className='text-xs text-gray-400 mt-0.5'>
                  {post.lastEditedDay}
                </div>
              </div>

              {/* 右侧图片区：尺寸缩减为 w-12 h-12 (48x48 像素) */}
              <div className='w-12 h-12 overflow-hidden relative shrink-0 rounded-xl shadow-sm'>
                <LazyImage
                  alt={post?.title}
                  src={`${headerImage}`}
                  className='object-cover w-full h-full group-hover:scale-110 transition-transform duration-500'
                />
              </div>

            </SmartLink>
          )
        })}
      </div>
    </>
  )
}
export default LatestPostsGroup
