import LazyImage from '@/components/LazyImage'
import { useGlobal } from '@/lib/global'
import SmartLink from '@/components/SmartLink'
import { useRouter } from 'next/router'

/**
 * 改造版：侧边栏“Top Favorite”模块 (加入极简暗色分割线)
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
      <div className='mb-2 px-1 flex flex-nowrap justify-between'>
        <div className='font-medium dark:text-gray-200'>
          <i className='mr-2 fas fa-thumbtack' />
          Top Favorite
        </div>
      </div>
      
      {/* 滚动容器 */}
      <div className='overflow-y-auto pr-2' style={{ maxHeight: '27rem' }}>
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
              // ✨ 新增分割线魔法：
              // 1. py-3: 上下留出均匀的内边距
              // 2. border-b: 底部添加边框
              // 3. border-gray-200 dark:border-gray-800: 白天极浅灰，夜间极暗灰
              // 4. last:border-0: 列表最后一条不显示边框
              className={'py-3 flex items-center justify-between group cursor-pointer border-b border-gray-200 dark:border-gray-800 last:border-0'}
            >
              
              {/* 左侧文字区 */}
              <div className={'flex-1 pr-3 overflow-hidden ' + (selected ? 'text-indigo-400' : 'text-gray-600 dark:text-gray-300')}>
                <div className='line-clamp-2 text-sm font-medium group-hover:text-indigo-400 transition-colors duration-200'>
                  {post.title}
                </div>
                <div className='text-xs text-gray-400 mt-1'>
                  {post.lastEditedDay}
                </div>
              </div>

              {/* 右侧图片区：正方形 + 大圆角 */}
              <div className='w-14 h-14 overflow-hidden relative shrink-0 rounded-xl shadow-sm'>
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
