import LazyImage from '@/components/LazyImage'
import { siteConfig } from '@/lib/config'
import SmartLink from '@/components/SmartLink'
import CONFIG from '../config'
import { BlogPostCardInfo } from './BlogPostCardInfo'

const BlogPostCard = ({ index, post, showSummary, siteInfo }) => {
  const showPreview =
    siteConfig('HEXO_POST_LIST_PREVIEW', null, CONFIG) && post.blockMap

  // 🌟 核心修改：如果文章没有手动设置封面，自动分配 LoremFlickr 的 F1 真实相片
  if (post && !post.pageCoverThumbnail) {
    // 巧妙利用 post.id 和 index 计算出一个固定的随机数种子 (lockId)
    const lockId = post.id
      ? post.id.charCodeAt(post.id.length - 1) + post.id.charCodeAt(post.id.length - 2) + index
      : Math.floor(Math.random() * 1000)

    // 调用 LoremFlickr 接口，关键词锁定 formula1, racing, f1
    post.pageCoverThumbnail = `https://loremflickr.com/1200/800/formula1,racing,f1?lock=${lockId}`
  } else if (
    post &&
    !post.pageCoverThumbnail &&
    siteConfig('HEXO_POST_LIST_COVER_DEFAULT', null, CONFIG)
  ) {
    // 兼容原有逻辑（不过上面的 api 拦截通常会先执行）
    post.pageCoverThumbnail = siteInfo?.pageCover
  }

  const showPageCover =
    siteConfig('HEXO_POST_LIST_COVER', null, CONFIG) &&
    post?.pageCoverThumbnail &&
    !showPreview

  //   const delay = (index % 2) * 200

  return (
    <div
      className={`${siteConfig('HEXO_POST_LIST_COVER_HOVER_ENLARGE', null, CONFIG) ? ' hover:scale-110 transition-all duration-150' : ''}`}>
      <div
        key={post.id}
        id='blog-post-card'
        className={`group md:h-56 w-full flex justify-between md:flex-row flex-col-reverse shadow-sm ${siteConfig('HEXO_POST_LIST_IMG_CROSSOVER', null, CONFIG) && index % 2 === 1 ? 'md:flex-row-reverse' : ''}
                    overflow-hidden border dark:border-black rounded-xl bg-white dark:bg-hexo-black-gray`}>
        {/* 文字内容 */}
        <BlogPostCardInfo
          index={index}
          post={post}
          showPageCover={showPageCover}
          showPreview={showPreview}
          showSummary={showSummary}
        />

        {/* 图片封面 */}
        {showPageCover && (
          <div className='md:w-5/12 overflow-hidden'>
            <SmartLink href={post?.href}>
              <>
                <LazyImage
                  priority={index === 1}
                  alt={post?.title}
                  src={post?.pageCoverThumbnail}
                  className='h-56 w-full object-cover object-center group-hover:scale-110 duration-500'
                />
              </>
            </SmartLink>
          </div>
        )}
      </div>
    </div>
  )
}

export default BlogPostCard
