import { BeiAnGongAn } from '@/components/BeiAnGongAn'
import BeiAnSite from '@/components/BeiAnSite'
import PoweredBy from '@/components/PoweredBy'
import { siteConfig } from '@/lib/config'

const Footer = ({ title }) => {
  return (
    <footer className='relative z-10 dark:bg-black flex-shrink-0 bg-hexo-light-gray justify-center text-center m-auto w-full leading-6 text-gray-600 dark:text-gray-100 text-sm p-6'>
      
      {/* 美化后的版权与作者信息 */}
      <div className='flex items-center justify-center font-mono tracking-wider text-gray-500 dark:text-gray-400'>
        <i className='fas fa-copyright mr-2' /> 
        <span>Since 2026</span>
        <i className='mx-3 animate-pulse fas fa-heart text-red-500' />
        <a
          href={siteConfig('LINK')}
          className='font-bold text-gray-700 dark:text-gray-200 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors duration-300'>
          {siteConfig('AUTHOR')}
        </a>
      </div>

      {/* 其他站点信息 */}
      <div className='mt-1'>
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
        
        {/* 固定文本 */}
        <h1 className='text-xs pt-4 text-light-400 dark:text-gray-500 tracking-widest'>
          | Evan Space |
        </h1>
        
        <PoweredBy className='justify-center mt-2' />
      </div>
    </footer>
  )
}

export default Footer
