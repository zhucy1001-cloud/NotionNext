// Weglot 翻译按钮 + 跑马灯移至箭头下方 + 隐藏“心情随笔”卡片
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

  // ==================== 2. 样式与布局改造（隐藏心情随笔 + 跑马灯下沉到箭头下方） ====================
  var style = document.createElement('style');
  style.innerHTML = `
    /* 🎯 隐藏屏幕中间的“心情随笔”分类悬浮卡片 */
    a:has(> div), div[class*="group"]:has(> div) {
      /* 通过精准匹配文字内容或者卡片特征来隐藏，如果下面脚本生效则以脚本为准 */
    }
  `;
  document.head.appendChild(style);

  // 运行时动态巡逻脚本
  setInterval(function() {
    // A. 遍历并隐藏包含“心情随笔”的卡片元素
    var allDivs = document.querySelectorAll('div, a');
    allDivs.forEach(function(el) {
      if (el.innerText && el.innerText.trim() === '心情随笔' && el.children.length < 3) {
        // 向上找到它的卡片外框并隐藏
        var card = el.closest('.cursor-pointer') || el.closest('div[class*="rounded"]');
        if (card) {
          card.style.display = 'none';
        } else {
          el.style.display = 'none';
        }
      }
    });

    // B. 将跑马灯文字向下推到“向下箭头”的下方
    var typedElem = document.getElementById('typed');
    if (typedElem) {
      var subContainer = typedElem.parentElement;
      if (subContainer && subContainer !== document.body) {
        subContainer.style.position = 'absolute';
        // 🌟 将 bottom 设为 25px ~ 35px，让跑马灯直接落到向下箭头的正下方！
        subContainer.style.bottom = '30px'; 
        subContainer.style.left = '0';
        subContainer.style.right = '0';
        subContainer.style.margin = 'auto';
        subContainer.style.zIndex = '20';
        subContainer.style.textAlign = 'center';
        subContainer.style.width = '100%';
        subContainer.style.maxWidth = '900px';
      }
    }
  }, 1000);

}, 1000);
