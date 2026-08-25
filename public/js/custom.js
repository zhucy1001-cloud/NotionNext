// Weglot 终极版：精准固定在放大镜旁边
setTimeout(function() {
  var script = document.createElement('script');
  script.src = "https://cdn.weglot.com/weglot.min.js";
  
  script.onload = function() {
    Weglot.initialize({
        api_key: 'wg_09e141cacea940b6432fab178adc79f15', // 已替换为你的真实密钥
        hide_switcher: true // 关闭默认浮动挂件
    });
    
    // 精准吸附到放大镜旁边的函数
    function attachNextToSearch() {
      // 1. 寻找网页上的搜索/放大镜图标按钮（兼容 Hexo 主题的常见类名）
      var searchIconBtn = document.querySelector('header .fa-search') || 
                          document.querySelector('header svg.search-icon') || 
                          document.querySelector('header [aria-label*="search" i]') ||
                          document.querySelector('header .search') ||
                          document.querySelector('header .fa-magnifying-glass');
                          
      // 如果还没找到图标，就找包含放大镜的父级容器
      var targetArea = searchIconBtn ? searchIconBtn.closest('a, button, div') : null;
      
      // 如果实在找不到，就退而求其次找右上角的整排图标容器
      if (!targetArea) {
        targetArea = document.querySelector('header nav') || document.querySelector('header .right-area');
      }
      
      if (!targetArea) return; // 没找到位置就继续等待

      // 2. 防止重复创建
      if (document.getElementById('fixed-lang-switch')) return;

      // 3. 创建极简的 EN 切换按钮
      var langBtn = document.createElement('a');
      langBtn.id = 'fixed-lang-switch';
      
      // 赋予和旁边图标完全一致的高级质感样式（圆角、悬停变色、合适的内边距）
      langBtn.className = 'cursor-pointer px-2 py-1 mx-1 text-xs font-bold transition-all rounded-md hover:bg-black/10 dark:hover:bg-white/10 flex items-center justify-center';
      langBtn.style.display = 'inline-block';
      langBtn.style.textDecoration = 'none';

      // 实时同步当前语言状态显示文字
      function updateText() {
        var currentLang = Weglot.getCurrentLang();
        langBtn.innerText = currentLang === 'zh' ? 'EN' : '中文';
      }
      
      updateText();
      
      // 点击时触发语言切换
      langBtn.onclick = function(e) {
        e.preventDefault();
        var currentLang = Weglot.getCurrentLang();
        var targetLang = currentLang === 'zh' ? 'en' : 'zh';
        Weglot.switchTo(targetLang);
      };
      
      // 当语言切换完成后更新按钮文字
      Weglot.on('languageChanged', function() {
        updateText();
      });
      
      // 4. 将按钮精准插入到放大镜的前面
      if (searchIconBtn && targetArea) {
        targetArea.parentNode.insertBefore(langBtn, targetArea);
      } else {
        targetArea.appendChild(langBtn);
      }
      
      console.log("✅ 报告站长：EN 按钮已成功锁定并固定在放大镜身旁！");
    }
    
    // 延迟 2 秒等待页面完全渲染
    setTimeout(attachNextToSearch, 2000);
  };
  
  document.body.appendChild(script);
}, 1000);
