// Weglot Hexo 导航栏间距与视觉优化版
setTimeout(function() {
  var script = document.createElement('script');
  script.src = "https://cdn.weglot.com/weglot.min.js";
  
  script.onload = function() {
    Weglot.initialize({
        api_key: 'wg_09e141cacea940b6432fab178adc79f15',
        hide_switcher: true
    });
    
    function forceInject() {
      if (document.getElementById('evan-lang-btn')) return true;
      
      var navRight = document.querySelector('.nav-right') || 
                     document.querySelector('#nav-right') || 
                     document.querySelector('.menus_items') || 
                     document.querySelector('#menus') ||
                     document.querySelector('nav');
                     
      if (!navRight) return false; 
      
      var langBtn = document.createElement('a');
      langBtn.id = 'evan-lang-btn';
      
      // 🌟 关键修改在这里：
      // margin: 0 20px; 代表上下边距为0，左右边距各 20px，完美撑开它和放大镜的距离！
      // 加入了 opacity: 0.8 和 transition，让它平时微微透明，鼠标放上去变亮，更有质感。
      langBtn.style.cssText = 'cursor: pointer; margin: 0 20px; font-weight: bold; font-size: 15px; z-index: 99999; display: inline-block !important; visibility: visible !important; color: inherit; opacity: 0.8; transition: opacity 0.3s ease;';
      
      // 增加鼠标悬停效果
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
      
      navRight.appendChild(langBtn);
      console.log("✅ 报告站长：EN 按钮间距已完美优化！");
      return true;
    }
    
    var attempts = 0;
    var timer = setInterval(function() {
      if (forceInject() || attempts > 20) {
        clearInterval(timer);
      }
      attempts++;
    }, 500);
  };
  
  document.body.appendChild(script);
}, 1000);
