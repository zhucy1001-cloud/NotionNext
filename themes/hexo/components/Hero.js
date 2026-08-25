// import Image from 'next/image'
import LazyImage from '@/components/LazyImage'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { loadExternalResource } from '@/lib/utils'
import { useEffect, useState } from 'react'
import CONFIG from '../config'
import NavButtonGroup from './NavButtonGroup'

let wrapperTop = 0

// 🎯 已为你填好来自你 GitHub 仓库的 5 张图片永久直链库
const MY_COVER_GALLERY = [
  'https://raw.githubusercontent.com/zhucy1001-cloud/NotionNext/refs/heads/main/MyImage/main.jpeg',
  'https://raw.githubusercontent.com/zhucy1001-cloud/NotionNext/refs/heads/main/MyImage/%E6%A2%85%E5%A5%94.jpeg',
  'https://raw.githubusercontent.com/zhucy1001-cloud/NotionNext/refs/heads/main/MyImage/%E6%B3%95%E6%8B%89%E5%88%A9.jpeg',
  'https://raw.githubusercontent.com/zhucy1001-cloud/NotionNext/refs/heads/main/MyImage/%E7%BA%A2%E7%89%9B.jpeg',
  'https://raw.githubusercontent.com/zhucy1001-cloud/NotionNext/refs/heads/main/MyImage/%E8%BF%88%E5%87%AF%E8%BD%AE.jpeg'
]

/**
 * 顶部全屏大图
 * @returns
 */
const Hero = props => {
  const [typed, changeType] = useState()
  const { siteInfo } = props
  const { locale } = useGlobal()

  // 🎯 每次刷新时安全地随机抽出一张封面图
const [currentCover] = useState(() => {
  if (MY_COVER_GALLERY.length > 0) {
    const randomIndex = Math.floor(Math.random() * MY_COVER_GALLERY.length)
    return MY_COVER_GALLERY[randomIndex]
  }
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

      {/* 🎯 封面图：使用 GitHub 永久直链随机展示 */}
      <LazyImage
        priority
        id='header-cover'
        alt={siteInfo?.title}
        src={currentCover || siteInfo?.pageCover}
        width={1920}
        height={1080}
        className={`header-cover w-full h-screen object-cover object-center ${siteConfig('HEXO_HOME_NAV_BACKGROUND_IMG_FIXED', null, CONFIG) ? 'fixed' : ''}`}
      />
    </header>
  )
}

export default Hero
