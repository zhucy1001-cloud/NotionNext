import { useEffect, useState } from 'react'

export default function GoogleTranslate() {
  const [currentLang, setCurrentLang] = useState('zh-CN')

  useEffect(() => {
    // 1. 初始化时检查当前 cookie 中的语言状态
    const match = document.cookie.match(/googtrans=\/([^;]+)/)
    if (match && match[1]) {
      const lang = match[1].split('/')[1] || match[1]
      setCurrentLang(lang)
    }

    const proxyPath = '/google-api'

    // 2. 代理拦截 Google 翻译的所有网络请求和资源
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

    // 3. 注入 CSS 清除顶部横幅和高亮色块
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

    // 4. 在后台静默加载 Google 翻译核心引擎（不依赖它来显示外观）
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

  // 5. 切换语言：种下标准 Google 翻译 Cookie 并刷新
  const handleLanguageChange = (e) => {
    const lang = e.target.value
    setCurrentLang(lang)
    
    if (lang === 'zh-CN') {
      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${location.hostname}`
    } else {
      document.cookie = `googtrans=/auto/${lang}; path=/; domain=${location.hostname}`
      document.cookie = `googtrans=/auto/${lang}; path=/;`
    }
    window.location.reload()
  }

  return (
    <div className="inline-block relative z-50 mx-2 flex items-center">
      {/* 采用完全自主渲染的下拉菜单，绝对秒出、绝不消失，并内置全球主流官方语言 */}
      <select 
        value={currentLang} 
        onChange={handleLanguageChange}
        className="text-xs font-medium py-1 px-2 rounded-md outline-none cursor-pointer transition-all duration-200 bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20 text-gray-700 dark:text-gray-200 border border-black/10 dark:border-white/10"
      >
        <option value="zh-CN" className="bg-white dark:bg-gray-800 text-black dark:text-white">简体中文</option>
        <option value="en" className="bg-white dark:bg-gray-800 text-black dark:text-white">English</option>
        <option value="ja" className="bg-white dark:bg-gray-800 text-black dark:text-white">日本語</option>
        <option value="ko" className="bg-white dark:bg-gray-800 text-black dark:text-white">한국어</option>
        <option value="fr" className="bg-white dark:bg-gray-800 text-black dark:text-white">Français</option>
        <option value="de" className="bg-white dark:bg-gray-800 text-black dark:text-white">Deutsch</option>
        <option value="es" className="bg-white dark:bg-gray-800 text-black dark:text-white">Español</option>
        <option value="ru" className="bg-white dark:bg-gray-800 text-black dark:text-white">Русский</option>
      </select>
    </div>
  )
}
