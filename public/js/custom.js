// Weglot NotionNext Hexo 主题专属双端定位版
setTimeout(function() {
  var script = document.createElement('script');
  script.src = "https://cdn.weglot.com/weglot.min.js";
  
  script.onload = function() {
    Weglot.initialize({
        api_key: 'wg_09e141cacea940b6432fab178adc79f15',
        hide_switcher: true
    });
    
    function injectLangBtn() {
      if (document.getElementById('evan-lang-btn')) return true;
      
      // 1. 全局直接搜索放大镜图标的 class
      var searchIcon = document.querySelector('.fa-search') || 
                       document.querySelector('.search-button i') ||
                       document.querySelector('[aria-label="search"]');
                       
      if (!searchIcon) return false;

      // 2. 向上获取放大镜的可点击外层容器
      var searchWrapper = searchIcon.closest('div[class*="cursor-pointer"]') || 
                          searchIcon.closest('.search-button') || 
                          searchIcon.parentNode;
                          
      if (!searchWrapper || !searchWrapper.parentNode) return false;

      // 3. 创建极简 EN 按钮
      var langBtn = document.createElement('div');
      langBtn.id = 'evan-lang-btn';
      
      // 调整 margin: 0 8px; 以保证在手机端不会因为间距过大而换行
      langBtn.style.cssText = 'cursor: pointer; margin: 0 8px; font-weight: bold; font-size: 15px; display: flex; align-items: center; justify-content: center; z-index: 99; color: inherit; opacity: 0.8; transition: opacity 0.3s;';
      
      langBtn.onmouseover = function() { this.style.opacity = '1'; };
      langBtn.onmouseout = function() { this.style.opacity = '0.8'; };
      
      function updateText() {
        langBtn.innerText = Weglot.getCurrentLang() === 'zh' ? 'EN' : '中文';
      }
      updateText();
      
      langBtn.onclick = function(e) {
        e.preventDefault();
        e.stopPropagation(); // 防止触发旁边图标的点击事件
        Weglot.switchTo(Weglot.getCurrentLang() === 'zh' ? 'en' : 'zh');
      };
      
      Weglot.on('languageChanged', updateText);

      // 4. 将按钮精准插入到放大镜外层容器的“下一个兄弟节点”之前（即正右侧）
      searchWrapper.parentNode.insertBefore(langBtn, searchWrapper.nextSibling);
      
      return true;
    }
    
    var attempts = 0;
    var timer = setInterval(function() {
      if (injectLangBtn() || attempts > 30) {
        clearInterval(timer);
      }
      attempts++;
    }, 500);
  };
  
  document.body.appendChild(script);
}, 1000);
