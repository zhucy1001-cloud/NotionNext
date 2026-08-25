// 在 custom.js 里追加这段样式控制代码
setTimeout(function() {
  var style = document.createElement('style');
  style.innerHTML = `
    /* 调整跑马灯欢迎语的上下位置 */
    .group.flex.flex-col.items-center, /* 根据你的 Hexo 布局组件调整 */
    div:has(> #typed) {
      margin-top: 1000px !important; /* 改成负数可以把它往上提，改成正数往下压 */
    }
  `;
  document.head.appendChild(style);
}, 1000);

// Weglot 终极分身术版：完美间距微调
setTimeout(function() {
  var script = document.createElement('script');
  script.src = "https://cdn.weglot.com/weglot.min.js";
  
  script.onload = function() {
    Weglot.initialize({
        api_key: 'wg_09e141cacea940b6432fab178adc79f15',
        hide_switcher: true
    });
    
    // 永久巡逻进程
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
        
        // 🌟 核心美化调整：
        // 1. 改为 margin: 0 12px; 让它左边（放大镜）和右边（播客图标）都有 12px 的对称间距！
        // 2. 略微调大字号到 15px，并让它垂直居中，视觉上更稳重。
        langBtn.style.cssText = 'cursor: pointer; margin: 0 12px; display: inline-flex; align-items: center; justify-content: center; font-size: 15px; font-weight: bold; opacity: 0.8; transition: opacity 0.3s; color: inherit; line-height: 1;';
        
        langBtn.onmouseover = function() { this.style.opacity = '1'; };
        langBtn.onmouseout = function() { this.style.opacity = '0.8'; };
        
        function updateText() {
          // 手机端中/英依然保持极简
          langBtn.innerText = Weglot.getCurrentLang() === 'zh' ? 'EN' : '中';
        }
        updateText();
        
        langBtn.onclick = function(e) {
          e.preventDefault(); e.stopPropagation();
          Weglot.switchTo(Weglot.getCurrentLang() === 'zh' ? 'en' : 'zh');
        };
        
        Weglot.on('languageChanged', updateText);

        // 安插在放大镜的右边
        wrapper.parentNode.insertBefore(langBtn, wrapper.nextSibling);
      });
    }, 1000); 
  };
  
  document.body.appendChild(script);
}, 1000);
