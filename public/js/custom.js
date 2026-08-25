// Weglot 翻译按钮 + 暴力物理拔除大标题 + 跑马灯强行搬运至页面最底部
(function() {
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

    // ==================== 2. 全局永久巡逻与物理改造 ====================
    setInterval(function() {
      // 🎯 任务 A：彻底干掉中央大标题
      // 遍历所有 h1 或大号字体标签，只要内容是 "Evan Space" 且不在导航栏，直接隐藏
      var allHeaders = document.querySelectorAll('h1, div, span');
      allHeaders.forEach(function(el) {
        if (el.innerText && el.innerText.trim() === 'Evan Space' && el.children.length === 0) {
          // 确保它是屏幕中央的那个大标题（排除左上角 logo）
          var rect = el.getBoundingClientRect();
          if (rect.top > 60 && rect.top < 300) {
            el.style.setProperty('display', 'none', 'important');
            // 如果它有外层包裹卡片，顺便隐藏
            var parentBox = el.closest('.flex.flex-col') || el.parentElement;
            if (parentBox && parentBox.innerText.trim() === 'Evan Space') {
              parentBox.style.setProperty('display', 'none', 'important');
            }
          }
        }
      });

      // 🎯 任务 B：干掉“心情随笔”卡片
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

      // 🎯 任务 C：跑马灯物理强行搬运到底部（绝对不会闪烁或消失）
      var typedElem = document.getElementById('typed');
      if (typedElem) {
        var subContainer = typedElem.parentElement;
        if (subContainer && !subContainer.classList.contains('evan-relocated')) {
          subContainer.classList.add('evan-relocated');
          // 强制脱离原布局，直接锁死在屏幕底部正下方
          subContainer.style.setProperty('position', 'fixed', 'important');
          subContainer.style.setProperty('bottom', '15px', 'important');
          subContainer.style.setProperty('left', '0', 'important');
          subContainer.style.setProperty('right', '0', 'important');
          subContainer.style.setProperty('margin', 'auto', 'important');
          subContainer.style.setProperty('z-index', '999999', 'important');
          subContainer.style.setProperty('text-align', 'center', 'important');
          subContainer.style.setProperty('width', '100%', 'important');
          subContainer.style.setProperty('max-width', '900px', 'important');
          subContainer.style.setProperty('pointer-events', 'auto', 'important');
        }
      }
    }, 100); // 0.1秒极速巡逻

  }, 300);
})();
