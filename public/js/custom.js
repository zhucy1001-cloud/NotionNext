// Weglot Hexo 双端终极精准定位版
setTimeout(function() {
  var script = document.createElement('script');
  script.src = "https://cdn.weglot.com/weglot.min.js";
  
  script.onload = function() {
    Weglot.initialize({
        api_key: 'wg_09e141cacea940b6432fab178adc79f15',
        hide_switcher: true
    });
    
    function injectLanguageButton() {
      if (document.getElementById('evan-lang-btn')) return true;
      
      // 1. 极其关键：只在网页顶部的“天灵盖(header)”区域内寻找，防止被侧边栏的隐藏代码干扰！
      var header = document.querySelector('#page-header') || 
                   document.querySelector('header') || 
                   document.querySelector('.top-nav');
      if (!header) return false;

      // 2. 找到导航栏右侧的控制区 (这个区域在手机和电脑上都是常驻可见的)
      var navRight = header.querySelector('#nav-right') || 
                     header.querySelector('.nav-right') ||
                     header.querySelector('.right-area');
                     
      if (!navRight) return false;

      // 3. 在正确的控制区内寻找放大镜
      var searchBtn = navRight.querySelector('.search-button') || 
                      navRight.querySelector('.search') ||
                      navRight.querySelector('.fa-search');
      
      // 4. 创建 EN 按钮
      var langBtn = document.createElement('a');
      langBtn.id = 'evan-lang-btn';
      
      // 样式优化：确保在手机和电脑上都是可见的，间距适中
      langBtn.style.cssText = 'cursor: pointer; margin: 0 10px; font-weight: bold; font-size: 15px; z-index: 99999; display: inline-flex !important; align-items: center; justify-content: center; visibility: visible !important; color: inherit; opacity: 0.8; transition: opacity 0.3s ease; line-height: 1;';
      
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

      // 5. 精准插入：如果找到了放大镜，就插在它后面(右边)；如果意外没找到，就强行兜底塞进右侧区域
      if (searchBtn && searchBtn.parentNode === navRight) {
         navRight.insertBefore(langBtn, searchBtn.nextSibling);
      } else if (searchBtn) {
         searchBtn.parentNode.insertBefore(langBtn, searchBtn.nextSibling);
      } else {
         navRight.appendChild(langBtn);
      }
      
      console.log("✅ 报告站长：双端注入成功，按钮已锁定顶部导航栏！");
      return true;
    }
    
    // 轮询检测，最多检测 15 秒（30次）
    var attempts = 0;
    var timer = setInterval(function() {
      if (injectLanguageButton() || attempts > 30) {
        clearInterval(timer);
      }
      attempts++;
    }, 500);
  };
  
  document.body.appendChild(script);
}, 1000);
