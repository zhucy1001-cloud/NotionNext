import { useEffect, useState } from 'react'
import { useGlobal } from '@/lib/global'
import NotionPage from '@/components/NotionPage'

const Announcement = ({ post, className }) => {
  const { siteInfo } = useGlobal()
  const [f1News, setF1News] = useState([])
  const [nbaNews, setNbaNews] = useState([])
  const [loadingF1, setLoadingF1] = useState(true)
  const [loadingNBA, setLoadingNBA] = useState(true)

  const extractImage = (item) => {
    if (item.thumbnail && typeof item.thumbnail === 'string' && item.thumbnail.startsWith('http')) return item.thumbnail
    if (item.enclosure?.link && item.enclosure.link.startsWith('http')) return item.enclosure.link
    const content = item.content || item.description || ''
    const match = content.match(/<img[^>]+src=["']([^"']+)["']/i)
    if (match && match[1]) return match[1]
    return null
  }

  // 时间格式化：将 RSS 时间转换为 MM-DD HH:mm
  const formatTime = (dateStr) => {
    if (!dateStr) return ''
    try {
      const d = new Date(dateStr.replace(/-/g, '/')) // 兼容 Safari
      if (isNaN(d.getTime())) return dateStr.slice(5, 16)
      const month = (d.getMonth() + 1).toString().padStart(2, '0')
      const day = d.getDate().toString().padStart(2, '0')
      const hours = d.getHours().toString().padStart(2, '0')
      const minutes = d.getMinutes().toString().padStart(2, '0')
      return `${month}-${day} ${hours}:${minutes}`
    } catch (e) {
      return dateStr.slice(5, 16)
    }
  }

  useEffect(() => {
    // 1. Motorsport F1 抓取
    const fetchF1 = async () => {
      try {
        const res = await fetch('https://api.rss2json.com/v1/api.json?rss_url=' + encodeURIComponent('https://www.motorsport.com/rss/f1/news/'))
        const data = await res.json()
        if (data.status === 'ok' && data.items?.length > 0) {
          const list = data.items.slice(0, 15).map(item => ({
            title: item.title,
            link: item.link,
            image: extractImage(item) || 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=150&auto=format&fit=crop&q=60',
            time: formatTime(item.pubDate) // 增加时间字段
          }))
          setF1News(list)
        }
      } catch (err) {
        console.error('F1 获取失败:', err)
      } finally {
        setLoadingF1(false)
      }
    }

    // 2. NBA 抓取
    const fetchNBA = async () => {
      const urls = [
        'https://api.rss2json.com/v1/api.json?rss_url=' + encodeURIComponent('https://sports.yahoo.com/nba/rss.xml'),
        'https://api.rss2json.com/v1/api.json?rss_url=' + encodeURIComponent('https://hoopshype.com/feed/')
      ]
      for (const url of urls) {
        try {
          const res = await fetch(url)
          const data = await res.json()
          if (data.status === 'ok' && data.items?.length > 0) {
            const list = data.items.slice(0, 15).map(item => ({
              title: item.title,
              link: item.link,
              image: extractImage(item) || 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=150&auto=format&fit=crop&q=60',
              time: formatTime(item.pubDate) // 增加时间字段
            }))
            setNbaNews(list)
            break
          }
        } catch (e) {
          // 容错继续请求下一个
        }
      }
      setLoadingNBA(false)
    }

    fetchF1()
    fetchNBA()
  }, [])

  return (
    <div className={className}>
      <section
        id='announcement-wrapper'
        style={{ backdropFilter: 'blur(15px)', WebkitBackdropFilter: 'blur(15px)' }}
        className='border dark:border-gray-800 rounded-xl p-5 !bg-[rgba(255,255,255,0.6)] dark:!bg-[rgba(15,17,24,0.6)] text-xs shadow-lg'
      >
        <style jsx global>{`
          #notice-content .notion,
          #notice-content .notion-page,
          #notice-content .notion-page-content,
          #notice-content article {
            padding: 0 !important;
            margin: 0 !important;
            min-height: 0 !important;
            height: auto !important;
          }
          #notice-content .notion-list,
          #notice-content .notion-to-do,
          #notice-content .notion-text {
            margin-bottom: 3px !important;
            padding-bottom: 0 !important;
          }

          @keyframes autoScrollUp {
            0% { transform: translateY(0); }
            100% { transform: translateY(-50%); }
          }
          .scroll-track {
            animation: autoScrollUp 45s linear infinite;
          }
          .scroll-container:hover .scroll-track {
            animation-play-state: paused;
          }
        `}</style>

        {/* 1. Notice 标题与 Notion 目标 */}
        {(post?.blockMap || siteInfo?.description) && (
          <div className="w-full mb-4">
            <div className="flex items-center text-base font-bold text-gray-800 dark:text-gray-100 tracking-wide mb-2.5 leading-none">
              <span className="w-5 h-5 inline-flex items-center justify-center mr-2 text-blue-500 shrink-0">
                <i className="fas fa-bullhorn text-sm relative -top-[3px]" />
              </span>
              <span className="leading-none select-none">Notice</span>
            </div>

            <div id="notice-content" className="text-gray-600 dark:text-gray-400 leading-snug overflow-hidden">
              {post?.blockMap ? <NotionPage post={post} /> : <p>{siteInfo?.description}</p>}
            </div>
          </div>
        )}

        {/* 2. F1 赛车专栏 */}
        <div className="mb-4">
          <a
            href="https://www.motorsport.com/f1/news/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between text-xs font-bold group/f1 cursor-pointer"
          >
            <div className="flex items-center gap-1.5">
              <span className="px-1.5 py-0.5 rounded bg-red-600 text-white font-black text-[10px] tracking-wider">F1</span>
              <span className="text-gray-800 dark:text-gray-200 font-semibold group-hover/f1:text-red-500 transition-colors">Motorsport 专栏</span>
            </div>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 font-normal">LIVE</span>
          </a>

          {/* 缩小顶部边距 (mt-1)，增大底部边距 (mb-3.5)，使分割线贴近标题 */}
          <hr className="border-t border-gray-200/60 dark:border-gray-700/60 mt-1 mb-3.5" />

          {loadingF1 ? (
            <div className="py-2 text-gray-400 text-[11px] flex items-center gap-1.5">
              <i className="fas fa-spinner fa-spin" /> 正在更新快讯...
            </div>
          ) : f1News.length > 0 ? (
            <div className="scroll-container max-h-[295px] overflow-hidden relative select-none">
              <div className="scroll-track space-y-2">
                {[...f1News, ...f1News].map((item, index) => (
                  <a
                    key={index}
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 group p-1.5 -mx-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-all"
                  >
                    <img
                      src={item.image}
                      alt=""
                      className="w-11 h-11 object-cover rounded-md flex-shrink-0 bg-gray-200 dark:bg-gray-800 border border-black/5 dark:border-white/5 group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <h4 className="line-clamp-2 text-gray-700 dark:text-gray-300 group-hover:text-red-500 transition-colors leading-snug font-medium text-[11px]">
                        {item.title}
                      </h4>
                      {/* 时间显示行 */}
                      {item.time && (
                        <span className="text-[9.5px] text-gray-400/80 dark:text-gray-500 mt-1 font-mono">
                          {item.time}
                        </span>
                      )}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-gray-400 py-1 text-[11px]">暂无动态</div>
          )}
        </div>

        {/* 3. NBA 专栏 */}
        <div>
          <a
            href="https://hoopshype.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between text-xs font-bold group/nba cursor-pointer"
          >
            <div className="flex items-center gap-1.5">
              <span className="px-1.5 py-0.5 rounded bg-blue-600 text-white font-black text-[10px] tracking-wider">NBA</span>
              <span className="text-gray-800 dark:text-gray-200 font-semibold group-hover/nba:text-blue-500 transition-colors">NBA 专栏</span>
            </div>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 font-normal">LIVE</span>
          </a>

          {/* 缩小顶部边距 (mt-1)，增大底部边距 (mb-3.5)，使分割线贴近标题 */}
          <hr className="border-t border-gray-200/60 dark:border-gray-700/60 mt-1 mb-3.5" />

          {loadingNBA ? (
            <div className="py-2 text-gray-400 text-[11px] flex items-center gap-1.5">
              <i className="fas fa-spinner fa-spin" /> 正在更新快讯...
            </div>
          ) : nbaNews.length > 0 ? (
            <div className="scroll-container max-h-[295px] overflow-hidden relative select-none">
              <div className="scroll-track space-y-2">
                {[...nbaNews, ...nbaNews].map((item, index) => (
                  <a
                    key={index}
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 group p-1.5 -mx-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-all"
                  >
                    <img
                      src={item.image}
                      alt=""
                      className="w-11 h-11 object-cover rounded-md flex-shrink-0 bg-gray-200 dark:bg-gray-800 border border-black/5 dark:border-white/5 group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <h4 className="line-clamp-2 text-gray-700 dark:text-gray-300 group-hover:text-blue-500 transition-colors leading-snug font-medium text-[11px]">
                        {item.title}
                      </h4>
                      {/* 时间显示行 */}
                      {item.time && (
                        <span className="text-[9.5px] text-gray-400/80 dark:text-gray-500 mt-1 font-mono">
                          {item.time}
                        </span>
                      )}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-gray-400 py-1 text-[11px]">暂无动态</div>
          )}
        </div>
      </section>
    </div>
  )
}

export default Announcement
