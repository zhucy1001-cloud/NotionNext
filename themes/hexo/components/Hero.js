// import Image from 'next/image'
import LazyImage from '@/components/LazyImage'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { loadExternalResource } from '@/lib/utils'
import { useEffect, useState } from 'react'
import CONFIG from '../config'
import NavButtonGroup from './NavButtonGroup'

let wrapperTop = 0

/**
 * 顶部全屏大图（支持从 Notion 指定相册页面动态提取图片）
 * @returns
 */
const Hero = props => {
  const [typed, changeType] = useState()
  const { siteInfo, blockMap } = props
  const { locale } = useGlobal()

  // 🎯 动态获取封面图逻辑：
  // 1. 优先尝试从当前 Notion 页面包含的图片中随机抽取
  // 2. 如果没有，则降级使用 siteInfo?.pageCover
  const [currentCover, setCurrentCover] = useState(() => {
    try {
      // 收集页面中所有的图片 URL (Notion 块中的图片)
      const images = []
      if (blockMap && blockMap.block) {
        Object.values(blockMap.block).forEach(b => {
          if (b.value && b.value.type === 'image') {
            const src = b.value.properties?.source?.[0]?.[0] || b.value.format?.block_src
            if (src) {
              // 自动将 Notion 的内部图片转为代理加速链接
              const imageUrl = src.startsWith('http') 
                ? `https://www.notion.so/image/${encodeURIComponent(src)}?table=block&id=${b.value.id}&cache=v2`
                : src
              images.push(imageUrl)
            }
          }
        })
      }

      // 如果在当前页面找到了图片，就随机选一张
      if (images.length > 0) {
        const randomIndex = Math.floor(Math.random() * images.length)
        return images[randomIndex]
      }
    } catch (e) {
      console.error('提取首页壁纸失败:', e)
    }

    // 默认降级封面
    return siteInfo?.pageCover || ''
  })

  const scrollToWrapper = () => {
    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize)
    window.scrollTo({ top: wrapperTop - 2 * rem, behavior: 'smooth' })
  }

  const GREETING_WORDS = siteConfig('GREETING_WORDS').split(',')
  const GREETING_WORDS_TYPE_SPEED = Number(siteConfig('GREETING_WORDS_TYPE_SPEED')) || 200
  const GREETING_WORDS_BACK_SPEED = Number(siteConfig('GREETING_WORDS_BACK_SPEED')) || 100
  
  useEffect(() => {
    updateHeaderHeight()

    if (!typed && window && document.getElementById('typed')) {
      loadExternalResource('/js/typed.min.js', 'js').then(() => {
        if (window.Typed) {
          changeType(
            new window.Typed('#typed', {
              strings: GREETING_WORDS,
              typeSpeed: GREETING_WORDS_TYPE_SPEED,
              backSpeed: GREETING_WORDS_BACK_SPEED,
              backDelay: 400,
              showCursor: true,
              smartBackspace: true
            })
          )
        }
      })
    }

    window.addEventListener('resize', updateHeaderHeight)
    return () => {
      window.removeEventListener('resize', updateHeaderHeight)
    }
  })

  function updateHeaderHeight() {
    requestAnimationFrame(() => {
      const wrapperElement = document.getElementById('wrapper')
      wrapperTop = wrapperElement?.offsetTop
    })
  }

  return (
    <header
      id='header'
      style={{ zIndex: 1 }}
      className='w-full h-screen relative bg-black'>
      <div className='text-white absolute bottom-0 flex flex-col h-full items-center justify-end w-full '>
        {/* 站点标题 */}
        {/* 站点欢迎语 */}
        <div className='mt-2 h-12 items-center text-center font-light shadow-text text-lg'>
          <span id='typed' />
        </div>

        {/* 首页导航大按钮 */}
        {siteConfig('HEXO_HOME_NAV_BUTTONS', null, CONFIG) && (
          <NavButtonGroup {...props} />
        )}

        {/* 滚动按钮 */}
        <div
          onClick={scrollToWrapper}
          className='z-10 cursor-pointer w-full text-center py-4 text-3xl absolute bottom-10 text-white [text-shadow:0_0_0.1em_black,0_0_0.2em_black]'>
          <div className='opacity-70 animate-bounce text-xs'>  
            {siteConfig('HEXO_SHOW_START_READING', null, CONFIG) &&
              locale.COMMON.START_READING}
          </div>
          <i className='opacity-70 animate-bounce fas fa-angle-down' />
        </div>
      </div>

      {/* 🎯 封面图：自动从页面结构中提取并随机展示 */}
      <LazyImage
        priority
        id='header-cover'
        alt={siteInfo?.title}
        src={currentCover || siteInfo?.pageCover}
        width={1920}
        height={1080}
        className={`header-cover w-full h-screen object-cover object-center ${siteConfig('HEXO_HEXO_HOME_NAV_BACKGROUND_IMG_FIXED', null, CONFIG) ? 'fixed' : ''}`}
      />
    </header>
  )
}

export default Hero
