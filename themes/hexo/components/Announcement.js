import { useEffect, useState } from 'react'
import { useGlobal } from '@/lib/global'
import NotionPage from '@/components/NotionPage'

const Announcement = ({ post, className }) => {
  const { siteInfo } = useGlobal()
  const [f1News, setF1News] = useState([])
  const [nbaNews, setNbaNews] = useState([])
  const [loadingF1, setLoadingF1] = useState(true)
  const [loadingNBA, setLoadingNBA] = useState(true)

  // 深度提取图片链接
  const extractImage = (item) => {
    if (item.thumbnail && typeof item.thumbnail === 'string' && item.thumbnail.startsWith('http')) return item.thumbnail
    if (item.enclosure?.link && item.enclosure.link.startsWith('http')) return item.enclosure.link
    const content = item.content || item.description || ''
    const match = content.match(/<img[^>]+src=["']([^"']+)["']/i)
    if (match && match[1]) return match[1]
    return null
  }

  useEffect(() => {
    // 1. 抓取 Motorsport F1
    const fetchF1 = async () => {
      try {
        const res = await fetch('https://api.rss2json.com/v1/api.json?rss_url=' + encodeURIComponent('https://www.motorsport.com/rss/f1/news/'))
        const data = await res.json()
        if (data.status === 'ok' && data.items?.length > 0) {
          const list = data.items.slice(0, 15).map(item => ({
            title: item.title,
            link: item.link,
            image: extractImage(item) || 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=150&auto=format&fit=crop&q=60'
          }))
          setF1News(list)
        }
      } catch (err) {
        console.error('F1 获取失败:', err)
      } finally {
        setLoadingF1(false)
      }
    }

    // 2. 抓取 ClutchPoints NBA (稳定原生大图源)
    const fetchNBA = async () => {
      try {
        const res = await fetch('https://api.rss2json.com/v1/api.json?rss_url=' + encodeURIComponent('https://clutchpoints.com/feed'))
        const data = await res.json()
        if (data.status === 'ok' && data.items?.length > 0) {
          const list = data.items.slice(0, 15).map(item => ({
            title: item.title,
            link: item.link,
            image: extractImage(item) || 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=150&auto=format&fit=crop&q=60'
          }))
          setNbaNews(list)
        }
      } catch (err) {
        console.error('NBA 获取失败:', err)
      } finally {
        setLoadingNBA(false)
      }
    }

    fetchF1()
    fetchNBA()
  }, [])

  return (
    <div className={className}>
      <section
        id='announcement-wrapper'
        style={{ backdropFilter: 'blur(15px)', WebkitBackdropFilter: 'blur(15px)' }}
        className='dark:text-gray-300 border dark:border-gray-800 rounded-xl lg:p-5 p-4 !bg-[rgba(255,255,255,0.6)] dark:!bg-[rgba(15,17,24,0.6)] text-xs shadow-lg'
      >
        {/* 1. Notice 标题与原 Notion 目标 */}
        {(post?.blockMap || siteInfo?.description) && (
          <div className='mb-0'>
            {/* 像素级对齐的 Notice 标题行 */}
            <div className='font-bold flex items-center text-base text-gray-800 dark:text-gray-100 tracking-wide mb-2'>
              <span className='w-5 inline-flex items-center justify-center mr-2 text-blue-500'>
                <i className='fas fa-bullhorn text-base' />
              </span>
              <span>Notice</span>
            </div>

            {/* 紧缩 Notion 冗余间距 */}
            <div className='text-gray-600 dark:text-gray-400 leading-normal overflow-hidden [&_.notion-page]:!p-0 [&_.notion]:!p-0 [&_.notion-page-content]:!p-0 [&_.notion-list]:!mb-0 [&_.notion-to-do]:!mb-1.5 [&_.notion-text]:!mb-1'>
              {post?.blockMap ? <NotionPage post={post} /> : <p>{siteInfo?.description}</p>}
            </div>
          </div>
        )}

        {/* 紧致分割线 */}
        <hr className='border-t border-gray-200/60 dark:border-gray-700/60 my-2.5' />

        {/* 2. F1 赛车专栏 */}
        <div>
          <div className='font-bold flex items-center justify-between mb-2 text-xs'>
            <div className='flex items-center gap-1.5'>
              <span className='px-1.5 py-0.5 rounded bg-red-600 text-white font-black text-[10px] tracking-wider'>F1</span>
              <span className='text-gray-800 dark:text-gray-200 font-semibold'>Motorsport 专栏</span>
            </div>
            <span className='text-[10px] px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 font-normal'>LIVE</span>
          </div>

          {loadingF1 ? (
            <div className='py-2 text-gray-400 text-[11px] flex items-center gap-1.5'>
              <i className='fas fa-spinner fa-spin' /> 正在更新快讯...
            </div>
          ) : f1News.length > 0 ? (
            <div className='space-y-1.5 max-h-[295px] overflow-y-auto pr-1 select-none scrollbar-thin scrollbar-thumb-gray-400/30'>
              {f1News.map((item, index) => (
                <a
                  key={index}
                  href={item.link}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex items-center gap-2.5 group p-1.5 -mx-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-all'
                >
                  <img
                    src={item.image}
                    alt=''
                    className='w-11 h-11 object-cover rounded-md flex-shrink-0 bg-gray-200 dark:bg-gray-800 border border-black/5 dark:border-white/5 group-hover:scale-105 transition-transform duration-300'
                    loading='lazy'
                  />
                  <div className='flex-1 min-w-0'>
                    <h4 className='line-clamp-2 text-gray-700 dark:text-gray-300 group-hover:text-red-500 transition-colors leading-snug font-medium text-[11px]'>
                      {item.title}
                    </h4>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <div className='text-gray-400 py-1 text-[11px]'>暂无动态</div>
          )}
        </div>

        {/* 紧致分割线 */}
        <hr className='border-t border-gray-200/60 dark:border-gray-700/60 my-2.5' />

        {/* 3. NBA 专栏 */}
        <div>
          <div className='font-bold flex items-center justify-between mb-2 text-xs'>
            <div className='flex items-center gap-1.5'>
              <span className='px-1.5 py-0.5 rounded bg-blue-600 text-white font-black text-[10px] tracking-wider'>NBA</span>
              <span className='text-gray-800 dark:text-gray-200 font-semibold'>ClutchPoints 专栏</span>
            </div>
            <span className='text-[10px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 font-normal'>LIVE</span>
          </div>

          {loadingNBA ? (
            <div className='py-2 text-gray-400 text-[11px] flex items-center gap-1.5'>
              <i className='fas fa-spinner fa-spin' /> 正在更新快讯...
            </div>
          ) : nbaNews.length > 0 ? (
            <div className='space-y-1.5 max-h-[295px] overflow-y-auto pr-1 select-none scrollbar-thin scrollbar-thumb-gray-400/30'>
              {nbaNews.map((item, index) => (
                <a
                  key={index}
                  href={item.link}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex items-center gap-2.5 group p-1.5 -mx-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-all'
                >
                  <img
                    src={item.image}
                    alt=''
                    className='w-11 h-11 object-cover rounded-md flex-shrink-0 bg-gray-200 dark:bg-gray-800 border border-black/5 dark:border-white/5 group-hover:scale-105 transition-transform duration-300'
                    loading='lazy'
                  />
                  <div className='flex-1 min-w-0'>
                    <h4 className='line-clamp-2 text-gray-700 dark:text-gray-300 group-hover:text-blue-500 transition-colors leading-snug font-medium text-[11px]'>
                      {item.title}
                    </h4>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <div className='text-gray-400 py-1 text-[11px]'>暂无动态</div>
          )}
        </div>
      </section>
    </div>
  )
}

export default Announcement
