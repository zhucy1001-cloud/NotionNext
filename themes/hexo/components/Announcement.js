import { useEffect, useState } from 'react'
import { useGlobal } from '@/lib/global'
import NotionPage from '@/components/NotionPage'
import Parser from 'rss-parser'

const Announcement = ({ post, className }) => {
  const { siteInfo } = useGlobal()
  const [f1News, setF1News] = useState([])
  const [nbaNews, setNbaNews] = useState([])
  const [loading, setLoading] = useState(true)

  const F1_FEED_URL = 'https://www.motorsport.com/rss/f1/news/'
  const NBA_FEED_URL = 'https://www.espn.com/espn/rss/nba/news'

  useEffect(() => {
    const parser = new Parser()
    const fetchAllNews = async () => {
      try {
        // 并发抓取 F1 和 NBA
        const [f1Res, nbaRes] = await Promise.all([
          parser.parseURL(`https://api.allorigins.win/raw?url=${encodeURIComponent(F1_FEED_URL)}`),
          parser.parseURL(`https://api.allorigins.win/raw?url=${encodeURIComponent(NBA_FEED_URL)}`)
        ])
        
        if (f1Res?.items) setF1News(f1Res.items.slice(0, 4))
        if (nbaRes?.items) setNbaNews(nbaRes.items.slice(0, 4))
      } catch (err) {
        console.error('RSS 抓取失败:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchAllNews()
  }, [])

  return (
    <div className={className}>
      <section
        id='announcement-wrapper'
        style={{ backdropFilter: 'blur(15px)', WebkitBackdropFilter: 'blur(15px)' }}
        className='dark:text-gray-300 border dark:border-gray-800 rounded-xl lg:p-5 p-4 !bg-[rgba(255,255,255,0.6)] dark:!bg-[rgba(15,17,24,0.6)] text-xs shadow-lg'
      >
        {/* 1. 原 Notion 公告区（近期小目标） */}
        {post?.blockMap ? (
          <div className='pb-3 mb-4 border-b border-gray-200 dark:border-gray-700/60'>
            <div className='font-bold flex items-center mb-2 text-sm text-gray-800 dark:text-gray-200'>
              <i className='mr-2 fas fa-bullhorn text-blue-500' />
              <span>公告 / 近期目标</span>
            </div>
            <div className='text-gray-600 dark:text-gray-400 leading-relaxed overflow-hidden'>
              <NotionPage post={post} />
            </div>
          </div>
        ) : siteInfo?.description ? (
          <div className='pb-3 mb-4 border-b border-gray-200 dark:border-gray-700/60'>
            <div className='font-bold flex items-center mb-2 text-sm text-gray-800 dark:text-gray-200'>
              <i className='mr-2 fas fa-bullhorn text-blue-500' />
              <span>公告</span>
            </div>
            <p className='text-gray-600 dark:text-gray-400'>{siteInfo.description}</p>
          </div>
        ) : null}

        {/* 2. F1 赛车专栏 */}
        <div className='mb-4'>
          <div className='font-bold flex items-center justify-between pb-2 mb-2 border-b border-gray-100 dark:border-gray-800 text-xs'>
            <div className='flex items-center gap-1.5'>
              <span className='text-red-500 font-black tracking-wider'>F1</span>
              <span className='text-gray-700 dark:text-gray-300 font-medium'>Motorsport 专栏</span>
            </div>
            <span className='text-[10px] px-1.5 py-0.2 rounded bg-red-500/10 text-red-400 font-normal'>LIVE</span>
          </div>

          {loading ? (
            <div className='py-2 text-gray-400 text-[11px]'><i className='fas fa-spinner fa-spin mr-1' />加载中...</div>
          ) : (
            <ul className='space-y-2'>
              {f1News.map((item, index) => (
                <li key={index} className='line-clamp-2 leading-snug group'>
                  <a href={item.link} target='_blank' rel='noopener noreferrer' className='flex items-start gap-1.5 text-gray-300 group-hover:text-red-400 transition-colors'>
                    <span className='text-red-500 text-xs select-none'>›</span>
                    <span>{item.title}</span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* 3. NBA 实时新闻 */}
        <div>
          <div className='font-bold flex items-center justify-between pb-2 mb-2 border-b border-gray-100 dark:border-gray-800 text-xs'>
            <div className='flex items-center gap-1.5'>
              <span className='text-blue-500 font-black tracking-wider'>NBA</span>
              <span className='text-gray-700 dark:text-gray-300 font-medium'>ESPN 专栏</span>
            </div>
            <span className='text-[10px] px-1.5 py-0.2 rounded bg-blue-500/10 text-blue-400 font-normal'>LIVE</span>
          </div>

          {loading ? (
            <div className='py-2 text-gray-400 text-[11px]'><i className='fas fa-spinner fa-spin mr-1' />加载中...</div>
          ) : (
            <ul className='space-y-2'>
              {nbaNews.map((item, index) => (
                <li key={index} className='line-clamp-2 leading-snug group'>
                  <a href={item.link} target='_blank' rel='noopener noreferrer' className='flex items-start gap-1.5 text-gray-300 group-hover:text-blue-400 transition-colors'>
                    <span className='text-blue-500 text-xs select-none'>›</span>
                    <span>{item.title}</span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  )
}

export default Announcement
