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
 * 顶部全屏大图
 * @returns
 */
const Hero = props => {
  const [typed, changeType] = useState()
  const { siteInfo } = props
  const { locale } = useGlobal()
  
  // 🎯 已为你填好来自 Notion 的 5 张图片链接库
  const MY_COVER_GALLERY = [
    'https://app.notion.com/image/attachment%3A9af83a15-f95d-4d17-ab37-746d4e0fba2c%3A%E7%BA%A2%E7%89%9B.jpeg?table=block&id=3c77dce6-6b89-8077-9365-c392b8b7e781&spaceId=0d47dce6-6b89-812f-b304-0003dabc6200&width=2000&userId=3c4d872b-594c-810d-b8a9-0002e126da87&cache=v2&imgBuildSrc=requestProxiedImageUrl',
    'https://app.notion.com/image/attachment%3A147b10e0-b385-4cbd-8b3a-4b9ef800bbf7%3A%E6%B3%95%E6%8B%89%E5%88%A9.jpeg?table=block&id=3c77dce6-6b89-801b-bf71-c6658a7f6c1f&spaceId=0d47dce6-6b89-812f-b304-0003dabc6200&width=2000&userId=3c4d872b-594c-810d-b8a9-0002e126da87&cache=v2&imgBuildSrc=requestProxiedImageUrl',
    'https://app.notion.com/image/attachment%3A2c37bb44-0f2a-4170-9c09-802bb3dd275b%3A%E6%A2%85%E5%A5%94.jpeg?table=block&id=3c77dce6-6b89-8023-8825-d55e902686e4&spaceId=0d47dce6-6b89-812f-b304-0003dabc6200&width=2000&userId=3c4d872b-594c-810d-b8a9-0002e126da87&cache=v2&imgBuildSrc=requestProxiedImageUrl',
    'https://app.notion.com/image/attachment%3A71a22a38-f120-421c-9e42-3fcb6128b16e%3A%E8%BF%88%E5%87%AF%E8%BD%AE.jpeg?table=block&id=3c77dce6-6b89-80fe-bc14-df4f01d10cb7&spaceId=0d47dce6-6b89-812f-b304-0003dabc6200&width=2000&userId=3c4d872b-594c-810d-b8a9-0002e126da87&cache=v2&imgBuildSrc=requestProxiedImageUrl',
    'https://app.notion.com/image/attachment%3A61f43692-1f7c-4c2d-9bfe-5a93041cbbc9%3Amain.jpeg?table=block&id=3c77dce6-6b89-80f1-b856-cbce5f7ef0c6&spaceId=0d47dce6-6b89-812f-b304-0003dabc6200&width=2000&userId=3c4d872b-594c-810d-b8a9-0002e126da87&cache=v2&imgBuildSrc=requestProxiedImageUrl'
  ]

  // 🎯 每次刷新页面时，随机从这 5 张图中抽出一张
  const [currentCover, setCurrentCover] = useState('')

  useEffect(() => {
    const validImages = MY_COVER_GALLERY.filter(Boolean)
    if (validImages.length > 0) {
      const randomIndex = Math.floor(Math.random() * validImages.length)
      setCurrentCover(validImages[randomIndex])
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

      {/* 🎯 封面图：优先显示随机抽中的 Notion 图片，如果未加载则降级使用默认封面 */}
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
