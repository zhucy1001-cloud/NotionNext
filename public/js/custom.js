// Weglot 翻译按钮 + 彻底隐藏大标题与心情随笔 + 原生底部流式布局（完美保留打字机回退效果）
(function() {
  // 1. 全局样式：隐藏大标题、心情随笔卡片，并调整首屏容器让打字机天然处于底部
  var nativeStyle = document.createElement('style');
  nativeStyle.innerHTML = `
    /* 🎯 彻底隐藏中央大标题 */
    h1, .hero-title {
      display: none !important;
    }

    /* 🎯 让首屏 Hero 区域的内部元素向下对齐，使跑马灯自然沉底，不破坏打字机生命周期 */
    .group.flex.flex-col {
      justify-content: flex-end !important;
      padding-bottom: 25px !important;
      min-height: 85vh !important; /* 确保占据大半个首屏高度，让底部空间完美展开 */
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

    // ==================== 3. 持续清理大标题与心情随笔 ====================
    setInterval(function() {
      var allHeaders = document.querySelectorAll('h1, div, span');
      allHeaders.forEach(function-remove(el) {
        if (el.innerText && el.innerText.trim() === 'Evan Space' && el.children.length === 0) {
          var rect = el.getBoundingClientRect();
          if (rect.top > 60 && rect.top < 300) {
            el.style.setProperty('display', 'none', 'important');
          }
        }
      });

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
