// Weglot 纯净回退版：精准插入放大镜左侧
setTimeout(function() {
  var script = document.createElement('script');
  script.src = "https://cdn.weglot.com/weglot.min.js";
  
  script.onload = function() {
    Weglot.initialize({
        api_key: 'wg_09e141cacea940b6432fab178adc79f15',
        hide_switcher: true
    });
    
    function injectToLeftOfSearch() {
      // 1. 如果已经存在，跳过
      if (document.getElementById('evan-lang-btn')) return;

      // 2. 没有任何多余的限制，在全网页直接抓取放大镜图标！
      var searchIcon = document.querySelector('.search-button') || 
                       document.querySelector('.fa-search') || 
                       document.querySelector('svg.search-icon') ||
                       document.querySelector('[aria-label*="search" i]');

      if (!searchIcon) return; // 没找到说明网页还在加载，继续等
      
      // 3. 找到放大镜最外层的点击框，防止我们插错层级
      var targetNode = searchIcon.closest('.search-button') || 
                       searchIcon.closest('a') || 
                       searchIcon.closest('div.cursor-pointer') || 
                       searchIcon;
                       
      var parent = targetNode.parentNode;
      if (!parent) return;

      // 4. 创建简单干净的 EN 按钮
      var langBtn = document.createElement('a');
      langBtn.id = 'evan-lang-btn';
      
      // 这里的 margin: 0 15px; 会在它的左右各撑开 15px 的间距，视觉上极其舒适
      langBtn.style.cssText = 'cursor: pointer; margin: 0 15px; display: inline-flex; align-items: center; justify-content: center; font-size: 15px; font-weight: bold; opacity: 0.8; transition: opacity 0.3s; color: inherit; text-decoration: none;';
      
      langBtn.onmouseover = function() { this.style.opacity = '1'; };
      langBtn.onmouseout = function() { this.style.opacity = '0.8'; };
      
      function updateText() {
        langBtn.innerText = Weglot.getCurrentLang() === 'zh' ? 'EN' : '中文';
      }
      updateText();
      
      langBtn.onclick = function(e) {
        e.preventDefault(); 
        e.stopPropagation();
        Weglot.switchTo(Weglot.getCurrentLang() === 'zh' ? 'en' : 'zh');
      };
      
      Weglot.on('languageChanged', updateText);

      // 5. 核心动作：将它插在放大镜的前面（即左侧）
      parent.insertBefore(langBtn, targetNode);
      console.log("✅ 报告站长：EN 按钮已成功安插在放大镜左侧！");
    }

    // 守护进程：如果 React 刷新网页把按钮刷没了，1 毫秒内把它补回来
    var observer = new MutationObserver(function() {
        if (!document.getElementById('evan-lang-btn')) {
            injectToLeftOfSearch();
        }
    });
    
    // 监视整个网页
    observer.observe(document.body, { childList: true, subtree: true });
    
    // 页面刚加载时，主动寻找 20 次
    var attempts = 0;
    var timer = setInterval(function() {
        injectToLeftOfSearch();
        if (document.getElementById('evan-lang-btn') || attempts > 20) {
            clearInterval(timer);
        }
        attempts++;
    }, 500);
  };
  
  document.body.appendChild(script);
}, 1000);
