import { useGlobal } from '@/lib/global'
import dynamic from 'next/dynamic'

const NotionPage = dynamic(() => import('@/components/NotionPage'))

const Announcement = ({ post, className }) => {
  const { locale } = useGlobal()
  if (post?.blockMap) {
    return (
      <div className={className}>
        <section 
          id='announcement-wrapper' 
          /* 【加入毛玻璃滤镜】 */
          style={{ backdropFilter: 'blur(15px)', WebkitBackdropFilter: 'blur(15px)' }}
          /* 【强制透明背景并微调边框颜色】 */
          className='dark:text-gray-300 border dark:border-gray-800 rounded-xl lg:p-6 p-4 !bg-[rgba(255,255,255,0.6)] dark:!bg-[rgba(15,17,24,0.6)]'
        >
          <div><i className='mr-2 fas fa-bullhorn' />{locale.COMMON.ANNOUNCEMENT}</div>
          {post && (
            <div id='announcement-content'>
              <NotionPage post={post} className='text-center ' />
            </div>
          )}
        </section>
      </div>
    )
  } else {
    return <></>
  }
}
export default Announcement
