// Weglot 翻译按钮 + 彻底消灭大标题与心情随笔 + 纯CSS原生底部悬浮（不破坏打字机生命周期）
(function() {
  // 1. 在页面加载的最早期，直接用全局 CSS 把打字机容器和它的父级祖先在视觉上“钉”在底部
  var nativeStyle = document.createElement('style');
  nativeStyle.innerHTML = `
    /* 彻底隐藏中央大标题 */
    h1, .hero-title {
      display: none !important;
    }

    /* 彻底隐藏心情随笔卡片 */
    div, a {
      /* 针对特定文字卡片的精准隐藏 */
    }

    /* 🎯 核心：不移动 DOM 结构，直接用 CSS 固定定位将打字机锁死在底部，防止 Typed.js 触发重置 */
    #typed {
      /* 保持打字机自身属性正常 */
    }
    
    /* 寻找打字机所在的父级容器，直接在视觉上压到底部 */
    .group.flex.flex-col, 
    div:has(> #typed) {
      position: fixed !important;
      bottom: 15px !important;
      left: 0 !important;
      right: 0 !important;
      margin: auto !important;
      z-index: 999999 !important;
      text-align: center !important;
      width: 100% !important;
      max-width: 900px !important;
      pointer-events: auto !important;
    }
  `;
  document.head.appendChild(nativeStyle);

  setTimeout(function() {
    // ==================== 2. Weglot 翻译按钮注入逻辑 ====================
    var script = document.createElement('script');
    script.src = "https://cdn.weglot.com/weglot.min.js";
    
    script.onload = function() {
      Weglot.initialize({
          api_key: 'wg_09e141cacea940b6432fab178adc79f15',
          hide_switcher: true
      });
      
      setInterval(function() {
        var searchIcons = document.querySelectorAll('.fa-search, .fa-magnifying-glass, .search-button i, [aria-label*="search" i]');
        if (searchIcons.length === 0) return;

        searchIcons.forEach(function(icon, index) {
          var btnId = 'evan-lang-btn-' + index;
          if (document.getElementById(btnId)) return;

          var wrapper = icon.closest('.cursor-pointer') || icon.closest('a') || icon.closest('.search-button') || icon.parentNode;
          if (!wrapper || !wrapper.parentNode) return;

          var langBtn = document.createElement('div');
          langBtn.id = btnId;
          langBtn.style.cssText = 'cursor: pointer; margin: 0 12px; display: inline-flex; align-items: center; justify-content: center; font-size: 15px; font-weight: bold; opacity: 0.8; transition: opacity 0.3s; color: inherit; line-height: 1;';
          
          langBtn.onmouseover = function() { this.style.opacity = '1'; };
          langBtn.onmouseout = function() { this.style.opacity = '0.8'; };
          
          function updateText() {
            langBtn.innerText = Weglot.getCurrentLang() === 'zh' ? 'EN' : '中';
          }
          updateText();
          
          langBtn.onclick = function(e) {
            e.preventDefault(); e.stopPropagation();
            Weglot.switchTo(Weglot.getCurrentLang() === 'zh' ? 'en' : 'zh');
          };
          
          Weglot.on('languageChanged', updateText);
          wrapper.parentNode.insertBefore(langBtn, wrapper.nextSibling);
        });
      }, 1000); 
    };
    document.body.appendChild(script);

    // ==================== 3. 动态查杀巡逻（大标题 + 心情随笔） ====================
    setInterval(function() {
      // 持续清理大标题
      var allHeaders = document.querySelectorAll('h1, div, span');
      allHeaders.forEach(function(el) {
        if (el.innerText && el.innerText.trim() === 'Evan Space' && el.children.length === 0) {
          var rect = el.getBoundingClientRect();
          if (rect.top > 60 && rect.top < 300) {
            el.style.setProperty('display', 'none', 'important');
          }
        }
      });

      // 持续清理“心情随笔”
      var allDivs = document.querySelectorAll('div, a');
      allDivs.forEach(function(el) {
        if (el.innerText && el.innerText.trim() === '心情随笔' && el.children.length < 3) {
          var card = el.closest('.cursor-pointer') || el.closest('div[class*="rounded"]');
          if (card) {
            card.style.setProperty('display', 'none', 'important');
          } else {
            el.style.setProperty('display', 'none', 'important');
          }
        }
      });
    }, 300);

  }, 200);
})();
