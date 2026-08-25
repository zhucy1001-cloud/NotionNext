// Weglot 终极分身术版：全网捕获放大镜 (完美解决双端问题)
setTimeout(function() {
  var script = document.createElement('script');
  script.src = "https://cdn.weglot.com/weglot.min.js";
  
  script.onload = function() {
    Weglot.initialize({
        api_key: 'wg_09e141cacea940b6432fab178adc79f15',
        hide_switcher: true
    });
    
    // 开启永久巡逻进程，每 1 秒扫描一次网页全图
    setInterval(function() {
      // 1. 抓捕网页里【所有】的放大镜图标 (一网打尽电脑端和手机端)
      var searchIcons = document.querySelectorAll('.fa-search, .fa-magnifying-glass, .search-button i, [aria-label*="search" i]');
      
      if (searchIcons.length === 0) return;

      // 2. 遍历每一个放大镜，挨个给它们发配一个 EN 按钮
      searchIcons.forEach(function(icon, index) {
        var btnId = 'evan-lang-btn-' + index; // 给每个按钮独一无二的编号

        // 如果这个放大镜旁边已经有咱们的按钮了，就跳过
        if (document.getElementById(btnId)) return;

        // 找到这个放大镜的点击外框
        var wrapper = icon.closest('.cursor-pointer') || icon.closest('a') || icon.closest('.search-button') || icon.parentNode;
        if (!wrapper || !wrapper.parentNode) return;

        // 3. 创建纯净的 EN 按钮
        var langBtn = document.createElement('div');
        langBtn.id = btnId;
        
        // 样式优化：宽度高度设定为 32px 完美契合 Hexo 原生图标，放在放大镜的正右侧 (margin-left: 10px)
        langBtn.style.cssText = 'cursor: pointer; width: 32px; height: 32px; margin-left: 10px; display: inline-flex; align-items: center; justify-content: center; font-size: 14px; font-weight: bold; opacity: 0.8; transition: opacity 0.3s; color: inherit;';
        
        langBtn.onmouseover = function() { this.style.opacity = '1'; };
        langBtn.onmouseout = function() { this.style.opacity = '0.8'; };
        
        function updateText() {
          // 手机端空间小，中文显示“中”会更精致
          langBtn.innerText = Weglot.getCurrentLang() === 'zh' ? 'EN' : '中';
        }
        updateText();
        
        langBtn.onclick = function(e) {
          e.preventDefault(); e.stopPropagation();
          Weglot.switchTo(Weglot.getCurrentLang() === 'zh' ? 'en' : 'zh');
        };
        
        Weglot.on('languageChanged', updateText);

        // 4. 精准安插在放大镜的右边 (即下一个兄弟节点之前)
        wrapper.parentNode.insertBefore(langBtn, wrapper.nextSibling);
      });
    }, 1000); // 永久定时器，完美抗击 React 刷新机制
  };
  
  document.body.appendChild(script);
}, 1000);
