import LazyImage from '@/components/LazyImage'
import { useGlobal } from '@/lib/global'
// import Image from 'next/image'
import SmartLink from '@/components/SmartLink'
import { useRouter } from 'next/router'

/**
 * 改造版：侧边栏“Top Favorite”模块
 * @param props 包含了父组件传下来的所有网站数据
 * @constructor
 */
const LatestPostsGroup = (props) => {
  const { posts, latestPosts, siteInfo } = props
  const currentPath = useRouter().asPath
  const { locale } = useGlobal()

  // 1. 筛选逻辑：严格只捕捉打上了 '置顶' 标签的文章（不限制提取数量）
  const sourcePosts = posts || latestPosts || []
  const favoritePosts = sourcePosts.filter(post => 
    post?.tags && post.tags.includes('置顶')
  )

  // 如果没有置顶文章，模块自动隐藏
  if (!favoritePosts || favoritePosts.length === 0) {
    return <></>
  }

  return (
    <>
      <div className=' mb-2 px-1 flex flex-nowrap justify-between'>
        <div>
          {/* 2. 修改 UI：改名为 Top Favorite，并去掉了彩色，完全跟随 Notice 的素色极简风格 */}
          <i className='mr-2 fas fa-thumbtack' />
          Top Favorite
        </div>
      </div>
      
      {/* 3. 滚动容器：设定最大高度约为 6 篇文章的累计高度，超过即显示内部滚动条 */}
      <div className='overflow-y-auto pr-1' style={{ maxHeight: '27rem' }}>
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
              className={'my-3 flex'}>
              <div className='w-20 h-14 overflow-hidden relative shrink-0'>
                <LazyImage
                  alt={post?.title}
                  src={`${headerImage}`}
                  className='object-cover w-full h-full'
                />
              </div>
              <div
                className={
                  (selected ? ' text-indigo-400 ' : 'dark:text-gray-400 ') +
                  ' text-sm overflow-x-hidden hover:text-indigo-600 px-2 duration-200 w-full rounded ' +
                  ' hover:text-indigo-400 cursor-pointer items-center flex'
                }>
                <div>
                  <div className='line-clamp-2 menu-link'>{post.title}</div>
                  <div className='text-gray-500'>{post.lastEditedDay}</div>
                </div>
              </div>
            </SmartLink>
          )
        })}
      </div>
    </>
  )
}
export default LatestPostsGroup
