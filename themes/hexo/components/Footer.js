import { BeiAnGongAn } from '@/components/BeiAnGongAn'
import BeiAnSite from '@/components/BeiAnSite'
import PoweredBy from '@/components/PoweredBy'
import { siteConfig } from '@/lib/config'

const Footer = ({ title }) => {
  return (
    <footer className='relative z-10 dark:bg-black flex-shrink-0 bg-hexo-light-gray justify-center text-center m-auto w-full leading-6 text-gray-600 dark:text-gray-100 text-sm p-6'>
      
      {/* 移除了 space-y-2，所有行将紧密贴合 */}
      <div className='flex flex-col items-center justify-center'>
        
        {/* 第 1 行: 版权与作者信息 */}
        <div className='font-mono tracking-wider text-gray-500 dark:text-gray-400'>
          <i className='fas fa-copyright mr-1' /> 
          <span>Since 2026</span>
          <i className='mx-2 animate-pulse fas fa-heart text-red-500' />
          <a
            href={siteConfig('LINK')}
            className='font-bold text-gray-700 dark:text-gray-200 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors duration-300'>
            {siteConfig('AUTHOR')}
          </a>
        </div>

        {/* 第 2 行: 访问量统计 */}
        <div className='text-gray-500 dark:text-gray-400'>
          <BeiAnSite />
          <BeiAnGongAn />
          <span className='hidden busuanzi_container_site_pv'>
            <i className='fas fa-eye' />
            <span className='px-1 busuanzi_value_site_pv'> </span>
          </span>
          <span className='pl-2 hidden busuanzi_container_site_uv'>
            <i className='fas fa-users' />
            <span className='px-1 busuanzi_value_site_uv'> </span>
          </span>
        </div>
        
        {/* 第 3 行: 固定文本 (去除了之前遗留的 pt-4 属性) */}
        <div className='text-xs text-light-400 dark:text-gray-500 tracking-widest'>
          | Evan Space |
        </div>
        
        {/* 第 4 行: Powered By */}
        <PoweredBy className='justify-center' />
        
      </div>
    </footer>
  )
}

export default Footer
