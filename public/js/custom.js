// Weglot Hexo - React 基因锁守卫版 (MutationObserver 终极杀器)
setTimeout(function() {
  var script = document.createElement('script');
  script.src = "https://cdn.weglot.com/weglot.min.js";
  
  script.onload = function() {
    Weglot.initialize({
        api_key: 'wg_09e141cacea940b6432fab178adc79f15',
        hide_switcher: true
    });
    
    // 制作一个精致的独立按钮（带磨砂玻璃质感，放哪都好看）
    function createLangBtn() {
      var btn = document.createElement('a');
      btn.id = 'evan-lang-btn';
      btn.style.cssText = 'cursor: pointer; margin: 0 10px; padding: 4px 10px; border-radius: 6px; background: rgba(128,128,128,0.15); font-weight: bold; font-size: 13px; display: inline-flex; align-items: center; justify-content: center; z-index: 99999; color: inherit; text-decoration: none; backdrop-filter: blur(4px); transition: all 0.3s;';
      
      btn.onmouseover = function() { this.style.background = 'rgba(128,128,128,0.3)'; };
      btn.onmouseout = function() { this.style.background = 'rgba(128,128,128,0.15)'; };
      
      btn.onclick = function(e) {
        e.preventDefault(); e.stopPropagation();
        Weglot.switchTo(Weglot.getCurrentLang() === 'zh' ? 'en' : 'zh');
      };
      return btn;
    }

    function updateBtnText() {
      var btn = document.getElementById('evan-lang-btn');
      if (btn) btn.innerText = Weglot.getCurrentLang() === 'zh' ? 'EN' : '中文';
    }

    // 暴力注入逻辑
    function forceInject() {
      if (document.getElementById('evan-lang-btn')) {
          updateBtnText();
          return;
      }

      // 1. 寻找顶栏容器
      var header = document.querySelector('#nav') || document.querySelector('header') || document.querySelector('#top-nav') || document.querySelector('.top-nav');
      if (!header) return;

      // 2. 广泛捕获右侧的任何图标（搜索、月亮/太阳、甚至是手机端的汉堡菜单）
      var anyIcon = header.querySelector('.fa-search') || 
                    header.querySelector('.search') || 
                    header.querySelector('.fa-moon') || 
                    header.querySelector('.fa-bars') || 
                    header.querySelector('svg');

      if (anyIcon) {
          // 找到图标的可点击父级
          var targetNode = anyIcon.closest('div.cursor-pointer, a, li, button') || anyIcon;
          
          if (targetNode && targetNode.parentNode) {
              var btn = createLangBtn();
              // 强行安插在这个图标的前面（左侧）
              targetNode.parentNode.insertBefore(btn, targetNode);
              updateBtnText();
              console.log("✅ 报告站长：基因守卫已将 EN 按钮强行锁定在导航栏！");
          }
      }
    }

    // 🌟 终极杀器：开启 MutationObserver 监视器
    // 只要 React 刷新页面导致按钮消失，立刻在后台光速补齐！
    var observer = new MutationObserver(function(mutations) {
        if (!document.getElementById('evan-lang-btn')) {
            forceInject();
        }
    });
    
    // 监视整个网页的任何风吹草动
    observer.observe(document.body, { childList: true, subtree: true });
    
    // 立即执行一次
    forceInject();
    
    // 监听 Weglot 语言变化
    Weglot.on('languageChanged', updateBtnText);
  };
  
  document.body.appendChild(script);
}, 1000);
