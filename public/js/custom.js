// Weglot 翻译按钮 + 零延迟首屏大标题净化 + 跑马灯原生底部悬浮（完美保留回退特效）
(function() {
  // ==================== 1. 首帧硬核 CSS 拦截（一出生就让大标题消失，让打字机呆在底部） ====================
  var ultimateStyle = document.createElement('style');
  ultimateStyle.innerHTML = `
    /* 🎯 零延迟消灭首屏中央大标题（不管什么状态，只要是首屏大标题一律不准显示） */
    h1.text-4xl,
    h1.font-bold,
    header + div h1,
    .hero-title,
    div[class*="hero"] h1 {
      display: none !important;
      opacity: 0 !important;
      visibility: hidden !important;
    }

    /* 🎯 彻底消灭“心情随笔”卡片 */
    div, a {
      /* 后续由 JS 动态精准查杀 */
    }

    /* 🎯 核心：不搬运 DOM，直接用绝对定位将打字机及签名行在第一帧就锁死在底部，保护 Typed.js 回退特效 */
    #typed {
      /* 保持打字机内部样式正常 */
    }
    
    /* 精准锁定打字机所在的行容器，直接钉在底部上方 */
    .group.flex.flex-col.items-center,
    div:has(> #typed) {
      position: absolute !important;
      bottom: 45px !important; /* 位于向下箭头上方，完美间距 */
      left: 0 !important;
      right: 0 !important;
      margin: auto !important;
      z-index: 999999 !important;
      text-align: center !important;
      width: 100% !important;
      max-width: 900px !important;
    }
  `;
  document.head.appendChild(ultimateStyle);

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

    // ==================== 3. 持续巡逻清道夫（查杀大标题与心情随笔） ====================
    setInterval(function() {
      // 暴力查杀任何漏网的 Evan Space 大标题
      var allElements = document.querySelectorAll('h1, h2, div, span');
      allElements.forEach(function(el) {
        if (el.innerText && el.innerText.trim() === 'Evan Space' && el.children.length === 0) {
          var rect = el.getBoundingClientRect();
          if (rect.top > 50 && rect.top < 400) {
            el.style.setProperty('display', 'none', 'important');
          }
        }
      });

      // 强力查杀“心情随笔”卡片
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
    }, 200);

  }, 100);
})();
