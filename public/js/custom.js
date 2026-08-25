// Weglot Hexo 导航栏终极稳定版
setTimeout(function() {
  var script = document.createElement('script');
  script.src = "https://cdn.weglot.com/weglot.min.js";
  
  script.onload = function() {
    Weglot.initialize({
        api_key: 'wg_09e141cacea940b6432fab178adc79f15',
        hide_switcher: true
    });
    
    function injectLangButton() {
      // 1. 如果已经存在，直接跳过
      if (document.getElementById('evan-lang-btn')) return;
      
      // 2. 寻找放大镜图标 (兼容各种 Hexo 主题的常见类名)
      var searchIcon = document.querySelector('.search-button') || 
                       document.querySelector('.fa-search') ||
                       document.querySelector('.search') ||
                       document.querySelector('[aria-label="search"]');
                       
      if (!searchIcon) return; // 没找到就继续等
      
      // 3. 找到图标的最外层包装盒 (通常是 li 或 div)
      var searchContainer = searchIcon.closest('li') || searchIcon.closest('div') || searchIcon;
      if (!searchContainer || !searchContainer.parentNode) return;

      // 4. 创建纯文本按钮 (避免破坏原有主题的复杂 CSS)
      var langBtn = document.createElement('a');
      langBtn.id = 'evan-lang-btn';
      // 添加一些基础的内边距和鼠标样式，让它看起来像个按钮
      langBtn.style.cssText = 'cursor: pointer; padding: 0 12px; font-weight: bold; font-size: 14px; display: inline-flex; align-items: center; justify-content: center;';
      
      // 动态更新文字
      function updateText() {
        langBtn.innerText = Weglot.getCurrentLang() === 'zh' ? 'EN' : '中文';
      }
      updateText();
      
      // 绑定点击切换事件
      langBtn.onclick = function(e) {
        e.preventDefault();
        Weglot.switchTo(Weglot.getCurrentLang() === 'zh' ? 'en' : 'zh');
      };
      
      Weglot.on('languageChanged', updateText);
      
      // 5. 稳稳地插入到放大镜的前面
      searchContainer.parentNode.insertBefore(langBtn, searchContainer);
      console.log("✅ 报告站长：EN 按钮已成功复活并固定在放大镜身旁！");
    }
    
    // 使用安全的定时器，每 0.5 秒找一次，直到找到为止
    var checkTimer = setInterval(function() {
        if (document.getElementById('evan-lang-btn')) {
            clearInterval(checkTimer);
        } else {
            injectLangButton();
        }
    }, 500);
    
    // 10秒后自动停止，保护网页性能
    setTimeout(function() { clearInterval(checkTimer); }, 10000);
  };
  
  document.body.appendChild(script);
}, 1000);
