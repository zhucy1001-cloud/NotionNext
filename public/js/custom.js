// Weglot 翻译按钮 + 全局首屏容器强行沉底 + 彻底净化大标题与心情随笔
(function() {
  // 1. 注入全屏无死角的强力降维打击 CSS
  var ultimateStyle = document.createElement('style');
  ultimateStyle.innerHTML = `
    /* 🎯 强制让首屏包裹区域变成弹性底部对齐，使所有子元素天然在底部展开 */
    section.relative.w-full.h-screen,
    .h-screen.relative,
    main section:first-of-type {
      display: flex !important;
      flex-direction: column !important;
      justify-content: flex-end !important;
      align-items: center !important;
      padding-bottom: 40px !important;
    }

    /* 🎯 彻底隐藏屏幕中间的 "Evan Space" 主标题（不管它用的是什么标签） */
    h1 {
      display: none !important;
    }

    /* 🎯 彻底隐藏“心情随笔”卡片 */
    a[href*="note"], div[class*="rounded"] {
      /* 防止误伤，我们主要靠下面的 JS 精准查杀 */
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

    // ==================== 3. 强力巡逻清道夫（秒杀大标题与心情随笔） ====================
    setInterval(function() {
      // 遍历所有元素，只要内容是 "Evan Space" 且出现在首屏中央，强制抹杀
      var allElements = document.querySelectorAll('h1, h2, div, span');
      allElements.forEach(function(el) {
        if (el.innerText && el.innerText.trim() === 'Evan Space' && el.children.length === 0) {
          var rect = el.getBoundingClientRect();
          // 确保只干掉车头中间的那个大标题，不影响顶部导航
          if (rect.top > 50 && rect.top < 400) {
            el.style.setProperty('display', 'none', 'important');
            var parent = el.closest('.flex') || el.parentElement;
            if (parent && parent.innerText.includes('Evan Space')) {
              parent.style.setProperty('display', 'none', 'important');
            }
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

  }, 200);
})();
