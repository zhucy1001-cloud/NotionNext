// Weglot 翻译按钮放置在搜索放大镜左侧
(function() {
  setTimeout(function() {
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

          // 寻找搜索图标的包装容器
          var wrapper = icon.closest('.cursor-pointer') || icon.closest('a') || icon.closest('.search-button') || icon.parentNode;
          if (!wrapper || !wrapper.parentNode) return;

          // 创建翻译按钮
          var langBtn = document.createElement('div');
          langBtn.id = btnId;
          // 调整间距：设置合适左右 margin，让它和放大镜以及旁边的元素保持优美的呼吸感
          langBtn.style.cssText = 'cursor: pointer; margin: 0 14px; display: inline-flex; align-items: center; justify-content: center; font-size: 15px; font-weight: bold; opacity: 0.8; transition: opacity 0.3s; color: inherit; line-height: 1;';
          
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
          
          // 🎯 核心改变：将翻译按钮插入到搜索包装容器的【前面】，即放大镜的左侧
          wrapper.parentNode.insertBefore(langBtn, wrapper);
        });
      }, 1000); 
    };
    document.body.appendChild(script);
  }, 100);
})();
