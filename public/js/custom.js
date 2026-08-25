// Weglot Hexo 放大镜右侧 + 手机端穿透版
setTimeout(function() {
  var script = document.createElement('script');
  script.src = "https://cdn.weglot.com/weglot.min.js";
  
  script.onload = function() {
    Weglot.initialize({
        api_key: 'wg_09e141cacea940b6432fab178adc79f15',
        hide_switcher: true
    });
    
    function injectNextToSearch() {
      if (document.getElementById('evan-lang-btn')) return true;
      
      // 1. 全网搜捕“放大镜”图标元素
      var searchIcon = document.querySelector('.search-button') || 
                       document.querySelector('#search-button') ||
                       document.querySelector('.search') ||
                       document.querySelector('a[aria-label*="search" i]') ||
                       document.querySelector('.fa-search') ||
                       document.querySelector('.fa-magnifying-glass');
                       
      if (!searchIcon) return false; // 没抓到放大镜，继续等

      // 2. 找到放大镜最外层的可点击按钮包装（确保我们和它平级）
      var targetNode = searchIcon.closest('a') || searchIcon.closest('div') || searchIcon;
      if (!targetNode || !targetNode.parentNode) return false;
      
      // 3. 创建 EN 按钮
      var langBtn = document.createElement('a');
      langBtn.id = 'evan-lang-btn';
      
      // 🌟 间距与样式优化：
      // margin: 0 10px 0 15px; 表示左侧距离放大镜 15px(稍微拉开距离)，右侧距离下一个图标 10px。
      langBtn.style.cssText = 'cursor: pointer; margin: 0 10px 0 15px; font-weight: bold; font-size: 15px; z-index: 99999; display: inline-flex !important; align-items: center; justify-content: center; visibility: visible !important; color: inherit; opacity: 0.8; transition: opacity 0.3s ease; line-height: 1;';
      
      langBtn.onmouseover = function() { this.style.opacity = '1'; };
      langBtn.onmouseout = function() { this.style.opacity = '0.8'; };
      
      function updateText() {
        langBtn.innerText = Weglot.getCurrentLang() === 'zh' ? 'EN' : '中文';
      }
      updateText();
      
      langBtn.onclick = function(e) {
        e.preventDefault();
        Weglot.switchTo(Weglot.getCurrentLang() === 'zh' ? 'en' : 'zh');
      };
      
      Weglot.on('languageChanged', updateText);
      
      // 4. 关键注入动作：插在放大镜的“下一个兄弟节点”之前（也就是正右边！）
      targetNode.parentNode.insertBefore(langBtn, targetNode.nextSibling);
      
      console.log("✅ 报告站长：EN 按钮已成功部署到放大镜右侧，并突破手机端封锁！");
      return true;
    }
    
    // 轮询检测，最多检测 15 秒（30次），确保在 React 渲染完后必能注入
    var attempts = 0;
    var timer = setInterval(function() {
      if (injectNextToSearch() || attempts > 30) {
        clearInterval(timer);
      }
      attempts++;
    }, 500);
  };
  
  document.body.appendChild(script);
}, 1000);
