import LazyImage from '@/components/LazyImage'
import { useGlobal } from '@/lib/global'
import SmartLink from '@/components/SmartLink'
import { useRouter } from 'next/router'

/**
 * 改造版：侧边栏“Top Favorite”模块 (现代 UI 升级版)
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
              // 添加 group 类，用于触发整行的联动悬停效果
              className={'my-4 flex items-center justify-between group cursor-pointer'}
            >
              
              {/* 左侧文字区 */}
              <div className={'flex-1 pr-3 overflow-hidden ' + (selected ? 'text-indigo-400' : 'text-gray-600 dark:text-gray-300')}>
                {/* 标题：限制2行，悬停变色 */}
                <div className='line-clamp-2 text-sm font-medium group-hover:text-indigo-400 transition-colors duration-200'>
                  {post.title}
                </div>
                {/* 日期：稍微调小字体，颜色变浅，拉开层级 */}
                <div className='text-xs text-gray-400 mt-1'>
                  {post.lastEditedDay}
                </div>
              </div>

              {/* 右侧图片区：改为正方形(w-14 h-14) + 大圆角(rounded-xl) */}
              <div className='w-14 h-14 overflow-hidden relative shrink-0 rounded-xl shadow-sm'>
                <LazyImage
                  alt={post?.title}
                  src={`${headerImage}`}
                  // 图片悬停放大效果 (group-hover:scale-110)
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
