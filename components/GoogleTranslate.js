import { useEffect } from 'react'

export default function GoogleTranslate() {
  useEffect(() => {
    const proxyPath = '/google-api'

    // 1. 代理拦截
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
        
        const propertyName = tagName.toLowerCase() === 'script' ? 'src' : 'href'
        Object.defineProperty(el, propertyName, {
          set(val) {
            if (val && val.includes('translate.googleapis.com')) {
              val = val.replace('https://translate.googleapis.com', proxyPath)
              val = val.replace('//translate.googleapis.com', proxyPath)
            }
            originalSetAttribute.call(el, propertyName, val)
          },
          get() { return el.getAttribute(propertyName) }
        })
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
    const origFetch = window.fetch
    window.fetch = async function(...args) {
      if (typeof args[0] === 'string' && args[0].includes('translate.googleapis.com')) {
        args[0] = args[0].replace('https://translate.googleapis.com', proxyPath).replace('//translate.googleapis.com', proxyPath)
      }
      return origFetch.apply(this, args)
    }

    // 2. 注入精细化美化 CSS，完美适配 Hexo 主题的亮色/暗黑模式
    const style = document.createElement('style')
    style.innerHTML = `
      /* 隐藏顶部的黑色横幅和悬浮提示 */
      .goog-te-banner-frame { display: none !important; }
      .skiptranslate { display: none !important; }
      body { top: 0 !important; position: relative !important; }
      html { top: 0 !important; }
      #goog-gt-tt { display: none !important; }
      .goog-text-highlight { background-color: transparent !important; box-shadow: none !important; }

      /* 美化 Google 翻译的外层容器，让它完美融入导航栏 */
      .goog-te-gadget {
        font-size: 0px !important;
        color: transparent !important;
      }
      
      /* 隐藏 Google 丑陋的文字 Logo */
      .goog-logo-link {
        display: none !important;
      }
      .goog-te-gadget span {
        display: none !important;
      }

      /* 精心雕琢下拉选择框，使其风格与网站自带按钮统一 */
      .goog-te-gadget .goog-te-combo {
        font-size: 13px !important;
        font-family: inherit !important;
        padding: 4px 10px !important;
        border-radius: 6px !important;
        outline: none !important;
        cursor: pointer !important;
        transition: all 0.2s ease-in-out !important;
        /* 默认浅色模式样式：半透明白底，细腻边框，契合毛玻璃导航栏 */
        background-color: rgba(255, 255, 255, 0.6) !important;
        border: 1px solid rgba(209, 213, 219, 0.6) !important;
        color: #374151 !important;
      }

      /* 悬停效果 */
      .goog-te-gadget .goog-te-combo:hover {
        border-color: rgba(156, 163, 175, 0.9) !important;
        background-color: rgba(255, 255, 255, 0.9) !important;
      }

      /* 暗黑模式适配：自动切换为暗色毛玻璃背景与浅灰文字 */
      .dark .goog-te-gadget .goog-te-combo {
        background-color: rgba(31, 41, 55, 0.7) !important;
        border: 1px solid rgba(75, 85, 99, 0.6) !important;
        color: #d1d5db !important;
      }
      .dark .goog-te-gadget .goog-te-combo:hover {
        background-color: rgba(31, 41, 55, 0.9) !important;
        border-color: rgba(156, 163, 175, 0.8) !important;
      }
    `
    document.head.appendChild(style)

    // 3. 初始化 Google 翻译组件
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        { 
          pageLanguage: 'auto', 
          autoDisplay: false,
          // 如果你希望限制只显示部分语言，可以在这里配置，目前默认包含所有语言
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE
        },
        'google_translate_element'
      )
    }

    // 防止重复注入脚本
    if (!document.getElementById('google-translate-script')) {
      const script = document.createElement('script')
      script.id = 'google-translate-script'
      script.src = `${proxyPath}/translate_a/element.js?cb=googleTranslateElementInit`
      document.body.appendChild(script)
    }
  }, [])

  return (
    <div className="inline-block relative z-50 mx-1 flex items-center">
      {/* 渲染官方下拉菜单挂载点 */}
      <div id="google_translate_element"></div>
    </div>
  )
}
