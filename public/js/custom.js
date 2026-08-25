// Weglot 翻译按钮 + 隐藏标题与心情随笔 + 跑马灯首帧直达底部
setTimeout(function() {
  // ==================== 1. Weglot 翻译按钮注入逻辑 ====================
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

  // ==================== 2. 全局 CSS 拦截：消灭标题、消灭心情随笔、跑马灯首帧定位 ====================
  var style = document.createElement('style');
  style.innerHTML = `
    /* 🎯 目标 1：彻底隐藏屏幕中间的 "Evan Space" 主标题 */
    h1.text-4xl.font-bold,
    .hero-title,
    header h1 {
      display: none !important;
    }

    /* 🎯 目标 2：通过 CSS 直接锁定打字机跑马灯，从第一帧起就呆在底部，绝对不闪烁！ */
    #typed, 
    div:has(> #typed) {
      position: absolute !important;
      bottom: 15px !important;
      left: 0 !important;
      right: 0 !important;
      margin: auto !important;
      z-index: 20 !important;
      text-align: center !important;
      width: 100% !important;
      max-width: 900px !important;
    }
  `;
  document.head.appendChild(style);

  // ==================== 3. 动态巡逻清道夫（负责消灭“心情随笔”卡片） ====================
  setInterval(function() {
    var allDivs = document.querySelectorAll('div, a');
    allDivs.forEach(function(el) {
      if (el.innerText && el.innerText.trim() === '心情随笔' && el.children.length < 3) {
        var card = el.closest('.cursor-pointer') || el.closest('div[class*="rounded"]');
        if (card) {
          card.style.display = 'none';
        } else {
          el.style.display = 'none';
        }
      }
    });
  }, 500);

}, 500);
