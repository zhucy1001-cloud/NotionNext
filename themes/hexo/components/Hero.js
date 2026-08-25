// import Image from 'next/image'
import LazyImage from '@/components/LazyImage'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { loadExternalResource } from '@/lib/utils'
import { useEffect, useState } from 'react'
import CONFIG from '../config'
import NavButtonGroup from './NavButtonGroup'

let wrapperTop = 0

const Hero = props => {
  const [typed, changeType] = useState()
  const { siteInfo } = props
  const { locale } = useGlobal()

  // 1. 默认先使用博客配置的封面（防止网页刚打开时背景是黑的）
  const [currentCover, setCurrentCover] = useState(siteInfo?.pageCover || '')

  // 🎯 2. 核心魔法：自动扫描 GitHub 文件夹里的图片
  useEffect(() => {
    const fetchGithubImages = async () => {
      const cacheKey = 'github_wallpapers'
      const cacheTimeKey = 'github_wallpapers_time'
      const cached = localStorage.getItem(cacheKey)
      const cacheTime = localStorage.getItem(cacheTimeKey)
      const now = Date.now()

      let images = []

      // 为了加载更快并防止被 GitHub 限制，如果 1 小时内已经扫描过，就直接用本地记录
      if (cached && cacheTime && (now - parseInt(cacheTime) < 3600000)) {
        images = JSON.parse(cached)
      } else {
        try {
          // 自动获取你在 GitHub 的 MyImage/top 文件夹下的所有文件列表
          const res = await fetch('https://api.github.com/repos/zhucy1001-cloud/NotionNext/contents/MyImage/top')
          const data = await res.json()
          
          if (Array.isArray(data)) {
            // 自动筛选出所有的图片文件 (支持 jpeg, jpg, png, gif, webp)
            images = data
              .filter(file => file.type === 'file' && file.name.match(/\.(jpeg|jpg|png|gif|webp)$/i))
              .map(file => file.download_url)
            
            // 把扫到的图片列表存起来
            if (images.length > 0) {
              localStorage.setItem(cacheKey, JSON.stringify(images))
              localStorage.setItem(cacheTimeKey, now.toString())
            }
          }
        } catch (error) {
          console.error('自动扫描 GitHub 图片失败:', error)
        }
      }

      // 3. 从扫到的图片中随机抽选一张，替换当前背景！
      if (images.length > 0) {
        const randomIndex = Math.floor(Math.random() * images.length)
        setCurrentCover(images[randomIndex])
      }
    }

    fetchGithubImages()
  }, [])

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
    <header id='header' style={{ zIndex: 1 }} className='w-full h-screen relative bg-black'>
      <div className='text-white absolute bottom-0 flex flex-col h-full items-center justify-end w-full '>
        <div className='mt-2 h-12 items-center text-center font-light shadow-text text-lg'>
          <span id='typed' />
        </div>
        {siteConfig('HEXO_HOME_NAV_BUTTONS', null, CONFIG) && (
          <NavButtonGroup {...props} />
        )}
        <div onClick={scrollToWrapper} className='z-10 cursor-pointer w-full text-center py-4 text-3xl absolute bottom-10 text-white [text-shadow:0_0_0.1em_black,0_0_0.2em_black]'>
          <div className='opacity-70 animate-bounce text-xs'>  
            {siteConfig('HEXO_SHOW_START_READING', null, CONFIG) && locale.COMMON.START_READING}
          </div>
          <i className='opacity-70 animate-bounce fas fa-angle-down' />
        </div>
      </div>
      <LazyImage
        priority
        id='header-cover'
        alt={siteInfo?.title}
        src={currentCover}
        width={1920}
        height={1080}
        className={`header-cover w-full h-screen object-cover object-center ${siteConfig('HEXO_HOME_NAV_BACKGROUND_IMG_FIXED', null, CONFIG) ? 'fixed' : ''}`}
      />
    </header>
  )
}

export default Hero
