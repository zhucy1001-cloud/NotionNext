// Weglot 真实 DOM 嵌入版 + React 守卫
setTimeout(function() {
  var script = document.createElement('script');
  script.src = "https://cdn.weglot.com/weglot.min.js";
  
  script.onload = function() {
    Weglot.initialize({
        api_key: 'wg_09e141cacea940b6432fab178adc79f15',
        hide_switcher: true
    });
    
    function injectInFlow() {
      // 如果已经存在，就不重复添加
      if (document.getElementById('evan-lang-btn')) return;

      // 1. 寻找网页中真实的放大镜图标
      var searchIcon = document.querySelector('.search-button') || 
                       document.querySelector('.fa-search') || 
                       document.querySelector('svg.search-icon') ||
                       document.querySelector('[aria-label*="search" i]');

      if (!searchIcon) return; // 网页还没渲染好就继续等
      
      // 2. 极其关键：不能直接插在图标旁边，要找到它的“外层包装盒”
      // 保证我们插入的层级和“友情链接”、“放大镜包装盒”是平级的兄弟关系
      var targetNode = searchIcon.closest('.search-button') || 
                       searchIcon.closest('a') || 
                       searchIcon.closest('li') || 
                       searchIcon.closest('div.cursor-pointer') || 
                       searchIcon;
                       
      var parent = targetNode.parentNode;
      if (!parent) return;

      // 3. 创建真实的内联按钮元素 (不再使用绝对定位/悬浮)
      var langBtn = document.createElement('a'); // 使用 <a> 标签更容易融入菜单
      langBtn.id = 'evan-lang-btn';
      
      // ✨ 核心魔法：纯正的 Flex 布局代码，不包含任何 position: fixed
      // margin: 0 12px; 会在左右各撑开 12px 的真实物理空间，把放大镜挤过去！
      langBtn.style.cssText = 'cursor: pointer; margin: 0 12px; display: inline-flex; align-items: center; justify-content: center; font-size: 14px; font-weight: bold; opacity: 0.8; transition: opacity 0.3s; color: inherit; text-decoration: none;';
      
      langBtn.onmouseover = function() { this.style.opacity = '1'; };
      langBtn.onmouseout = function() { this.style.opacity = '0.8'; };
      
      function updateText() {
        // 为了菜单的紧凑感，依然是中/EN切换
        langBtn.innerText = Weglot.getCurrentLang() === 'zh' ? 'EN' : '中文';
      }
      updateText();
      
      langBtn.onclick = function(e) {
        e.preventDefault(); 
        e.stopPropagation();
        Weglot.switchTo(Weglot.getCurrentLang() === 'zh' ? 'en' : 'zh');
      };
      
      Weglot.on('languageChanged', updateText);

      // 4. 将它作为真正的兄弟节点，插入到放大镜包装盒的前面（左侧）
      parent.insertBefore(langBtn, targetNode);
      console.log("✅ 报告站长：EN 按钮已作为真实元素嵌入菜单栏！");
    }

    // 🚀 终极防守：使用 MutationObserver 死死盯住 React 框架
    // 只要 React 刷新页面导致我们的真实节点丢失，立刻在后台光速补齐！
    var observer = new MutationObserver(function() {
        if (!document.getElementById('evan-lang-btn')) {
            injectInFlow();
        }
    });
    
    // 监视整个网页的任何风吹草动
    observer.observe(document.body, { childList: true, subtree: true });
    
    // 首次主动出击，利用定时器确保注入成功
    var attempts = 0;
    var timer = setInterval(function() {
        injectInFlow();
        if (document.getElementById('evan-lang-btn') || attempts > 20) {
            clearInterval(timer);
        }
        attempts++;
    }, 500);
  };
  
  document.body.appendChild(script);
}, 1000);
