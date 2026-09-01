import { useEffect, useState } from 'react'
import Parser from 'rss-parser'

const Announcement = ({ className }) => {
  const [f1News, setF1News] = useState([])
  const [loading, setLoading] = useState(true)

  const FEED_URL = 'https://www.motorsport.com/rss/f1/news/'

  useEffect(() => {
    const parser = new Parser()
    const fetchF1 = async () => {
      try {
        const feed = await parser.parseURL(`https://api.allorigins.win/raw?url=${encodeURIComponent(FEED_URL)}`)
        if (feed && feed.items) {
          setF1News(feed.items.slice(0, 5))
        }
      } catch (err) {
        console.error('Motorsport F1 RSS 抓取失败:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchF1()
  }, [])

  return (
    <div className={className}>
      <section 
        id='announcement-wrapper' 
        style={{ backdropFilter: 'blur(15px)', WebkitBackdropFilter: 'blur(15px)' }}
        className='dark:text-gray-300 border dark:border-gray-800 rounded-xl lg:p-5 p-4 !bg-[rgba(255,255,255,0.6)] dark:!bg-[rgba(15,17,24,0.6)] text-xs shadow-lg'
      >
        <div className='font-bold flex items-center justify-between pb-2 mb-3 border-b border-gray-200 dark:border-gray-700 text-sm'>
          <div className='flex items-center gap-1.5'>
            <span className='text-red-500 font-black tracking-wider text-base'>F1</span>
            <span>Motorsport 专栏</span>
          </div>
          <span className='text-[10px] px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 font-medium'>LIVE</span>
        </div>

        {loading ? (
          <div className='py-4 text-center text-gray-400'>
            <i className='fas fa-spinner fa-spin mr-2' />获取最新资讯中...
          </div>
        ) : f1News.length > 0 ? (
          <ul className='space-y-2.5'>
            {f1News.map((item, index) => (
              <li key={index} className='line-clamp-2 leading-relaxed group'>
                <a 
                  href={item.link} 
                  target='_blank' 
                  rel='noopener noreferrer' 
                  className='flex items-start gap-2 text-gray-300 group-hover:text-red-400 transition-colors'
                >
                  <span className='text-red-500 text-xs mt-0.5 select-none'>›</span>
                  <span>{item.title}</span>
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <div className='text-gray-400 text-center py-2'>暂无最新动态</div>
        )}
      </section>
    </div>
  )
}

export default Announcement
