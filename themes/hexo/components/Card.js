const Card = ({ children, headerSlot, className = '' }) => {
  return (
    <div
      /* 【核心修改 1：加入毛玻璃滤镜内联样式】 */
      style={{ backdropFilter: 'blur(15px)', WebkitBackdropFilter: 'blur(15px)' }}
      /* 【核心修改 2：替换背景为强制透明 RGBA，修改边框颜色】 */
      className={`border dark:border-gray-800 rounded-xl lg:p-6 p-4 mb-6 !bg-[rgba(255,255,255,0.6)] dark:!bg-[rgba(15,17,24,0.6)] ${className}`}
    >
      {headerSlot}
      {children}
    </div>
  )
}

export default Card
