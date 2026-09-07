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

    // 2. 注入 CSS：干掉横幅，并把 Google 原生的下拉框穿上好看的“皮肤”
    const style = document.createElement('style')
    style.innerHTML = `
      .goog-te-banner-frame { display: none !important; }
      .skiptranslate { display: none !important; }
      body { top: 0 !important; position: relative !important; }
      html { top: 0 !important; }
      #goog-gt-tt { display: none !important; }
      .goog-text-highlight { background-color: transparent !important; box-shadow: none !important; }
      .goog-logo-link { display: none !important; }
      .goog-te-gadget span { display: none !important; }

      /* 让 Google 自带的容器文字变透明，只保留它生成的原生 select 下拉菜单 */
      .goog-te-gadget {
        font-size: 0px !important;
        color: transparent !important;
      }

      /* 核心：用 CSS 精心美化 Google 生成的下拉框，让它拥有全量语言且颜值在线 */
      .goog-te-gadget .goog-te-combo {
        font-size: 13px !important;
        font-family: inherit !important;
        padding: 4px 8px !important;
        border-radius: 6px !important;
        outline: none !important;
        cursor: pointer !important;
        transition: all 0.2s ease-in-out !important;
        background-color: rgba(255, 255, 255, 0.15) !important;
        border: 1px solid rgba(209, 213, 219, 0.3) !important;
        color: #374151 !important;
      }
      .goog-te-gadget .goog-te-combo:hover {
        background-color: rgba(255, 255, 255, 0.3) !important;
        border-color: rgba(156, 163, 175, 0.6) !important;
      }

      /* 暗黑模式自适应 */
      .dark .goog-te-gadget .goog-te-combo {
        background-color: rgba(31, 41, 55, 0.5) !important;
        border: 1px solid rgba(75, 85, 99, 0.4) !important;
        color: #d1d5db !important;
      }
      .dark .goog-te-gadget .goog-te-combo:hover {
        background-color: rgba(31, 41, 55, 0.8) !important;
        border-color: rgba(156, 163, 175, 0.6) !important;
      }
    `
    document.head.appendChild(style)

    // 3. 初始化 Google 翻译组件，让它把全世界所有官方支持的语言全部加载出来
    window.googleTranslateElementInit = () => {
      if (!document.getElementById('google_translate_element').hasChildNodes()) {
        new window.google.translate.TranslateElement(
          { 
            pageLanguage: 'auto', 
            autoDisplay: false,
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE
          },
          'google_translate_element'
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

  return (
    <div className="inline-block relative z-50 mx-2 flex items-center">
      {/* 挂载点：Google 会自动在这里生成包含完整世界语言的精美下拉菜单 */}
      <div id="google_translate_element"></div>
    </div>
  )
}
