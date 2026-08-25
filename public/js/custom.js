// Weglot Hexo 导航栏终极暴力注入版
setTimeout(function() {
  var script = document.createElement('script');
  script.src = "https://cdn.weglot.com/weglot.min.js";
  
  script.onload = function() {
    Weglot.initialize({
        api_key: 'wg_09e141cacea940b6432fab178adc79f15',
        hide_switcher: true
    });
    
    function forceInject() {
      // 1. 如果已经存在，直接返回成功
      if (document.getElementById('evan-lang-btn')) return true;
      
      // 2. 扩大火力覆盖范围：直接抓取整个右侧导航容器
      var navRight = document.querySelector('.nav-right') || 
                     document.querySelector('#nav-right') || 
                     document.querySelector('.menus_items') || 
                     document.querySelector('#menus') ||
                     document.querySelector('nav');
                     
      if (!navRight) return false; // 没找到容器，说明网页还没渲染完，继续等
      
      // 3. 创建极简按钮
      var langBtn = document.createElement('a');
      langBtn.id = 'evan-lang-btn';
      // 使用最高级别的显示权重，防止被其他样式隐藏
      langBtn.style.cssText = 'cursor: pointer; margin-left: 15px; font-weight: bold; font-size: 15px; z-index: 99999; display: inline-block !important; visibility: visible !important; color: inherit;';
      
      function updateText() {
        langBtn.innerText = Weglot.getCurrentLang() === 'zh' ? 'EN' : '中文';
      }
      updateText();
      
      langBtn.onclick = function(e) {
        e.preventDefault();
        Weglot.switchTo(Weglot.getCurrentLang() === 'zh' ? 'en' : 'zh');
      };
      
      Weglot.on('languageChanged', updateText);
      
      // 4. 暴力追加到右侧导航栏的最后面
      navRight.appendChild(langBtn);
      console.log("✅ 报告站长：EN 按钮已强行突破防线，成功空降导航栏！");
      return true;
    }
    
    // 5. 启动疯狂轮询模式：每 0.5 秒攻击一次，直到注入成功，最多尝试 20 次 (10秒)
    var attempts = 0;
    var timer = setInterval(function() {
      if (forceInject() || attempts > 20) {
        clearInterval(timer); // 成功或者超时，就停止轮询
      }
      attempts++;
    }, 500);
  };
  
  document.body.appendChild(script);
}, 1000); // 整体延迟 1 秒，避开 React 首次渲染高峰
