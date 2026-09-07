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

    // 2. 注入极其安全且美观的 CSS，确保绝对不会隐形
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

      /* 下拉框美化：保证字体正常显示，带有现代感圆角和边框 */
      .goog-te-gadget .goog-te-combo {
        font-size: 14px !important;
        font-family: inherit !important;
        padding: 4px 8px !important;
        border-radius: 6px !important;
        outline: none !important;
        cursor: pointer !important;
        background-color: rgba(255, 255, 255, 0.8) !important;
        border: 1px solid rgba(209, 213, 219, 0.8) !important;
        color: #1f2937 !important;
      }
      .goog-te-gadget .goog-te-combo:hover {
        background-color: #ffffff !important;
        border-color: #9ca3af !important;
      }

      /* 暗黑模式自适应 */
      .dark .goog-te-gadget .goog-te-combo {
        background-color: rgba(31, 41, 55, 0.8) !important;
        border: 1px solid rgba(75, 85, 99, 0.8) !important;
        color: #f3f4f6 !important;
      }
      .dark .goog-te-gadget .goog-te-combo:hover {
        background-color: rgba(31, 41, 55, 1) !important;
        border-color: #9ca3af !important;
      }
    `
    document.head.appendChild(style)

    // 3. 初始化 Google 翻译
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        { 
          pageLanguage: 'auto', 
          autoDisplay: false,
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE
        },
        'google_translate_element'
      )
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
      <div id="google_translate_element"></div>
    </div>
  )
}
