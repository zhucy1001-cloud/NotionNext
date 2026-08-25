// import Image from 'next/image'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { loadExternalResource } from '@/lib/utils'
import { useEffect, useState } from 'react'
import CONFIG from '../config'
import NavButtonGroup from './NavButtonGroup'

let wrapperTop = 0

// 🎯 使用公开稳定的高质量赛车图片直链（你可以随时换成你自己的公开图床链接）
const MY_COVER_GALLERY = [
  'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7',
  'https://images.unsplash.com/photo-1503376780353-7e6692767b70',
  'https://images.unsplash.com/photo-1558981403-c5f9899a28bc',
  'https://images.unsplash.com/photo-1511919884226-fd3cad34687c',
  'https://images.unsplash.com/photo-1502877338535-766e1452684a'
]

/**
 * 顶部全屏大图
 * @returns
 */
const Hero = props => {
  const [typed, changeType] = useState()
  const { siteInfo } = props
  const { locale } = useGlobal()
  
  const [currentCover, setCurrentCover] = useState(siteInfo?.pageCover || '')

  useEffect(() => {
    if (MY_COVER_GALLERY.length > 0) {
      const randomIndex = Math.floor(Math.random() * MY_COVER_GALLERY.length)
      setCurrentCover(MY_COVER_GALLERY[randomIndex])
    }
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
    <header
      id='header'
      style={{ zIndex: 1 }}
      className='w-full h-screen relative bg-black'>
      
      {/* 中间导航大按钮区域 */}
      <div className='text-white absolute inset-0 flex flex-col items-center justify-center w-full pointer-events-none'>
        {siteConfig('HEXO_HOME_NAV_BUTTONS', null, CONFIG) && (
          <div className="pointer-events-auto">
            <NavButtonGroup {...props} />
          </div>
        )}
      </div>

      {/* 底部区域：欢迎语（在上）与滚动箭头（在下） */}
      <div className='text-white absolute bottom-8 left-0 right-0 flex flex-col items-center justify-end w-full z-10'>
        {/* 站点欢迎语 */}
        <div className='mb-6 h-10 items-center text-center font-light shadow-text text-base md:text-lg px-4'>
          <span id='typed' />
        </div>

        {/* 滚动按钮 */}
        <div
          onClick={scrollToWrapper}
          className='cursor-pointer text-center text-2xl text-white [text-shadow:0_0_0.1em_black,0_0_0.2em_black]'>
          <div className='opacity-70 animate-bounce text-xs mb-1'>  
            {siteConfig('HEXO_SHOW_START_READING', null, CONFIG) &&
              locale.COMMON.START_READING}
          </div>
          <i className='opacity-70 animate-bounce fas fa-angle-down' />
        </div>
      </div>

      {/* 封面图 */}
      <img
        id='header-cover'
        alt={siteInfo?.title || 'Cover'}
        src={currentCover || siteInfo?.pageCover}
        className={`header-cover w-full h-screen object-cover object-center ${siteConfig('HEXO_HOME_NAV_BACKGROUND_IMG_FIXED', null, CONFIG) ? 'fixed' : ''}`}
      />
    </header>
  )
}

export default Hero
