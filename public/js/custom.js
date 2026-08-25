// Weglot 翻译按钮 + 暴力查杀大标题与心情随笔 + 首帧隐身防闪烁技术
(function() {
  // ==================== 0. 首帧防闪烁：网页一加载立刻把打字机容器设为透明 ====================
  var antiFlashStyle = document.createElement('style');
  antiFlashStyle.innerHTML = `
    #typed, div:has(> #typed) {
      opacity: 0 !important;
      transition: opacity 0.3s ease-in;
    }
  `;
  document.head.appendChild(antiFlashStyle);

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

    // ==================== 2. 永久巡逻进程：精准查杀大标题、心情随笔、并下沉跑马灯 ====================
    setInterval(function() {
      // A. 暴力查杀中央大标题 (遍历所有 h1，只要包含 Evan Space 且在首屏就隐藏)
      var h1List = document.querySelectorAll('h1');
      h1List.forEach(function(h1) {
        if (h1.innerText && h1.innerText.includes('Evan Space')) {
          // 排除导航栏可能存在的 logo
          if (h1.getBoundingClientRect().top > 50) {
            h1.style.display = 'none';
          }
        }
      });

      // B. 彻底消灭“心情随笔”卡片
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

      // C. 跑马灯瞬间转移到底部，并解除隐身状态
      var typedElem = document.getElementById('typed');
      if (typedElem) {
        var subContainer = typedElem.parentElement;
        if (subContainer && subContainer !== document.body) {
          subContainer.style.position = 'absolute';
          subContainer.style.bottom = '15px'; // 位于箭头下方
          subContainer.style.left = '0';
          subContainer.style.right = '0';
          subContainer.style.margin = 'auto';
          subContainer.style.zIndex = '20';
          subContainer.style.textAlign = 'center';
          subContainer.style.width = '100%';
          subContainer.style.maxWidth = '900px';
          
          // 移位完成后，瞬间显形！
          subContainer.style.opacity = '1';
        }
      }
    }, 200); // 频率提高到每 0.2 秒巡逻一次，确保以最快速度完成查杀和搬运

  }, 500);
})();
