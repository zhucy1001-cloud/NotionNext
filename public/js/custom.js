// Weglot 翻译按钮 + 跑马灯下沉到底部 + 隐藏主标题 终极完整版
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

  // ==================== 2. 隐藏主标题 + 跑马灯下沉到底部逻辑 ====================
  setInterval(function() {
    // 隐藏首屏中间的 "Evan Space" 主标题（精准匹配页面中的大标题 h1）
    var mainTitles = document.querySelectorAll('h1.text-4xl, h1.font-bold');
    mainTitles.forEach(function(title) {
      // 确保只隐藏首屏那个带有 "Evan Space" 的大标题
      if (title.innerText && title.innerText.includes('Evan Space')) {
        title.style.display = 'none';
      }
    });

    // 将跑马灯文字独立下沉到底部
    var typedElem = document.getElementById('typed');
    if (typedElem) {
      var subContainer = typedElem.parentElement;
      if (subContainer && subContainer !== document.body) {
        subContainer.style.position = 'absolute';
        subContainer.style.bottom = '80px'; // 距离底部高度，可按需微调
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
