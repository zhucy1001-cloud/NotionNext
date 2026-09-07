import { useEffect, useState } from 'react'

export default function GoogleTranslate() {
  const [currentLang, setCurrentLang] = useState('zh-CN')

  useEffect(() => {
    // 1. 检查当前语言状态
    const match = document.cookie.match(/googtrans=\/([^;]+)/)
    if (match && match[1]) {
      // 格式通常是 zh-CN/en 或者直接是 en
      const lang = match[1].split('/')[1] || match[1]
      setCurrentLang(lang)
    }

    const proxyPath = '/google-api'

    // 2. 代理拦截脚本与请求
    const originalCreateElement = document.createElement
    document.createElement = function (tagName) {
      const el = originalCreateElement.call(document, tagName)
      if (tagName.toLowerCase() === 'script' || tagName.toLowerCase() === 'link') {
        const originalSetAttribute = el.setAttribute
        el.setAttribute = function (name, value) {
          if ((name === 'src' || name === 'href') && value && value.includes('translate.googleapis.com')) {
            value = value.replace('https://translate.googleapis.com', proxyPath)
            value = value.replace('//translate.googleapis.com', proxyPath)
          }
          originalSetAttribute.call(this, name, value)
        }
      }
      return el
    }

    const origOpen = XMLHttpRequest.prototype.open
    XMLHttpRequest.prototype.open = function(method, url) {
      if (typeof url === 'string' && url.includes('translate.googleapis.com')) {
        url = url.replace('https://translate.googleapis.com', proxyPath).replace('//translate.googleapis.com', proxyPath)
      }
      return origOpen.apply(this, arguments)
    }

    // 3. 注入样式：清除 Google 默认横幅和各种噪音
    const style = document.createElement('style')
    style.innerHTML = `
      .goog-te-banner-frame { display: none !important; }
      .skiptranslate { display: none !important; }
      body { top: 0 !important; position: relative !important; }
      html { top: 0 !important; }
      #goog-gt-tt { display: none !important; }
      .goog-text-highlight { background-color: transparent !important; box-shadow: none !important; }
    `
    document.head.appendChild(style)

    // 4. 加载官方翻译核心，并在其自带下拉生成后隐藏它（作为内核驱动）
    window.googleTranslateElementInit = () => {
      if (!document.getElementById('hidden_google_translate_div')) {
        const div = document.createElement('div')
        div.id = 'hidden_google_translate_div'
        div.style.display = 'none'
        document.body.appendChild(div)
        new window.google.translate.TranslateElement(
          { pageLanguage: 'auto', autoDisplay: false },
          'hidden_google_translate_div'
        )
      }
    }

    if (!document.getElementById('google-translate-script')) {
      const script = document.createElement('script')
      script.id = 'google-translate-script'
      script.src = `${proxyPath}/translate_a/element.js?cb=googleTranslateElementInit`
      document.body.appendChild(script)
    }
  }, [])

  // 5. 切换语言事件：通过操作 Google 底层的 select 并种下 Cookie
  const handleLanguageChange = (e) => {
    const lang = e.target.value
    setCurrentLang(lang)
    
    if (lang === 'zh-CN') {
      // 恢复中文：清除 Cookie
      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${location.hostname}`
    } else {
      // 切换目标语言
      document.cookie = `googtrans=/auto/${lang}; path=/; domain=${location.hostname}`
      document.cookie = `googtrans=/auto/${lang}; path=/;`
    }
    window.location.reload()
  }

  return (
    <div className="inline-block relative z-50 mx-2 flex items-center">
      {/* 采用高度契合 Hexo 主题风格的精致原生下拉框，绝对不会渲染失败 */}
      <select 
        value={currentLang} 
        onChange={handleLanguageChange}
        className="text-xs font-medium py-1 px-2 rounded-md outline-none cursor-pointer transition-all duration-200 bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20 text-gray-700 dark:text-gray-200 border border-black/10 dark:border-white/10"
      >
        <option value="zh-CN" className="bg-white dark:bg-gray-800 text-black dark:text-white">中文 (简体)</option>
        <option value="en" className="bg-white dark:bg-gray-800 text-black dark:text-white">English</option>
        <option value="ja" className="bg-white dark:bg-gray-800 text-black dark:text-white">日本語</option>
        <option value="ko" className="bg-white dark:bg-gray-800 text-black dark:text-white">한국어</option>
      </select>
    </div>
  )
}
