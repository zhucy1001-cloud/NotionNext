import { useEffect } from 'react'

export default function GoogleTranslate() {
  useEffect(() => {
    // 代理路径（对应 next.config.js 中的 source）
    const proxyPath = '/google-api'

    // 1. 黑魔法：全局拦截动态创建的脚本和样式表请求 (JSONP 和 CSS)
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

    // 2. 黑魔法：以防万一，拦截底层 XHR 和 Fetch 请求
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

    // 3. 注入翻译按钮样式修正（干掉原版丑陋的谷歌 Logo 和弹窗 Banner）
    const style = document.createElement('style')
    style.innerHTML = `
      .goog-te-gadget { color: transparent !important; font-size: 0; }
      .goog-te-gadget .goog-te-combo { 
        color: #666; font-size: 13px; border-radius: 6px; padding: 2px 6px; 
        outline: none; border: 1px solid rgba(156, 163, 175, 0.4); 
        background: transparent; cursor: pointer; transition: all 0.2s;
      }
      .dark .goog-te-gadget .goog-te-combo { color: #ccc; background: rgba(31, 41, 55, 0.8); border-color: rgba(255, 255, 255, 0.2); }
      .goog-logo-link, .goog-te-banner-frame, #goog-gt-tt { display: none !important; }
      body { top: 0 !important; }
    `
    document.head.appendChild(style)

    // 4. 挂载入口脚本，点燃发动机
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        { pageLanguage: 'auto', autoDisplay: false },
        'google_translate_element'
      )
    }
    const script = document.createElement('script')
    script.src = `${proxyPath}/translate_a/element.js?cb=googleTranslateElementInit`
    document.body.appendChild(script)
  }, [])

  return (
    // 渲染翻译下拉框的容器，尺寸用 scale 微缩一下让它在导航栏不突兀
    <div id="google_translate_element" className="inline-block relative z-50 transform scale-95 origin-right"></div>
  )
}
